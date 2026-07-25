import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as log } from "./logger-DTutvtjM.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-ey8aD0rO.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./agent-harness-runtime-D7zuPfY8.js";
import { d as withSessionTranscriptWriteLock, r as publishSessionTranscriptUpdateByIdentity } from "./session-transcript-runtime-DE6luY3W.js";
import { createHash } from "node:crypto";
import { Compile } from "typebox/compile";
import { Buffer } from "node:buffer";
//#region extensions/codex/src/app-server/protocol-generated/json/DynamicToolCallParams.json
var DynamicToolCallParams_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
		"arguments": true,
		"callId": { "type": "string" },
		"namespace": { "type": ["string", "null"] },
		"threadId": { "type": "string" },
		"tool": { "type": "string" },
		"turnId": { "type": "string" }
	},
	required: [
		"arguments",
		"callId",
		"threadId",
		"tool",
		"turnId"
	],
	title: "DynamicToolCallParams",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ErrorNotification.json
var ErrorNotification_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	definitions: {
		"CodexErrorInfo": {
			"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
			"oneOf": [
				{
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				},
				{
					"enum": [
						"contextWindowExceeded",
						"sessionBudgetExceeded",
						"usageLimitExceeded",
						"serverOverloaded",
						"cyberPolicy",
						"internalServerError",
						"unauthorized",
						"badRequest",
						"threadRollbackFailed",
						"sandboxError",
						"other"
					],
					"type": "string"
				}
			]
		},
		"NonSteerableTurnKind": {
			"enum": ["review", "compact"],
			"type": "string"
		},
		"TurnError": {
			"properties": {
				"additionalDetails": {
					"default": null,
					"type": ["string", "null"]
				},
				"codexErrorInfo": { "anyOf": [{ "$ref": "#/definitions/CodexErrorInfo" }, { "type": "null" }] },
				"message": { "type": "string" }
			},
			"required": ["message"],
			"type": "object"
		}
	},
	properties: {
		"error": { "$ref": "#/definitions/TurnError" },
		"threadId": { "type": "string" },
		"turnId": { "type": "string" },
		"willRetry": { "type": "boolean" }
	},
	required: [
		"error",
		"threadId",
		"turnId",
		"willRetry"
	],
	title: "ErrorNotification",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ModelListResponse.json
var ModelListResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	definitions: {
		"InputModality": {
			"description": "Canonical user-input modality tags advertised by a model.",
			"oneOf": [{
				"description": "Plain text turns and tool payloads.",
				"enum": ["text"],
				"type": "string"
			}, {
				"description": "Image attachments included in user turns.",
				"enum": ["image"],
				"type": "string"
			}]
		},
		"Model": {
			"properties": {
				"additionalSpeedTiers": {
					"default": [],
					"description": "Deprecated: use `serviceTiers` instead.",
					"items": { "type": "string" },
					"type": "array"
				},
				"availabilityNux": { "anyOf": [{ "$ref": "#/definitions/ModelAvailabilityNux" }, { "type": "null" }] },
				"defaultReasoningEffort": { "$ref": "#/definitions/ReasoningEffort" },
				"defaultServiceTier": {
					"default": null,
					"description": "Catalog default service tier id for this model, when one is configured.",
					"type": ["string", "null"]
				},
				"description": { "type": "string" },
				"displayName": { "type": "string" },
				"hidden": { "type": "boolean" },
				"id": { "type": "string" },
				"inputModalities": {
					"default": ["text", "image"],
					"items": { "$ref": "#/definitions/InputModality" },
					"type": "array"
				},
				"isDefault": { "type": "boolean" },
				"model": { "type": "string" },
				"serviceTiers": {
					"default": [],
					"items": { "$ref": "#/definitions/ModelServiceTier" },
					"type": "array"
				},
				"supportedReasoningEfforts": {
					"items": { "$ref": "#/definitions/ReasoningEffortOption" },
					"type": "array"
				},
				"supportsPersonality": {
					"default": false,
					"type": "boolean"
				},
				"upgrade": { "type": ["string", "null"] },
				"upgradeInfo": { "anyOf": [{ "$ref": "#/definitions/ModelUpgradeInfo" }, { "type": "null" }] }
			},
			"required": [
				"defaultReasoningEffort",
				"description",
				"displayName",
				"hidden",
				"id",
				"isDefault",
				"model",
				"supportedReasoningEfforts"
			],
			"type": "object"
		},
		"ModelAvailabilityNux": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"ModelServiceTier": {
			"properties": {
				"description": { "type": "string" },
				"id": { "type": "string" },
				"name": { "type": "string" }
			},
			"required": [
				"description",
				"id",
				"name"
			],
			"type": "object"
		},
		"ModelUpgradeInfo": {
			"properties": {
				"migrationMarkdown": { "type": ["string", "null"] },
				"model": { "type": "string" },
				"modelLink": { "type": ["string", "null"] },
				"upgradeCopy": { "type": ["string", "null"] }
			},
			"required": ["model"],
			"type": "object"
		},
		"ReasoningEffort": {
			"description": "A non-empty reasoning effort value advertised by the model.",
			"minLength": 1,
			"type": "string"
		},
		"ReasoningEffortOption": {
			"properties": {
				"description": { "type": "string" },
				"reasoningEffort": { "$ref": "#/definitions/ReasoningEffort" }
			},
			"required": ["description", "reasoningEffort"],
			"type": "object"
		}
	},
	properties: {
		"data": {
			"items": { "$ref": "#/definitions/Model" },
			"type": "array"
		},
		"nextCursor": {
			"description": "Opaque cursor to pass to the next call to continue after the last item. If None, there are no more items to return.",
			"type": ["string", "null"]
		}
	},
	required: ["data"],
	title: "ModelListResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ThreadResumeResponse.json
var ThreadResumeResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	definitions: {
		"AbsolutePathBuf": {
			"description": "A path that is guaranteed to be absolute and normalized (though it is not guaranteed to be canonicalized or exist on the filesystem).\n\nIMPORTANT: When deserializing an `AbsolutePathBuf`, a base path must be set using [AbsolutePathBufGuard::new]. If no base path is set, the deserialization will fail unless the path being deserialized is already absolute.",
			"type": "string"
		},
		"ActivePermissionProfile": {
			"properties": {
				"extends": {
					"default": null,
					"description": "Parent profile identifier from the selected permissions profile's `extends` setting, when present.",
					"type": ["string", "null"]
				},
				"id": {
					"description": "Identifier from `default_permissions` or the implicit built-in default, such as `:workspace` or a user-defined `[permissions.<id>]` profile.",
					"type": "string"
				}
			},
			"required": ["id"],
			"type": "object"
		},
		"AgentPath": { "type": "string" },
		"ApprovalsReviewer": {
			"description": "Configures who approval requests are routed to for review. Examples include sandbox escapes, blocked network access, MCP approval prompts, and ARC escalations. Defaults to `user`. `auto_review` uses a carefully prompted subagent to gather relevant context and apply a risk-based decision framework before approving or denying the request. The legacy value `guardian_subagent` is accepted for compatibility.",
			"enum": [
				"user",
				"auto_review",
				"guardian_subagent"
			],
			"type": "string"
		},
		"AskForApproval": { "oneOf": [{
			"additionalProperties": false,
			"properties": { "granular": {
				"properties": {
					"mcp_elicitations": { "type": "boolean" },
					"request_permissions": {
						"default": false,
						"type": "boolean"
					},
					"rules": { "type": "boolean" },
					"sandbox_approval": { "type": "boolean" },
					"skill_approval": {
						"default": false,
						"type": "boolean"
					}
				},
				"required": [
					"mcp_elicitations",
					"rules",
					"sandbox_approval"
				],
				"type": "object"
			} },
			"required": ["granular"],
			"title": "GranularAskForApproval",
			"type": "object"
		}, {
			"enum": [
				"untrusted",
				"on-request",
				"never"
			],
			"type": "string"
		}] },
		"ByteRange": {
			"properties": {
				"end": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				},
				"start": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				}
			},
			"required": ["end", "start"],
			"type": "object"
		},
		"CodexErrorInfo": {
			"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
			"oneOf": [
				{
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				},
				{
					"enum": [
						"contextWindowExceeded",
						"sessionBudgetExceeded",
						"usageLimitExceeded",
						"serverOverloaded",
						"cyberPolicy",
						"internalServerError",
						"unauthorized",
						"badRequest",
						"threadRollbackFailed",
						"sandboxError",
						"other"
					],
					"type": "string"
				}
			]
		},
		"CollabAgentState": {
			"properties": {
				"message": { "type": ["string", "null"] },
				"status": { "$ref": "#/definitions/CollabAgentStatus" }
			},
			"required": ["status"],
			"type": "object"
		},
		"CollabAgentStatus": {
			"enum": [
				"pendingInit",
				"running",
				"interrupted",
				"completed",
				"errored",
				"shutdown",
				"notFound"
			],
			"type": "string"
		},
		"CollabAgentTool": {
			"enum": [
				"spawnAgent",
				"sendInput",
				"resumeAgent",
				"wait",
				"closeAgent"
			],
			"type": "string"
		},
		"CollabAgentToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"CommandAction": { "oneOf": [
			{
				"properties": {
					"command": { "type": "string" },
					"name": { "type": "string" },
					"path": { "$ref": "#/definitions/AbsolutePathBuf" },
					"type": {
						"enum": ["read"],
						"title": "ReadCommandActionType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"name",
					"path",
					"type"
				],
				"title": "ReadCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"type": {
						"enum": ["listFiles"],
						"title": "ListFilesCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "ListFilesCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "SearchCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"type": {
						"enum": ["unknown"],
						"title": "UnknownCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "UnknownCommandAction",
				"type": "object"
			}
		] },
		"CommandExecutionSource": {
			"enum": [
				"agent",
				"userShell",
				"unifiedExecStartup",
				"unifiedExecInteraction"
			],
			"type": "string"
		},
		"CommandExecutionStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"DynamicToolCallOutputContentItem": { "oneOf": [{
			"properties": {
				"text": { "type": "string" },
				"type": {
					"enum": ["inputText"],
					"title": "InputTextDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["text", "type"],
			"title": "InputTextDynamicToolCallOutputContentItem",
			"type": "object"
		}, {
			"properties": {
				"imageUrl": { "type": "string" },
				"type": {
					"enum": ["inputImage"],
					"title": "InputImageDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["imageUrl", "type"],
			"title": "InputImageDynamicToolCallOutputContentItem",
			"type": "object"
		}] },
		"DynamicToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"FileUpdateChange": {
			"properties": {
				"diff": { "type": "string" },
				"kind": { "$ref": "#/definitions/PatchChangeKind" },
				"path": { "type": "string" }
			},
			"required": [
				"diff",
				"kind",
				"path"
			],
			"type": "object"
		},
		"GitInfo": {
			"properties": {
				"branch": { "type": ["string", "null"] },
				"originUrl": { "type": ["string", "null"] },
				"sha": { "type": ["string", "null"] }
			},
			"type": "object"
		},
		"HookPromptFragment": {
			"properties": {
				"hookRunId": { "type": "string" },
				"text": { "type": "string" }
			},
			"required": ["hookRunId", "text"],
			"type": "object"
		},
		"ImageDetail": {
			"enum": [
				"auto",
				"low",
				"high",
				"original"
			],
			"type": "string"
		},
		"LegacyAppPathString": { "type": "string" },
		"McpToolCallAppContext": {
			"properties": {
				"actionName": { "type": ["string", "null"] },
				"appName": { "type": ["string", "null"] },
				"connectorId": { "type": "string" },
				"linkId": { "type": ["string", "null"] },
				"resourceUri": { "type": ["string", "null"] },
				"templateId": { "type": ["string", "null"] }
			},
			"required": ["connectorId"],
			"type": "object"
		},
		"McpToolCallError": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"McpToolCallResult": {
			"properties": {
				"_meta": true,
				"content": {
					"items": true,
					"type": "array"
				},
				"structuredContent": true
			},
			"required": ["content"],
			"type": "object"
		},
		"McpToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"MemoryCitation": {
			"properties": {
				"entries": {
					"items": { "$ref": "#/definitions/MemoryCitationEntry" },
					"type": "array"
				},
				"threadIds": {
					"items": { "type": "string" },
					"type": "array"
				}
			},
			"required": ["entries", "threadIds"],
			"type": "object"
		},
		"MemoryCitationEntry": {
			"properties": {
				"lineEnd": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"lineStart": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"note": { "type": "string" },
				"path": { "type": "string" }
			},
			"required": [
				"lineEnd",
				"lineStart",
				"note",
				"path"
			],
			"type": "object"
		},
		"MessagePhase": {
			"description": "Classifies an assistant message as interim commentary or final answer text.\n\nProviders do not emit this consistently, so callers must treat `None` as \"phase unknown\" and keep compatibility behavior for legacy models.",
			"oneOf": [{
				"description": "Mid-turn assistant text (for example preamble/progress narration).\n\nAdditional tool calls or assistant output may follow before turn completion.",
				"enum": ["commentary"],
				"type": "string"
			}, {
				"description": "The assistant's terminal answer text for the current turn.",
				"enum": ["final_answer"],
				"type": "string"
			}]
		},
		"MultiAgentMode": {
			"description": "Controls the effective multi-agent delegation instructions for a turn. `custom` means the configured mode hint defines the policy instead of a built-in policy.",
			"oneOf": [{
				"additionalProperties": false,
				"properties": { "custom": { "type": "string" } },
				"required": ["custom"],
				"title": "CustomMultiAgentMode",
				"type": "object"
			}, {
				"enum": ["explicitRequestOnly", "proactive"],
				"type": "string"
			}]
		},
		"NetworkAccess": {
			"enum": ["restricted", "enabled"],
			"type": "string"
		},
		"NonSteerableTurnKind": {
			"enum": ["review", "compact"],
			"type": "string"
		},
		"PatchApplyStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"PatchChangeKind": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["add"],
					"title": "AddPatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "AddPatchChangeKind",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["delete"],
					"title": "DeletePatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DeletePatchChangeKind",
				"type": "object"
			},
			{
				"properties": {
					"move_path": { "type": ["string", "null"] },
					"type": {
						"enum": ["update"],
						"title": "UpdatePatchChangeKindType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "UpdatePatchChangeKind",
				"type": "object"
			}
		] },
		"ReasoningEffort": {
			"description": "A non-empty reasoning effort value advertised by the model.",
			"minLength": 1,
			"type": "string"
		},
		"SandboxPolicy": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["dangerFullAccess"],
					"title": "DangerFullAccessSandboxPolicyType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DangerFullAccessSandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"networkAccess": {
						"default": false,
						"type": "boolean"
					},
					"type": {
						"enum": ["readOnly"],
						"title": "ReadOnlySandboxPolicyType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ReadOnlySandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"networkAccess": {
						"allOf": [{ "$ref": "#/definitions/NetworkAccess" }],
						"default": "restricted"
					},
					"type": {
						"enum": ["externalSandbox"],
						"title": "ExternalSandboxSandboxPolicyType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ExternalSandboxSandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"excludeSlashTmp": {
						"default": false,
						"type": "boolean"
					},
					"excludeTmpdirEnvVar": {
						"default": false,
						"type": "boolean"
					},
					"networkAccess": {
						"default": false,
						"type": "boolean"
					},
					"type": {
						"enum": ["workspaceWrite"],
						"title": "WorkspaceWriteSandboxPolicyType",
						"type": "string"
					},
					"writableRoots": {
						"default": [],
						"items": { "$ref": "#/definitions/AbsolutePathBuf" },
						"type": "array"
					}
				},
				"required": ["type"],
				"title": "WorkspaceWriteSandboxPolicy",
				"type": "object"
			}
		] },
		"SessionSource": { "oneOf": [
			{
				"additionalProperties": false,
				"properties": { "custom": { "type": "string" } },
				"required": ["custom"],
				"title": "CustomSessionSource",
				"type": "object"
			},
			{
				"additionalProperties": false,
				"properties": { "subAgent": { "$ref": "#/definitions/SubAgentSource" } },
				"required": ["subAgent"],
				"title": "SubAgentSessionSource",
				"type": "object"
			},
			{
				"enum": [
					"cli",
					"vscode",
					"exec",
					"appServer",
					"unknown"
				],
				"type": "string"
			}
		] },
		"SubAgentActivityKind": {
			"enum": [
				"started",
				"interacted",
				"interrupted"
			],
			"type": "string"
		},
		"SubAgentSource": { "oneOf": [
			{
				"additionalProperties": false,
				"properties": { "thread_spawn": {
					"properties": {
						"agent_nickname": {
							"default": null,
							"type": ["string", "null"]
						},
						"agent_path": {
							"anyOf": [{ "$ref": "#/definitions/AgentPath" }, { "type": "null" }],
							"default": null
						},
						"agent_role": {
							"default": null,
							"type": ["string", "null"]
						},
						"depth": {
							"format": "int32",
							"type": "integer"
						},
						"parent_thread_id": { "$ref": "#/definitions/ThreadId" }
					},
					"required": ["depth", "parent_thread_id"],
					"type": "object"
				} },
				"required": ["thread_spawn"],
				"title": "ThreadSpawnSubAgentSource",
				"type": "object"
			},
			{
				"additionalProperties": false,
				"properties": { "other": { "type": "string" } },
				"required": ["other"],
				"title": "OtherSubAgentSource",
				"type": "object"
			},
			{
				"enum": [
					"review",
					"compact",
					"memory_consolidation"
				],
				"type": "string"
			}
		] },
		"TextElement": {
			"properties": {
				"byteRange": {
					"allOf": [{ "$ref": "#/definitions/ByteRange" }],
					"description": "Byte range in the parent `text` buffer that this element occupies."
				},
				"placeholder": {
					"description": "Optional human-readable placeholder for the element, displayed in the UI.",
					"type": ["string", "null"]
				}
			},
			"required": ["byteRange"],
			"type": "object"
		},
		"Thread": {
			"properties": {
				"agentNickname": {
					"description": "Optional random unique nickname assigned to an AgentControl-spawned sub-agent.",
					"type": ["string", "null"]
				},
				"agentRole": {
					"description": "Optional role (agent_role) assigned to an AgentControl-spawned sub-agent.",
					"type": ["string", "null"]
				},
				"cliVersion": {
					"description": "Version of the CLI that created the thread.",
					"type": "string"
				},
				"createdAt": {
					"description": "Unix timestamp (in seconds) when the thread was created.",
					"format": "int64",
					"type": "integer"
				},
				"cwd": {
					"allOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }],
					"description": "Working directory captured for the thread."
				},
				"ephemeral": {
					"description": "Whether the thread is ephemeral and should not be materialized on disk.",
					"type": "boolean"
				},
				"extra": {
					"anyOf": [{ "$ref": "#/definitions/ThreadExtra" }, { "type": "null" }],
					"description": "Optional implementation-specific thread data."
				},
				"forkedFromId": {
					"description": "Source thread id when this thread was created by forking another thread.",
					"type": ["string", "null"]
				},
				"gitInfo": {
					"anyOf": [{ "$ref": "#/definitions/GitInfo" }, { "type": "null" }],
					"description": "Optional Git metadata captured when the thread was created."
				},
				"historyMode": {
					"allOf": [{ "$ref": "#/definitions/ThreadHistoryMode" }],
					"default": "legacy",
					"description": "Persisted thread history contract selected when this thread was created."
				},
				"id": {
					"description": "Identifier for this thread. Codex-generated thread IDs are UUIDv7.",
					"type": "string"
				},
				"modelProvider": {
					"description": "Model provider used for this thread (for example, 'openai').",
					"type": "string"
				},
				"name": {
					"description": "Optional user-facing thread title.",
					"type": ["string", "null"]
				},
				"parentThreadId": {
					"description": "The ID of the parent thread. This will only be set if this thread is a subagent.",
					"type": ["string", "null"]
				},
				"path": {
					"description": "[UNSTABLE] Path to the thread on disk.",
					"type": ["string", "null"]
				},
				"preview": {
					"description": "Usually the first user message in the thread, if available.",
					"type": "string"
				},
				"recencyAt": {
					"description": "Unix timestamp (in seconds) used for thread recency ordering.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"sessionId": {
					"description": "Session id shared by threads that belong to the same session tree.",
					"type": "string"
				},
				"source": {
					"allOf": [{ "$ref": "#/definitions/SessionSource" }],
					"description": "Origin of the thread (CLI, VSCode, codex exec, codex app-server, etc.)."
				},
				"status": {
					"allOf": [{ "$ref": "#/definitions/ThreadStatus" }],
					"description": "Current runtime status for the thread."
				},
				"threadSource": {
					"anyOf": [{ "$ref": "#/definitions/ThreadSource" }, { "type": "null" }],
					"description": "Optional analytics source classification for this thread."
				},
				"turns": {
					"description": "Only populated on `thread/resume`, `thread/rollback`, `thread/fork`, and `thread/read` (when `includeTurns` is true) responses. For all other responses and notifications returning a Thread, the turns field will be an empty list.",
					"items": { "$ref": "#/definitions/Turn" },
					"type": "array"
				},
				"updatedAt": {
					"description": "Unix timestamp (in seconds) when the thread was last updated.",
					"format": "int64",
					"type": "integer"
				}
			},
			"required": [
				"cliVersion",
				"createdAt",
				"cwd",
				"ephemeral",
				"id",
				"modelProvider",
				"preview",
				"sessionId",
				"source",
				"status",
				"turns",
				"updatedAt"
			],
			"type": "object"
		},
		"ThreadActiveFlag": {
			"enum": ["waitingOnApproval", "waitingOnUserInput"],
			"type": "string"
		},
		"ThreadExtra": {
			"description": "Extra app-server data for a thread.",
			"type": "object"
		},
		"ThreadHistoryMode": {
			"enum": ["legacy", "paginated"],
			"type": "string"
		},
		"ThreadId": { "type": "string" },
		"ThreadItem": { "oneOf": [
			{
				"properties": {
					"clientId": { "type": ["string", "null"] },
					"content": {
						"items": { "$ref": "#/definitions/UserInput" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["userMessage"],
						"title": "UserMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"content",
					"id",
					"type"
				],
				"title": "UserMessageThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"fragments": {
						"items": { "$ref": "#/definitions/HookPromptFragment" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["hookPrompt"],
						"title": "HookPromptThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"fragments",
					"id",
					"type"
				],
				"title": "HookPromptThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"memoryCitation": {
						"anyOf": [{ "$ref": "#/definitions/MemoryCitation" }, { "type": "null" }],
						"default": null
					},
					"phase": {
						"anyOf": [{ "$ref": "#/definitions/MessagePhase" }, { "type": "null" }],
						"default": null
					},
					"text": { "type": "string" },
					"type": {
						"enum": ["agentMessage"],
						"title": "AgentMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "AgentMessageThreadItem",
				"type": "object"
			},
			{
				"description": "EXPERIMENTAL - proposed plan item content. The completed plan item is authoritative and may not match the concatenation of `PlanDelta` text.",
				"properties": {
					"id": { "type": "string" },
					"text": { "type": "string" },
					"type": {
						"enum": ["plan"],
						"title": "PlanThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "PlanThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"content": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"id": { "type": "string" },
					"summary": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"type": {
						"enum": ["reasoning"],
						"title": "ReasoningThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ReasoningThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"aggregatedOutput": {
						"description": "The command's output, aggregated from stdout and stderr.",
						"type": ["string", "null"]
					},
					"command": {
						"description": "The command to be executed.",
						"type": "string"
					},
					"commandActions": {
						"description": "A best-effort parsing of the command to understand the action(s) it will perform. This returns a list of CommandAction objects because a single shell command may be composed of many commands piped together.",
						"items": { "$ref": "#/definitions/CommandAction" },
						"type": "array"
					},
					"cwd": {
						"allOf": [{ "$ref": "#/definitions/LegacyAppPathString" }],
						"description": "The command's working directory."
					},
					"durationMs": {
						"description": "The duration of the command execution in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"exitCode": {
						"description": "The command's exit code.",
						"format": "int32",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"processId": {
						"description": "Identifier for the underlying PTY process (when available).",
						"type": ["string", "null"]
					},
					"source": {
						"allOf": [{ "$ref": "#/definitions/CommandExecutionSource" }],
						"default": "agent"
					},
					"status": { "$ref": "#/definitions/CommandExecutionStatus" },
					"type": {
						"enum": ["commandExecution"],
						"title": "CommandExecutionThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"commandActions",
					"cwd",
					"id",
					"status",
					"type"
				],
				"title": "CommandExecutionThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"changes": {
						"items": { "$ref": "#/definitions/FileUpdateChange" },
						"type": "array"
					},
					"id": { "type": "string" },
					"status": { "$ref": "#/definitions/PatchApplyStatus" },
					"type": {
						"enum": ["fileChange"],
						"title": "FileChangeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"changes",
					"id",
					"status",
					"type"
				],
				"title": "FileChangeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"appContext": { "anyOf": [{ "$ref": "#/definitions/McpToolCallAppContext" }, { "type": "null" }] },
					"arguments": true,
					"durationMs": {
						"description": "The duration of the MCP tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"error": { "anyOf": [{ "$ref": "#/definitions/McpToolCallError" }, { "type": "null" }] },
					"id": { "type": "string" },
					"mcpAppResourceUri": {
						"description": "Deprecated: use `appContext.resourceUri` instead.",
						"type": ["string", "null"]
					},
					"pluginId": { "type": ["string", "null"] },
					"result": { "anyOf": [{ "$ref": "#/definitions/McpToolCallResult" }, { "type": "null" }] },
					"server": { "type": "string" },
					"status": { "$ref": "#/definitions/McpToolCallStatus" },
					"tool": { "type": "string" },
					"type": {
						"enum": ["mcpToolCall"],
						"title": "McpToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"server",
					"status",
					"tool",
					"type"
				],
				"title": "McpToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"arguments": true,
					"contentItems": {
						"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
						"type": ["array", "null"]
					},
					"durationMs": {
						"description": "The duration of the dynamic tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"namespace": { "type": ["string", "null"] },
					"status": { "$ref": "#/definitions/DynamicToolCallStatus" },
					"success": { "type": ["boolean", "null"] },
					"tool": { "type": "string" },
					"type": {
						"enum": ["dynamicToolCall"],
						"title": "DynamicToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"status",
					"tool",
					"type"
				],
				"title": "DynamicToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentsStates": {
						"additionalProperties": { "$ref": "#/definitions/CollabAgentState" },
						"description": "Last known status of the target agents, when available.",
						"type": "object"
					},
					"id": {
						"description": "Unique identifier for this collab tool call.",
						"type": "string"
					},
					"model": {
						"description": "Model requested for the spawned agent, when applicable.",
						"type": ["string", "null"]
					},
					"prompt": {
						"description": "Prompt text sent as part of the collab tool call, when available.",
						"type": ["string", "null"]
					},
					"reasoningEffort": {
						"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
						"description": "Reasoning effort requested for the spawned agent, when applicable."
					},
					"receiverThreadIds": {
						"description": "Thread ID of the receiving agent, when applicable. In case of spawn operation, this corresponds to the newly spawned agent.",
						"items": { "type": "string" },
						"type": "array"
					},
					"senderThreadId": {
						"description": "Thread ID of the agent issuing the collab request.",
						"type": "string"
					},
					"status": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentToolCallStatus" }],
						"description": "Current status of the collab tool call."
					},
					"tool": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentTool" }],
						"description": "Name of the collab tool that was invoked."
					},
					"type": {
						"enum": ["collabAgentToolCall"],
						"title": "CollabAgentToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentsStates",
					"id",
					"receiverThreadIds",
					"senderThreadId",
					"status",
					"tool",
					"type"
				],
				"title": "CollabAgentToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentPath": { "type": "string" },
					"agentThreadId": { "type": "string" },
					"id": { "type": "string" },
					"kind": { "$ref": "#/definitions/SubAgentActivityKind" },
					"type": {
						"enum": ["subAgentActivity"],
						"title": "SubAgentActivityThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentPath",
					"agentThreadId",
					"id",
					"kind",
					"type"
				],
				"title": "SubAgentActivityThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"action": { "anyOf": [{ "$ref": "#/definitions/WebSearchAction" }, { "type": "null" }] },
					"id": { "type": "string" },
					"query": { "type": "string" },
					"type": {
						"enum": ["webSearch"],
						"title": "WebSearchThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"query",
					"type"
				],
				"title": "WebSearchThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"path": { "$ref": "#/definitions/LegacyAppPathString" },
					"type": {
						"enum": ["imageView"],
						"title": "ImageViewThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"path",
					"type"
				],
				"title": "ImageViewThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"durationMs": {
						"format": "uint64",
						"minimum": 0,
						"type": "integer"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["sleep"],
						"title": "SleepThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"durationMs",
					"id",
					"type"
				],
				"title": "SleepThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"result": { "type": "string" },
					"revisedPrompt": { "type": ["string", "null"] },
					"savedPath": { "anyOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }, { "type": "null" }] },
					"status": { "type": "string" },
					"type": {
						"enum": ["imageGeneration"],
						"title": "ImageGenerationThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"result",
					"status",
					"type"
				],
				"title": "ImageGenerationThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["enteredReviewMode"],
						"title": "EnteredReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "EnteredReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["exitedReviewMode"],
						"title": "ExitedReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "ExitedReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"type": {
						"enum": ["contextCompaction"],
						"title": "ContextCompactionThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ContextCompactionThreadItem",
				"type": "object"
			}
		] },
		"ThreadSource": { "type": "string" },
		"ThreadStatus": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["notLoaded"],
					"title": "NotLoadedThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "NotLoadedThreadStatus",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["idle"],
					"title": "IdleThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "IdleThreadStatus",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["systemError"],
					"title": "SystemErrorThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "SystemErrorThreadStatus",
				"type": "object"
			},
			{
				"properties": {
					"activeFlags": {
						"items": { "$ref": "#/definitions/ThreadActiveFlag" },
						"type": "array"
					},
					"type": {
						"enum": ["active"],
						"title": "ActiveThreadStatusType",
						"type": "string"
					}
				},
				"required": ["activeFlags", "type"],
				"title": "ActiveThreadStatus",
				"type": "object"
			}
		] },
		"Turn": {
			"properties": {
				"completedAt": {
					"description": "Unix timestamp (in seconds) when the turn completed.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"durationMs": {
					"description": "Duration between turn start and completion in milliseconds, if known.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"error": {
					"anyOf": [{ "$ref": "#/definitions/TurnError" }, { "type": "null" }],
					"description": "Only populated when the Turn's status is failed."
				},
				"id": {
					"description": "Identifier for this turn. Codex-generated turn IDs are UUIDv7.",
					"type": "string"
				},
				"items": {
					"description": "Thread items currently included in this turn payload.",
					"items": { "$ref": "#/definitions/ThreadItem" },
					"type": "array"
				},
				"itemsView": {
					"allOf": [{ "$ref": "#/definitions/TurnItemsView" }],
					"default": "full",
					"description": "Describes how much of `items` has been loaded for this turn."
				},
				"startedAt": {
					"description": "Unix timestamp (in seconds) when the turn started.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"status": { "$ref": "#/definitions/TurnStatus" }
			},
			"required": [
				"id",
				"items",
				"status"
			],
			"type": "object"
		},
		"TurnError": {
			"properties": {
				"additionalDetails": {
					"default": null,
					"type": ["string", "null"]
				},
				"codexErrorInfo": { "anyOf": [{ "$ref": "#/definitions/CodexErrorInfo" }, { "type": "null" }] },
				"message": { "type": "string" }
			},
			"required": ["message"],
			"type": "object"
		},
		"TurnItemsView": { "oneOf": [
			{
				"description": "`items` was not loaded for this turn. The field is intentionally empty.",
				"enum": ["notLoaded"],
				"type": "string"
			},
			{
				"description": "`items` contains only a display summary for this turn.",
				"enum": ["summary"],
				"type": "string"
			},
			{
				"description": "`items` contains every ThreadItem available from persisted app-server history for this turn.",
				"enum": ["full"],
				"type": "string"
			}
		] },
		"TurnStatus": {
			"enum": [
				"completed",
				"interrupted",
				"failed",
				"inProgress"
			],
			"type": "string"
		},
		"TurnsPage": {
			"properties": {
				"backwardsCursor": { "type": ["string", "null"] },
				"data": {
					"items": { "$ref": "#/definitions/Turn" },
					"type": "array"
				},
				"nextCursor": { "type": ["string", "null"] }
			},
			"required": ["data"],
			"type": "object"
		},
		"UserInput": { "oneOf": [
			{
				"properties": {
					"text": { "type": "string" },
					"text_elements": {
						"default": [],
						"description": "UI-defined spans within `text` used to render or persist special elements.",
						"items": { "$ref": "#/definitions/TextElement" },
						"type": "array"
					},
					"type": {
						"enum": ["text"],
						"title": "TextUserInputType",
						"type": "string"
					}
				},
				"required": ["text", "type"],
				"title": "TextUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"type": {
						"enum": ["image"],
						"title": "ImageUserInputType",
						"type": "string"
					},
					"url": { "type": "string" }
				},
				"required": ["type", "url"],
				"title": "ImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"path": { "type": "string" },
					"type": {
						"enum": ["localImage"],
						"title": "LocalImageUserInputType",
						"type": "string"
					}
				},
				"required": ["path", "type"],
				"title": "LocalImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["skill"],
						"title": "SkillUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "SkillUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["mention"],
						"title": "MentionUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "MentionUserInput",
				"type": "object"
			}
		] },
		"WebSearchAction": { "oneOf": [
			{
				"properties": {
					"queries": {
						"items": { "type": "string" },
						"type": ["array", "null"]
					},
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchWebSearchActionType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "SearchWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"type": {
						"enum": ["openPage"],
						"title": "OpenPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "OpenPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"pattern": { "type": ["string", "null"] },
					"type": {
						"enum": ["findInPage"],
						"title": "FindInPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "FindInPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["other"],
					"title": "OtherWebSearchActionType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "OtherWebSearchAction",
				"type": "object"
			}
		] }
	},
	properties: {
		"activePermissionProfile": {
			"anyOf": [{ "$ref": "#/definitions/ActivePermissionProfile" }, { "type": "null" }],
			"default": null,
			"description": "Named or implicit built-in profile that produced the active permissions, when known."
		},
		"approvalPolicy": { "$ref": "#/definitions/AskForApproval" },
		"approvalsReviewer": {
			"allOf": [{ "$ref": "#/definitions/ApprovalsReviewer" }],
			"description": "Reviewer currently used for approval requests on this thread."
		},
		"cwd": { "$ref": "#/definitions/AbsolutePathBuf" },
		"initialTurnsPage": {
			"anyOf": [{ "$ref": "#/definitions/TurnsPage" }, { "type": "null" }],
			"default": null,
			"description": "`thread/turns/list` page returned when requested by `initialTurnsPage`."
		},
		"instructionSources": {
			"default": [],
			"description": "Environment-native paths to instruction source files currently loaded for this thread.",
			"items": { "$ref": "#/definitions/LegacyAppPathString" },
			"type": "array"
		},
		"model": { "type": "string" },
		"modelProvider": { "type": "string" },
		"multiAgentMode": {
			"allOf": [{ "$ref": "#/definitions/MultiAgentMode" }],
			"default": "explicitRequestOnly",
			"description": "@deprecated Always `explicitRequestOnly`. Use `reasoningEffort` for Ultra behavior."
		},
		"reasoningEffort": { "anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }] },
		"runtimeWorkspaceRoots": {
			"default": [],
			"description": "Thread-scoped runtime workspace roots used to materialize `:workspace_roots`.",
			"items": { "$ref": "#/definitions/AbsolutePathBuf" },
			"type": "array"
		},
		"sandbox": {
			"allOf": [{ "$ref": "#/definitions/SandboxPolicy" }],
			"description": "Legacy sandbox policy retained for compatibility. Experimental clients should prefer `activePermissionProfile` for profile provenance."
		},
		"serviceTier": { "type": ["string", "null"] },
		"thread": { "$ref": "#/definitions/Thread" }
	},
	required: [
		"approvalPolicy",
		"approvalsReviewer",
		"cwd",
		"model",
		"modelProvider",
		"sandbox",
		"thread"
	],
	title: "ThreadResumeResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ThreadStartResponse.json
var ThreadStartResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	definitions: {
		"AbsolutePathBuf": {
			"description": "A path that is guaranteed to be absolute and normalized (though it is not guaranteed to be canonicalized or exist on the filesystem).\n\nIMPORTANT: When deserializing an `AbsolutePathBuf`, a base path must be set using [AbsolutePathBufGuard::new]. If no base path is set, the deserialization will fail unless the path being deserialized is already absolute.",
			"type": "string"
		},
		"ActivePermissionProfile": {
			"properties": {
				"extends": {
					"default": null,
					"description": "Parent profile identifier from the selected permissions profile's `extends` setting, when present.",
					"type": ["string", "null"]
				},
				"id": {
					"description": "Identifier from `default_permissions` or the implicit built-in default, such as `:workspace` or a user-defined `[permissions.<id>]` profile.",
					"type": "string"
				}
			},
			"required": ["id"],
			"type": "object"
		},
		"AgentPath": { "type": "string" },
		"ApprovalsReviewer": {
			"description": "Configures who approval requests are routed to for review. Examples include sandbox escapes, blocked network access, MCP approval prompts, and ARC escalations. Defaults to `user`. `auto_review` uses a carefully prompted subagent to gather relevant context and apply a risk-based decision framework before approving or denying the request. The legacy value `guardian_subagent` is accepted for compatibility.",
			"enum": [
				"user",
				"auto_review",
				"guardian_subagent"
			],
			"type": "string"
		},
		"AskForApproval": { "oneOf": [{
			"additionalProperties": false,
			"properties": { "granular": {
				"properties": {
					"mcp_elicitations": { "type": "boolean" },
					"request_permissions": {
						"default": false,
						"type": "boolean"
					},
					"rules": { "type": "boolean" },
					"sandbox_approval": { "type": "boolean" },
					"skill_approval": {
						"default": false,
						"type": "boolean"
					}
				},
				"required": [
					"mcp_elicitations",
					"rules",
					"sandbox_approval"
				],
				"type": "object"
			} },
			"required": ["granular"],
			"title": "GranularAskForApproval",
			"type": "object"
		}, {
			"enum": [
				"untrusted",
				"on-request",
				"never"
			],
			"type": "string"
		}] },
		"ByteRange": {
			"properties": {
				"end": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				},
				"start": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				}
			},
			"required": ["end", "start"],
			"type": "object"
		},
		"CodexErrorInfo": {
			"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
			"oneOf": [
				{
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				},
				{
					"enum": [
						"contextWindowExceeded",
						"sessionBudgetExceeded",
						"usageLimitExceeded",
						"serverOverloaded",
						"cyberPolicy",
						"internalServerError",
						"unauthorized",
						"badRequest",
						"threadRollbackFailed",
						"sandboxError",
						"other"
					],
					"type": "string"
				}
			]
		},
		"CollabAgentState": {
			"properties": {
				"message": { "type": ["string", "null"] },
				"status": { "$ref": "#/definitions/CollabAgentStatus" }
			},
			"required": ["status"],
			"type": "object"
		},
		"CollabAgentStatus": {
			"enum": [
				"pendingInit",
				"running",
				"interrupted",
				"completed",
				"errored",
				"shutdown",
				"notFound"
			],
			"type": "string"
		},
		"CollabAgentTool": {
			"enum": [
				"spawnAgent",
				"sendInput",
				"resumeAgent",
				"wait",
				"closeAgent"
			],
			"type": "string"
		},
		"CollabAgentToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"CommandAction": { "oneOf": [
			{
				"properties": {
					"command": { "type": "string" },
					"name": { "type": "string" },
					"path": { "$ref": "#/definitions/AbsolutePathBuf" },
					"type": {
						"enum": ["read"],
						"title": "ReadCommandActionType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"name",
					"path",
					"type"
				],
				"title": "ReadCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"type": {
						"enum": ["listFiles"],
						"title": "ListFilesCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "ListFilesCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "SearchCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"type": {
						"enum": ["unknown"],
						"title": "UnknownCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "UnknownCommandAction",
				"type": "object"
			}
		] },
		"CommandExecutionSource": {
			"enum": [
				"agent",
				"userShell",
				"unifiedExecStartup",
				"unifiedExecInteraction"
			],
			"type": "string"
		},
		"CommandExecutionStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"DynamicToolCallOutputContentItem": { "oneOf": [{
			"properties": {
				"text": { "type": "string" },
				"type": {
					"enum": ["inputText"],
					"title": "InputTextDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["text", "type"],
			"title": "InputTextDynamicToolCallOutputContentItem",
			"type": "object"
		}, {
			"properties": {
				"imageUrl": { "type": "string" },
				"type": {
					"enum": ["inputImage"],
					"title": "InputImageDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["imageUrl", "type"],
			"title": "InputImageDynamicToolCallOutputContentItem",
			"type": "object"
		}] },
		"DynamicToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"FileUpdateChange": {
			"properties": {
				"diff": { "type": "string" },
				"kind": { "$ref": "#/definitions/PatchChangeKind" },
				"path": { "type": "string" }
			},
			"required": [
				"diff",
				"kind",
				"path"
			],
			"type": "object"
		},
		"GitInfo": {
			"properties": {
				"branch": { "type": ["string", "null"] },
				"originUrl": { "type": ["string", "null"] },
				"sha": { "type": ["string", "null"] }
			},
			"type": "object"
		},
		"HookPromptFragment": {
			"properties": {
				"hookRunId": { "type": "string" },
				"text": { "type": "string" }
			},
			"required": ["hookRunId", "text"],
			"type": "object"
		},
		"ImageDetail": {
			"enum": [
				"auto",
				"low",
				"high",
				"original"
			],
			"type": "string"
		},
		"LegacyAppPathString": { "type": "string" },
		"McpToolCallAppContext": {
			"properties": {
				"actionName": { "type": ["string", "null"] },
				"appName": { "type": ["string", "null"] },
				"connectorId": { "type": "string" },
				"linkId": { "type": ["string", "null"] },
				"resourceUri": { "type": ["string", "null"] },
				"templateId": { "type": ["string", "null"] }
			},
			"required": ["connectorId"],
			"type": "object"
		},
		"McpToolCallError": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"McpToolCallResult": {
			"properties": {
				"_meta": true,
				"content": {
					"items": true,
					"type": "array"
				},
				"structuredContent": true
			},
			"required": ["content"],
			"type": "object"
		},
		"McpToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"MemoryCitation": {
			"properties": {
				"entries": {
					"items": { "$ref": "#/definitions/MemoryCitationEntry" },
					"type": "array"
				},
				"threadIds": {
					"items": { "type": "string" },
					"type": "array"
				}
			},
			"required": ["entries", "threadIds"],
			"type": "object"
		},
		"MemoryCitationEntry": {
			"properties": {
				"lineEnd": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"lineStart": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"note": { "type": "string" },
				"path": { "type": "string" }
			},
			"required": [
				"lineEnd",
				"lineStart",
				"note",
				"path"
			],
			"type": "object"
		},
		"MessagePhase": {
			"description": "Classifies an assistant message as interim commentary or final answer text.\n\nProviders do not emit this consistently, so callers must treat `None` as \"phase unknown\" and keep compatibility behavior for legacy models.",
			"oneOf": [{
				"description": "Mid-turn assistant text (for example preamble/progress narration).\n\nAdditional tool calls or assistant output may follow before turn completion.",
				"enum": ["commentary"],
				"type": "string"
			}, {
				"description": "The assistant's terminal answer text for the current turn.",
				"enum": ["final_answer"],
				"type": "string"
			}]
		},
		"MultiAgentMode": {
			"description": "Controls the effective multi-agent delegation instructions for a turn. `custom` means the configured mode hint defines the policy instead of a built-in policy.",
			"oneOf": [{
				"additionalProperties": false,
				"properties": { "custom": { "type": "string" } },
				"required": ["custom"],
				"title": "CustomMultiAgentMode",
				"type": "object"
			}, {
				"enum": ["explicitRequestOnly", "proactive"],
				"type": "string"
			}]
		},
		"NetworkAccess": {
			"enum": ["restricted", "enabled"],
			"type": "string"
		},
		"NonSteerableTurnKind": {
			"enum": ["review", "compact"],
			"type": "string"
		},
		"PatchApplyStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"PatchChangeKind": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["add"],
					"title": "AddPatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "AddPatchChangeKind",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["delete"],
					"title": "DeletePatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DeletePatchChangeKind",
				"type": "object"
			},
			{
				"properties": {
					"move_path": { "type": ["string", "null"] },
					"type": {
						"enum": ["update"],
						"title": "UpdatePatchChangeKindType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "UpdatePatchChangeKind",
				"type": "object"
			}
		] },
		"ReasoningEffort": {
			"description": "A non-empty reasoning effort value advertised by the model.",
			"minLength": 1,
			"type": "string"
		},
		"SandboxPolicy": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["dangerFullAccess"],
					"title": "DangerFullAccessSandboxPolicyType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DangerFullAccessSandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"networkAccess": {
						"default": false,
						"type": "boolean"
					},
					"type": {
						"enum": ["readOnly"],
						"title": "ReadOnlySandboxPolicyType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ReadOnlySandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"networkAccess": {
						"allOf": [{ "$ref": "#/definitions/NetworkAccess" }],
						"default": "restricted"
					},
					"type": {
						"enum": ["externalSandbox"],
						"title": "ExternalSandboxSandboxPolicyType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ExternalSandboxSandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"excludeSlashTmp": {
						"default": false,
						"type": "boolean"
					},
					"excludeTmpdirEnvVar": {
						"default": false,
						"type": "boolean"
					},
					"networkAccess": {
						"default": false,
						"type": "boolean"
					},
					"type": {
						"enum": ["workspaceWrite"],
						"title": "WorkspaceWriteSandboxPolicyType",
						"type": "string"
					},
					"writableRoots": {
						"default": [],
						"items": { "$ref": "#/definitions/AbsolutePathBuf" },
						"type": "array"
					}
				},
				"required": ["type"],
				"title": "WorkspaceWriteSandboxPolicy",
				"type": "object"
			}
		] },
		"SessionSource": { "oneOf": [
			{
				"additionalProperties": false,
				"properties": { "custom": { "type": "string" } },
				"required": ["custom"],
				"title": "CustomSessionSource",
				"type": "object"
			},
			{
				"additionalProperties": false,
				"properties": { "subAgent": { "$ref": "#/definitions/SubAgentSource" } },
				"required": ["subAgent"],
				"title": "SubAgentSessionSource",
				"type": "object"
			},
			{
				"enum": [
					"cli",
					"vscode",
					"exec",
					"appServer",
					"unknown"
				],
				"type": "string"
			}
		] },
		"SubAgentActivityKind": {
			"enum": [
				"started",
				"interacted",
				"interrupted"
			],
			"type": "string"
		},
		"SubAgentSource": { "oneOf": [
			{
				"additionalProperties": false,
				"properties": { "thread_spawn": {
					"properties": {
						"agent_nickname": {
							"default": null,
							"type": ["string", "null"]
						},
						"agent_path": {
							"anyOf": [{ "$ref": "#/definitions/AgentPath" }, { "type": "null" }],
							"default": null
						},
						"agent_role": {
							"default": null,
							"type": ["string", "null"]
						},
						"depth": {
							"format": "int32",
							"type": "integer"
						},
						"parent_thread_id": { "$ref": "#/definitions/ThreadId" }
					},
					"required": ["depth", "parent_thread_id"],
					"type": "object"
				} },
				"required": ["thread_spawn"],
				"title": "ThreadSpawnSubAgentSource",
				"type": "object"
			},
			{
				"additionalProperties": false,
				"properties": { "other": { "type": "string" } },
				"required": ["other"],
				"title": "OtherSubAgentSource",
				"type": "object"
			},
			{
				"enum": [
					"review",
					"compact",
					"memory_consolidation"
				],
				"type": "string"
			}
		] },
		"TextElement": {
			"properties": {
				"byteRange": {
					"allOf": [{ "$ref": "#/definitions/ByteRange" }],
					"description": "Byte range in the parent `text` buffer that this element occupies."
				},
				"placeholder": {
					"description": "Optional human-readable placeholder for the element, displayed in the UI.",
					"type": ["string", "null"]
				}
			},
			"required": ["byteRange"],
			"type": "object"
		},
		"Thread": {
			"properties": {
				"agentNickname": {
					"description": "Optional random unique nickname assigned to an AgentControl-spawned sub-agent.",
					"type": ["string", "null"]
				},
				"agentRole": {
					"description": "Optional role (agent_role) assigned to an AgentControl-spawned sub-agent.",
					"type": ["string", "null"]
				},
				"cliVersion": {
					"description": "Version of the CLI that created the thread.",
					"type": "string"
				},
				"createdAt": {
					"description": "Unix timestamp (in seconds) when the thread was created.",
					"format": "int64",
					"type": "integer"
				},
				"cwd": {
					"allOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }],
					"description": "Working directory captured for the thread."
				},
				"ephemeral": {
					"description": "Whether the thread is ephemeral and should not be materialized on disk.",
					"type": "boolean"
				},
				"extra": {
					"anyOf": [{ "$ref": "#/definitions/ThreadExtra" }, { "type": "null" }],
					"description": "Optional implementation-specific thread data."
				},
				"forkedFromId": {
					"description": "Source thread id when this thread was created by forking another thread.",
					"type": ["string", "null"]
				},
				"gitInfo": {
					"anyOf": [{ "$ref": "#/definitions/GitInfo" }, { "type": "null" }],
					"description": "Optional Git metadata captured when the thread was created."
				},
				"historyMode": {
					"allOf": [{ "$ref": "#/definitions/ThreadHistoryMode" }],
					"default": "legacy",
					"description": "Persisted thread history contract selected when this thread was created."
				},
				"id": {
					"description": "Identifier for this thread. Codex-generated thread IDs are UUIDv7.",
					"type": "string"
				},
				"modelProvider": {
					"description": "Model provider used for this thread (for example, 'openai').",
					"type": "string"
				},
				"name": {
					"description": "Optional user-facing thread title.",
					"type": ["string", "null"]
				},
				"parentThreadId": {
					"description": "The ID of the parent thread. This will only be set if this thread is a subagent.",
					"type": ["string", "null"]
				},
				"path": {
					"description": "[UNSTABLE] Path to the thread on disk.",
					"type": ["string", "null"]
				},
				"preview": {
					"description": "Usually the first user message in the thread, if available.",
					"type": "string"
				},
				"recencyAt": {
					"description": "Unix timestamp (in seconds) used for thread recency ordering.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"sessionId": {
					"description": "Session id shared by threads that belong to the same session tree.",
					"type": "string"
				},
				"source": {
					"allOf": [{ "$ref": "#/definitions/SessionSource" }],
					"description": "Origin of the thread (CLI, VSCode, codex exec, codex app-server, etc.)."
				},
				"status": {
					"allOf": [{ "$ref": "#/definitions/ThreadStatus" }],
					"description": "Current runtime status for the thread."
				},
				"threadSource": {
					"anyOf": [{ "$ref": "#/definitions/ThreadSource" }, { "type": "null" }],
					"description": "Optional analytics source classification for this thread."
				},
				"turns": {
					"description": "Only populated on `thread/resume`, `thread/rollback`, `thread/fork`, and `thread/read` (when `includeTurns` is true) responses. For all other responses and notifications returning a Thread, the turns field will be an empty list.",
					"items": { "$ref": "#/definitions/Turn" },
					"type": "array"
				},
				"updatedAt": {
					"description": "Unix timestamp (in seconds) when the thread was last updated.",
					"format": "int64",
					"type": "integer"
				}
			},
			"required": [
				"cliVersion",
				"createdAt",
				"cwd",
				"ephemeral",
				"id",
				"modelProvider",
				"preview",
				"sessionId",
				"source",
				"status",
				"turns",
				"updatedAt"
			],
			"type": "object"
		},
		"ThreadActiveFlag": {
			"enum": ["waitingOnApproval", "waitingOnUserInput"],
			"type": "string"
		},
		"ThreadExtra": {
			"description": "Extra app-server data for a thread.",
			"type": "object"
		},
		"ThreadHistoryMode": {
			"enum": ["legacy", "paginated"],
			"type": "string"
		},
		"ThreadId": { "type": "string" },
		"ThreadItem": { "oneOf": [
			{
				"properties": {
					"clientId": { "type": ["string", "null"] },
					"content": {
						"items": { "$ref": "#/definitions/UserInput" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["userMessage"],
						"title": "UserMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"content",
					"id",
					"type"
				],
				"title": "UserMessageThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"fragments": {
						"items": { "$ref": "#/definitions/HookPromptFragment" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["hookPrompt"],
						"title": "HookPromptThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"fragments",
					"id",
					"type"
				],
				"title": "HookPromptThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"memoryCitation": {
						"anyOf": [{ "$ref": "#/definitions/MemoryCitation" }, { "type": "null" }],
						"default": null
					},
					"phase": {
						"anyOf": [{ "$ref": "#/definitions/MessagePhase" }, { "type": "null" }],
						"default": null
					},
					"text": { "type": "string" },
					"type": {
						"enum": ["agentMessage"],
						"title": "AgentMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "AgentMessageThreadItem",
				"type": "object"
			},
			{
				"description": "EXPERIMENTAL - proposed plan item content. The completed plan item is authoritative and may not match the concatenation of `PlanDelta` text.",
				"properties": {
					"id": { "type": "string" },
					"text": { "type": "string" },
					"type": {
						"enum": ["plan"],
						"title": "PlanThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "PlanThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"content": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"id": { "type": "string" },
					"summary": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"type": {
						"enum": ["reasoning"],
						"title": "ReasoningThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ReasoningThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"aggregatedOutput": {
						"description": "The command's output, aggregated from stdout and stderr.",
						"type": ["string", "null"]
					},
					"command": {
						"description": "The command to be executed.",
						"type": "string"
					},
					"commandActions": {
						"description": "A best-effort parsing of the command to understand the action(s) it will perform. This returns a list of CommandAction objects because a single shell command may be composed of many commands piped together.",
						"items": { "$ref": "#/definitions/CommandAction" },
						"type": "array"
					},
					"cwd": {
						"allOf": [{ "$ref": "#/definitions/LegacyAppPathString" }],
						"description": "The command's working directory."
					},
					"durationMs": {
						"description": "The duration of the command execution in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"exitCode": {
						"description": "The command's exit code.",
						"format": "int32",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"processId": {
						"description": "Identifier for the underlying PTY process (when available).",
						"type": ["string", "null"]
					},
					"source": {
						"allOf": [{ "$ref": "#/definitions/CommandExecutionSource" }],
						"default": "agent"
					},
					"status": { "$ref": "#/definitions/CommandExecutionStatus" },
					"type": {
						"enum": ["commandExecution"],
						"title": "CommandExecutionThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"commandActions",
					"cwd",
					"id",
					"status",
					"type"
				],
				"title": "CommandExecutionThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"changes": {
						"items": { "$ref": "#/definitions/FileUpdateChange" },
						"type": "array"
					},
					"id": { "type": "string" },
					"status": { "$ref": "#/definitions/PatchApplyStatus" },
					"type": {
						"enum": ["fileChange"],
						"title": "FileChangeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"changes",
					"id",
					"status",
					"type"
				],
				"title": "FileChangeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"appContext": { "anyOf": [{ "$ref": "#/definitions/McpToolCallAppContext" }, { "type": "null" }] },
					"arguments": true,
					"durationMs": {
						"description": "The duration of the MCP tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"error": { "anyOf": [{ "$ref": "#/definitions/McpToolCallError" }, { "type": "null" }] },
					"id": { "type": "string" },
					"mcpAppResourceUri": {
						"description": "Deprecated: use `appContext.resourceUri` instead.",
						"type": ["string", "null"]
					},
					"pluginId": { "type": ["string", "null"] },
					"result": { "anyOf": [{ "$ref": "#/definitions/McpToolCallResult" }, { "type": "null" }] },
					"server": { "type": "string" },
					"status": { "$ref": "#/definitions/McpToolCallStatus" },
					"tool": { "type": "string" },
					"type": {
						"enum": ["mcpToolCall"],
						"title": "McpToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"server",
					"status",
					"tool",
					"type"
				],
				"title": "McpToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"arguments": true,
					"contentItems": {
						"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
						"type": ["array", "null"]
					},
					"durationMs": {
						"description": "The duration of the dynamic tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"namespace": { "type": ["string", "null"] },
					"status": { "$ref": "#/definitions/DynamicToolCallStatus" },
					"success": { "type": ["boolean", "null"] },
					"tool": { "type": "string" },
					"type": {
						"enum": ["dynamicToolCall"],
						"title": "DynamicToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"status",
					"tool",
					"type"
				],
				"title": "DynamicToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentsStates": {
						"additionalProperties": { "$ref": "#/definitions/CollabAgentState" },
						"description": "Last known status of the target agents, when available.",
						"type": "object"
					},
					"id": {
						"description": "Unique identifier for this collab tool call.",
						"type": "string"
					},
					"model": {
						"description": "Model requested for the spawned agent, when applicable.",
						"type": ["string", "null"]
					},
					"prompt": {
						"description": "Prompt text sent as part of the collab tool call, when available.",
						"type": ["string", "null"]
					},
					"reasoningEffort": {
						"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
						"description": "Reasoning effort requested for the spawned agent, when applicable."
					},
					"receiverThreadIds": {
						"description": "Thread ID of the receiving agent, when applicable. In case of spawn operation, this corresponds to the newly spawned agent.",
						"items": { "type": "string" },
						"type": "array"
					},
					"senderThreadId": {
						"description": "Thread ID of the agent issuing the collab request.",
						"type": "string"
					},
					"status": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentToolCallStatus" }],
						"description": "Current status of the collab tool call."
					},
					"tool": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentTool" }],
						"description": "Name of the collab tool that was invoked."
					},
					"type": {
						"enum": ["collabAgentToolCall"],
						"title": "CollabAgentToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentsStates",
					"id",
					"receiverThreadIds",
					"senderThreadId",
					"status",
					"tool",
					"type"
				],
				"title": "CollabAgentToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentPath": { "type": "string" },
					"agentThreadId": { "type": "string" },
					"id": { "type": "string" },
					"kind": { "$ref": "#/definitions/SubAgentActivityKind" },
					"type": {
						"enum": ["subAgentActivity"],
						"title": "SubAgentActivityThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentPath",
					"agentThreadId",
					"id",
					"kind",
					"type"
				],
				"title": "SubAgentActivityThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"action": { "anyOf": [{ "$ref": "#/definitions/WebSearchAction" }, { "type": "null" }] },
					"id": { "type": "string" },
					"query": { "type": "string" },
					"type": {
						"enum": ["webSearch"],
						"title": "WebSearchThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"query",
					"type"
				],
				"title": "WebSearchThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"path": { "$ref": "#/definitions/LegacyAppPathString" },
					"type": {
						"enum": ["imageView"],
						"title": "ImageViewThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"path",
					"type"
				],
				"title": "ImageViewThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"durationMs": {
						"format": "uint64",
						"minimum": 0,
						"type": "integer"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["sleep"],
						"title": "SleepThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"durationMs",
					"id",
					"type"
				],
				"title": "SleepThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"result": { "type": "string" },
					"revisedPrompt": { "type": ["string", "null"] },
					"savedPath": { "anyOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }, { "type": "null" }] },
					"status": { "type": "string" },
					"type": {
						"enum": ["imageGeneration"],
						"title": "ImageGenerationThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"result",
					"status",
					"type"
				],
				"title": "ImageGenerationThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["enteredReviewMode"],
						"title": "EnteredReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "EnteredReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["exitedReviewMode"],
						"title": "ExitedReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "ExitedReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"type": {
						"enum": ["contextCompaction"],
						"title": "ContextCompactionThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ContextCompactionThreadItem",
				"type": "object"
			}
		] },
		"ThreadSource": { "type": "string" },
		"ThreadStatus": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["notLoaded"],
					"title": "NotLoadedThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "NotLoadedThreadStatus",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["idle"],
					"title": "IdleThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "IdleThreadStatus",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["systemError"],
					"title": "SystemErrorThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "SystemErrorThreadStatus",
				"type": "object"
			},
			{
				"properties": {
					"activeFlags": {
						"items": { "$ref": "#/definitions/ThreadActiveFlag" },
						"type": "array"
					},
					"type": {
						"enum": ["active"],
						"title": "ActiveThreadStatusType",
						"type": "string"
					}
				},
				"required": ["activeFlags", "type"],
				"title": "ActiveThreadStatus",
				"type": "object"
			}
		] },
		"Turn": {
			"properties": {
				"completedAt": {
					"description": "Unix timestamp (in seconds) when the turn completed.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"durationMs": {
					"description": "Duration between turn start and completion in milliseconds, if known.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"error": {
					"anyOf": [{ "$ref": "#/definitions/TurnError" }, { "type": "null" }],
					"description": "Only populated when the Turn's status is failed."
				},
				"id": {
					"description": "Identifier for this turn. Codex-generated turn IDs are UUIDv7.",
					"type": "string"
				},
				"items": {
					"description": "Thread items currently included in this turn payload.",
					"items": { "$ref": "#/definitions/ThreadItem" },
					"type": "array"
				},
				"itemsView": {
					"allOf": [{ "$ref": "#/definitions/TurnItemsView" }],
					"default": "full",
					"description": "Describes how much of `items` has been loaded for this turn."
				},
				"startedAt": {
					"description": "Unix timestamp (in seconds) when the turn started.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"status": { "$ref": "#/definitions/TurnStatus" }
			},
			"required": [
				"id",
				"items",
				"status"
			],
			"type": "object"
		},
		"TurnError": {
			"properties": {
				"additionalDetails": {
					"default": null,
					"type": ["string", "null"]
				},
				"codexErrorInfo": { "anyOf": [{ "$ref": "#/definitions/CodexErrorInfo" }, { "type": "null" }] },
				"message": { "type": "string" }
			},
			"required": ["message"],
			"type": "object"
		},
		"TurnItemsView": { "oneOf": [
			{
				"description": "`items` was not loaded for this turn. The field is intentionally empty.",
				"enum": ["notLoaded"],
				"type": "string"
			},
			{
				"description": "`items` contains only a display summary for this turn.",
				"enum": ["summary"],
				"type": "string"
			},
			{
				"description": "`items` contains every ThreadItem available from persisted app-server history for this turn.",
				"enum": ["full"],
				"type": "string"
			}
		] },
		"TurnStatus": {
			"enum": [
				"completed",
				"interrupted",
				"failed",
				"inProgress"
			],
			"type": "string"
		},
		"UserInput": { "oneOf": [
			{
				"properties": {
					"text": { "type": "string" },
					"text_elements": {
						"default": [],
						"description": "UI-defined spans within `text` used to render or persist special elements.",
						"items": { "$ref": "#/definitions/TextElement" },
						"type": "array"
					},
					"type": {
						"enum": ["text"],
						"title": "TextUserInputType",
						"type": "string"
					}
				},
				"required": ["text", "type"],
				"title": "TextUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"type": {
						"enum": ["image"],
						"title": "ImageUserInputType",
						"type": "string"
					},
					"url": { "type": "string" }
				},
				"required": ["type", "url"],
				"title": "ImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"path": { "type": "string" },
					"type": {
						"enum": ["localImage"],
						"title": "LocalImageUserInputType",
						"type": "string"
					}
				},
				"required": ["path", "type"],
				"title": "LocalImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["skill"],
						"title": "SkillUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "SkillUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["mention"],
						"title": "MentionUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "MentionUserInput",
				"type": "object"
			}
		] },
		"WebSearchAction": { "oneOf": [
			{
				"properties": {
					"queries": {
						"items": { "type": "string" },
						"type": ["array", "null"]
					},
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchWebSearchActionType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "SearchWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"type": {
						"enum": ["openPage"],
						"title": "OpenPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "OpenPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"pattern": { "type": ["string", "null"] },
					"type": {
						"enum": ["findInPage"],
						"title": "FindInPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "FindInPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["other"],
					"title": "OtherWebSearchActionType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "OtherWebSearchAction",
				"type": "object"
			}
		] }
	},
	properties: {
		"activePermissionProfile": {
			"anyOf": [{ "$ref": "#/definitions/ActivePermissionProfile" }, { "type": "null" }],
			"default": null,
			"description": "Named or implicit built-in profile that produced the active permissions, when known."
		},
		"approvalPolicy": { "$ref": "#/definitions/AskForApproval" },
		"approvalsReviewer": {
			"allOf": [{ "$ref": "#/definitions/ApprovalsReviewer" }],
			"description": "Reviewer currently used for approval requests on this thread."
		},
		"cwd": { "$ref": "#/definitions/AbsolutePathBuf" },
		"instructionSources": {
			"default": [],
			"description": "Environment-native paths to instruction source files currently loaded for this thread.",
			"items": { "$ref": "#/definitions/LegacyAppPathString" },
			"type": "array"
		},
		"model": { "type": "string" },
		"modelProvider": { "type": "string" },
		"multiAgentMode": {
			"allOf": [{ "$ref": "#/definitions/MultiAgentMode" }],
			"default": "explicitRequestOnly",
			"description": "@deprecated Always `explicitRequestOnly`. Use `reasoningEffort` for Ultra behavior."
		},
		"reasoningEffort": { "anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }] },
		"runtimeWorkspaceRoots": {
			"default": [],
			"description": "Thread-scoped runtime workspace roots used to materialize `:workspace_roots`.",
			"items": { "$ref": "#/definitions/AbsolutePathBuf" },
			"type": "array"
		},
		"sandbox": {
			"allOf": [{ "$ref": "#/definitions/SandboxPolicy" }],
			"description": "Legacy sandbox policy retained for compatibility. Experimental clients should prefer `activePermissionProfile` for profile provenance."
		},
		"serviceTier": { "type": ["string", "null"] },
		"thread": { "$ref": "#/definitions/Thread" }
	},
	required: [
		"approvalPolicy",
		"approvalsReviewer",
		"cwd",
		"model",
		"modelProvider",
		"sandbox",
		"thread"
	],
	title: "ThreadStartResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/TurnCompletedNotification.json
var TurnCompletedNotification_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	definitions: {
		"AbsolutePathBuf": {
			"description": "A path that is guaranteed to be absolute and normalized (though it is not guaranteed to be canonicalized or exist on the filesystem).\n\nIMPORTANT: When deserializing an `AbsolutePathBuf`, a base path must be set using [AbsolutePathBufGuard::new]. If no base path is set, the deserialization will fail unless the path being deserialized is already absolute.",
			"type": "string"
		},
		"ByteRange": {
			"properties": {
				"end": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				},
				"start": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				}
			},
			"required": ["end", "start"],
			"type": "object"
		},
		"CodexErrorInfo": {
			"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
			"oneOf": [
				{
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				},
				{
					"enum": [
						"contextWindowExceeded",
						"sessionBudgetExceeded",
						"usageLimitExceeded",
						"serverOverloaded",
						"cyberPolicy",
						"internalServerError",
						"unauthorized",
						"badRequest",
						"threadRollbackFailed",
						"sandboxError",
						"other"
					],
					"type": "string"
				}
			]
		},
		"CollabAgentState": {
			"properties": {
				"message": { "type": ["string", "null"] },
				"status": { "$ref": "#/definitions/CollabAgentStatus" }
			},
			"required": ["status"],
			"type": "object"
		},
		"CollabAgentStatus": {
			"enum": [
				"pendingInit",
				"running",
				"interrupted",
				"completed",
				"errored",
				"shutdown",
				"notFound"
			],
			"type": "string"
		},
		"CollabAgentTool": {
			"enum": [
				"spawnAgent",
				"sendInput",
				"resumeAgent",
				"wait",
				"closeAgent"
			],
			"type": "string"
		},
		"CollabAgentToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"CommandAction": { "oneOf": [
			{
				"properties": {
					"command": { "type": "string" },
					"name": { "type": "string" },
					"path": { "$ref": "#/definitions/AbsolutePathBuf" },
					"type": {
						"enum": ["read"],
						"title": "ReadCommandActionType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"name",
					"path",
					"type"
				],
				"title": "ReadCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"type": {
						"enum": ["listFiles"],
						"title": "ListFilesCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "ListFilesCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "SearchCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"type": {
						"enum": ["unknown"],
						"title": "UnknownCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "UnknownCommandAction",
				"type": "object"
			}
		] },
		"CommandExecutionSource": {
			"enum": [
				"agent",
				"userShell",
				"unifiedExecStartup",
				"unifiedExecInteraction"
			],
			"type": "string"
		},
		"CommandExecutionStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"DynamicToolCallOutputContentItem": { "oneOf": [{
			"properties": {
				"text": { "type": "string" },
				"type": {
					"enum": ["inputText"],
					"title": "InputTextDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["text", "type"],
			"title": "InputTextDynamicToolCallOutputContentItem",
			"type": "object"
		}, {
			"properties": {
				"imageUrl": { "type": "string" },
				"type": {
					"enum": ["inputImage"],
					"title": "InputImageDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["imageUrl", "type"],
			"title": "InputImageDynamicToolCallOutputContentItem",
			"type": "object"
		}] },
		"DynamicToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"FileUpdateChange": {
			"properties": {
				"diff": { "type": "string" },
				"kind": { "$ref": "#/definitions/PatchChangeKind" },
				"path": { "type": "string" }
			},
			"required": [
				"diff",
				"kind",
				"path"
			],
			"type": "object"
		},
		"HookPromptFragment": {
			"properties": {
				"hookRunId": { "type": "string" },
				"text": { "type": "string" }
			},
			"required": ["hookRunId", "text"],
			"type": "object"
		},
		"ImageDetail": {
			"enum": [
				"auto",
				"low",
				"high",
				"original"
			],
			"type": "string"
		},
		"LegacyAppPathString": { "type": "string" },
		"McpToolCallAppContext": {
			"properties": {
				"actionName": { "type": ["string", "null"] },
				"appName": { "type": ["string", "null"] },
				"connectorId": { "type": "string" },
				"linkId": { "type": ["string", "null"] },
				"resourceUri": { "type": ["string", "null"] },
				"templateId": { "type": ["string", "null"] }
			},
			"required": ["connectorId"],
			"type": "object"
		},
		"McpToolCallError": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"McpToolCallResult": {
			"properties": {
				"_meta": true,
				"content": {
					"items": true,
					"type": "array"
				},
				"structuredContent": true
			},
			"required": ["content"],
			"type": "object"
		},
		"McpToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"MemoryCitation": {
			"properties": {
				"entries": {
					"items": { "$ref": "#/definitions/MemoryCitationEntry" },
					"type": "array"
				},
				"threadIds": {
					"items": { "type": "string" },
					"type": "array"
				}
			},
			"required": ["entries", "threadIds"],
			"type": "object"
		},
		"MemoryCitationEntry": {
			"properties": {
				"lineEnd": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"lineStart": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"note": { "type": "string" },
				"path": { "type": "string" }
			},
			"required": [
				"lineEnd",
				"lineStart",
				"note",
				"path"
			],
			"type": "object"
		},
		"MessagePhase": {
			"description": "Classifies an assistant message as interim commentary or final answer text.\n\nProviders do not emit this consistently, so callers must treat `None` as \"phase unknown\" and keep compatibility behavior for legacy models.",
			"oneOf": [{
				"description": "Mid-turn assistant text (for example preamble/progress narration).\n\nAdditional tool calls or assistant output may follow before turn completion.",
				"enum": ["commentary"],
				"type": "string"
			}, {
				"description": "The assistant's terminal answer text for the current turn.",
				"enum": ["final_answer"],
				"type": "string"
			}]
		},
		"NonSteerableTurnKind": {
			"enum": ["review", "compact"],
			"type": "string"
		},
		"PatchApplyStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"PatchChangeKind": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["add"],
					"title": "AddPatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "AddPatchChangeKind",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["delete"],
					"title": "DeletePatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DeletePatchChangeKind",
				"type": "object"
			},
			{
				"properties": {
					"move_path": { "type": ["string", "null"] },
					"type": {
						"enum": ["update"],
						"title": "UpdatePatchChangeKindType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "UpdatePatchChangeKind",
				"type": "object"
			}
		] },
		"ReasoningEffort": {
			"description": "A non-empty reasoning effort value advertised by the model.",
			"minLength": 1,
			"type": "string"
		},
		"SubAgentActivityKind": {
			"enum": [
				"started",
				"interacted",
				"interrupted"
			],
			"type": "string"
		},
		"TextElement": {
			"properties": {
				"byteRange": {
					"allOf": [{ "$ref": "#/definitions/ByteRange" }],
					"description": "Byte range in the parent `text` buffer that this element occupies."
				},
				"placeholder": {
					"description": "Optional human-readable placeholder for the element, displayed in the UI.",
					"type": ["string", "null"]
				}
			},
			"required": ["byteRange"],
			"type": "object"
		},
		"ThreadItem": { "oneOf": [
			{
				"properties": {
					"clientId": { "type": ["string", "null"] },
					"content": {
						"items": { "$ref": "#/definitions/UserInput" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["userMessage"],
						"title": "UserMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"content",
					"id",
					"type"
				],
				"title": "UserMessageThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"fragments": {
						"items": { "$ref": "#/definitions/HookPromptFragment" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["hookPrompt"],
						"title": "HookPromptThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"fragments",
					"id",
					"type"
				],
				"title": "HookPromptThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"memoryCitation": {
						"anyOf": [{ "$ref": "#/definitions/MemoryCitation" }, { "type": "null" }],
						"default": null
					},
					"phase": {
						"anyOf": [{ "$ref": "#/definitions/MessagePhase" }, { "type": "null" }],
						"default": null
					},
					"text": { "type": "string" },
					"type": {
						"enum": ["agentMessage"],
						"title": "AgentMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "AgentMessageThreadItem",
				"type": "object"
			},
			{
				"description": "EXPERIMENTAL - proposed plan item content. The completed plan item is authoritative and may not match the concatenation of `PlanDelta` text.",
				"properties": {
					"id": { "type": "string" },
					"text": { "type": "string" },
					"type": {
						"enum": ["plan"],
						"title": "PlanThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "PlanThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"content": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"id": { "type": "string" },
					"summary": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"type": {
						"enum": ["reasoning"],
						"title": "ReasoningThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ReasoningThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"aggregatedOutput": {
						"description": "The command's output, aggregated from stdout and stderr.",
						"type": ["string", "null"]
					},
					"command": {
						"description": "The command to be executed.",
						"type": "string"
					},
					"commandActions": {
						"description": "A best-effort parsing of the command to understand the action(s) it will perform. This returns a list of CommandAction objects because a single shell command may be composed of many commands piped together.",
						"items": { "$ref": "#/definitions/CommandAction" },
						"type": "array"
					},
					"cwd": {
						"allOf": [{ "$ref": "#/definitions/LegacyAppPathString" }],
						"description": "The command's working directory."
					},
					"durationMs": {
						"description": "The duration of the command execution in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"exitCode": {
						"description": "The command's exit code.",
						"format": "int32",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"processId": {
						"description": "Identifier for the underlying PTY process (when available).",
						"type": ["string", "null"]
					},
					"source": {
						"allOf": [{ "$ref": "#/definitions/CommandExecutionSource" }],
						"default": "agent"
					},
					"status": { "$ref": "#/definitions/CommandExecutionStatus" },
					"type": {
						"enum": ["commandExecution"],
						"title": "CommandExecutionThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"commandActions",
					"cwd",
					"id",
					"status",
					"type"
				],
				"title": "CommandExecutionThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"changes": {
						"items": { "$ref": "#/definitions/FileUpdateChange" },
						"type": "array"
					},
					"id": { "type": "string" },
					"status": { "$ref": "#/definitions/PatchApplyStatus" },
					"type": {
						"enum": ["fileChange"],
						"title": "FileChangeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"changes",
					"id",
					"status",
					"type"
				],
				"title": "FileChangeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"appContext": { "anyOf": [{ "$ref": "#/definitions/McpToolCallAppContext" }, { "type": "null" }] },
					"arguments": true,
					"durationMs": {
						"description": "The duration of the MCP tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"error": { "anyOf": [{ "$ref": "#/definitions/McpToolCallError" }, { "type": "null" }] },
					"id": { "type": "string" },
					"mcpAppResourceUri": {
						"description": "Deprecated: use `appContext.resourceUri` instead.",
						"type": ["string", "null"]
					},
					"pluginId": { "type": ["string", "null"] },
					"result": { "anyOf": [{ "$ref": "#/definitions/McpToolCallResult" }, { "type": "null" }] },
					"server": { "type": "string" },
					"status": { "$ref": "#/definitions/McpToolCallStatus" },
					"tool": { "type": "string" },
					"type": {
						"enum": ["mcpToolCall"],
						"title": "McpToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"server",
					"status",
					"tool",
					"type"
				],
				"title": "McpToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"arguments": true,
					"contentItems": {
						"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
						"type": ["array", "null"]
					},
					"durationMs": {
						"description": "The duration of the dynamic tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"namespace": { "type": ["string", "null"] },
					"status": { "$ref": "#/definitions/DynamicToolCallStatus" },
					"success": { "type": ["boolean", "null"] },
					"tool": { "type": "string" },
					"type": {
						"enum": ["dynamicToolCall"],
						"title": "DynamicToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"status",
					"tool",
					"type"
				],
				"title": "DynamicToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentsStates": {
						"additionalProperties": { "$ref": "#/definitions/CollabAgentState" },
						"description": "Last known status of the target agents, when available.",
						"type": "object"
					},
					"id": {
						"description": "Unique identifier for this collab tool call.",
						"type": "string"
					},
					"model": {
						"description": "Model requested for the spawned agent, when applicable.",
						"type": ["string", "null"]
					},
					"prompt": {
						"description": "Prompt text sent as part of the collab tool call, when available.",
						"type": ["string", "null"]
					},
					"reasoningEffort": {
						"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
						"description": "Reasoning effort requested for the spawned agent, when applicable."
					},
					"receiverThreadIds": {
						"description": "Thread ID of the receiving agent, when applicable. In case of spawn operation, this corresponds to the newly spawned agent.",
						"items": { "type": "string" },
						"type": "array"
					},
					"senderThreadId": {
						"description": "Thread ID of the agent issuing the collab request.",
						"type": "string"
					},
					"status": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentToolCallStatus" }],
						"description": "Current status of the collab tool call."
					},
					"tool": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentTool" }],
						"description": "Name of the collab tool that was invoked."
					},
					"type": {
						"enum": ["collabAgentToolCall"],
						"title": "CollabAgentToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentsStates",
					"id",
					"receiverThreadIds",
					"senderThreadId",
					"status",
					"tool",
					"type"
				],
				"title": "CollabAgentToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentPath": { "type": "string" },
					"agentThreadId": { "type": "string" },
					"id": { "type": "string" },
					"kind": { "$ref": "#/definitions/SubAgentActivityKind" },
					"type": {
						"enum": ["subAgentActivity"],
						"title": "SubAgentActivityThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentPath",
					"agentThreadId",
					"id",
					"kind",
					"type"
				],
				"title": "SubAgentActivityThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"action": { "anyOf": [{ "$ref": "#/definitions/WebSearchAction" }, { "type": "null" }] },
					"id": { "type": "string" },
					"query": { "type": "string" },
					"type": {
						"enum": ["webSearch"],
						"title": "WebSearchThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"query",
					"type"
				],
				"title": "WebSearchThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"path": { "$ref": "#/definitions/LegacyAppPathString" },
					"type": {
						"enum": ["imageView"],
						"title": "ImageViewThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"path",
					"type"
				],
				"title": "ImageViewThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"durationMs": {
						"format": "uint64",
						"minimum": 0,
						"type": "integer"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["sleep"],
						"title": "SleepThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"durationMs",
					"id",
					"type"
				],
				"title": "SleepThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"result": { "type": "string" },
					"revisedPrompt": { "type": ["string", "null"] },
					"savedPath": { "anyOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }, { "type": "null" }] },
					"status": { "type": "string" },
					"type": {
						"enum": ["imageGeneration"],
						"title": "ImageGenerationThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"result",
					"status",
					"type"
				],
				"title": "ImageGenerationThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["enteredReviewMode"],
						"title": "EnteredReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "EnteredReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["exitedReviewMode"],
						"title": "ExitedReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "ExitedReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"type": {
						"enum": ["contextCompaction"],
						"title": "ContextCompactionThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ContextCompactionThreadItem",
				"type": "object"
			}
		] },
		"Turn": {
			"properties": {
				"completedAt": {
					"description": "Unix timestamp (in seconds) when the turn completed.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"durationMs": {
					"description": "Duration between turn start and completion in milliseconds, if known.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"error": {
					"anyOf": [{ "$ref": "#/definitions/TurnError" }, { "type": "null" }],
					"description": "Only populated when the Turn's status is failed."
				},
				"id": {
					"description": "Identifier for this turn. Codex-generated turn IDs are UUIDv7.",
					"type": "string"
				},
				"items": {
					"description": "Thread items currently included in this turn payload.",
					"items": { "$ref": "#/definitions/ThreadItem" },
					"type": "array"
				},
				"itemsView": {
					"allOf": [{ "$ref": "#/definitions/TurnItemsView" }],
					"default": "full",
					"description": "Describes how much of `items` has been loaded for this turn."
				},
				"startedAt": {
					"description": "Unix timestamp (in seconds) when the turn started.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"status": { "$ref": "#/definitions/TurnStatus" }
			},
			"required": [
				"id",
				"items",
				"status"
			],
			"type": "object"
		},
		"TurnError": {
			"properties": {
				"additionalDetails": {
					"default": null,
					"type": ["string", "null"]
				},
				"codexErrorInfo": { "anyOf": [{ "$ref": "#/definitions/CodexErrorInfo" }, { "type": "null" }] },
				"message": { "type": "string" }
			},
			"required": ["message"],
			"type": "object"
		},
		"TurnItemsView": { "oneOf": [
			{
				"description": "`items` was not loaded for this turn. The field is intentionally empty.",
				"enum": ["notLoaded"],
				"type": "string"
			},
			{
				"description": "`items` contains only a display summary for this turn.",
				"enum": ["summary"],
				"type": "string"
			},
			{
				"description": "`items` contains every ThreadItem available from persisted app-server history for this turn.",
				"enum": ["full"],
				"type": "string"
			}
		] },
		"TurnStatus": {
			"enum": [
				"completed",
				"interrupted",
				"failed",
				"inProgress"
			],
			"type": "string"
		},
		"UserInput": { "oneOf": [
			{
				"properties": {
					"text": { "type": "string" },
					"text_elements": {
						"default": [],
						"description": "UI-defined spans within `text` used to render or persist special elements.",
						"items": { "$ref": "#/definitions/TextElement" },
						"type": "array"
					},
					"type": {
						"enum": ["text"],
						"title": "TextUserInputType",
						"type": "string"
					}
				},
				"required": ["text", "type"],
				"title": "TextUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"type": {
						"enum": ["image"],
						"title": "ImageUserInputType",
						"type": "string"
					},
					"url": { "type": "string" }
				},
				"required": ["type", "url"],
				"title": "ImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"path": { "type": "string" },
					"type": {
						"enum": ["localImage"],
						"title": "LocalImageUserInputType",
						"type": "string"
					}
				},
				"required": ["path", "type"],
				"title": "LocalImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["skill"],
						"title": "SkillUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "SkillUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["mention"],
						"title": "MentionUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "MentionUserInput",
				"type": "object"
			}
		] },
		"WebSearchAction": { "oneOf": [
			{
				"properties": {
					"queries": {
						"items": { "type": "string" },
						"type": ["array", "null"]
					},
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchWebSearchActionType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "SearchWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"type": {
						"enum": ["openPage"],
						"title": "OpenPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "OpenPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"pattern": { "type": ["string", "null"] },
					"type": {
						"enum": ["findInPage"],
						"title": "FindInPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "FindInPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["other"],
					"title": "OtherWebSearchActionType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "OtherWebSearchAction",
				"type": "object"
			}
		] }
	},
	properties: {
		"threadId": { "type": "string" },
		"turn": { "$ref": "#/definitions/Turn" }
	},
	required: ["threadId", "turn"],
	title: "TurnCompletedNotification",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/TurnStartResponse.json
var TurnStartResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	definitions: {
		"AbsolutePathBuf": {
			"description": "A path that is guaranteed to be absolute and normalized (though it is not guaranteed to be canonicalized or exist on the filesystem).\n\nIMPORTANT: When deserializing an `AbsolutePathBuf`, a base path must be set using [AbsolutePathBufGuard::new]. If no base path is set, the deserialization will fail unless the path being deserialized is already absolute.",
			"type": "string"
		},
		"ByteRange": {
			"properties": {
				"end": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				},
				"start": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				}
			},
			"required": ["end", "start"],
			"type": "object"
		},
		"CodexErrorInfo": {
			"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
			"oneOf": [
				{
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": {
							"format": "uint16",
							"minimum": 0,
							"type": ["integer", "null"]
						} },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				},
				{
					"enum": [
						"contextWindowExceeded",
						"sessionBudgetExceeded",
						"usageLimitExceeded",
						"serverOverloaded",
						"cyberPolicy",
						"internalServerError",
						"unauthorized",
						"badRequest",
						"threadRollbackFailed",
						"sandboxError",
						"other"
					],
					"type": "string"
				}
			]
		},
		"CollabAgentState": {
			"properties": {
				"message": { "type": ["string", "null"] },
				"status": { "$ref": "#/definitions/CollabAgentStatus" }
			},
			"required": ["status"],
			"type": "object"
		},
		"CollabAgentStatus": {
			"enum": [
				"pendingInit",
				"running",
				"interrupted",
				"completed",
				"errored",
				"shutdown",
				"notFound"
			],
			"type": "string"
		},
		"CollabAgentTool": {
			"enum": [
				"spawnAgent",
				"sendInput",
				"resumeAgent",
				"wait",
				"closeAgent"
			],
			"type": "string"
		},
		"CollabAgentToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"CommandAction": { "oneOf": [
			{
				"properties": {
					"command": { "type": "string" },
					"name": { "type": "string" },
					"path": { "$ref": "#/definitions/AbsolutePathBuf" },
					"type": {
						"enum": ["read"],
						"title": "ReadCommandActionType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"name",
					"path",
					"type"
				],
				"title": "ReadCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"type": {
						"enum": ["listFiles"],
						"title": "ListFilesCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "ListFilesCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "type": ["string", "null"] },
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "SearchCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"type": {
						"enum": ["unknown"],
						"title": "UnknownCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "UnknownCommandAction",
				"type": "object"
			}
		] },
		"CommandExecutionSource": {
			"enum": [
				"agent",
				"userShell",
				"unifiedExecStartup",
				"unifiedExecInteraction"
			],
			"type": "string"
		},
		"CommandExecutionStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"DynamicToolCallOutputContentItem": { "oneOf": [{
			"properties": {
				"text": { "type": "string" },
				"type": {
					"enum": ["inputText"],
					"title": "InputTextDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["text", "type"],
			"title": "InputTextDynamicToolCallOutputContentItem",
			"type": "object"
		}, {
			"properties": {
				"imageUrl": { "type": "string" },
				"type": {
					"enum": ["inputImage"],
					"title": "InputImageDynamicToolCallOutputContentItemType",
					"type": "string"
				}
			},
			"required": ["imageUrl", "type"],
			"title": "InputImageDynamicToolCallOutputContentItem",
			"type": "object"
		}] },
		"DynamicToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"FileUpdateChange": {
			"properties": {
				"diff": { "type": "string" },
				"kind": { "$ref": "#/definitions/PatchChangeKind" },
				"path": { "type": "string" }
			},
			"required": [
				"diff",
				"kind",
				"path"
			],
			"type": "object"
		},
		"HookPromptFragment": {
			"properties": {
				"hookRunId": { "type": "string" },
				"text": { "type": "string" }
			},
			"required": ["hookRunId", "text"],
			"type": "object"
		},
		"ImageDetail": {
			"enum": [
				"auto",
				"low",
				"high",
				"original"
			],
			"type": "string"
		},
		"LegacyAppPathString": { "type": "string" },
		"McpToolCallAppContext": {
			"properties": {
				"actionName": { "type": ["string", "null"] },
				"appName": { "type": ["string", "null"] },
				"connectorId": { "type": "string" },
				"linkId": { "type": ["string", "null"] },
				"resourceUri": { "type": ["string", "null"] },
				"templateId": { "type": ["string", "null"] }
			},
			"required": ["connectorId"],
			"type": "object"
		},
		"McpToolCallError": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"McpToolCallResult": {
			"properties": {
				"_meta": true,
				"content": {
					"items": true,
					"type": "array"
				},
				"structuredContent": true
			},
			"required": ["content"],
			"type": "object"
		},
		"McpToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"MemoryCitation": {
			"properties": {
				"entries": {
					"items": { "$ref": "#/definitions/MemoryCitationEntry" },
					"type": "array"
				},
				"threadIds": {
					"items": { "type": "string" },
					"type": "array"
				}
			},
			"required": ["entries", "threadIds"],
			"type": "object"
		},
		"MemoryCitationEntry": {
			"properties": {
				"lineEnd": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"lineStart": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"note": { "type": "string" },
				"path": { "type": "string" }
			},
			"required": [
				"lineEnd",
				"lineStart",
				"note",
				"path"
			],
			"type": "object"
		},
		"MessagePhase": {
			"description": "Classifies an assistant message as interim commentary or final answer text.\n\nProviders do not emit this consistently, so callers must treat `None` as \"phase unknown\" and keep compatibility behavior for legacy models.",
			"oneOf": [{
				"description": "Mid-turn assistant text (for example preamble/progress narration).\n\nAdditional tool calls or assistant output may follow before turn completion.",
				"enum": ["commentary"],
				"type": "string"
			}, {
				"description": "The assistant's terminal answer text for the current turn.",
				"enum": ["final_answer"],
				"type": "string"
			}]
		},
		"NonSteerableTurnKind": {
			"enum": ["review", "compact"],
			"type": "string"
		},
		"PatchApplyStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"PatchChangeKind": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["add"],
					"title": "AddPatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "AddPatchChangeKind",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["delete"],
					"title": "DeletePatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DeletePatchChangeKind",
				"type": "object"
			},
			{
				"properties": {
					"move_path": { "type": ["string", "null"] },
					"type": {
						"enum": ["update"],
						"title": "UpdatePatchChangeKindType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "UpdatePatchChangeKind",
				"type": "object"
			}
		] },
		"ReasoningEffort": {
			"description": "A non-empty reasoning effort value advertised by the model.",
			"minLength": 1,
			"type": "string"
		},
		"SubAgentActivityKind": {
			"enum": [
				"started",
				"interacted",
				"interrupted"
			],
			"type": "string"
		},
		"TextElement": {
			"properties": {
				"byteRange": {
					"allOf": [{ "$ref": "#/definitions/ByteRange" }],
					"description": "Byte range in the parent `text` buffer that this element occupies."
				},
				"placeholder": {
					"description": "Optional human-readable placeholder for the element, displayed in the UI.",
					"type": ["string", "null"]
				}
			},
			"required": ["byteRange"],
			"type": "object"
		},
		"ThreadItem": { "oneOf": [
			{
				"properties": {
					"clientId": { "type": ["string", "null"] },
					"content": {
						"items": { "$ref": "#/definitions/UserInput" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["userMessage"],
						"title": "UserMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"content",
					"id",
					"type"
				],
				"title": "UserMessageThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"fragments": {
						"items": { "$ref": "#/definitions/HookPromptFragment" },
						"type": "array"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["hookPrompt"],
						"title": "HookPromptThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"fragments",
					"id",
					"type"
				],
				"title": "HookPromptThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"memoryCitation": {
						"anyOf": [{ "$ref": "#/definitions/MemoryCitation" }, { "type": "null" }],
						"default": null
					},
					"phase": {
						"anyOf": [{ "$ref": "#/definitions/MessagePhase" }, { "type": "null" }],
						"default": null
					},
					"text": { "type": "string" },
					"type": {
						"enum": ["agentMessage"],
						"title": "AgentMessageThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "AgentMessageThreadItem",
				"type": "object"
			},
			{
				"description": "EXPERIMENTAL - proposed plan item content. The completed plan item is authoritative and may not match the concatenation of `PlanDelta` text.",
				"properties": {
					"id": { "type": "string" },
					"text": { "type": "string" },
					"type": {
						"enum": ["plan"],
						"title": "PlanThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"text",
					"type"
				],
				"title": "PlanThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"content": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"id": { "type": "string" },
					"summary": {
						"default": [],
						"items": { "type": "string" },
						"type": "array"
					},
					"type": {
						"enum": ["reasoning"],
						"title": "ReasoningThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ReasoningThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"aggregatedOutput": {
						"description": "The command's output, aggregated from stdout and stderr.",
						"type": ["string", "null"]
					},
					"command": {
						"description": "The command to be executed.",
						"type": "string"
					},
					"commandActions": {
						"description": "A best-effort parsing of the command to understand the action(s) it will perform. This returns a list of CommandAction objects because a single shell command may be composed of many commands piped together.",
						"items": { "$ref": "#/definitions/CommandAction" },
						"type": "array"
					},
					"cwd": {
						"allOf": [{ "$ref": "#/definitions/LegacyAppPathString" }],
						"description": "The command's working directory."
					},
					"durationMs": {
						"description": "The duration of the command execution in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"exitCode": {
						"description": "The command's exit code.",
						"format": "int32",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"processId": {
						"description": "Identifier for the underlying PTY process (when available).",
						"type": ["string", "null"]
					},
					"source": {
						"allOf": [{ "$ref": "#/definitions/CommandExecutionSource" }],
						"default": "agent"
					},
					"status": { "$ref": "#/definitions/CommandExecutionStatus" },
					"type": {
						"enum": ["commandExecution"],
						"title": "CommandExecutionThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"commandActions",
					"cwd",
					"id",
					"status",
					"type"
				],
				"title": "CommandExecutionThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"changes": {
						"items": { "$ref": "#/definitions/FileUpdateChange" },
						"type": "array"
					},
					"id": { "type": "string" },
					"status": { "$ref": "#/definitions/PatchApplyStatus" },
					"type": {
						"enum": ["fileChange"],
						"title": "FileChangeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"changes",
					"id",
					"status",
					"type"
				],
				"title": "FileChangeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"appContext": { "anyOf": [{ "$ref": "#/definitions/McpToolCallAppContext" }, { "type": "null" }] },
					"arguments": true,
					"durationMs": {
						"description": "The duration of the MCP tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"error": { "anyOf": [{ "$ref": "#/definitions/McpToolCallError" }, { "type": "null" }] },
					"id": { "type": "string" },
					"mcpAppResourceUri": {
						"description": "Deprecated: use `appContext.resourceUri` instead.",
						"type": ["string", "null"]
					},
					"pluginId": { "type": ["string", "null"] },
					"result": { "anyOf": [{ "$ref": "#/definitions/McpToolCallResult" }, { "type": "null" }] },
					"server": { "type": "string" },
					"status": { "$ref": "#/definitions/McpToolCallStatus" },
					"tool": { "type": "string" },
					"type": {
						"enum": ["mcpToolCall"],
						"title": "McpToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"server",
					"status",
					"tool",
					"type"
				],
				"title": "McpToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"arguments": true,
					"contentItems": {
						"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
						"type": ["array", "null"]
					},
					"durationMs": {
						"description": "The duration of the dynamic tool call in milliseconds.",
						"format": "int64",
						"type": ["integer", "null"]
					},
					"id": { "type": "string" },
					"namespace": { "type": ["string", "null"] },
					"status": { "$ref": "#/definitions/DynamicToolCallStatus" },
					"success": { "type": ["boolean", "null"] },
					"tool": { "type": "string" },
					"type": {
						"enum": ["dynamicToolCall"],
						"title": "DynamicToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"arguments",
					"id",
					"status",
					"tool",
					"type"
				],
				"title": "DynamicToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentsStates": {
						"additionalProperties": { "$ref": "#/definitions/CollabAgentState" },
						"description": "Last known status of the target agents, when available.",
						"type": "object"
					},
					"id": {
						"description": "Unique identifier for this collab tool call.",
						"type": "string"
					},
					"model": {
						"description": "Model requested for the spawned agent, when applicable.",
						"type": ["string", "null"]
					},
					"prompt": {
						"description": "Prompt text sent as part of the collab tool call, when available.",
						"type": ["string", "null"]
					},
					"reasoningEffort": {
						"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
						"description": "Reasoning effort requested for the spawned agent, when applicable."
					},
					"receiverThreadIds": {
						"description": "Thread ID of the receiving agent, when applicable. In case of spawn operation, this corresponds to the newly spawned agent.",
						"items": { "type": "string" },
						"type": "array"
					},
					"senderThreadId": {
						"description": "Thread ID of the agent issuing the collab request.",
						"type": "string"
					},
					"status": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentToolCallStatus" }],
						"description": "Current status of the collab tool call."
					},
					"tool": {
						"allOf": [{ "$ref": "#/definitions/CollabAgentTool" }],
						"description": "Name of the collab tool that was invoked."
					},
					"type": {
						"enum": ["collabAgentToolCall"],
						"title": "CollabAgentToolCallThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentsStates",
					"id",
					"receiverThreadIds",
					"senderThreadId",
					"status",
					"tool",
					"type"
				],
				"title": "CollabAgentToolCallThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"agentPath": { "type": "string" },
					"agentThreadId": { "type": "string" },
					"id": { "type": "string" },
					"kind": { "$ref": "#/definitions/SubAgentActivityKind" },
					"type": {
						"enum": ["subAgentActivity"],
						"title": "SubAgentActivityThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"agentPath",
					"agentThreadId",
					"id",
					"kind",
					"type"
				],
				"title": "SubAgentActivityThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"action": { "anyOf": [{ "$ref": "#/definitions/WebSearchAction" }, { "type": "null" }] },
					"id": { "type": "string" },
					"query": { "type": "string" },
					"type": {
						"enum": ["webSearch"],
						"title": "WebSearchThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"query",
					"type"
				],
				"title": "WebSearchThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"path": { "$ref": "#/definitions/LegacyAppPathString" },
					"type": {
						"enum": ["imageView"],
						"title": "ImageViewThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"path",
					"type"
				],
				"title": "ImageViewThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"durationMs": {
						"format": "uint64",
						"minimum": 0,
						"type": "integer"
					},
					"id": { "type": "string" },
					"type": {
						"enum": ["sleep"],
						"title": "SleepThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"durationMs",
					"id",
					"type"
				],
				"title": "SleepThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"result": { "type": "string" },
					"revisedPrompt": { "type": ["string", "null"] },
					"savedPath": { "anyOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }, { "type": "null" }] },
					"status": { "type": "string" },
					"type": {
						"enum": ["imageGeneration"],
						"title": "ImageGenerationThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"result",
					"status",
					"type"
				],
				"title": "ImageGenerationThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["enteredReviewMode"],
						"title": "EnteredReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "EnteredReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"review": { "type": "string" },
					"type": {
						"enum": ["exitedReviewMode"],
						"title": "ExitedReviewModeThreadItemType",
						"type": "string"
					}
				},
				"required": [
					"id",
					"review",
					"type"
				],
				"title": "ExitedReviewModeThreadItem",
				"type": "object"
			},
			{
				"properties": {
					"id": { "type": "string" },
					"type": {
						"enum": ["contextCompaction"],
						"title": "ContextCompactionThreadItemType",
						"type": "string"
					}
				},
				"required": ["id", "type"],
				"title": "ContextCompactionThreadItem",
				"type": "object"
			}
		] },
		"Turn": {
			"properties": {
				"completedAt": {
					"description": "Unix timestamp (in seconds) when the turn completed.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"durationMs": {
					"description": "Duration between turn start and completion in milliseconds, if known.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"error": {
					"anyOf": [{ "$ref": "#/definitions/TurnError" }, { "type": "null" }],
					"description": "Only populated when the Turn's status is failed."
				},
				"id": {
					"description": "Identifier for this turn. Codex-generated turn IDs are UUIDv7.",
					"type": "string"
				},
				"items": {
					"description": "Thread items currently included in this turn payload.",
					"items": { "$ref": "#/definitions/ThreadItem" },
					"type": "array"
				},
				"itemsView": {
					"allOf": [{ "$ref": "#/definitions/TurnItemsView" }],
					"default": "full",
					"description": "Describes how much of `items` has been loaded for this turn."
				},
				"startedAt": {
					"description": "Unix timestamp (in seconds) when the turn started.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"status": { "$ref": "#/definitions/TurnStatus" }
			},
			"required": [
				"id",
				"items",
				"status"
			],
			"type": "object"
		},
		"TurnError": {
			"properties": {
				"additionalDetails": {
					"default": null,
					"type": ["string", "null"]
				},
				"codexErrorInfo": { "anyOf": [{ "$ref": "#/definitions/CodexErrorInfo" }, { "type": "null" }] },
				"message": { "type": "string" }
			},
			"required": ["message"],
			"type": "object"
		},
		"TurnItemsView": { "oneOf": [
			{
				"description": "`items` was not loaded for this turn. The field is intentionally empty.",
				"enum": ["notLoaded"],
				"type": "string"
			},
			{
				"description": "`items` contains only a display summary for this turn.",
				"enum": ["summary"],
				"type": "string"
			},
			{
				"description": "`items` contains every ThreadItem available from persisted app-server history for this turn.",
				"enum": ["full"],
				"type": "string"
			}
		] },
		"TurnStatus": {
			"enum": [
				"completed",
				"interrupted",
				"failed",
				"inProgress"
			],
			"type": "string"
		},
		"UserInput": { "oneOf": [
			{
				"properties": {
					"text": { "type": "string" },
					"text_elements": {
						"default": [],
						"description": "UI-defined spans within `text` used to render or persist special elements.",
						"items": { "$ref": "#/definitions/TextElement" },
						"type": "array"
					},
					"type": {
						"enum": ["text"],
						"title": "TextUserInputType",
						"type": "string"
					}
				},
				"required": ["text", "type"],
				"title": "TextUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"type": {
						"enum": ["image"],
						"title": "ImageUserInputType",
						"type": "string"
					},
					"url": { "type": "string" }
				},
				"required": ["type", "url"],
				"title": "ImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"path": { "type": "string" },
					"type": {
						"enum": ["localImage"],
						"title": "LocalImageUserInputType",
						"type": "string"
					}
				},
				"required": ["path", "type"],
				"title": "LocalImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["skill"],
						"title": "SkillUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "SkillUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["mention"],
						"title": "MentionUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "MentionUserInput",
				"type": "object"
			}
		] },
		"WebSearchAction": { "oneOf": [
			{
				"properties": {
					"queries": {
						"items": { "type": "string" },
						"type": ["array", "null"]
					},
					"query": { "type": ["string", "null"] },
					"type": {
						"enum": ["search"],
						"title": "SearchWebSearchActionType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "SearchWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"type": {
						"enum": ["openPage"],
						"title": "OpenPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "OpenPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"pattern": { "type": ["string", "null"] },
					"type": {
						"enum": ["findInPage"],
						"title": "FindInPageWebSearchActionType",
						"type": "string"
					},
					"url": { "type": ["string", "null"] }
				},
				"required": ["type"],
				"title": "FindInPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["other"],
					"title": "OtherWebSearchActionType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "OtherWebSearchAction",
				"type": "object"
			}
		] }
	},
	properties: { "turn": { "$ref": "#/definitions/Turn" } },
	required: ["turn"],
	title: "TurnStartResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-validators.ts
/**
* Runtime validators for Codex app-server protocol payloads, including schema
* normalization for generated JSON Schema before TypeBox compilation.
*/
function compileCodexSchema(schema) {
	const validator = Compile(normalizeJsonSchemaNode(schema));
	return {
		check: (value) => validator.Check(value),
		errors: (value) => [...validator.Errors(value)]
	};
}
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
const schemaValueKeywords = /* @__PURE__ */ new Set([
	"additionalItems",
	"additionalProperties",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaArrayKeywords = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
function schemaTypeIncludes(schema, type) {
	return schema.type === type || Array.isArray(schema.type) && schema.type.includes(type);
}
function normalizeSchemaMap(value) {
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeJsonSchemaNode(entry)]));
}
function expandJsonSchemaTypeArray(schema) {
	const { type, ...rest } = schema;
	if (!Array.isArray(type)) return schema;
	return { anyOf: type.map((entry) => Object.assign({}, rest, { type: entry })) };
}
function normalizeJsonSchemaNode(schema) {
	if (Array.isArray(schema)) return schema.map((entry) => normalizeJsonSchemaNode(entry));
	if (!isRecord(schema)) return schema;
	const normalizedSchema = expandJsonSchemaTypeArray(schema);
	return Object.fromEntries(Object.entries(normalizedSchema).map(([key, value]) => {
		if (schemaMapKeywords.has(key)) return [key, normalizeSchemaMap(value)];
		if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key)) return [key, normalizeJsonSchemaNode(value)];
		return [key, value];
	}));
}
function readDefault(schema) {
	if (!isRecord(schema) || !Object.hasOwn(schema, "default")) return;
	return structuredClone(schema.default);
}
function decodePointerSegment(segment) {
	return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}
