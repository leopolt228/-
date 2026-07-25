// packages/markdown-core/src/ir-source-spacing.ts
function computeNextMappedBlockStarts(tokens) {
  const nextStarts = [];
  let nextStart;
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    nextStarts[index] = nextStart;
    const currentStart = tokens[index]?.map?.[0];
    if (currentStart !== void 0) {
      nextStart = currentStart;
    }
  }
  return nextStarts;
}
function sourceBlockNewlineCount(preserveSourceBlockSpacing, nextBlockStart, blockLineEnd) {
  if (!preserveSourceBlockSpacing || blockLineEnd === void 0) {
    return void 0;
  }
  return nextBlockStart === void 0 ? 0 : Math.max(1, nextBlockStart - blockLineEnd + 1);
}
export {
  computeNextMappedBlockStarts,
  sourceBlockNewlineCount
};
