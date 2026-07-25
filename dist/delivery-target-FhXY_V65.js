import { c as normalizeOptionalString, u as normalizeOptionalThreadValue } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { r as resolveAgentMainSessionKey } from "./main-session-C7kXMD8t.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import { yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-BV9s-P0K.js";
import { r as stripTargetProviderPrefix } from "./channel-target-prefix-Btghjzyf.js";
import { t as resolveExplicitDeliveryTargetCompat } from "./target-parsing-loaded-DnWRrY22.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BRBN4bbo.js";
import { n as isReservedTargetLiteralError } from "./target-errors-CZ0A80hz.js";
import { t as resolveSessionDeliveryTarget } from "./targets-session-CmHRr4hB.js";
import { n as resolveCronStoredDeliveryContext } from "./delivery-context-3tiYyUnG.js";
import { t as resolveOutboundTargetWithPlugin } from "./targets-resolve-shared-DAnp_VBN.js";
//#region src/infra/outbound/targets-loaded.ts
function resolveLoadedOutboundChannelPlugin(channel) {
	const normalized = normalizeOptionalString(channel);
	if (!normalized) return;
	return getLoadedChannelPluginForRead(normalized);
}
/** Resolves targets through an already-loaded channel plugin without bootstrap discovery. */
function tryResolveLoadedOutboundTarget(params) {
	return resolveOutboundTargetWithPlugin({
		plugin: resolveLoadedOutboundChannelPlugin(params.channel),
		target: params
	});
}
//#endregion
//#region src/cron/isolated-agent/delivery-target.ts
/** Resolves isolated cron delivery requests into concrete outbound targets. */
const targetsRuntimeLoader = createLazyImportLoader(() => import("./targets.runtime.js"));
async function loadTargetsRuntime() {
	return await targetsRuntimeLoader.load();
}
async function resolveOutboundTargetWithRuntime(params) {
	try {
		const loaded = tryResolveLoadedOutboundTarget(params);
		if (loaded) return loaded;
		const { resolveOutboundTarget } = await loadTargetsRuntime();
		return resolveOutboundTarget({
			...params,
			allowBootstrap: true
		});
	} catch (err) {
		return {
			ok: false,
			error: /* @__PURE__ */ new Error(`Invalid delivery target: ${formatErrorMessage(err)}`)
		};
	}
}
const channelSelectionRuntimeLoader = createLazyImportLoader(() => import("./channel-selection.runtime.js"));
const deliveryTargetRuntimeLoader = createLazyImportLoader(() => import("./delivery-target.runtime.js"));
async function loadChannelSelectionRuntime() {
	return await channelSelectionRuntimeLoader.load();
}
async function loadDeliveryTargetRuntime() {
	return await deliveryTargetRuntimeLoader.load();
}
function isNonEmptyThreadId(value) {
	return value != null && value !== "";
}
function routesSharePeer(left, right) {
	return Boolean(left && right && left.baseSessionKey === right.baseSessionKey && left.peer.kind === right.peer.kind && left.peer.id === right.peer.id);
}
function shouldCarrySessionThread(params) {
	if (!isNonEmptyThreadId(params.resolved.threadId)) return false;
	if (!params.explicitTo) return params.resolved.channel === params.resolved.lastChannel && params.resolved.to === params.resolved.lastTo;
	return routesSharePeer(params.route, params.lastRoute);
}
function stripSelectedProviderPrefix(params) {
	const trimmed = params.to?.trim();
	if (!trimmed) return;
	return stripTargetProviderPrefix(trimmed, params.channel).trim() || void 0;
}
function shouldStripResolvedTargetProviderPrefix(target) {
	return target.resolutionSource === "normalized";
}
/** Resolves cron delivery config into a concrete channel target and optional thread/account. */
async function resolveDeliveryTarget(cfg, agentId, jobPayload, options) {
	const requestedChannel = typeof jobPayload.channel === "string" ? jobPayload.channel : "last";
	const explicitTo = typeof jobPayload.to === "string" ? jobPayload.to : void 0;
	const allowMismatchedLastTo = requestedChannel === "last";
	const deliveryTargetRuntime = await loadDeliveryTargetRuntime();
	const sessionCfg = cfg.session;
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	const storePath = resolveStorePath(sessionCfg?.store, { agentId });
	const rawSessionKey = jobPayload.sessionKey?.trim();
	const threadSessionKey = rawSessionKey ? resolveCronAgentSessionKey({
		sessionKey: rawSessionKey,
		agentId,
		mainKey: cfg.session?.mainKey,
		cfg
	}) : void 0;
	const storedDeliveryContext = resolveCronStoredDeliveryContext({
		cfg,
		sessionKey: threadSessionKey
	});
	const storedDeliveryEntry = storedDeliveryContext ? {
		sessionId: threadSessionKey ?? mainSessionKey,
		updatedAt: 0,
		deliveryContext: storedDeliveryContext
	} : void 0;
	const threadEntry = threadSessionKey ? loadSessionEntry({
		agentId,
		sessionKey: threadSessionKey,
		storePath
	}) : void 0;
	const mainEntry = loadSessionEntry({
		agentId,
		sessionKey: mainSessionKey,
		storePath
	});
	const main = storedDeliveryEntry ?? threadEntry ?? mainEntry;
	const usedSharedMainFallback = mainEntry !== void 0 && main === mainEntry;
	const preliminary = resolveSessionDeliveryTarget({
		entry: main,
		requestedChannel,
		explicitTo,
		explicitThreadId: jobPayload.threadId,
		allowMismatchedLastTo
	});
	let fallbackChannel;
	let channelResolutionError;
	if (!preliminary.channel) if (preliminary.lastChannel) fallbackChannel = preliminary.lastChannel;
	else try {
		const { resolveMessageChannelSelection } = await loadChannelSelectionRuntime();
		fallbackChannel = (await resolveMessageChannelSelection({ cfg })).channel;
	} catch (err) {
		const detail = formatErrorMessage(err);
		channelResolutionError = /* @__PURE__ */ new Error(`${detail} Set delivery.channel explicitly or use a main session with a previous channel.`);
	}
	const resolved = fallbackChannel ? resolveSessionDeliveryTarget({
		entry: main,
		requestedChannel,
		explicitTo,
		explicitThreadId: jobPayload.threadId,
		fallbackChannel,
		allowMismatchedLastTo,
		mode: preliminary.mode
	}) : preliminary;
	const channel = resolved.channel ?? fallbackChannel;
	const mode = resolved.mode;
	let toCandidate = resolved.to;
	let accountId = (typeof jobPayload.accountId === "string" && jobPayload.accountId.trim() ? jobPayload.accountId.trim() : void 0) ?? resolved.accountId;
	if (!accountId && channel) accountId = deliveryTargetRuntime.resolveFirstBoundAccountId({
		cfg,
		channelId: channel,
		agentId
	});
	if (jobPayload.accountId) accountId = jobPayload.accountId;
	if (!channel) return {
		ok: false,
		channel: void 0,
		to: void 0,
		accountId,
		threadId: void 0,
		mode,
		error: channelResolutionError ?? /* @__PURE__ */ new Error("Channel is required when delivery.channel=last has no previous channel.")
	};
	const explicitThreadId = isNonEmptyThreadId(jobPayload.threadId) ? jobPayload.threadId : void 0;
	let effectiveAllowFrom;
	if (mode === "implicit") {
		const { getLoadedChannelPluginForRead, mapAllowFromEntries } = deliveryTargetRuntime;
		const channelPlugin = getLoadedChannelPluginForRead(channel);
		const resolvedAccountId = normalizeAccountId(accountId);
		const configuredAllowFromRaw = channelPlugin?.config.resolveAllowFrom?.({
			cfg,
			accountId: resolvedAccountId
		});
		const allowFromOverride = uniqueStrings(configuredAllowFromRaw ? mapAllowFromEntries(configuredAllowFromRaw) : []);
		effectiveAllowFrom = allowFromOverride;
		if (toCandidate && allowFromOverride.length > 0) {
			if (!(await resolveOutboundTargetWithRuntime({
				channel,
				to: toCandidate,
				cfg,
				accountId,
				mode,
				allowFrom: effectiveAllowFrom
			})).ok) toCandidate = allowFromOverride[0];
		}
	}
	if (!rawSessionKey && mode === "implicit" && !explicitTo && usedSharedMainFallback && toCandidate != null && toCandidate === resolved.lastTo) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: /* @__PURE__ */ new Error("Refusing implicit isolated cron delivery: the target would be inherited from the shared agent-main session bucket's last recipient, which is ambiguous across conversations and can deliver to the wrong room (and replay there after a restart). Set delivery.channel and delivery.to explicitly, or run the cron from a session that carries its own delivery context.")
	};
	const preResolvedRouteTargetCandidate = toCandidate;
	const docked = await resolveOutboundTargetWithRuntime({
		channel,
		to: toCandidate,
		cfg,
		accountId,
		mode,
		allowFrom: effectiveAllowFrom
	});
	if (!docked.ok) {
		if (!toCandidate || !isReservedTargetLiteralError(docked.error)) return {
			ok: false,
			channel,
			to: void 0,
			accountId,
			threadId: explicitThreadId,
			mode,
			error: docked.error
		};
	} else toCandidate = docked.to;
	const targetResolution = await deliveryTargetRuntime.resolveChannelTargetForDelivery({
		cfg,
		channel,
		input: toCandidate,
		accountId
	});
	if (!targetResolution.ok) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: targetResolution.error
	};
	const resolvedTarget = targetResolution.target;
	const routeTargetCandidate = resolvedTarget.source === "directory" ? resolvedTarget.to : preResolvedRouteTargetCandidate ?? toCandidate;
	const selectedTarget = shouldStripResolvedTargetProviderPrefix(resolvedTarget) ? stripSelectedProviderPrefix({
		channel,
		to: resolvedTarget.to
	}) : resolvedTarget.to.trim();
	if (!selectedTarget) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: /* @__PURE__ */ new Error("Target is required")
	};
	toCandidate = selectedTarget;
	const route = await (async () => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				accountId,
				target: routeTargetCandidate,
				resolvedTarget,
				threadId: explicitThreadId,
				currentSessionKey: threadSessionKey ?? mainSessionKey
			});
		} catch {
			return null;
		}
	})();
	const routeCanCanonicalizeTarget = deliveryTargetRuntime.channelCanResolveOutboundSessionRoute({
		cfg,
		channel
	});
	const routeShouldCanonicalizeTarget = route && (route.threadId !== void 0 || route.to !== routeTargetCandidate);
	if (route && routeCanCanonicalizeTarget && routeShouldCanonicalizeTarget) {
		const routeTo = stripSelectedProviderPrefix({
			channel,
			to: route.to
		});
		if (!routeTo) return {
			ok: false,
			channel,
			to: void 0,
			accountId,
			threadId: explicitThreadId,
			mode,
			error: /* @__PURE__ */ new Error("Target is required")
		};
		toCandidate = routeTo;
	}
	const lastTo = resolved.lastTo;
	const lastRoute = lastTo && resolved.lastChannel === channel ? await (async () => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				accountId: resolved.lastAccountId ?? accountId,
				target: lastTo,
				threadId: resolved.lastThreadId,
				currentSessionKey: threadSessionKey ?? mainSessionKey
			});
		} catch {
			return null;
		}
	})() : null;
	const parserExplicitThreadId = explicitThreadId == null && explicitTo ? normalizeOptionalThreadValue(resolveExplicitDeliveryTargetCompat({
		channel,
		rawTarget: explicitTo
	})?.threadId) : void 0;
	const canUseSessionThread = options?.inheritSessionThread !== false && shouldCarrySessionThread({
		resolved,
		explicitTo,
		route,
		lastRoute
	});
	const threadId = explicitThreadId ?? route?.threadId ?? parserExplicitThreadId ?? (canUseSessionThread ? resolved.threadId : void 0);
	if (options?.dryRun) return {
		ok: true,
		channel,
		to: toCandidate,
		accountId,
		threadId,
		mode
	};
	return {
		ok: true,
		channel,
		to: toCandidate,
		accountId,
		threadId,
		mode
	};
}
//#endregion
export { resolveDeliveryTarget as t };