function resolveLocalRef(root, ref) {
	if (ref === "#") return root;
	if (!ref.startsWith("#/")) return;
	let current = root;
	for (const segment of ref.slice(2).split("/").map(decodePointerSegment)) {
		if (!isRecord(current)) return;
		current = current[segment];
	}
	return current;
}
function applySchemaDefaults(schema, value, root = schema, resolvingRefs = /* @__PURE__ */ new Set()) {
	if (value === void 0) {
		const defaultValue = readDefault(schema);
		if (defaultValue !== void 0) return defaultValue;
	}
	if (!isRecord(schema)) return value;
	let nextValue = value;
	if (typeof schema.$ref === "string" && !resolvingRefs.has(schema.$ref)) {
		const target = resolveLocalRef(root, schema.$ref);
		if (target !== void 0) {
			resolvingRefs.add(schema.$ref);
			nextValue = applySchemaDefaults(target, nextValue, root, resolvingRefs);
			resolvingRefs.delete(schema.$ref);
		}
	}
	for (const key of ["allOf"]) {
		const branches = schema[key];
		if (Array.isArray(branches)) for (const branch of branches) nextValue = applySchemaDefaults(branch, nextValue, root, resolvingRefs);
	}
	if (schemaTypeIncludes(schema, "object") && isRecord(nextValue) && isRecord(schema.properties)) {
		for (const [key, propertySchema] of Object.entries(schema.properties)) {
			const currentValue = nextValue[key];
			const defaultedValue = applySchemaDefaults(propertySchema, currentValue, root, resolvingRefs);
			if (defaultedValue !== void 0 && defaultedValue !== currentValue) nextValue[key] = defaultedValue;
		}
		if (isRecord(schema.additionalProperties)) for (const key of Object.keys(nextValue)) {
			if (Object.hasOwn(schema.properties, key)) continue;
			nextValue[key] = applySchemaDefaults(schema.additionalProperties, nextValue[key], root, resolvingRefs);
		}
	}
	if (schemaTypeIncludes(schema, "array") && Array.isArray(nextValue) && isRecord(schema.items)) return nextValue.map((entry) => applySchemaDefaults(schema.items, entry, root, resolvingRefs));
	return nextValue;
}
function normalizeWithDefaults(schema, value) {
	if (value === void 0 || value === null) return value;
	return applySchemaDefaults(schema, structuredClone(value));
}
const validateDynamicToolCallParams = compileCodexSchema(DynamicToolCallParams_default);
const validateErrorNotification = compileCodexSchema(ErrorNotification_default);
const validateModelListResponse = compileCodexSchema(ModelListResponse_default);
const validateThreadResumeResponse = compileCodexSchema(ThreadResumeResponse_default);
const validateThreadStartResponse = compileCodexSchema(ThreadStartResponse_default);
const validateTurnCompletedNotification = compileCodexSchema(TurnCompletedNotification_default);
const validateTurnStartResponse = compileCodexSchema(TurnStartResponse_default);
/** Asserts and normalizes a Codex thread/start response. */
function assertCodexThreadStartResponse(value) {
	const normalized = normalizeWithDefaults(ThreadStartResponse_default, value);
	return assertCodexShape(validateThreadStartResponse, normalized, "thread/start response");
}
/** Asserts and normalizes a Codex thread/fork response. */
function assertCodexThreadForkResponse(value) {
	const normalized = normalizeWithDefaults(ThreadStartResponse_default, value);
	return assertCodexShape(validateThreadStartResponse, normalized, "thread/fork response");
}
/** Asserts the experimental beforeTurnId request field before it crosses the app-server boundary. */
function assertCodexThreadForkParams(value) {
	if (!isRecord(value) || typeof value.threadId !== "string" || !value.threadId.trim() || value.beforeTurnId !== void 0 && value.beforeTurnId !== null && typeof value.beforeTurnId !== "string") throw new Error("Invalid Codex app-server thread/fork params");
	return value;
}
/** Asserts and normalizes a Codex thread/resume response. */
function assertCodexThreadResumeResponse(value) {
	const normalized = normalizeWithDefaults(ThreadResumeResponse_default, value);
	return assertCodexShape(validateThreadResumeResponse, normalized, "thread/resume response");
}
/** Asserts and normalizes a Codex turn/start response. */
function assertCodexTurnStartResponse(value) {
	const normalized = normalizeWithDefaults(TurnStartResponse_default, normalizeTurnStartResponse(value));
	return assertCodexShape(validateTurnStartResponse, normalized, "turn/start response");
}
/** Reads Codex dynamic-tool call params, returning undefined for invalid payloads. */
function readCodexDynamicToolCallParams(value) {
	return readCodexShape(validateDynamicToolCallParams, normalizeWithDefaults(DynamicToolCallParams_default, value));
}
/** Reads a Codex error notification payload if it matches the protocol schema. */
function readCodexErrorNotification(value) {
	return readCodexShape(validateErrorNotification, normalizeWithDefaults(ErrorNotification_default, value));
}
/** Reads a Codex model/list response if it matches the protocol schema. */
function readCodexModelListResponse(value) {
	return readCodexShape(validateModelListResponse, normalizeWithDefaults(ModelListResponse_default, value));
}
/** Reads and normalizes a Codex turn object. */
function readCodexTurn(value) {
	return readCodexShape(validateTurnStartResponse, normalizeWithDefaults(TurnStartResponse_default, { turn: normalizeTurn(value) }))?.turn;
}
/** Reads a Codex turn/completed notification payload if it matches the protocol schema. */
function readCodexTurnCompletedNotification(value) {
	return readCodexShape(validateTurnCompletedNotification, normalizeWithDefaults(TurnCompletedNotification_default, normalizeTurnCompletedNotification(value)));
}
function assertCodexShape(validate, value, label) {
	if (validate.check(value)) return value;
	throw new Error(`Invalid Codex app-server ${label}: ${formatValidationErrors(validate, value)}`);
}
function readCodexShape(validate, value) {
	return validate.check(value) ? value : void 0;
}
function normalizeTurn(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return {
		error: null,
		startedAt: null,
		completedAt: null,
		durationMs: null,
		...value,
		items: Array.isArray(value.items) ? value.items.map(normalizeThreadItem) : []
	};
}
function normalizeThreadItem(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	switch (value.type) {
		case "agentMessage": return {
			phase: null,
			memoryCitation: null,
			...value
		};
		case "plan": return {
			text: "",
			...value
		};
		case "reasoning": return {
			summary: [],
			content: [],
			...value
		};
		case "dynamicToolCall": return {
			namespace: null,
			arguments: null,
			status: "completed",
			contentItems: null,
			success: null,
			durationMs: null,
			...value
		};
		default: return value;
	}
}
function normalizeTurnStartResponse(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || !("turn" in value)) return value;
	return {
		...value,
		turn: normalizeTurn(value.turn)
	};
}
function normalizeTurnCompletedNotification(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || !("turn" in value)) return value;
	return {
		...value,
		turn: normalizeTurn(value.turn)
	};
}
function formatValidationErrors(validate, value) {
	const errors = validate.errors(value);
	if (!errors || errors.length === 0) return "schema validation failed";
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join("; ");
}
//#endregion
//#region extensions/codex/src/app-server/upstream-prompt-provenance.ts
const UPSTREAM_USER_TEXT_META_KEY = "upstreamUserText";
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
function attachCodexMirrorIdentity(message, identity) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[MIRROR_IDENTITY_META_KEY]: identity
		}
	};
}
function readMirrorIdentity(message) {
	const meta = message["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const id = meta[MIRROR_IDENTITY_META_KEY];
	return typeof id === "string" && id ? id : void 0;
}
function attachUpstreamUserText(message, text) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[UPSTREAM_USER_TEXT_META_KEY]: text
		}
	};
}
function readUpstreamUserText(message) {
	const meta = message?.["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const text = meta[UPSTREAM_USER_TEXT_META_KEY];
	return typeof text === "string" && text ? text : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/user-prompt-message.ts
function buildSenderLabel(params) {
	const label = params.senderName ?? params.senderUsername ?? params.senderE164 ?? params.senderId;
	if (!label) return;
	return !params.senderId || label.includes(params.senderId) ? label : `${label} (${params.senderId})`;
}
function buildFromPrepared(params, preparedUserMessage) {
	const senderId = normalizeOptionalString(params.senderId);
	const senderName = normalizeOptionalString(params.senderName);
	const senderUsername = normalizeOptionalString(params.senderUsername);
	const senderE164 = normalizeOptionalString(params.senderE164);
	const senderLabel = buildSenderLabel({
		senderId,
		senderName,
		senderUsername,
		senderE164
	});
	const sourceChannel = normalizeOptionalString(params.inputProvenance?.sourceChannel ?? params.messageChannel ?? params.messageProvider);
	return {
		role: "user",
		timestamp: Date.now(),
		...params.inputProvenance ? { provenance: params.inputProvenance } : {},
		...sourceChannel ? { sourceChannel } : {},
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...senderLabel ? { senderLabel } : {},
		...preparedUserMessage ? preparedUserMessage : { content: params.prompt }
	};
}
function buildCodexUserPromptMessage(params) {
	return buildFromPrepared(params, params.userTurnTranscriptRecorder?.message);
}
function buildCodexUpstreamPromptMessage(params, identity, upstreamUserText) {
	const message = attachCodexMirrorIdentity(buildCodexUserPromptMessage(params), identity);
	return upstreamUserText ? attachUpstreamUserText(message, upstreamUserText) : message;
}
function promptSnapshot(params, turnId, upstreamUserText) {
	return params.suppressNextUserMessagePersistence ? [] : [buildCodexUpstreamPromptMessage(params, `${turnId}:prompt`, upstreamUserText)];
}
async function buildResolvedCodexUserPromptMessage(params) {
	return buildFromPrepared(params, await params.userTurnTranscriptRecorder?.resolveMessage() ?? params.userTurnTranscriptRecorder?.message);
}
//#endregion
//#region extensions/codex/src/app-server/transcript-mirror.ts
const MIRROR_ORIGIN_META_KEY = "mirrorOrigin";
const CODEX_APP_SERVER_MIRROR_ORIGIN = "codex-app-server";
const CODEX_HISTORY_IMPORT_MAX_MESSAGES = 200;
const CODEX_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
const CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES = 64 * 1024;
const CODEX_HISTORY_TRUNCATION_SUFFIX = "\n\n[Message truncated during Codex history import.]";
const CODEX_HISTORY_ASSISTANT_API = "openai-chatgpt-responses";
const CODEX_HISTORY_ASSISTANT_PROVIDER = "openai";
const CODEX_HISTORY_ASSISTANT_MODEL = "native-history";
const CODEX_HISTORY_ZERO_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
function isUtf8ContinuationByte(byte) {
	return byte !== void 0 && (byte & 192) === 128;
}
function truncateUtf8Prefix(value, maxBytes) {
	const bytes = Buffer.from(value);
	if (bytes.byteLength <= maxBytes) return value;
	let end = Math.max(0, maxBytes);
	while (end > 0 && isUtf8ContinuationByte(bytes[end])) end -= 1;
	return bytes.subarray(0, end).toString("utf8");
}
function normalizeImportedHistoryText(value) {
	if (typeof value !== "string") return;
	const text = value.trim();
	if (!text) return;
	if (Buffer.byteLength(text, "utf8") <= CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES) return text;
	const suffixBytes = Buffer.byteLength(CODEX_HISTORY_TRUNCATION_SUFFIX, "utf8");
	return `${truncateUtf8Prefix(text, Math.max(0, CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES - suffixBytes))}${CODEX_HISTORY_TRUNCATION_SUFFIX}`;
}
function projectCodexUserItemText(item) {
	if (!Array.isArray(item.content)) return;
	const parts = [];
	for (const value of item.content) {
		if (!value || typeof value !== "object" || Array.isArray(value)) continue;
		const input = value;
		if (input.type === "text") {
			const text = normalizeImportedHistoryText(input.text);
			if (text) parts.push(text);
			continue;
		}
		if (input.type === "image" || input.type === "localImage") {
			parts.push("[Image attachment]");
			continue;
		}
		if (input.type === "skill" || input.type === "mention") {
			const name = normalizeOptionalString(input.name);
			if (name) parts.push(`${input.type === "skill" ? "$" : "@"}${name}`);
		}
	}
	return normalizeImportedHistoryText(parts.join("\n"));
}
function selectTurnsThroughBoundary(thread, throughTurnId) {
	if (throughTurnId === null) return [];
	const turns = thread.turns ?? [];
	const boundaryIndex = turns.findIndex((turn) => turn.id === throughTurnId);
	if (boundaryIndex < 0) throw new Error(`Codex history boundary turn not found: ${throughTurnId}`);
	const boundary = turns[boundaryIndex];
	if (boundary?.status !== "completed" && boundary?.status !== "interrupted" && boundary?.status !== "failed") throw new Error(`Codex history boundary turn is not terminal: ${throughTurnId}`);
	return turns.slice(0, boundaryIndex + 1);
}
function projectCodexThreadHistory(params) {
	const projected = [];
	const threadTimestamp = typeof params.thread.createdAt === "number" && Number.isFinite(params.thread.createdAt) ? params.thread.createdAt * 1e3 : params.importedAt;
	let itemOffset = 0;
	for (const turn of selectTurnsThroughBoundary(params.thread, params.throughTurnId)) for (const value of turn.items) {
		const item = value;
		const itemId = normalizeOptionalString(item.id);
		const identity = `${turn.id}:${itemId ?? itemOffset}`;
		const timestampSeconds = item.type === "agentMessage" ? turn.completedAt ?? turn.startedAt : turn.startedAt ?? turn.completedAt;
		const timestamp = typeof timestampSeconds === "number" && Number.isFinite(timestampSeconds) ? timestampSeconds * 1e3 + itemOffset : threadTimestamp + itemOffset;
		const text = item.type === "userMessage" ? projectCodexUserItemText(item) : item.type === "agentMessage" ? normalizeImportedHistoryText(item.text) : void 0;
		const role = item.type === "userMessage" ? "user" : item.type === "agentMessage" ? "assistant" : void 0;
		itemOffset += 1;
		if (!text || !role) continue;
		const message = role === "assistant" ? attachCodexMirrorIdentity({
			role,
			content: [{
				type: "text",
				text
			}],
			api: CODEX_HISTORY_ASSISTANT_API,
			provider: normalizeOptionalString(params.modelProvider) ?? normalizeOptionalString(params.thread.modelProvider) ?? CODEX_HISTORY_ASSISTANT_PROVIDER,
			model: CODEX_HISTORY_ASSISTANT_MODEL,
			usage: CODEX_HISTORY_ZERO_USAGE,
			stopReason: "stop",
			timestamp
		}, identity) : attachCodexMirrorIdentity({
			role,
			content: text,
			timestamp
		}, identity);
		const phase = item.phase === "commentary" || item.phase === "final_answer" ? item.phase : void 0;
		projected.push({
			message,
			responseItem: {
				type: "message",
				role,
				content: [{
					type: role === "assistant" ? "output_text" : "input_text",
					text
				}],
				...role === "assistant" && phase ? { phase } : {}
			},
			textBytes: Buffer.byteLength(text, "utf8")
		});
	}
	return projected;
}
function selectBoundedCodexHistoryTail(projected) {
	const selected = [];
	let selectedBytes = 0;
	for (let index = projected.length - 1; index >= 0; index -= 1) {
		const candidate = projected[index];
		if (!candidate) continue;
		if (selected.length >= CODEX_HISTORY_IMPORT_MAX_MESSAGES || selectedBytes + candidate.textBytes > CODEX_HISTORY_IMPORT_MAX_BYTES) break;
		selected.push(candidate);
		selectedBytes += candidate.textBytes;
	}
	return selected.toReversed();
}
/** Projects one terminal Codex history prefix into transcript and Responses API items. */
function projectBoundedCodexThreadHistory(params) {
	const projected = projectCodexThreadHistory({
		thread: params.thread,
		throughTurnId: params.throughTurnId,
		importedAt: params.importedAt,
		...params.modelProvider ? { modelProvider: params.modelProvider } : {}
	});
	const selected = selectBoundedCodexHistoryTail(projected);
	return {
		importedMessages: selected.length,
		omittedMessages: projected.length - selected.length,
		responseItems: selected.map(({ responseItem }) => responseItem),
		transcriptMessages: selected.map(({ message }) => message)
	};
}
/** Imports a bounded, user-visible Codex history tail into a new OpenClaw transcript. */
async function importCodexThreadHistoryToTranscript(params) {
	const projection = projectBoundedCodexThreadHistory({
		thread: params.thread,
		throughTurnId: params.throughTurnId,
		importedAt: Date.now(),
		...params.modelProvider ? { modelProvider: params.modelProvider } : {}
	});
	if (projection.transcriptMessages.length > 0) await mirror({
		storePath: params.storePath,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		messages: projection.transcriptMessages,
		idempotencyScope: `codex-app-server:${params.thread.id}:history`
	});
	return {
		importedMessages: projection.importedMessages,
		omittedMessages: projection.omittedMessages
	};
}
function attachCodexMirrorOrigin(message) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[MIRROR_ORIGIN_META_KEY]: CODEX_APP_SERVER_MIRROR_ORIGIN
		}
	};
}
async function mirrorBestEffort(params) {
	try {
		const messages = await resolveFinalCodexMirrorMessages({
			params: params.params,
			messagesSnapshot: params.result.messagesSnapshot,
			turnId: params.turnId
		});
		const mirrorResult = await mirror({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			storePath: params.params.sessionTarget?.storePath,
			cwd: params.cwd,
			messages,
			idempotencyScope: `codex-app-server:${params.threadId}`,
			config: params.params.config
		});
		for (const message of mirrorResult.userMessagesPresent) try {
			params.notifyUserMessagePersisted(message);
		} catch (error) {
			log.warn("failed to notify codex app-server user-message persistence", { error: formatErrorMessage(error) });
		}
		return mirrorResult.assistantMirrorIdentitiesOwned.includes(`${params.turnId}:assistant`);
	} catch (error) {
		log.warn("failed to mirror codex app-server transcript", { error });
		return false;
	}
}
async function resolveFinalCodexMirrorMessages(params) {
	if (params.params.suppressNextUserMessagePersistence || !params.params.userTurnTranscriptRecorder) return params.messagesSnapshot;
	const promptSnapshot = params.messagesSnapshot.find((message) => message.role === "user");
	const resolvedBase = attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`);
	const upstreamUserText = readUpstreamUserText(promptSnapshot);
	const resolvedPrompt = upstreamUserText ? attachUpstreamUserText(resolvedBase, upstreamUserText) : resolvedBase;
	const firstUserIndex = params.messagesSnapshot.findIndex((message) => message.role === "user");
	if (firstUserIndex === -1) return [resolvedPrompt, ...params.messagesSnapshot];
	const messages = params.messagesSnapshot.slice();
	messages[firstUserIndex] = resolvedPrompt;
	return messages;
}
function createCodexAppServerUserMessagePersistenceNotifier(runParams) {
	let notified = false;
	return (message) => {
		if (notified) return;
		notified = true;
		runParams.userTurnTranscriptRecorder?.markRuntimePersisted(message);
		try {
			runParams.onUserMessagePersisted?.(message);
		} catch (error) {
			log.warn("codex app-server user persistence notification failed", { error: formatErrorMessage(error) });
		}
	};
}
async function mirrorPromptAtTurnStartBestEffort(params) {
	if (params.params.suppressNextUserMessagePersistence) return;
	try {
		const mirrorPromise = (async () => {
			const userPromptMessage = attachUpstreamUserText(attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`), params.upstreamUserText);
			const mirrorResult = await mirror({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.params.sessionId,
				storePath: params.params.sessionTarget?.storePath,
				cwd: params.cwd,
				messages: [userPromptMessage],
				idempotencyScope: `codex-app-server:${params.threadId}`,
				config: params.params.config
			});
			for (const message of mirrorResult.userMessagesPresent) params.notifyUserMessagePersisted(message);
		})();
		params.params.userTurnTranscriptRecorder?.markRuntimePersistencePending(mirrorPromise);
		await mirrorPromise;
	} catch (error) {
		log.warn("failed to mirror codex app-server prompt at turn start", { error });
	}
}
function fingerprintMirrorMessageContent(message) {
	const payload = JSON.stringify({
		role: message.role,
		content: message.content
	});
	return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
function buildMirrorDedupeIdentity(message) {
	const explicit = readMirrorIdentity(message);
	if (explicit) return explicit;
	return `${message.role}:${fingerprintMirrorMessageContent(message)}`;
}
async function mirror(params) {
	const messages = params.messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
	if (messages.length === 0) return {
		assistantMirrorIdentitiesOwned: [],
		userMessagesPresent: []
	};
	const transcriptTarget = resolveCodexMirrorTranscriptTarget(params);
	const { appendedUpdates, assistantMirrorIdentitiesOwned, userMessagesPresent } = await withSessionTranscriptWriteLock({
		...transcriptTarget,
		config: params.config
	}, async (transcript) => {
		const nextAppendedUpdates = [];
		const nextAssistantMirrorIdentitiesOwned = /* @__PURE__ */ new Set();
		const nextUserMessagesPresent = [];
		const mirrorState = readTranscriptMirrorState(await transcript.readEvents());
		let nextMessageSeq = mirrorState.messageCount;
		for (const message of messages) {
			const dedupeIdentity = buildMirrorDedupeIdentity(message);
			const idempotencyKey = (message.role === "user" ? normalizeOptionalString(message.idempotencyKey) : void 0) ?? (params.idempotencyScope ? `${params.idempotencyScope}:${dedupeIdentity}` : void 0);
			const transcriptMessage = {
				...attachCodexMirrorOrigin(message),
				...idempotencyKey ? { idempotencyKey } : {}
			};
			if (idempotencyKey && mirrorState.idempotencyKeys.has(idempotencyKey)) {
				const persistedUserMessage = mirrorState.userMessagesByIdempotencyKey.get(idempotencyKey);
				if (persistedUserMessage) nextUserMessagesPresent.push(persistedUserMessage);
				if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
				continue;
			}
			const nextMessage = runAgentHarnessBeforeMessageWriteHook({
				message: transcriptMessage,
				agentId: params.agentId,
				sessionKey: params.sessionKey
			});
			if (!nextMessage) {
				if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
				continue;
			}
			const messageToAppend = idempotencyKey ? {
				...attachCodexMirrorOrigin(nextMessage),
				idempotencyKey
			} : attachCodexMirrorOrigin(nextMessage);
			const appended = await transcript.appendMessage({
				message: messageToAppend,
				idempotencyLookup: idempotencyKey ? "caller-checked" : "scan",
				cwd: params.cwd
			});
			if (!appended) continue;
			const { messageId, message: appendedMessage } = appended;
			if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
			if (appendedMessage.role === "user") {
				nextUserMessagesPresent.push(appendedMessage);
				if (idempotencyKey) mirrorState.userMessagesByIdempotencyKey.set(idempotencyKey, appendedMessage);
			}
			nextMessageSeq += 1;
			nextAppendedUpdates.push({
				messageId,
				message: appendedMessage,
				messageSeq: nextMessageSeq
			});
			if (idempotencyKey) mirrorState.idempotencyKeys.add(idempotencyKey);
		}
		return {
			appendedUpdates: nextAppendedUpdates,
			assistantMirrorIdentitiesOwned: [...nextAssistantMirrorIdentitiesOwned],
			userMessagesPresent: nextUserMessagesPresent
		};
	});
	for (const update of appendedUpdates) try {
		await publishSessionTranscriptUpdateByIdentity({
			...transcriptTarget,
			update: {
				...params.agentId ? { agentId: params.agentId } : {},
				message: update.message,
				messageId: update.messageId,
				messageSeq: update.messageSeq,
				sessionKey: transcriptTarget.sessionKey
			}
		});
	} catch (error) {
		log.warn("failed to publish codex app-server transcript update", { error: formatErrorMessage(error) });
	}
	return {
		assistantMirrorIdentitiesOwned,
		userMessagesPresent
	};
}
const codexTranscriptMirrorRuntime = {
	mirror,
	mirrorBestEffort
};
function resolveCodexMirrorTranscriptTarget(params) {
	const sessionKey = params.sessionKey?.trim();
	const storePath = params.storePath?.trim();
	if (!sessionKey || !storePath) throw new Error("Codex transcript mirror requires a runtime session identity");
	return {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		sessionKey,
		storePath
	};
}
function readTranscriptMirrorState(events) {
	const idempotencyKeys = /* @__PURE__ */ new Set();
	const userMessagesByIdempotencyKey = /* @__PURE__ */ new Map();
	let messageCount = 0;
	for (const event of events) {
		if (!event || typeof event !== "object" || Array.isArray(event)) continue;
		const parsed = event;
		if (parsed.type === "message") messageCount += 1;
		if (typeof parsed.message?.idempotencyKey === "string") {
			idempotencyKeys.add(parsed.message.idempotencyKey);
			if (parsed.message.role === "user") userMessagesByIdempotencyKey.set(parsed.message.idempotencyKey, parsed.message);
		}
	}
	return {
		idempotencyKeys,
		messageCount,
		userMessagesByIdempotencyKey
	};
}
//#endregion
export { readCodexTurn as _, projectBoundedCodexThreadHistory as a, attachCodexMirrorIdentity as c, assertCodexThreadResumeResponse as d, assertCodexThreadStartResponse as f, readCodexModelListResponse as g, readCodexErrorNotification as h, mirrorPromptAtTurnStartBestEffort as i, assertCodexThreadForkParams as l, readCodexDynamicToolCallParams as m, createCodexAppServerUserMessagePersistenceNotifier as n, buildCodexUserPromptMessage as o, assertCodexTurnStartResponse as p, importCodexThreadHistoryToTranscript as r, promptSnapshot as s, codexTranscriptMirrorRuntime as t, assertCodexThreadForkResponse as u, readCodexTurnCompletedNotification as v };
