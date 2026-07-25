// packages/memory-host-sdk/src/host/batch-output.ts
var DEFAULT_BATCH_OUTPUT_RECORD_MAX_BYTES = 4 * 1024 * 1024;
var INITIAL_BATCH_OUTPUT_RECORD_BYTES = 64 * 1024;
async function readEmbeddingBatchJsonl(response, options) {
  const reader = response.body?.getReader();
  if (!reader) {
    return;
  }
  const maxRecordBytes = options.maxRecordBytes ?? DEFAULT_BATCH_OUTPUT_RECORD_MAX_BYTES;
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let recordCount = 0;
  let recordBytes = 0;
  let recordBuffer;
  const appendRecordPart = (part) => {
    if (part.byteLength === 0) {
      return;
    }
    const nextRecordBytes = recordBytes + part.byteLength;
    if (nextRecordBytes > maxRecordBytes) {
      throw new Error(`${options.label}: JSONL record exceeds ${maxRecordBytes} bytes`);
    }
    if (!recordBuffer || recordBuffer.byteLength < nextRecordBytes) {
      const nextCapacity = Math.min(
        maxRecordBytes,
        Math.max(
          nextRecordBytes,
          recordBuffer ? recordBuffer.byteLength * 2 : Math.min(INITIAL_BATCH_OUTPUT_RECORD_BYTES, maxRecordBytes)
        )
      );
      const nextBuffer = new Uint8Array(nextCapacity);
      if (recordBuffer) {
        nextBuffer.set(recordBuffer.subarray(0, recordBytes));
      }
      recordBuffer = nextBuffer;
    }
    recordBuffer.set(part, recordBytes);
    recordBytes = nextRecordBytes;
  };
  const emitRecord = () => {
    recordCount += 1;
    if (recordCount > options.maxRecords) {
      throw new Error(`${options.label}: JSONL output exceeds ${options.maxRecords} records`);
    }
    let text;
    try {
      text = decoder.decode(recordBuffer?.subarray(0, recordBytes)).trim();
    } catch {
      recordBytes = 0;
      throw new Error(`${options.label}: malformed JSONL record`);
    }
    recordBytes = 0;
    if (!text) {
      return true;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`${options.label}: malformed JSONL record`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`${options.label}: malformed JSONL record`);
    }
    return options.onRecord(parsed);
  };
  const cancel = async () => {
    await reader.cancel().catch(() => {
    });
  };
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      let offset = 0;
      for (let index = 0; index < value.byteLength; index += 1) {
        if (value[index] !== 10) {
          continue;
        }
        appendRecordPart(value.subarray(offset, index));
        if (!emitRecord()) {
          await cancel();
          return;
        }
        offset = index + 1;
      }
      appendRecordPart(value.subarray(offset));
    }
    if (recordBytes > 0) {
      emitRecord();
    }
  } catch (error) {
    await cancel();
    throw error;
  } finally {
    reader.releaseLock();
  }
}
function applyEmbeddingBatchOutputLine(params) {
  const customId = params.line.custom_id;
  if (!customId) {
    return;
  }
  params.remaining.delete(customId);
  const errorMessage = params.line.error?.message;
  if (errorMessage) {
    params.errors.push(`${customId}: ${errorMessage}`);
    return;
  }
  const response = params.line.response;
  const statusCode = response?.status_code ?? 0;
  if (statusCode >= 400) {
    const messageFromObject = response?.body && typeof response.body === "object" ? response.body.error?.message : void 0;
    const messageFromString = typeof response?.body === "string" ? response.body : void 0;
    params.errors.push(
      `${customId}: ${messageFromObject || messageFromString || response?.message || "unknown error"}`
    );
    return;
  }
  const data = response?.body && typeof response.body === "object" ? response.body.data ?? [] : [];
  const embedding = data[0]?.embedding ?? [];
  if (embedding.length === 0) {
    params.errors.push(`${customId}: empty embedding`);
    return;
  }
  params.byCustomId.set(customId, embedding);
}
export {
  applyEmbeddingBatchOutputLine,
  readEmbeddingBatchJsonl
};
