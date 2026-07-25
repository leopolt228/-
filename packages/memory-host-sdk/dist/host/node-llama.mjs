// packages/memory-host-sdk/src/host/node-llama.ts
var NODE_LLAMA_CPP_MODULE = "node-llama-cpp";
async function importNodeLlamaCpp(moduleSpecifier = NODE_LLAMA_CPP_MODULE) {
  return import(moduleSpecifier);
}
export {
  importNodeLlamaCpp
};
