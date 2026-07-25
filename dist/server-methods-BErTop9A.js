import { n as getPluginRegistryState } from "./runtime-state-Bd0YsvqM.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-CRTM-3cy.js";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-DN3UnWnt.js";
import { n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified } from "./core-descriptors-BaSJeBqR.js";
import { c as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-BHrNTqoH.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { a as getGatewaySuspendAdmissionPhase, g as tryBeginGatewayRootWorkAdmission, o as isGatewayRestartDraining } from "./gateway-work-admission-CLw1UuhK.js";
import { i as createPluginGatewayMethodDescriptors, n as createGatewayMethodRegistry, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-CnDSDSlE.js";
import { n as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import { a as missingScopeErrorShape, i as errorShape } from "./error-codes-DKVDGU7l.js";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-CaXwt5uN.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-Q607YvPV.js";
//#region src/gateway/server-methods-node-methods.ts
const NODE_PAIR_GATEWAY_METHODS = [
	"node.pair.list",
	"node.pair.approve",
	"node.pair.reject"
];
//#endregion
//#region src/gateway/server-methods/lazy-core-handlers.ts
function lazyHandlerModule(loadModule, selectHandlers) {
	let handlersPromise = null;
	return () => handlersPromise ??= loadModule().then(selectHandlers);
}
function createLazyCoreHandlers(params) {
	return Object.fromEntries(params.methods.map((method) => [method, async (opts) => {
		const handler = (await params.loadHandlers())[method];
		if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
		await handler(opts);
	}]));
}
//#endregion
//#region src/gateway/server-methods/skills-method-names.ts
const SKILLS_GATEWAY_METHOD_NAMES = [
	"skills.upload.begin",
	"skills.upload.chunk",
	"skills.upload.commit",
	"skills.status",
	"skills.bins",
	"skills.search",
	"skills.detail",
	"skills.securityVerdicts",
	"skills.skillCard",
	"skills.install",
	"skills.update",
	"skills.curator.status",
	"skills.curator.pin",
	"skills.curator.unpin",
	"skills.curator.restore",
	"skills.proposals.list",
	"skills.proposals.inspect",
	"skills.proposals.historyStatus",
	"skills.proposals.historyScan",
	"skills.proposals.create",
	"skills.proposals.update",
	"skills.proposals.revise",
	"skills.proposals.requestRevision",
	"skills.proposals.apply",
	"skills.proposals.reject",
	"skills.proposals.quarantine"
];
//#endregion
//#region src/gateway/server-methods.ts
const loadAgentHandlers = lazyHandlerModule(() => import("./agent-CfL5V0I5.js"), (module) => module.agentHandlers);
const loadAgentsHandlers = lazyHandlerModule(() => import("./agents-CyN6avav.js"), (module) => module.agentsHandlers);
const loadAgentsWorkspaceHandlers = lazyHandlerModule(() => import("./agents-workspace-6KmM76As.js"), (module) => module.agentsWorkspaceHandlers);
const loadArtifactsHandlers = lazyHandlerModule(() => import("./artifacts-D8T42Q_O.js"), (module) => module.artifactsHandlers);
const loadBoardHandlers = lazyHandlerModule(() => import("./board-DD1jUSjd.js"), (module) => module.boardHandlers);
const loadAuditHandlers = lazyHandlerModule(() => import("./audit-BLPhoazM.js"), (module) => module.auditHandlers);
const loadUsersHandlers = lazyHandlerModule(() => import("./users-Eo-ZlFHb.js"), (module) => module.usersHandlers);
const loadAttachHandlers = lazyHandlerModule(() => import("./attach-DL9LQT0D.js"), (module) => module.attachHandlers);
const loadChannelsHandlers = lazyHandlerModule(() => import("./channels-CFGUrgOO.js"), (module) => module.channelsHandlers);
const loadChatHandlers = lazyHandlerModule(() => import("./chat-C7lLA1RF.js"), (module) => module.chatHandlers);
const loadCommandsHandlers = lazyHandlerModule(() => import("./commands-CuG4oq8X.js"), (module) => module.commandsHandlers);
const loadConfigHandlers = lazyHandlerModule(() => import("./config-XUhUQgJP.js"), (module) => module.configHandlers);
const loadConversationHandlers = lazyHandlerModule(() => import("./conversations-AmdAnGt5.js"), (module) => module.conversationHandlers);
const loadConnectHandlers = lazyHandlerModule(() => import("./connect-0BsDhF4C.js"), (module) => module.connectHandlers);
const loadControlUiHandlers = lazyHandlerModule(() => import("./control-ui-CUbqcVFv.js"), (module) => module.controlUiHandlers);
const loadCronHandlers = lazyHandlerModule(() => import("./cron-Cw3h9Tiw.js"), (module) => module.cronHandlers);
const loadDeviceHandlers = lazyHandlerModule(() => import("./devices-DwdfwNOs.js"), (module) => module.deviceHandlers);
const loadDevicePairSetupHandlers = lazyHandlerModule(() => import("./device-pair-setup-B8r9tnnL.js"), (module) => module.devicePairSetupHandlers);
const loadDiagnosticsHandlers = lazyHandlerModule(() => import("./diagnostics-BPdQr9K5.js"), (module) => module.diagnosticsHandlers);
const loadDoctorHandlers = lazyHandlerModule(() => import("./doctor-CXbRhuRr.js"), (module) => module.doctorHandlers);
const loadEnvironmentsHandlers = lazyHandlerModule(() => import("./environments-SEXA2Yoi.js"), (module) => module.environmentsHandlers);
const loadWorktreesHandlers = lazyHandlerModule(() => import("./worktrees-DAvdoVtr.js"), (module) => module.worktreesHandlers);
const loadExecApprovalsHandlers = lazyHandlerModule(() => import("./exec-approvals-CPthMmam.js"), (module) => module.execApprovalsHandlers);
const loadFsHandlers = lazyHandlerModule(() => import("./fs-CSVXQ5YC.js"), (module) => module.fsHandlers);
const loadHealthHandlers = lazyHandlerModule(() => import("./health-CLpJLMhq.js"), (module) => module.healthHandlers);
const loadLogsHandlers = lazyHandlerModule(() => import("./logs-umJKajfx.js"), (module) => module.logsHandlers);
const loadTerminalHandlers = lazyHandlerModule(() => import("./terminal-CuHHJGS1.js"), (module) => module.terminalHandlers);
const loadUiCommandHandlers = lazyHandlerModule(() => import("./ui-command-DM17PU-p.js"), (module) => module.uiCommandHandlers);
const loadModelsAuthStatusHandlers = lazyHandlerModule(() => import("./models-auth-status-CDa00ygF.js"), (module) => module.modelsAuthStatusHandlers);
const loadModelsHandlers = lazyHandlerModule(() => import("./models-DtDjSdkY.js"), (module) => module.modelsHandlers);
const loadModelsProbeHandlers = lazyHandlerModule(() => import("./models-probe-DEeUxKI6.js"), (module) => module.modelsProbeHandlers);
const loadNativeHookRelayHandlers = lazyHandlerModule(() => import("./native-hook-relay-CQRGPPs_.js"), (module) => module.nativeHookRelayHandlers);
const loadNodePendingHandlers = lazyHandlerModule(() => import("./nodes-pending-Ct8a9DRS.js"), (module) => module.nodePendingHandlers);
const loadNodeHandlers = lazyHandlerModule(() => import("./nodes-VmrFZah2.js"), (module) => module.nodeHandlers);
const loadPluginHostHookHandlers = lazyHandlerModule(() => import("./plugin-host-hooks-BEe-SWZR.js"), (module) => module.pluginHostHookHandlers);
const loadPluginsHandlers = lazyHandlerModule(() => import("./plugins-BltIBEK8.js"), (module) => module.pluginsHandlers);
const loadMigrationsHandlers = lazyHandlerModule(() => import("./migrations-rE3qqYES.js"), (module) => module.migrationsHandlers);
const loadPushHandlers = lazyHandlerModule(() => import("./push-YvJoBEYz.js"), (module) => module.pushHandlers);
const loadRestartHandlers = lazyHandlerModule(() => import("./restart-DdBCSXjj.js"), (module) => module.restartHandlers);
const loadSuspendHandlers = lazyHandlerModule(() => import("./suspend-DCpOGhTK.js"), (module) => module.suspendHandlers);
const loadSendHandlers = lazyHandlerModule(() => import("./send-5ffOB9lX.js"), (module) => module.sendHandlers);
const loadSessionsFilesHandlers = lazyHandlerModule(() => import("./sessions-files-CdD8MSU7.js"), (module) => module.sessionsFilesHandlers);
const loadSessionsDiffHandlers = lazyHandlerModule(() => import("./sessions-diff-DKN6qsUD.js"), (module) => module.sessionsDiffHandlers);
const loadSessionsHandlers = lazyHandlerModule(() => import("./sessions-CircIZYS.js"), (module) => module.sessionsHandlers);
const loadSessionCatalogHandlers = lazyHandlerModule(() => import("./session-catalog-B_9ainLp.js"), (module) => module.sessionCatalogHandlers);
const loadSessionDiscussionHandlers = lazyHandlerModule(() => import("./session-discussion-CyijO7vM.js"), (module) => module.sessionDiscussionHandlers);
const loadSkillsHandlers = lazyHandlerModule(() => import("./skills-BkMkYtka.js"), (module) => module.skillsHandlers);
const loadSystemHandlers = lazyHandlerModule(() => import("./system-CcqRkxU1.js"), (module) => module.systemHandlers);
const loadTalkHandlers = lazyHandlerModule(() => import("./talk-DhlVb67j.js"), (module) => module.talkHandlers);
const loadTasksHandlers = lazyHandlerModule(() => import("./tasks-4iHb-NED.js"), (module) => module.tasksHandlers);
const loadTaskSuggestionsHandlers = lazyHandlerModule(() => import("./task-suggestions-B6SNR9Rp.js"), (module) => module.taskSuggestionsHandlers);
const loadToolsCatalogHandlers = lazyHandlerModule(() => import("./tools-catalog-DU1ZIaIW.js"), (module) => module.toolsCatalogHandlers);
const loadToolsEffectiveHandlers = lazyHandlerModule(() => import("./tools-effective-BbAf6gPk.js"), (module) => module.toolsEffectiveHandlers);
const loadToolsInvokeHandlers = lazyHandlerModule(() => import("./tools-invoke-DrcAd_nf.js"), (module) => module.toolsInvokeHandlers);
const loadMcpAppHandlers = lazyHandlerModule(() => import("./mcp-app-45TnDfcH.js"), (module) => module.mcpAppHandlers);
const loadTtsHandlers = lazyHandlerModule(() => import("./tts-D43qZ9v8.js"), (module) => module.ttsHandlers);
const loadUpdateHandlers = lazyHandlerModule(() => import("./update-BByQTbNh.js"), (module) => module.updateHandlers);
const loadUsageHandlers = lazyHandlerModule(() => import("./usage-DUi3Jk1f.js"), (module) => module.usageHandlers);
const loadVoicewakeRoutingHandlers = lazyHandlerModule(() => import("./voicewake-routing-BTERPEU0.js"), (module) => module.voicewakeRoutingHandlers);
const loadVoicewakeHandlers = lazyHandlerModule(() => import("./voicewake-BReHjkKu.js"), (module) => module.voicewakeHandlers);
const loadWebHandlers = lazyHandlerModule(() => import("./web-C_bNTbtc.js"), (module) => module.webHandlers);
const loadSystemAgentHandlers = lazyHandlerModule(() => import("./system-agent-JdgIFQti.js"), (module) => module.systemAgentHandlers);
const loadSystemChangesHandlers = lazyHandlerModule(() => import("./system-changes-CtAdPwT8.js"), (module) => module.systemChangesHandlers);
const loadWizardHandlers = lazyHandlerModule(() => import("./wizard-DeZpNZsl.js"), (module) => module.wizardHandlers);
function authorizeGatewayMethod(method, client, params, methodRegistry) {
	if (!client?.connect) return null;
	if (method === "health") return null;
	const roleRaw = client.connect.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`);
	const scopes = client.connect.scopes ?? [];
	if (!isRoleAuthorizedForMethod(role, method)) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`);
	if (role === "node") return null;
	if (scopes.includes("operator.admin")) return null;
	const registeredScope = methodRegistry.getScope(method);
	const scopeAuth = isOperatorScope(registeredScope) ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes) : authorizeOperatorScopesForMethod(method, scopes, params);
	if (!scopeAuth.allowed) {
		const resolvedRequiredScopes = isOperatorScope(registeredScope) ? [registeredScope] : resolveLeastPrivilegeOperatorScopesForMethod(method, params);
		return missingScopeErrorShape({
			missingScope: scopeAuth.missingScope,
			requiredScopes: resolvedRequiredScopes.length > 0 ? resolvedRequiredScopes : [scopeAuth.missingScope]
		});
	}
	return null;
}
const SUSPEND_CONTROL_METHODS = /* @__PURE__ */ new Set([
	"gateway.suspend.prepare",
	"gateway.suspend.status",
	"gateway.suspend.resume"
]);
function isGatewayMethodAllowedDuringSuspension(method) {
	return SUSPEND_CONTROL_METHODS.has(method);
}
const coreGatewayHandlers = {
	...createLazyCoreHandlers({
		methods: ["connect"],
		loadHandlers: loadConnectHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["attach.grant", "attach.revoke"],
		loadHandlers: loadAttachHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["logs.tail"],
		loadHandlers: loadLogsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["openclaw.changes.list"],
		loadHandlers: loadSystemChangesHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"terminal.open",
			"terminal.input",
			"terminal.resize",
			"terminal.close",
			"terminal.attach",
			"terminal.list",
			"terminal.text",
			"terminal.upload"
		],
		loadHandlers: loadTerminalHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["ui.command"],
		loadHandlers: loadUiCommandHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"board.get",
			"board.update",
			"board.widget.put",
			"board.widget.grant",
			"board.widget.appView",
			"board.event",
			"board.prompt.authorize",
			"board.data.read",
			"board.action"
		],
		loadHandlers: loadBoardHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["voicewake.get", "voicewake.set"],
		loadHandlers: loadVoicewakeHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["voicewake.routing.get", "voicewake.routing.set"],
		loadHandlers: loadVoicewakeRoutingHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["health", "status"],
		loadHandlers: loadHealthHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"channels.status",
			"channels.start",
			"channels.stop",
			"channels.logout"
		],
		loadHandlers: loadChannelsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"chat.history",
			"chat.startup",
			"chat.metadata",
			"chat.message.get",
			"chat.toolTitles",
			"chat.abort",
			"chat.send",
			"chat.inject"
		],
		loadHandlers: loadChatHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["commands.list"],
		loadHandlers: loadCommandsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"wake",
			"cron.list",
			"cron.status",
			"cron.get",
			"cron.add",
			"cron.update",
			"cron.remove",
			"cron.run",
			"cron.runs"
		],
		loadHandlers: loadCronHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"device.pair.list",
			"device.pair.approve",
			"device.pair.reject",
			"device.pair.remove",
			"device.pair.rename",
			"device.token.rotate",
			"device.token.revoke"
		],
		loadHandlers: loadDeviceHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["device.pair.setupCode"],
		loadHandlers: loadDevicePairSetupHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["diagnostics.stability"],
		loadHandlers: loadDiagnosticsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["controlUi.githubPreview", "controlUi.sessionPullRequests"],
		loadHandlers: loadControlUiHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"doctor.memory.status",
			"doctor.memory.dreamDiary",
			"doctor.memory.backfillDreamDiary",
			"doctor.memory.resetDreamDiary",
			"doctor.memory.resetGroundedShortTerm",
			"doctor.memory.repairDreamingArtifacts",
			"doctor.memory.dedupeDreamDiary",
			"doctor.memory.remHarness"
		],
		loadHandlers: loadDoctorHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"environments.list",
			"environments.status",
			"environments.create",
			"environments.destroy"
		],
		loadHandlers: loadEnvironmentsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"worktrees.list",
			"worktrees.branches",
			"worktrees.create",
			"worktrees.remove",
			"worktrees.restore",
			"worktrees.gc"
		],
		loadHandlers: loadWorktreesHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"exec.approvals.get",
			"exec.approvals.set",
			"exec.approvals.node.get",
			"exec.approvals.node.set"
		],
		loadHandlers: loadExecApprovalsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["fs.listDir"],
		loadHandlers: loadFsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["web.login.start", "web.login.wait"],
		loadHandlers: loadWebHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["models.list"],
		loadHandlers: loadModelsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["models.probe"],
		loadHandlers: loadModelsProbeHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["models.authLogout", "models.authStatus"],
		loadHandlers: loadModelsAuthStatusHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["nativeHook.invoke"],
		loadHandlers: loadNativeHookRelayHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["plugins.uiDescriptors", "plugins.sessionAction"],
		loadHandlers: loadPluginHostHookHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"plugins.list",
			"plugins.search",
			"plugins.install",
			"plugins.setEnabled",
			"plugins.uninstall",
			"plugins.refresh"
		],
		loadHandlers: loadPluginsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"config.get",
			"config.schema",
			"config.schema.lookup",
			"config.set",
			"config.patch",
			"config.apply",
			"config.openFile"
		],
		loadHandlers: loadConfigHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"wizard.start",
			"wizard.next",
			"wizard.cancel",
			"wizard.status"
		],
		loadHandlers: loadWizardHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"openclaw.chat",
			"openclaw.chat.history",
			"openclaw.approval.list",
			"openclaw.setup.detect",
			"openclaw.setup.verify",
			"openclaw.setup.activate",
			"openclaw.setup.auth.start",
			"openclaw.setup.prepare.start"
		],
		loadHandlers: loadSystemAgentHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"talk.session.create",
			"talk.session.join",
			"talk.session.appendAudio",
			"talk.session.startTurn",
			"talk.session.endTurn",
			"talk.session.cancelTurn",
			"talk.session.cancelOutput",
			"talk.session.acknowledgeMark",
			"talk.session.submitToolResult",
			"talk.session.steer",
			"talk.session.close",
			"talk.client.create",
			"talk.client.transcript",
			"talk.client.close",
			"talk.client.toolCall",
			"talk.client.steer",
			"talk.catalog",
			"talk.config",
			"talk.speak",
			"talk.mode"
		],
		loadHandlers: loadTalkHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["audit.list", "audit.activity.list"],
		loadHandlers: loadAuditHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"users.list",
			"users.self",
			"users.linkEmail",
			"users.setDisplayName",
			"users.setAvatar"
		],
		loadHandlers: loadUsersHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"tasks.list",
			"tasks.get",
			"tasks.cancel"
		],
		loadHandlers: loadTasksHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"taskSuggestions.list",
			"taskSuggestions.create",
			"taskSuggestions.accept",
			"taskSuggestions.dismiss"
		],
		loadHandlers: loadTaskSuggestionsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["tools.catalog"],
		loadHandlers: loadToolsCatalogHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["tools.effective"],
		loadHandlers: loadToolsEffectiveHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["tools.invoke"],
		loadHandlers: loadToolsInvokeHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"mcp.app.view",
			"mcp.app.callTool",
			"mcp.app.listTools",
			"mcp.app.listResources",
			"mcp.app.listResourceTemplates",
			"mcp.app.readResource",
			"mcp.app.updateModelContext"
		],
		loadHandlers: loadMcpAppHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"tts.status",
			"tts.enable",
			"tts.disable",
			"tts.convert",
			"tts.speak",
			"tts.setProvider",
			"tts.personas",
			"tts.setPersona",
			"tts.providers"
		],
		loadHandlers: loadTtsHandlers
	}),
	...createLazyCoreHandlers({
		methods: SKILLS_GATEWAY_METHOD_NAMES,
		loadHandlers: loadSkillsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"sessions.catalog.list",
			"sessions.catalog.read",
			"sessions.catalog.continue",
			"sessions.catalog.archive"
		],
		loadHandlers: loadSessionCatalogHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["session.discussion.info", "session.discussion.open"],
		loadHandlers: loadSessionDiscussionHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"sessions.list",
			"sessions.search",
			"sessions.cleanup",
			"sessions.subscribe",
			"sessions.unsubscribe",
			"sessions.messages.subscribe",
			"sessions.messages.unsubscribe",
			"sessions.preview",
			"sessions.describe",
			"sessions.resolve",
			"sessions.compaction.list",
			"sessions.compaction.get",
			"sessions.create",
			"sessions.compaction.branch",
			"sessions.compaction.restore",
			"sessions.branches.list",
			"sessions.branches.switch",
			"sessions.rewind",
			"sessions.fork",
			"sessions.send",
			"sessions.steer",
			"sessions.abort",
			"sessions.patch",
			"sessions.pluginPatch",
			"sessions.reset",
			"sessions.delete",
			"sessions.get",
			"sessions.compact",
			"sessions.groups.list",
			"sessions.groups.put",
			"sessions.groups.rename",
			"sessions.groups.delete",
			"sessions.dispatch",
			"sessions.reclaim"
		],
		loadHandlers: loadSessionsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"gateway.identity.get",
			"last-heartbeat",
			"set-heartbeats",
			"system-presence",
			"system.info",
			"system-event"
		],
		loadHandlers: loadSystemHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["update.status", "update.run"],
		loadHandlers: loadUpdateHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			...NODE_PAIR_GATEWAY_METHODS,
			"node.pair.remove",
			"node.rename",
			"node.list",
			"node.describe",
			"plugin.surface.refresh",
			"node.pluginSurface.refresh",
			"node.pluginTools.update",
			"node.skills.update",
			"node.pending.pull",
			"node.pending.ack",
			"node.invoke",
			"node.invoke.progress",
			"node.invoke.result",
			"node.event"
		],
		loadHandlers: loadNodeHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["node.pending.drain", "node.pending.enqueue"],
		loadHandlers: loadNodePendingHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"push.test",
			"push.web.vapidPublicKey",
			"push.web.subscribe",
			"push.web.unsubscribe",
			"push.web.test"
		],
		loadHandlers: loadPushHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["gateway.restart.request", "gateway.restart.preflight"],
		loadHandlers: loadRestartHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"gateway.suspend.prepare",
			"gateway.suspend.status",
			"gateway.suspend.resume"
		],
		loadHandlers: loadSuspendHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"message.action",
			"send",
			"poll"
		],
		loadHandlers: loadSendHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"conversations.list",
			"conversations.send",
			"conversations.turn",
			"conversations.turn.cancel"
		],
		loadHandlers: loadConversationHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"usage.status",
			"usage.cost",
			"sessions.usage",
			"sessions.usage.timeseries",
			"sessions.usage.logs"
		],
		loadHandlers: loadUsageHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"agent",
			"agent.identity.get",
			"agent.wait"
		],
		loadHandlers: loadAgentHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"agents.list",
			"agents.create",
			"agents.update",
			"agents.delete",
			"agents.files.list",
			"agents.files.get",
			"agents.files.set"
		],
		loadHandlers: loadAgentsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["agents.workspace.list", "agents.workspace.get"],
		loadHandlers: loadAgentsWorkspaceHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"artifacts.list",
			"artifacts.get",
			"artifacts.download"
		],
		loadHandlers: loadArtifactsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"sessions.files.list",
			"sessions.files.get",
			"sessions.files.set",
			"sessions.files.reveal"
		],
		loadHandlers: loadSessionsFilesHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["sessions.diff"],
		loadHandlers: loadSessionsDiffHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["migrations.memory.plan", "migrations.memory.apply"],
		loadHandlers: loadMigrationsHandlers
	})
};
/** Builds the per-request method registry from core, plugin, and explicit extra handlers. */
function createRequestGatewayMethodRegistry(extraHandlers) {
	const activePluginRegistry = getPluginRegistryState()?.activeRegistry;
	const activePluginHandlers = activePluginRegistry?.gatewayHandlers ?? {};
	const extraHandlerEntries = Object.entries(extraHandlers ?? {});
	const pluginMethodNames = new Set(Object.keys(activePluginHandlers));
	const coreDescriptorHandlers = { ...coreGatewayHandlers };
	for (const [method, extraHandler] of extraHandlerEntries) if (!pluginMethodNames.has(method) && isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = extraHandler;
	const coreDescriptors = createCoreGatewayMethodDescriptors(coreDescriptorHandlers);
	for (const descriptor of coreDescriptors) {
		const extraHandler = extraHandlers?.[descriptor.name];
		if (extraHandler && !pluginMethodNames.has(descriptor.name)) descriptor.handler = extraHandler;
	}
	const coreMethodNames = new Set(coreDescriptors.map((descriptor) => descriptor.name));
	const auxHandlers = Object.fromEntries(extraHandlerEntries.filter(([method]) => !pluginMethodNames.has(method) && !coreMethodNames.has(method)));
	return createGatewayMethodRegistry([
		...coreDescriptors,
		...activePluginRegistry ? createPluginGatewayMethodDescriptors(activePluginRegistry) : [],
		...createGatewayMethodDescriptorsFromHandlers({
			handlers: auxHandlers,
			owner: {
				kind: "aux",
				area: "gateway-extra"
			},
			defaultScope: ADMIN_SCOPE
		})
	]);
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts) {
	const { req, respond, client, isWebchatConnect, context } = opts;
	const methodRegistry = opts.methodRegistry?.getHandler(req.method) !== void 0 ? opts.methodRegistry : createRequestGatewayMethodRegistry(opts.extraHandlers);
	const authError = authorizeGatewayMethod(req.method, client, req.params, methodRegistry);
	if (authError) {
		respond(false, void 0, authError);
		return;
	}
	if (context.unavailableGatewayMethods?.has(req.method)) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `${req.method} unavailable during gateway startup`, {
			retryable: true,
			retryAfterMs: 500,
			details: {
				...gatewayStartupUnavailableDetails(),
				method: req.method
			}
		}));
		return;
	}
	const rejectRateLimitedControlPlaneWrite = () => {
		if (!methodRegistry.isControlPlaneWrite(req.method)) return false;
		const budget = consumeControlPlaneWriteBudget({
			client,
			method: req.method
		});
		if (budget.allowed) return false;
		const actor = resolveControlPlaneActor(client);
		context.logGateway.warn(`control-plane write rate-limited method=${req.method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`);
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `rate limit exceeded for ${req.method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`, {
			retryable: true,
			retryAfterMs: budget.retryAfterMs,
			details: {
				method: req.method,
				limit: `30 per ${CONTROL_PLANE_RATE_LIMIT_WINDOW_MS / 1e3}s`
			}
		}));
		return true;
	};
	const isSuspendPrepare = req.method === "gateway.suspend.prepare";
	if (isSuspendPrepare && rejectRateLimitedControlPlaneWrite()) return;
	const handler = methodRegistry.getHandler(req.method);
	if (!handler) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
		return;
	}
	const rootWorkAdmission = tryBeginGatewayRootWorkAdmission();
	if (req.method === "gateway.suspend.prepare" && rootWorkAdmission && !rootWorkAdmission.ownsRoot) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "gateway suspension cannot begin from a nested request", {
			retryable: true,
			retryAfterMs: 1e3,
			details: {
				method: req.method,
				reason: "nested-gateway-request"
			}
		}));
		return;
	}
	if (!rootWorkAdmission && !isGatewayMethodAllowedDuringSuspension(req.method)) {
		const restartDraining = isGatewayRestartDraining();
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `${req.method} unavailable during gateway ${restartDraining ? "restart" : "suspension"}`, {
			retryable: true,
			retryAfterMs: 1e3,
			details: {
				method: req.method,
				reason: restartDraining ? "gateway-restarting" : "gateway-suspending",
				phase: getGatewaySuspendAdmissionPhase()
			}
		}));
		return;
	}
	if (!isSuspendPrepare && rejectRateLimitedControlPlaneWrite()) {
		rootWorkAdmission?.release();
		return;
	}
	const invokeHandler = () => handler({
		req,
		params: req.params ?? {},
		client,
		isWebchatConnect,
		respond,
		context
	});
	const invokeWithRequestScope = async () => await withPluginRuntimeGatewayRequestScope({
		context,
		client,
		isWebchatConnect
	}, invokeHandler);
	if (!rootWorkAdmission) {
		await invokeWithRequestScope();
		return;
	}
	try {
		await rootWorkAdmission.run(invokeWithRequestScope);
	} finally {
		rootWorkAdmission.release();
	}
}
//#endregion
export { coreGatewayHandlers, handleGatewayRequest };
