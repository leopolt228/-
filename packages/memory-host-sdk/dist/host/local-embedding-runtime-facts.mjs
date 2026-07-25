// packages/memory-host-sdk/src/host/local-embedding-runtime-facts.ts
var LOCAL_EMBEDDING_RUNTIME_FACTS = /* @__PURE__ */ Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function attachLocalEmbeddingRuntimeFacts(target, getFacts) {
  Object.defineProperty(target, LOCAL_EMBEDDING_RUNTIME_FACTS, {
    configurable: false,
    enumerable: false,
    value: getFacts,
    writable: false
  });
}
function getLocalEmbeddingRuntimeFacts(target) {
  if (!target) {
    return void 0;
  }
  const getFacts = Reflect.get(target, LOCAL_EMBEDDING_RUNTIME_FACTS);
  return typeof getFacts === "function" ? getFacts() : void 0;
}
export {
  attachLocalEmbeddingRuntimeFacts,
  getLocalEmbeddingRuntimeFacts
};
