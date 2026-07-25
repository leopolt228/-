// packages/sdk/src/event-hub.ts
var EventHub = class {
  constructor(options = {}) {
    this.replayEvents = [];
    this.closed = false;
    this.hasCloseError = false;
    this.listeners = /* @__PURE__ */ new Set();
    this.waiters = /* @__PURE__ */ new Set();
    this.replayLimit = options.replayLimit ?? 0;
  }
  publish(event) {
    if (this.closed) {
      return;
    }
    if (this.replayLimit > 0) {
      this.replayEvents.push(event);
      const overflow = this.replayEvents.length - this.replayLimit;
      if (overflow > 0) {
        this.replayEvents.splice(0, overflow);
      }
    }
    for (const listener of this.listeners) {
      listener(event);
    }
  }
  close(error) {
    const hasError = arguments.length > 0;
    if (hasError) {
      this.closeError = error;
      this.hasCloseError = true;
    }
    this.closed = true;
    this.replayEvents.length = 0;
    this.listeners.clear();
    for (const wake of this.waiters) {
      wake();
    }
    this.waiters.clear();
  }
  snapshot(filter) {
    return filter ? this.replayEvents.filter(filter) : [...this.replayEvents];
  }
  stream(filter, options = {}) {
    return {
      [Symbol.asyncIterator]: () => {
        const queue = options.replay ? this.snapshot(filter) : [];
        let stopped = false;
        let wake = null;
        const wakePending = () => {
          const pending = wake;
          if (!pending) {
            return;
          }
          wake = null;
          this.waiters.delete(pending);
          pending();
        };
        const listener = (event) => {
          if (!filter || filter(event)) {
            queue.push(event);
            wakePending();
          }
        };
        const cleanup = () => {
          if (stopped) {
            return;
          }
          stopped = true;
          this.listeners.delete(listener);
          wakePending();
        };
        this.listeners.add(listener);
        return {
          next: async () => {
            while (true) {
              if (stopped) {
                break;
              }
              if (queue.length > 0) {
                return { done: false, value: queue.shift() };
              }
              if (this.closed) {
                break;
              }
              await new Promise((resolve) => {
                const wakeCurrent = () => {
                  if (wake === wakeCurrent) {
                    wake = null;
                  }
                  this.waiters.delete(wakeCurrent);
                  resolve();
                };
                wake = wakeCurrent;
                this.waiters.add(wakeCurrent);
              });
            }
            cleanup();
            if (this.hasCloseError) {
              throw this.closeError;
            }
            return { done: true, value: void 0 };
          },
          return: async () => {
            cleanup();
            return { done: true, value: void 0 };
          }
        };
      }
    };
  }
};
function isGatewayEvent(value) {
  return typeof value === "object" && value !== null && typeof value.event === "string";
}
export {
  EventHub,
  isGatewayEvent
};
