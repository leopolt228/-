// packages/workboard-contract/src/index.ts
var WORKBOARD_STATUSES = [
  "triage",
  "backlog",
  "todo",
  "scheduled",
  "ready",
  "running",
  "review",
  "blocked",
  "done"
];
var WORKBOARD_PRIORITIES = ["low", "normal", "high", "urgent"];
var WORKBOARD_EXECUTION_ENGINES = ["codex", "claude"];
var WORKBOARD_EXECUTION_MODES = ["autonomous", "manual"];
var WORKBOARD_EXECUTION_STATUSES = [
  "idle",
  "running",
  "review",
  "blocked",
  "done"
];
var WORKBOARD_EVENT_KINDS = [
  "created",
  "edited",
  "moved",
  "linked",
  "specified",
  "decomposed",
  "claimed",
  "heartbeat",
  "execution_updated",
  "attempt_started",
  "attempt_updated",
  "comment_added",
  "link_added",
  "proof_added",
  "artifact_added",
  "attachment_added",
  "diagnostic",
  "notification",
  "dispatch",
  "orchestration",
  "protocol_violation",
  "archived",
  "unarchived",
  "stale"
];
var WORKBOARD_ATTEMPT_STATUSES = [
  "running",
  "succeeded",
  "failed",
  "blocked",
  "stopped"
];
var WORKBOARD_LINK_TYPES = [
  "parent",
  "child",
  "blocks",
  "blocked_by",
  "relates_to"
];
var WORKBOARD_PROOF_STATUSES = ["passed", "failed", "skipped", "unknown"];
var WORKBOARD_TEMPLATE_IDS = ["bugfix", "docs", "release", "pr_review", "plugin"];
var WORKBOARD_DIAGNOSTIC_KINDS = [
  "stranded_ready",
  "running_without_heartbeat",
  "blocked_too_long",
  "repeated_failures",
  "missing_proof",
  "orphaned_session"
];
var WORKBOARD_DIAGNOSTIC_SEVERITIES = ["warning", "error", "critical"];
var WORKBOARD_NOTIFICATION_KINDS = ["completed", "failed", "stale"];
var WORKBOARD_BOARD_ID_PATTERN = /^[a-z0-9][a-z0-9._-]{0,79}$/;
function isValidWorkboardBoardId(value) {
  return typeof value === "string" && WORKBOARD_BOARD_ID_PATTERN.test(value);
}
var WORKBOARD_CHANGED_EVENT = "plugin.workboard.changed";
export {
  WORKBOARD_ATTEMPT_STATUSES,
  WORKBOARD_BOARD_ID_PATTERN,
  WORKBOARD_CHANGED_EVENT,
  WORKBOARD_DIAGNOSTIC_KINDS,
  WORKBOARD_DIAGNOSTIC_SEVERITIES,
  WORKBOARD_EVENT_KINDS,
  WORKBOARD_EXECUTION_ENGINES,
  WORKBOARD_EXECUTION_MODES,
  WORKBOARD_EXECUTION_STATUSES,
  WORKBOARD_LINK_TYPES,
  WORKBOARD_NOTIFICATION_KINDS,
  WORKBOARD_PRIORITIES,
  WORKBOARD_PROOF_STATUSES,
  WORKBOARD_STATUSES,
  WORKBOARD_TEMPLATE_IDS,
  isValidWorkboardBoardId
};
