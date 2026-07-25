// packages/agent-core/src/tool-execution-context.ts
import { AsyncLocalStorage } from "node:async_hooks";
var activeToolExecution = new AsyncLocalStorage();
function getAgentToolExecutionContext() {
  return activeToolExecution.getStore();
}
function runWithAgentToolExecutionContext(context, run) {
  return activeToolExecution.run(context, run);
}
export {
  getAgentToolExecutionContext,
  runWithAgentToolExecutionContext
};
