// packages/memory-host-sdk/src/host/concurrency.ts
import pMap from "p-map";
async function runWithConcurrency(tasks, limit) {
  const inFlight = /* @__PURE__ */ new Set();
  try {
    return await pMap(
      tasks,
      (task) => {
        const run = Promise.resolve().then(task);
        inFlight.add(run);
        void run.then(
          () => inFlight.delete(run),
          () => inFlight.delete(run)
        );
        return run;
      },
      {
        concurrency: Math.max(1, Math.floor(limit)),
        stopOnError: true
      }
    );
  } catch (error) {
    await Promise.allSettled(inFlight);
    throw error;
  }
}
export {
  runWithConcurrency
};
