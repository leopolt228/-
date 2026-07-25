import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { i as mergeDmAllowFromSources, o as resolveGroupAllowFromSources } from "./allow-from-o-cfFFcK.js";
//#region src/channels/command-gating.ts
/** Resolves whether any configured authorizer permits a control command. */
function resolveCommandAuthorizedFromAuthorizers(params) {
	const { useAccessGroups, authorizers } = params;
	const mode = params.modeWhenAccessGroupsOff ?? "allow";
	if (!useAccessGroups) {
		if (mode === "allow") return true;
		if (mode === "deny") return false;
		if (!authorizers.some((entry) => entry.configured)) return true;
		return authorizers.some((entry) => entry.configured && entry.allowed);
	}
	return authorizers.some((entry) => entry.configured && entry.allowed);
}
/** Resolves command authorization and whether the current text command should be blocked. */
function resolveControlCommandGate(params) {
	const commandAuthorized = resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups: params.useAccessGroups,
		authorizers: params.authorizers,
		modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff
	});
	return {
		commandAuthorized,
		shouldBlock: params.allowTextCommands && params.hasControlCommand && !commandAuthorized
	};
}
/** Convenience gate for channels that check primary and secondary text command identities. */
function resolveDualTextControlCommandGate(params) {
	return resolveControlCommandGate({
		useAccessGroups: params.useAccessGroups,
		authorizers: [{
			configured: params.primaryConfigured,
			allowed: params.primaryAllowed
		}, {
			configured: params.secondaryConfigured,
			allowed: params.secondaryAllowed
		}],
		allowTextCommands: true,
		hasControlCommand: params.hasControlCommand,
		modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff
	});
}
//#endregion
//#region src/channels/message-access/effective-allow-from.ts
/**
* Merge configured direct, group, and pairing-store allowlists into the
* effective lists consumed by sender and context-visibility checks.
*/
function resolveChannelIngressEffectiveAllowFromLists(params) {
	const allowFrom = Array.isArray(params.allowFrom) ? params.allowFrom : void 0;
	const groupAllowFrom = Array.isArray(params.groupAllowFrom) ? params.groupAllowFrom : void 0;
	return {
		effectiveAllowFrom: normalizeStringEntries(mergeDmAllowFromSources({
			allowFrom,
			storeAllowFrom: Array.isArray(params.storeAllowFrom) ? params.storeAllowFrom : void 0,
			dmPolicy: params.dmPolicy ?? void 0
		})),
		effectiveGroupAllowFrom: normalizeStringEntries(resolveGroupAllowFromSources({
			allowFrom,
			groupAllowFrom,
			fallbackToAllowFrom: params.groupAllowFromFallbackToAllowFrom ?? void 0
		}))
	};
}
//#endregion
export { resolveDualTextControlCommandGate as i, resolveCommandAuthorizedFromAuthorizers as n, resolveControlCommandGate as r, resolveChannelIngressEffectiveAllowFromLists as t };
