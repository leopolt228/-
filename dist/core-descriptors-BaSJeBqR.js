//#region src/gateway/methods/descriptor.ts
/** Scope marker for methods that only authenticated node clients may call. */
const NODE_GATEWAY_METHOD_SCOPE = "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic";
//#endregion
//#region src/gateway/methods/core-descriptors.ts
const CORE_GATEWAY_METHOD_SPECS = [
	{
		name: "health",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "diagnostics.stability",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.dreamDiary",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.backfillDreamDiary",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.resetDreamDiary",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.resetGroundedShortTerm",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.repairDreamingArtifacts",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.dedupeDreamDiary",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "doctor.memory.remHarness",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "logs.tail",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "channels.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "channels.start",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "channels.stop",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "channels.logout",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "usage.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "usage.cost",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tts.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tts.providers",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tts.personas",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tts.enable",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "tts.disable",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "tts.convert",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "tts.setProvider",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "tts.setPersona",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "config.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "config.set",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "config.apply",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "config.patch",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "config.schema",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "config.schema.lookup",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "exec.approvals.get",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "exec.approvals.set",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "exec.approvals.node.get",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "exec.approvals.node.set",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "exec.approval.get",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "exec.approval.list",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "exec.approval.request",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "exec.approval.waitDecision",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "exec.approval.resolve",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "question.request",
		scope: "operator.questions",
		since: "2026.7"
	},
	{
		name: "question.waitAnswer",
		scope: "operator.questions",
		since: "2026.7"
	},
	{
		name: "question.resolve",
		scope: "operator.questions",
		since: "2026.7"
	},
	{
		name: "question.get",
		scope: "operator.questions",
		since: "2026.7"
	},
	{
		name: "question.list",
		scope: "operator.questions",
		since: "2026.7"
	},
	{
		name: "plugin.approval.list",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "plugin.approval.request",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "plugin.approval.waitDecision",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "plugin.approval.resolve",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "plugins.uiDescriptors",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "plugins.sessionAction",
		scope: "dynamic",
		since: "<=2026.7"
	},
	{
		name: "openclaw.chat",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "openclaw.chat.history",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "openclaw.changes.list",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "openclaw.approval.list",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "openclaw.setup.detect",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "openclaw.setup.activate",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "openclaw.setup.auth.start",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "openclaw.setup.prepare.start",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "wizard.start",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "wizard.next",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "wizard.cancel",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "wizard.status",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "talk.catalog",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "talk.config",
		scope: "dynamic",
		since: "<=2026.7"
	},
	{
		name: "talk.client.create",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.client.transcript",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.client.close",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.client.toolCall",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.client.steer",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.create",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.join",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.appendAudio",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.startTurn",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.endTurn",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.cancelTurn",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.cancelOutput",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.acknowledgeMark",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.submitToolResult",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.steer",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.session.close",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.speak",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "talk.mode",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "commands.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "models.list",
		scope: "operator.read",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "models.authStatus",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "models.authLogout",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "tools.catalog",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tools.effective",
		scope: "operator.read",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "tools.invoke",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.view",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.listTools",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.listResources",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.listResourceTemplates",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.readResource",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.callTool",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "mcp.app.updateModelContext",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "board.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "board.update",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "board.widget.put",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "board.widget.grant",
		scope: "operator.approvals",
		since: "<=2026.7"
	},
	{
		name: "board.widget.appView",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "board.event",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "audit.list",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "audit.activity.list",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "users.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "users.self",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "users.linkEmail",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "users.setDisplayName",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "users.setAvatar",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "tasks.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tasks.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "tasks.cancel",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "taskSuggestions.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "taskSuggestions.create",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "taskSuggestions.accept",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "taskSuggestions.dismiss",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "environments.list",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "environments.status",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "worktrees.list",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "worktrees.branches",
		scope: "operator.write",
		since: "2026.7"
	},
	{
		name: "fs.listDir",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "worktrees.create",
		scope: "operator.admin",
		since: "2026.7",
		controlPlaneWrite: true
	},
	{
		name: "worktrees.remove",
		scope: "operator.admin",
		since: "2026.7",
		controlPlaneWrite: true
	},
	{
		name: "worktrees.restore",
		scope: "operator.admin",
		since: "2026.7",
		controlPlaneWrite: true
	},
	{
		name: "worktrees.gc",
		scope: "operator.admin",
		since: "2026.7",
		controlPlaneWrite: true
	},
	{
		name: "agents.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "agents.create",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "agents.update",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "agents.delete",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "agents.files.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "agents.files.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "agents.files.set",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.files.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.files.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.files.set",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.files.reveal",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "artifacts.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "artifacts.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "artifacts.download",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.search",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.detail",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.securityVerdicts",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.skillCard",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.bins",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "skills.upload.begin",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.upload.chunk",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.upload.commit",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.install",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.update",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.curator.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.curator.pin",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.curator.unpin",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.curator.restore",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.inspect",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.historyStatus",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.historyScan",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.create",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.update",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.revise",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.requestRevision",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.apply",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.reject",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "skills.proposals.quarantine",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "update.status",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "update.run",
		scope: "operator.admin",
		controlPlaneWrite: true,
		since: "<=2026.7"
	},
	{
		name: "voicewake.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "voicewake.set",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "secrets.reload",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "secrets.resolve",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "voicewake.routing.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "voicewake.routing.set",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "sessions.list",
		scope: "operator.read",
		startup: true,
		since: "<=2026.7"
	},
	{
		name: "sessions.subscribe",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.unsubscribe",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.messages.subscribe",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.messages.unsubscribe",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.preview",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.describe",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.compaction.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.compaction.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.compaction.branch",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "sessions.compaction.restore",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.branches.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.branches.switch",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.rewind",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.fork",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "sessions.create",
		scope: "dynamic",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "sessions.send",
		scope: "operator.write",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "sessions.abort",
		scope: "operator.write",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "sessions.patch",
		scope: "dynamic",
		since: "<=2026.7"
	},
	{
		name: "sessions.pluginPatch",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.cleanup",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.reset",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.delete",
		scope: "dynamic",
		since: "<=2026.7"
	},
	{
		name: "sessions.compact",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "sessions.groups.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.groups.put",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "sessions.groups.rename",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "sessions.groups.delete",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "last-heartbeat",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "set-heartbeats",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "wake",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "node.pair.list",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "node.pair.approve",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "node.pair.reject",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "node.pair.remove",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.pair.list",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.pair.approve",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.pair.reject",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.pair.remove",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.pair.rename",
		scope: "operator.pairing",
		since: "2026.7"
	},
	{
		name: "device.token.rotate",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.token.revoke",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "device.pair.setupCode",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "node.rename",
		scope: "operator.pairing",
		since: "<=2026.7"
	},
	{
		name: "node.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "node.describe",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "node.pluginSurface.refresh",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.pluginTools.update",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.skills.update",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.pending.drain",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.pending.enqueue",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "node.invoke",
		scope: "dynamic",
		since: "<=2026.7"
	},
	{
		name: "node.pending.pull",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.pending.ack",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.invoke.progress",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.invoke.result",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "node.event",
		scope: "node",
		since: "<=2026.7"
	},
	{
		name: "cron.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "cron.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "cron.status",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "cron.add",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "cron.update",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "cron.remove",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "cron.run",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "cron.runs",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "gateway.identity.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "gateway.restart.preflight",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "gateway.restart.request",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "system-presence",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "system-event",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "message.action",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "conversations.send",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "conversations.turn",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "conversations.turn.cancel",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "send",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "agent",
		scope: "dynamic",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "agent.identity.get",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "agent.wait",
		scope: "operator.write",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "chat.history",
		scope: "operator.read",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "chat.startup",
		scope: "operator.read",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "chat.metadata",
		scope: "operator.read",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "chat.message.get",
		scope: "operator.read",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "chat.abort",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "chat.send",
		scope: "operator.write",
		since: "<=2026.7",
		startup: true
	},
	{
		name: "terminal.open",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "terminal.input",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "terminal.resize",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "terminal.close",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "assistant.media.get",
		scope: "operator.read",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "sessions.get",
		scope: "operator.read",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "sessions.resolve",
		scope: "operator.read",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "sessions.usage",
		scope: "operator.read",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "sessions.usage.timeseries",
		scope: "operator.read",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "sessions.usage.logs",
		scope: "operator.read",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "poll",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "sessions.steer",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "push.test",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "attach.grant",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "attach.revoke",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "push.web.vapidPublicKey",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "push.web.subscribe",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "push.web.unsubscribe",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "push.web.test",
		scope: "operator.write",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "config.openFile",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "connect",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "chat.inject",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "nativeHook.invoke",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "web.login.start",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "web.login.wait",
		scope: "operator.admin",
		since: "<=2026.7",
		advertise: false
	},
	{
		name: "terminal.attach",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "terminal.list",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "terminal.text",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "controlUi.githubPreview",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "system.info",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "agents.workspace.list",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "agents.workspace.get",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "tts.speak",
		scope: "operator.write",
		since: "2026.7"
	},
	{
		name: "plugins.list",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "plugins.search",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "plugins.install",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "plugins.setEnabled",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "plugins.uninstall",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "plugins.refresh",
		scope: "operator.admin",
		since: "<=2026.7",
		controlPlaneWrite: true
	},
	{
		name: "controlUi.sessionPullRequests",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "gateway.suspend.prepare",
		scope: "operator.admin",
		since: "2026.7",
		startup: true,
		controlPlaneWrite: true
	},
	{
		name: "gateway.suspend.status",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "gateway.suspend.resume",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "chat.toolTitles",
		scope: "operator.write",
		since: "<=2026.7"
	},
	{
		name: "sessions.diff",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "openclaw.setup.verify",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "environments.create",
		scope: "operator.admin",
		since: "2026.7",
		startup: true,
		controlPlaneWrite: true
	},
	{
		name: "environments.destroy",
		scope: "operator.admin",
		since: "2026.7",
		startup: true,
		controlPlaneWrite: true
	},
	{
		name: "sessions.catalog.list",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "sessions.catalog.read",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "terminal.upload",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "sessions.catalog.continue",
		scope: "operator.write",
		since: "2026.7"
	},
	{
		name: "sessions.catalog.archive",
		scope: "operator.write",
		since: "2026.7"
	},
	{
		name: "approval.get",
		scope: "operator.approvals",
		since: "2026.7"
	},
	{
		name: "approval.resolve",
		scope: "operator.approvals",
		since: "2026.7"
	},
	{
		name: "sessions.search",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "sessions.dispatch",
		scope: "operator.admin",
		since: "2026.7",
		startup: true,
		controlPlaneWrite: true
	},
	{
		name: "sessions.reclaim",
		scope: "operator.admin",
		since: "2026.7",
		startup: true,
		controlPlaneWrite: true
	},
	{
		name: "models.probe",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "migrations.memory.plan",
		scope: "operator.admin",
		since: "2026.7"
	},
	{
		name: "migrations.memory.apply",
		scope: "operator.admin",
		since: "2026.7",
		controlPlaneWrite: true
	},
	{
		name: "ui.command",
		scope: "operator.write",
		since: "2026.7"
	},
	{
		name: "approval.history",
		scope: "operator.approvals",
		since: "2026.7"
	},
	{
		name: "plugin.surface.refresh",
		scope: "operator.read",
		since: "<=2026.7"
	},
	{
		name: "conversations.list",
		scope: "operator.admin",
		since: "<=2026.7"
	},
	{
		name: "session.discussion.info",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "session.discussion.open",
		scope: "operator.write",
		since: "2026.7"
	},
	{
		name: "board.prompt.authorize",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "board.data.read",
		scope: "operator.read",
		since: "2026.7"
	},
	{
		name: "board.action",
		scope: "operator.write",
		since: "2026.7"
	}
];
const CORE_GATEWAY_METHOD_SPEC_BY_NAME = new Map(CORE_GATEWAY_METHOD_SPECS.map((spec) => [spec.name, spec]));
/** Core methods that are listed early but return retryable unavailable until sidecars are ready. */
const STARTUP_UNAVAILABLE_GATEWAY_METHODS = CORE_GATEWAY_METHOD_SPECS.filter((spec) => spec.startup === true).map((spec) => spec.name);
/** Returns the core methods that should be advertised to external gateway clients. */
function listCoreAdvertisedGatewayMethodNames() {
	return CORE_GATEWAY_METHOD_SPECS.filter((spec) => spec.advertise !== false).map((spec) => spec.name);
}
/** Returns all registered core method names, including hidden/internal compatibility methods. */
function listCoreGatewayMethodNames() {
	return listCoreGatewayMethodMetadata().map((spec) => spec.name);
}
/** Returns the public metadata emitted for every core gateway method. */
function listCoreGatewayMethodMetadata() {
	return CORE_GATEWAY_METHOD_SPECS.map(({ name, scope, since }) => ({
		name,
		scope,
		since
	}));
}
/** Looks up the raw core method scope, including node and dynamic sentinel scopes. */
function resolveCoreGatewayMethodScope(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.get(method)?.scope;
}
/** Looks up an operator-only core method scope, excluding node and dynamic methods. */
function resolveCoreOperatorGatewayMethodScope(method) {
	const scope = resolveCoreGatewayMethodScope(method);
	return scope === "node" || scope === "dynamic" ? void 0 : scope;
}
/** Returns true for core methods reserved for authenticated node clients. */
function isCoreNodeGatewayMethod(method) {
	return resolveCoreGatewayMethodScope(method) === NODE_GATEWAY_METHOD_SCOPE;
}
/** Returns true for core methods whose required operator scope is resolved by the handler. */
function isDynamicOperatorGatewayMethod(method) {
	return resolveCoreGatewayMethodScope(method) === DYNAMIC_GATEWAY_METHOD_SCOPE;
}
/** Returns true when a method name has an explicit core policy entry. */
function isCoreGatewayMethodClassified(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.has(method);
}
/** Creates dispatch descriptors for core handlers and fails if any handler lacks policy. */
function createCoreGatewayMethodDescriptors(handlers) {
	const descriptors = [];
	const specNames = /* @__PURE__ */ new Set();
	for (const spec of CORE_GATEWAY_METHOD_SPECS) {
		specNames.add(spec.name);
		const handler = handlers[spec.name];
		if (!handler) continue;
		descriptors.push({
			name: spec.name,
			handler,
			owner: {
				kind: "core",
				area: "gateway"
			},
			scope: spec.scope,
			...spec.since ? { since: spec.since } : {},
			...spec.advertise === false ? { advertise: false } : {},
			...spec.startup === true ? { startup: "unavailable-until-sidecars" } : {},
			...spec.controlPlaneWrite === true ? { controlPlaneWrite: true } : {}
		});
	}
	for (const name of Object.keys(handlers)) if (!specNames.has(name)) throw new Error(`gateway method handler is missing a descriptor: ${name}`);
	return descriptors;
}
//#endregion
export { isDynamicOperatorGatewayMethod as a, resolveCoreOperatorGatewayMethodScope as c, isCoreNodeGatewayMethod as i, DYNAMIC_GATEWAY_METHOD_SCOPE as l, createCoreGatewayMethodDescriptors as n, listCoreAdvertisedGatewayMethodNames as o, isCoreGatewayMethodClassified as r, listCoreGatewayMethodNames as s, STARTUP_UNAVAILABLE_GATEWAY_METHODS as t, NODE_GATEWAY_METHOD_SCOPE as u };
