import { o as PluginStateLeaseRunner } from "./plugin-state-lease.types-D2kJwQpO.js";
import { t as MemoryCoreAcquireLocalService } from "./embedding-local-service-BCpPp3QB.js";

//#region extensions/memory-core/src/memory/runtime-host.d.ts
type MemoryCoreRuntimeHost = {
  acquireLocalService?: MemoryCoreAcquireLocalService;
  withLease?: PluginStateLeaseRunner;
};
//#endregion
export { MemoryCoreRuntimeHost as t };