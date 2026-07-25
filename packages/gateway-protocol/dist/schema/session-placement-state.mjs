// packages/gateway-protocol/src/schema/session-placement-state.ts
var SESSION_PLACEMENT_STATES = [
  "local",
  "requested",
  "provisioning",
  "syncing",
  "starting",
  "active",
  "draining",
  "reconciling",
  "reclaimed",
  "failed"
];
function isCloudWorkerPlacementState(state) {
  return state !== void 0 && state !== "local" && state !== "reclaimed";
}
export {
  SESSION_PLACEMENT_STATES,
  isCloudWorkerPlacementState
};
