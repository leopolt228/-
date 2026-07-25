// packages/memory-host-sdk/src/host/batch-utils.ts
function normalizeBatchBaseUrl(client) {
  return client.baseUrl?.replace(/\/$/, "") ?? "";
}
function buildBatchHeaders(client, params) {
  const headers = client.headers ? { ...client.headers } : {};
  if (params.json) {
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  return headers;
}
var jsonlEncoder = new TextEncoder();
function estimateJsonlLineBytes(request) {
  return jsonlEncoder.encode(JSON.stringify(request) ?? "").byteLength;
}
function normalizePositiveInteger(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return void 0;
  }
  return Math.floor(value);
}
function splitBatchRequestsByLimits(requests, limits) {
  const maxRequests = normalizePositiveInteger(limits.maxRequests) ?? 1;
  const maxJsonlBytes = normalizePositiveInteger(limits.maxJsonlBytes);
  if (requests.length === 0) {
    return maxJsonlBytes ? [] : [requests];
  }
  const groups = [];
  let current = [];
  let currentBytes = 0;
  for (const request of requests) {
    const requestBytes = estimateJsonlLineBytes(request);
    const separatorBytes = current.length === 0 ? 0 : 1;
    const wouldExceedRequests = current.length >= maxRequests;
    const wouldExceedBytes = maxJsonlBytes !== void 0 && current.length > 0 && currentBytes + separatorBytes + requestBytes > maxJsonlBytes;
    if (current.length > 0 && (wouldExceedRequests || wouldExceedBytes)) {
      groups.push(current);
      current = [];
      currentBytes = 0;
    }
    currentBytes += (current.length === 0 ? 0 : 1) + requestBytes;
    current.push(request);
  }
  if (current.length > 0) {
    groups.push(current);
  }
  return groups;
}
export {
  buildBatchHeaders,
  normalizeBatchBaseUrl,
  splitBatchRequestsByLimits
};
