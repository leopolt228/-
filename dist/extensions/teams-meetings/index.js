import { c as normalizeOptionalString } from "../../string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import { a as addTimerTimeoutGraceMs } from "../../number-coercion-Crk_c9KW.js";
import { _ as uniqueStrings } from "../../string-normalization-CRyoFBPt.js";
import { r as formatErrorMessage } from "../../errors-DdbcjW1Y.js";
import { t as sleep } from "../../sleep-Ce8zcpEF.js";
import { n as normalizeAgentId } from "../../agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey } from "../../session-key-Drrs61Fd.js";
import { c as resolveDefaultAgentId } from "../../agent-scope-config-S7z_Yn4H.js";
import { t as ErrorCodes } from "../../gateway-error-details-CLDhuP4F.js";
import { d as readNonNegativeIntegerParam, p as readPositiveIntegerParam } from "../../common-C39GdgQ7.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { i as errorShape } from "../../error-codes-DKVDGU7l.js";
import "../../string-coerce-runtime-DBMkn-gE.js";
import "../../error-runtime-DUxkdoW4.js";
import "../../number-runtime-C6TGSEc_.js";
import "../../runtime-env-BDC_axp1.js";
import "../../routing-C_9uWiFw.js";
import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import "../../agent-runtime-Bt1w9GKE.js";
import { n as callGatewayFromCli } from "../../gateway-rpc-BeSn3X6s.js";
import "../../gateway-runtime-BpblXBwU.js";
import "../../channel-actions-CkrqGkMr.js";
import { A as startMeetingRealtimeEngine, D as createNodeMeetingRealtimeAudioTransport, E as MeetingSessionRuntime, O as createLocalMeetingRealtimeAudioTransport, S as recoverMeetingBrowserTab, T as resolveLocalMeetingBrowserRequest, _ as resolveMeetingBrowserNode, a as createMeetingSetupStatus, b as readMeetingTranscriptWithBrowser, f as consultMeetingAgent, h as callMeetingBrowserProxyOnNode, i as addMeetingSetupCheck, k as startMeetingAgentRealtimeEngine, m as resolveMeetingRealtimeTools, n as createMeetingBrowserNodeInvokePolicy, p as handleMeetingRealtimeConsultToolCall, t as createMeetingNodeHost, v as resolveMeetingBrowserNodeInfo, x as openMeetingWithBrowser, y as leaveMeetingWithBrowser } from "../../meeting-runtime-BU1dxXzu.js";
import { i as resolveTeamsMeetingsGatewayOperationTimeoutMs, n as DEFAULT_TEAMS_MEETINGS_AUDIO_OUTPUT_COMMAND, r as resolveTeamsMeetingsConfig, t as DEFAULT_TEAMS_MEETINGS_AUDIO_INPUT_COMMAND } from "../../config-QB9c4UAG.js";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { Type } from "typebox";
//#region extensions/teams-meetings/src/transports/chrome-audio-device.ts
const TEAMS_MEETINGS_SYSTEM_PROFILER_COMMAND = "/usr/sbin/system_profiler";
function outputMentionsBlackHole2ch(output) {
	return /\bBlackHole\s+2ch\b/i.test(output);
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-selectors.ts
const TEAMS_MEETING_SELECTORS = {
	continueInBrowser: [
		"[data-tid=\"joinOnWeb\"]",
		"[data-tid=\"joinOnWebButton\"]",
		"button[data-tid=\"continue-on-browser\"]"
	],
	guestName: [
		"input[data-tid=\"prejoin-display-name-input\"]",
		"[data-tid=\"prejoin-display-name-input\"] input",
		"input[data-tid=\"guest-name-input\"]"
	],
	join: [
		"button[data-tid=\"prejoin-join-button\"]",
		"[data-tid=\"prejoin-join-button\"] button",
		"button[data-tid=\"join-now\"]",
		"button[data-tid=\"join-button\"]"
	],
	microphone: [
		"button[data-tid=\"toggle-mute\"]",
		"[data-tid=\"toggle-mute\"] button",
		"input[data-tid=\"toggle-mute\"]",
		"[data-tid=\"toggle-mute\"][role=\"switch\"]",
		"button[data-tid=\"microphone-button\"]"
	],
	camera: [
		"button[data-tid=\"toggle-video\"]",
		"[data-tid=\"toggle-video\"] button",
		"input[data-tid=\"toggle-video\"]",
		"[data-tid=\"toggle-video\"][role=\"switch\"]",
		"button[data-tid=\"camera-button\"]"
	],
	deviceSettings: [
		"button#audio-button-configure",
		"button[aria-label=\"Open audio options\"]",
		"button[data-tid=\"prejoin-device-settings-button\"]",
		"button[data-tid=\"device-settings-button\"]",
		"button[data-tid=\"audio-device-settings-button\"]"
	],
	microphoneDevice: [
		"button[data-tid=\"selected-microphone-display\"]",
		"[data-tid=\"microphone-select\"]",
		"[data-tid=\"audio-device-input\"]",
		"[data-tid=\"device-settings-microphone\"] [role=\"combobox\"]",
		"select[data-tid=\"microphone-select\"]"
	],
	microphoneDeviceMenu: ["[data-tid=\"microphone-settings\"][role=\"listbox\"]"],
	selectedMicrophoneDevice: ["option:checked", "[role=\"option\"][aria-selected=\"true\"]"],
	audioDeviceOptions: ["option", "[role=\"option\"]"],
	leave: [
		"button#hangup-button",
		"button[data-tid=\"call-hangup\"]",
		"[data-tid=\"call-hangup\"] button",
		"button[data-tid=\"hangup-button\"]",
		"button[data-tid=\"call-hangup-button\"]"
	],
	leaveConfirmation: [
		"button[data-tid=\"confirm-leave-button\"]",
		"button[data-tid=\"leave-meeting-confirm\"]",
		"button[data-tid=\"leave-call-confirm\"]"
	],
	postCall: [
		"button[data-tid=\"anon-meeting-end-screen-rejoin-button\"]",
		"[data-tid=\"call-ended-screen\"]",
		"[data-tid=\"post-call-screen\"]",
		"button[data-tid=\"prejoin-rejoin-button\"]"
	],
	lobby: ["[data-tid=\"lobby-screen\"]", "[data-tid=\"lobby-waiting-screen\"]"],
	signIn: [
		"button[data-tid=\"signin-button\"]",
		"button[data-tid=\"sign-in-button\"]",
		"[data-tid=\"auth-signin\"]"
	],
	permissionPrompt: [
		"[data-tid=\"device-permission-prompt\"]",
		"[data-tid=\"media-permission-prompt\"]",
		"[data-tid=\"browser-permission-error\"]"
	],
	moreActions: ["button[aria-label=\"More\"]"],
	captions: ["button#closed-captions-button", "[role=\"menuitem\"][title*=\"captions\" i]"],
	captionsOff: ["button[data-tid=\"closed-captions-turn-off-button\"]", "button#captions-panel-dismiss-button"],
	captionRenderer: ["[data-tid=\"closed-caption-renderer-wrapper\"]"],
	captionContent: ["[data-tid=\"closed-caption-v2-virtual-list-content\"]"],
	captionRows: ["div[role=\"log\"]"],
	captionAuthor: ["[data-tid=\"author\"]"],
	captionText: ["[data-tid=\"closed-caption-text\"]"]
};
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-status-call-source.ts
const TEAMS_MEETING_CAPTION_SETTLE_MS = 1e3;
const TEAMS_MEETING_TRANSCRIPT_MAX_LINES$2 = 500;
function teamsMeetingStatusCallSource() {
	return `  let audioOutputRouted;
  let audioOutputDeviceLabel;
  let audioOutputRouteError;
  let audioOutputRouteRetryable = false;
  if (inCall && allowMicrophone && navigator.mediaDevices?.enumerateDevices) {
    const media = [...document.querySelectorAll("audio, video")].filter(
      (element) =>
        typeof element.setSinkId === "function" &&
        !String(element.id || "").startsWith("openclaw-teams-audio-output-"),
    );
    if (media.length > 0) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const output = devices.find((device) => device.kind === "audiooutput" && isBlackHole(device.label));
        if (output?.deviceId) {
          const routeErrors = [];
          const liveStream = (element) =>
            element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
              ? element.srcObject
              : undefined;
          const allBridgeEntries = Array.isArray(window.__openclawTeamsAudioOutputs)
            ? window.__openclawTeamsAudioOutputs
            : [];
          const retainedBridgeEntries = allBridgeEntries.filter((entry) => !bridgeOwnedBySession(entry));
          const previousBridgeEntries = allBridgeEntries.filter(bridgeOwnedBySession);
          const originalMuteBySource = new Map(previousBridgeEntries.flatMap((entry) =>
            bridgeSources(entry).flatMap((source) =>
              source?.element ? [[source.element, Boolean(source.muted)]] : []
            )
          ));
          const bridgedElements = new Set(previousBridgeEntries.flatMap((entry) =>
            bridgeSources(entry).map((source) => source?.element).filter(Boolean)
          ));
          const routeCandidates = media
            .map((element) => ({ element, stream: liveStream(element) }))
            // Teams mutes local/self-view and intentionally suppressed playback. Preserve
            // that product decision; only our own already-bridged source stays eligible.
            .filter((entry) => !entry.element.muted || bridgedElements.has(entry.element));
          // The self-view often exists before Teams attaches remote playback. With the
          // required output present, an all-filtered list is still a transient DOM state.
          if (routeCandidates.length === 0) audioOutputRouteRetryable = true;
          if (canMutateSession) {
            for (const { element } of routeCandidates) {
              if (!originalMuteBySource.has(element)) {
                originalMuteBySource.set(element, Boolean(element.muted));
              }
              // Sink changes are asynchronous. Silence the physical output until either
              // the source or its fallback bridge is confirmed on BlackHole.
              element.muted = true;
            }
          }
          const currentSources = new Set(routeCandidates.map((entry) => entry.element));
          const bridgeEntries = previousBridgeEntries.filter((entry) =>
            entry?.source &&
            entry?.stream === liveStream(entry.source) &&
            entry?.bridge?.isConnected &&
            currentSources.has(entry.source)
          );
          const suspendedBySource = new Map();
          for (const entry of previousBridgeEntries) {
            if (bridgeEntries.includes(entry)) continue;
            for (const source of bridgeSources(entry)) {
              if (
                !source?.element ||
                source.muted ||
                !bridgeSourceMatches(source.element, source)
              ) continue;
              const sourceStillPresent = currentSources.has(source.element);
              const detachedLiveSource = !sourceStillPresent && Boolean(liveStream(source.element));
              if (!sourceStillPresent && !detachedLiveSource) continue;
              suspendedBySource.set(source.element, {
                detached: detachedLiveSource,
                sessionId: entry.sessionId || sessionId,
                source: source.element,
                sourceMuted: false,
                sourceUrl: mediaSourceUrl(source.element) || source.url,
                stream: source.element.srcObject,
                suspended: true,
              });
            }
          }
          if (canMutateSession) {
            // One bridge owns one Teams playback element. Stream or element replacement
            // retires that bridge so it cannot keep playing or satisfy route verification.
            previousBridgeEntries.filter((entry) => !bridgeEntries.includes(entry)).forEach((entry) => {
              for (const source of bridgeSources(entry)) {
                if (
                  !source?.element ||
                  suspendedBySource.has(source.element) ||
                  currentSources.has(source.element)
                ) continue;
                restoreAudioBridgeSource(source);
              }
              // Reused current elements stay silent until this pass confirms their
              // replacement source; unrelated exact sources were restored above.
              retireAudioBridge(entry, false);
            });
          }
          const routed = [];
          for (const { element, stream } of routeCandidates) {
            let entry = bridgeEntries.find((candidate) => candidate.source === element);
            let elementRouted = element.sinkId === output.deviceId;
            let directRouteError;
            if (canMutateSession && !elementRouted) {
              try {
                await element.setSinkId(output.deviceId);
                elementRouted = element.sinkId === output.deviceId;
              } catch (error) {
                directRouteError = {
                  message: error?.message || String(error),
                  retryable: error?.name === "AbortError",
                };
              }
            }
            if (elementRouted && entry && canMutateSession) {
              const bridgedIndex = bridgeEntries.indexOf(entry);
              if (bridgedIndex >= 0) {
                const [bridged] = bridgeEntries.splice(bridgedIndex, 1);
                retireAudioBridge(bridged);
                entry = undefined;
              }
            }
            // Direct sink routing is valid for src/MediaSource and pre-attachment elements.
            // A live MediaStream is required only when the hidden bridge fallback is needed.
            if (elementRouted) {
              if (canMutateSession && originalMuteBySource.has(element)) {
                element.muted = originalMuteBySource.get(element);
              }
              suspendedBySource.delete(element);
              routed.push(true);
              continue;
            }
            if (!stream) {
              const hasLoadedPlaybackSource = Number(element.readyState) > 0;
              routed.push(false);
              if (hasLoadedPlaybackSource && directRouteError) routeErrors.push(directRouteError);
              if (!hasLoadedPlaybackSource) audioOutputRouteRetryable = true;
              if (canMutateSession && originalMuteBySource.get(element) === false) {
                // Teams may attach the remote MediaStream after creating its media element.
                // Keep it silent until a later serialized status poll routes that source.
                suspendedBySource.set(element, {
                  sessionId,
                  pending: true,
                  source: element,
                  sourceMuted: false,
                  sourceUrl: mediaSourceUrl(element),
                  stream: element.srcObject,
                  suspended: true,
                });
              }
              continue;
            }
            if (!elementRouted && stream) {
              if (!entry && canMutateSession) {
                const bridge = document.createElement("audio");
                bridge.id = "openclaw-teams-audio-output-" + bridgeEntries.length;
                bridge.autoplay = false;
                bridge.hidden = true;
                bridge.srcObject = stream;
                document.body.appendChild(bridge);
                entry = {
                  bridge,
                  playing: false,
                  sessionId,
                  source: element,
                  sourceMuted: originalMuteBySource.has(element)
                    ? originalMuteBySource.get(element)
                    : Boolean(element.muted),
                  sourceUrl: mediaSourceUrl(element),
                  stream,
                };
                bridgeEntries.push(entry);
                suspendedBySource.delete(element);
              }
              if (entry?.bridge) {
                try {
                  if (canMutateSession) {
                    if (entry.bridge.sinkId !== output.deviceId) {
                      await entry.bridge.setSinkId(output.deviceId);
                    }
                    await entry.bridge.play();
                    entry.playing = true;
                  }
                  elementRouted =
                    entry.bridge.sinkId === output.deviceId && entry.playing === true;
                  if (elementRouted) {
                    suspendedBySource.delete(element);
                    if (canMutateSession && !entry.sourceMuted) element.muted = true;
                  }
                } catch (error) {
                  entry.playing = false;
                  if (canMutateSession) retireAudioBridge(entry, false);
                  routeErrors.push({
                    message: error?.message || String(error),
                    retryable: error?.name === "AbortError",
                  });
                }
              }
            }
            routed.push(elementRouted);
          }
          if (canMutateSession) {
            const nextBridgeEntries = [
              ...retainedBridgeEntries,
              ...bridgeEntries,
              ...suspendedBySource.values(),
            ];
            if (nextBridgeEntries.length > 0) {
              window.__openclawTeamsAudioOutputs = nextBridgeEntries;
            } else {
              delete window.__openclawTeamsAudioOutputs;
            }
          }
          audioOutputRouted = routed.length > 0 && routed.every(Boolean);
          if (canMutateSession && !audioOutputRouted) suspendOwnedAudioBridges();
          if (audioOutputRouted && bridgeEntries.length > 0) {
            notes.push("Routed Teams remote audio to BlackHole 2ch through MediaStream bridges.");
          }
          audioOutputDeviceLabel = output.label || "BlackHole 2ch";
          // An unloaded Teams media element can reject setSinkId before its stream
          // arrives. Keep that state retryable; loaded-source failures are terminal.
          if (!audioOutputRouted && routed.length > 0 && routeErrors.length > 0) {
            audioOutputRouteError = routeErrors[routeErrors.length - 1]?.message;
            audioOutputRouteRetryable = routeErrors.every((error) => error.retryable === true);
          }
        } else {
          audioOutputRouted = false;
          if (canMutateSession) suspendOwnedAudioBridges();
          notes.push("BlackHole 2ch speaker output was not visible to Teams.");
        }
      } catch (error) {
        audioOutputRouted = false;
        audioOutputRouteError = error?.message || String(error);
        if (canMutateSession) suspendOwnedAudioBridges();
      }
      if (!audioOutputRouted && audioOutputRouteError) {
        notes.push("Could not route Teams speaker output to BlackHole 2ch: " + audioOutputRouteError);
      }
    } else {
      audioOutputRouted = false;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const output = devices.find(
          (device) => device.kind === "audiooutput" && isBlackHole(device.label)
        );
        if (output?.deviceId) {
          // Teams can briefly remove every media element during an in-call rerender.
          // Retry only after proving the required output still exists.
          audioOutputRouteRetryable = true;
          audioOutputDeviceLabel = output.label || "BlackHole 2ch";
        } else {
          notes.push("BlackHole 2ch speaker output was not visible to Teams.");
        }
      } catch (error) {
        audioOutputRouteError = error?.message || String(error);
        notes.push("Could not inspect Teams speaker outputs: " + audioOutputRouteError);
      }
      // Suspend ownership until the source returns; call teardown retires it.
      if (canMutateSession) suspendOwnedAudioBridges();
    }
  } else if (inCall && allowMicrophone) {
    audioOutputRouted = false;
    if (canMutateSession) retireOwnedAudioBridges();
  }
  let captioning = false;
  let captionsEnabledAttempted = false;
  let transcriptLines = 0;
  let lastCaptionAt;
  let lastCaptionSpeaker;
  let lastCaptionText;
  let recentTranscript = [];
  const captionState = (() => {
    let active = window.__openclawTeamsCaptions;
    const activeOwnedByRequest = Boolean(
      !active || (sessionId && (!active.sessionId || active.sessionId === sessionId))
    );
    if (!identityVerified) {
      if (identityAwaitingRerender && activeOwnedByRequest) return active;
      if (canMutateSession && activeOwnedByRequest) finalizeOwnedCaptions();
      return undefined;
    }
    if (!activeOwnedByRequest) {
      const replacedPriorOwner = Boolean(
        canMutateSession &&
        active?.sessionId &&
        active.sessionId !== sessionId
      );
      if (replacedPriorOwner) {
        if (priorMeeting?.sessionId === active.sessionId) {
          active.identity ||= priorMeeting.identity;
        }
        finalizeCaptionState(active);
      }
      else if (!canMutateSession || !captureCaptions || active?.finalized !== true) return undefined;
      archiveFinalizedCaptions(active);
      if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active.observer?.disconnect?.();
      delete window.__openclawTeamsCaptions;
      active = undefined;
    }
    if (!captureCaptions) {
      if (!canMutateSession) return undefined;
      if (active?.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active?.observer?.disconnect?.();
      if (active) delete window.__openclawTeamsCaptions;
      return undefined;
    }
    if (!inCall && !active) return undefined;
    if (!active && !canMutateSession) return undefined;
    if (!active) {
      if (active?.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active?.observer?.disconnect?.();
      window.__openclawTeamsCaptions = {
        sessionId,
        identity: expectedIdentity,
        epoch: crypto.randomUUID(),
        enabledAttempted: false,
        observerInstalled: false,
        observer: undefined,
        droppedLines: 0,
        lines: [],
        settled: [],
        settleTimer: undefined,
        visible: [],
      };
    }
    return window.__openclawTeamsCaptions;
  })();
  const normalizeCaption = (speaker, captionText) => {
    if (!captionState) return undefined;
    const clean = String(captionText || "").replace(/\\s+/g, " ").trim();
    const cleanSpeaker = String(speaker || "").replace(/\\s+/g, " ").trim();
    if (!clean) return undefined;
    return { speaker: cleanSpeaker || undefined, text: clean };
  };
  const captionRowIdentity = (row) =>
    // aria-posinset identifies the logical caption item across virtual-list
    // rerenders. DOM ids and data indexes can belong to the recycled element.
    ["aria-posinset"]
      .map((name) => {
        const value = row?.getAttribute?.(name);
        return typeof value === "string" && value.trim()
          ? name + ":" + value.trim()
          : undefined;
      })
      .find(Boolean);
  const sameCaptionUtterance = (prior, current) => {
    if (prior.rowIdentity || current.rowIdentity) {
      return Boolean(
        prior.rowIdentity &&
        current.rowIdentity &&
        prior.rowIdentity === current.rowIdentity
      );
    }
    if (prior.speaker && current.speaker && prior.speaker !== current.speaker) return false;
    return prior.node === current.node;
  };
  const commitCaptionLines = (state, entries) => {
    state.lines.push(...entries.map((entry) => {
      entry.utteranceId ||= crypto.randomUUID();
      return {
        at: entry.at,
        speaker: entry.speaker,
        text: entry.text,
        utteranceId: entry.utteranceId,
      };
    }));
    const excess = state.lines.length - ${TEAMS_MEETING_TRANSCRIPT_MAX_LINES$2};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  };
  const sameCaptionRow = (left, right) =>
    right.rowIdentity
      ? left.rowIdentity === right.rowIdentity
      : left.node === right.node;
  const retainSettledCaptionLines = (state, entries) => {
    const settled = [...state.settled];
    for (const entry of entries) {
      const priorIndex = settled.findIndex((candidate) => sameCaptionRow(candidate, entry));
      if (priorIndex >= 0) settled.splice(priorIndex, 1, { ...entry });
      else settled.push({ ...entry });
    }
    const retainedLineIds = new Set(state.lines.map((entry) => entry.utteranceId));
    state.settled = settled.filter((entry) => retainedLineIds.has(entry.utteranceId));
  };
  const scheduleCaptionSettle = () => {
    if (!captionState || captionState.visible.length === 0) return;
    if (captionState.settleTimer !== undefined) clearTimeout(captionState.settleTimer);
    const pendingState = captionState;
    pendingState.settleTimer = setTimeout(() => {
      if (window.__openclawTeamsCaptions !== pendingState) return;
      commitCaptionLines(pendingState, pendingState.visible);
      retainSettledCaptionLines(pendingState, pendingState.visible);
      pendingState.visible = [];
      pendingState.settleTimer = undefined;
    }, ${TEAMS_MEETING_CAPTION_SETTLE_MS});
  };
  const captionCaptureMatchesCurrentMeeting = () => {
    if (
      !captionState ||
      captionState.finalized === true ||
      window.__openclawTeamsCaptions !== captionState
    ) return false;
    const observedIdentity = meetingIdentity(location.href);
    const observedMeeting = window.__openclawTeamsMeeting;
    const identityConflicts = Boolean(
      observedIdentity && expectedIdentity && observedIdentity !== expectedIdentity
    );
    const sessionConflicts = Boolean(
      observedMeeting?.sessionId && sessionId && observedMeeting.sessionId !== sessionId
    );
    if (identityConflicts || sessionConflicts) {
      // The observer outlives Teams SPA navigation. Freeze the old buffer before
      // any caption nodes from the replacement meeting can be attributed to it.
      finalizeOwnedCaptions();
      return false;
    }
    if (observedIdentity === expectedIdentity) return true;
    const observedMarkerAgeMs = Date.now() - (observedMeeting?.verifiedAt || 0);
    const observedAwaitingRerender = Boolean(
      !observedIdentity &&
      observedMeeting?.identity === expectedIdentity &&
      (!observedMeeting.sessionId || !sessionId || observedMeeting.sessionId === sessionId) &&
      observedMeeting.inCallControl?.isConnected === false &&
      observedMeeting.inCallUrl === location.href &&
      observedMarkerAgeMs >= 0 &&
      observedMarkerAgeMs < 5_000
    );
    if (observedAwaitingRerender) return true;
    return Boolean(
      observedMeeting?.identity === expectedIdentity &&
      (!observedMeeting.sessionId || !sessionId || observedMeeting.sessionId === sessionId) &&
      observedMeeting.inCallControl?.isConnected !== false &&
      observedMeeting.inCallUrl === location.href
    );
  };
  const scrapeCaptions = (mutations = []) => {
    if (!captionCaptureMatchesCurrentMeeting()) return;
    const content = firstRaw(selectors.captionContent);
    const rows = content
      ? selectors.captionRows.flatMap((selector) => [...content.querySelectorAll(selector)])
      : [];
    captionState.settled = Array.isArray(captionState.settled) ? captionState.settled : [];
    const removedNodes = mutations.flatMap((mutation) => [...(mutation.removedNodes || [])]);
    const rowWasRemoved = (entry) => removedNodes.some((node) =>
      node === entry.node || node?.contains?.(entry.node)
    );
    const removedVisible = captionState.visible.filter(rowWasRemoved);
    if (removedVisible.length > 0) {
      if (captionState.settleTimer !== undefined) clearTimeout(captionState.settleTimer);
      captionState.settleTimer = undefined;
      captionState.visible = captionState.visible.filter((entry) => !rowWasRemoved(entry));
      commitCaptionLines(captionState, removedVisible);
      retainSettledCaptionLines(captionState, removedVisible);
    }
    const retainedLineIds = new Set(captionState.lines.map((entry) => entry.utteranceId));
    captionState.settled = captionState.settled.filter((entry) =>
      entry.rowIdentity
        ? retainedLineIds.has(entry.utteranceId)
        : !rowWasRemoved(entry) && rows.some((row) => sameCaptionRow(entry, {
            node: row,
            rowIdentity: captionRowIdentity(row),
          }))
    );
    const parsedRows = rows.flatMap((row) => {
      const speaker = text(firstWithin(row, selectors.captionAuthor));
      const captionText = text(firstWithin(row, selectors.captionText));
      const parsed = normalizeCaption(speaker, captionText);
      if (!parsed) return [];
      const current = { ...parsed, node: row, rowIdentity: captionRowIdentity(row) };
      const settledIndex = captionState.settled.findIndex((entry) =>
        sameCaptionRow(entry, current)
      );
      const settled = settledIndex >= 0 ? captionState.settled[settledIndex] : undefined;
      if (
        settled &&
        settled.text === current.text &&
        (settled.speaker || "") === (current.speaker || "")
      ) return [];
      if (settled?.rowIdentity && settled.rowIdentity === current.rowIdentity) {
        const committed = captionState.lines.find((entry) =>
          entry.utteranceId === settled.utteranceId
        );
        if (committed) {
          committed.speaker = current.speaker || committed.speaker;
          committed.text = current.text;
        }
        captionState.settled.splice(settledIndex, 1, {
          ...settled,
          ...current,
          speaker: current.speaker || settled.speaker,
        });
        return [];
      }
      if (settledIndex >= 0) captionState.settled.splice(settledIndex, 1);
      return [current];
    });
    if (parsedRows.length === 0) {
      if (captionState.visible.length > 0 && captionState.settleTimer === undefined) {
        scheduleCaptionSettle();
      }
      return;
    }
    const unmatchedPrevious = [...captionState.visible];
    const nextVisible = [];
    const now = Date.now();
    let captionChanged = false;
    for (const row of parsedRows) {
      const priorIndex = unmatchedPrevious.findIndex((candidate) =>
        row.rowIdentity
          ? candidate.rowIdentity === row.rowIdentity
          : candidate.node === row.node
      );
      const candidate = priorIndex >= 0 ? unmatchedPrevious[priorIndex] : undefined;
      const prior = candidate && sameCaptionUtterance(candidate, row)
        ? unmatchedPrevious.splice(priorIndex, 1)[0]
        : undefined;
      if (prior) {
        captionChanged ||=
          prior.text !== row.text ||
          prior.speaker !== row.speaker ||
          prior.node !== row.node;
        prior.speaker = row.speaker || prior.speaker;
        prior.text = row.text;
        prior.node = row.node;
        prior.rowIdentity = row.rowIdentity || prior.rowIdentity;
        prior.seenAt = now;
        nextVisible.push(prior);
      } else {
        captionChanged = true;
        nextVisible.push({
          at: new Date().toISOString(),
          node: row.node,
          rowIdentity: row.rowIdentity,
          seenAt: now,
          speaker: row.speaker,
          text: row.text,
        });
      }
    }
    captionChanged ||= unmatchedPrevious.length > 0;
    commitCaptionLines(captionState, unmatchedPrevious);
    retainSettledCaptionLines(captionState, unmatchedPrevious);
    captionState.visible = nextVisible;
    // Identity-less rows stay mutable while rendered; removal is their only
    // reliable utterance boundary. Stable logical rows may settle on quiet.
    if (
      (captionChanged || captionState.settleTimer === undefined) &&
      captionState.visible.every((entry) => entry.rowIdentity)
    ) {
      scheduleCaptionSettle();
    }
  };
  if (captionState) {
    const captionsFinalized = captionState.finalized === true;
    let captionsEnabledNow = captionsFinalized
      ? Boolean(captionState.enabledAttempted)
      : Boolean(firstRaw(selectors.captionRenderer) || firstRaw(selectors.captionsOff));
    if (!captionsFinalized && canMutateSession && inCall && !captionsEnabledNow) {
      let captionButton = first(selectors.captions);
      if (!captionButton) {
        first(selectors.moreActions)?.click?.();
        await waitForUi();
        captionButton = first(selectors.captions);
      }
      if (captionButton) {
        const captionLabel = label(captionButton);
        const alreadyEnabled = captionButton.getAttribute?.("aria-checked") === "true" ||
          /hide live captions|turn off captions/i.test(captionLabel) ||
          Boolean(firstRaw(selectors.captionsOff));
        if (!alreadyEnabled) {
          captionButton.click();
          await waitForUi();
        }
        const currentLabel = label(captionButton);
        captionsEnabledNow = captionButton.getAttribute?.("aria-checked") === "true" ||
          /hide live captions|turn off captions/i.test(currentLabel) ||
          Boolean(firstRaw(selectors.captionRenderer)) ||
          Boolean(firstRaw(selectors.captionsOff));
        if (captionsEnabledNow && !alreadyEnabled) {
          notes.push("Enabled Teams live captions for transcript capture.");
        }
      }
    }
    if (!captionsFinalized && canMutateSession) captionState.enabledAttempted = captionsEnabledNow;
    captionsEnabledAttempted = Boolean(captionState.enabledAttempted);
    if (!captionsFinalized && canMutateSession && inCall && !captionState.observerInstalled) {
      captionState.observerInstalled = true;
      captionState.observer = new MutationObserver(scrapeCaptions);
      captionState.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      notes.push("Installed Teams live-caption observer.");
    }
    if (!captionsFinalized && canMutateSession && inCall) scrapeCaptions();
    const allLines = [...captionState.lines, ...captionState.visible];
    const lines = allLines.slice(-${TEAMS_MEETING_TRANSCRIPT_MAX_LINES$2});
    const last = lines[lines.length - 1];
    captioning = captionsEnabledNow;
    transcriptLines = (captionState.droppedLines || 0) + allLines.length;
    lastCaptionAt = last?.at;
    lastCaptionSpeaker = last?.speaker;
    lastCaptionText = last?.text;
    recentTranscript = lines.slice(-5).map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text,
    }));
  }
  if (inCall && allowMicrophone && !manualActionReason) {
    if (audioInputRouted !== true || audioOutputRouted !== true) {
      manualActionReason = "teams-audio-choice-required";
      manualActionMessage = "Verify BlackHole 2ch is selected as both the Teams microphone and speaker before starting talk-back.";
    } else if (micMuted !== false) {
      manualActionReason = "teams-microphone-required";
      manualActionMessage = "Unmute the Teams microphone and verify the microphone control shows it is on before starting talk-back.";
    }
  }
  return JSON.stringify({
    clickedContinueInBrowser: Boolean(continueInBrowser),
    clickedJoin,
    inCall,
    micMuted,
    cameraOff,
    lobbyWaiting,
    captionCaptureRequested: captureCaptions,
    captioning,
    captionsEnabledAttempted,
    transcriptLines,
    lastCaptionAt,
    lastCaptionSpeaker,
    lastCaptionText,
    recentTranscript,
    audioInputRouted,
    audioInputDeviceLabel,
    audioInputRouteError,
    audioOutputRouted,
    audioOutputDeviceLabel,
    audioOutputRouteError,
    audioOutputRouteRetryable,
    manualActionRequired: Boolean(manualActionReason),
    manualActionReason,
    manualActionMessage,
    title: document.title,
    url: location.href,
    notes,
  });
}`;
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-status-prejoin-source.ts
const TEAMS_MEETING_TRANSCRIPT_MAX_LINES$1 = 500;
function teamsMeetingStatusPreludeSource(params) {
	const selectors = params.selectors;
	const expectedIdentity = params.expectedIdentity;
	const toggleStateFunction = params.toggleStateFunction;
	const pageIdentityFunctionSource = () => params.pageIdentitySource;
	return `async () => {
  ${pageIdentityFunctionSource()}
  const parseToggleState = ${toggleStateFunction};
  const selectors = ${selectors};
  const expectedIdentity = ${JSON.stringify(expectedIdentity)};
  const allowMicrophone = ${JSON.stringify(params.allowMicrophone)};
  const allowSessionAdoption = ${JSON.stringify(params.allowSessionAdoption)};
  const autoJoin = ${JSON.stringify(params.autoJoin)};
  const captureCaptions = ${JSON.stringify(params.captureCaptions)};
  const readOnly = ${JSON.stringify(Boolean(params.readOnly))};
  const sessionId = ${JSON.stringify(params.meetingSessionId)};
  const identityRetentionMs = ${JSON.stringify(Math.max(3e4, params.waitForInCallMs))};
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const label = (node) => [
    node?.getAttribute?.("aria-label"),
    node?.getAttribute?.("title"),
    node?.getAttribute?.("data-tid"),
    text(node),
  ].filter(Boolean).join(" ");
  const clickable = (node) => node?.matches?.("button")
    ? node
    : node?.querySelector?.("button") || node?.closest?.("button") || node;
  const first = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (node) return clickable(node);
    }
    return undefined;
  };
  const firstRaw = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return undefined;
  };
  const firstWithin = (root, list) => {
    if (!root) return undefined;
    for (const selector of list) {
      if (root.matches?.(selector)) return root;
      const node = root.querySelector?.(selector);
      if (node) return node;
    }
    return undefined;
  };
  const buttons = [...document.querySelectorAll("button")];
  const findTextButton = (pattern) => buttons.find((button) => !button.disabled && pattern.test(label(button)));
  const waitForUi = () => new Promise((resolve) => setTimeout(resolve, 120));
  const bridgeOwnedBySession = (entry) => Boolean(
    sessionId && (!entry?.sessionId || entry.sessionId === sessionId)
  );
  const mediaSourceUrl = (element) => String(element?.currentSrc || element?.src || "");
  const bridgeSources = (entry) => Array.isArray(entry?.sources)
    ? entry.sources
    : entry?.source
      ? [{ element: entry.source, muted: Boolean(entry.sourceMuted), pending: Boolean(entry.pending), stream: entry.stream, url: entry.sourceUrl }]
      : [];
  const bridgeSourceMatches = (element, source) => {
    if (!element) return false;
    if (source?.pending && mediaSourceIsEmpty(element) && !source.stream && !source.url) return true;
    if (source?.stream || element.srcObject) return element.srcObject === source?.stream;
    const currentUrl = mediaSourceUrl(element);
    return Boolean(source?.url && currentUrl && source.url === currentUrl);
  };
  const mediaSourceIsEmpty = (element) => Boolean(
    element && !element.srcObject && !mediaSourceUrl(element)
  );
  const restoreAudioBridgeSource = (source) => {
    const element = source?.element;
    // An empty element may receive a replacement source after cleanup. Keep it
    // silent because there is no source identity that is safe to restore.
    if (mediaSourceIsEmpty(element)) {
      element.muted = true;
      return;
    }
    // Teams reuses media elements across source changes. Restore only the exact
    // source this bridge muted.
    if (!bridgeSourceMatches(element, source)) return;
    const detachedLiveSource = Boolean(
      element.isConnected === false &&
      element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
    );
    if (detachedLiveSource) {
      element.muted = true;
      element.pause?.();
      element.srcObject = null;
      return;
    }
    element.muted = Boolean(source.muted);
  };
  const restoreAudioBridgeSources = (entry) => {
    bridgeSources(entry).forEach(restoreAudioBridgeSource);
  };
  const retireAudioBridge = (entry, restoreSources = true) => {
    if (restoreSources) restoreAudioBridgeSources(entry);
    entry?.bridge?.pause?.();
    if (entry?.bridge) entry.bridge.srcObject = null;
    entry?.bridge?.remove?.();
  };
  const retireOwnedAudioBridges = (restoreSources = true) => {
    const entries = Array.isArray(window.__openclawTeamsAudioOutputs)
      ? window.__openclawTeamsAudioOutputs
      : [];
    const retained = [];
    for (const entry of entries) {
      if (!bridgeOwnedBySession(entry)) {
        retained.push(entry);
        continue;
      }
      retireAudioBridge(entry, restoreSources);
    }
    if (retained.length > 0) window.__openclawTeamsAudioOutputs = retained;
    else delete window.__openclawTeamsAudioOutputs;
  };
  const adoptAudioBridgeSourcesForSession = () => {
    const entries = Array.isArray(window.__openclawTeamsAudioOutputs)
      ? window.__openclawTeamsAudioOutputs
      : [];
    const suspendedBySource = new Map();
    for (const entry of entries) {
      for (const source of bridgeSources(entry)) {
        if (!source?.element || suspendedBySource.has(source.element)) continue;
        if (!bridgeSourceMatches(source.element, source)) {
          restoreAudioBridgeSource(source);
          continue;
        }
        suspendedBySource.set(source.element, {
          sessionId,
          source: source.element,
          sourceMuted: Boolean(source.muted),
          sourceUrl: mediaSourceUrl(source.element) || source.url,
          stream: source.element.srcObject,
          suspended: true,
        });
      }
      retireAudioBridge(entry, false);
    }
    const suspended = [...suspendedBySource.values()];
    if (suspended.length > 0) window.__openclawTeamsAudioOutputs = suspended;
    else delete window.__openclawTeamsAudioOutputs;
  };
  const suspendOwnedAudioBridges = () => {
    const entries = Array.isArray(window.__openclawTeamsAudioOutputs)
      ? window.__openclawTeamsAudioOutputs
      : [];
    const retained = [];
    const suspendedBySource = new Map();
    for (const entry of entries) {
      if (!bridgeOwnedBySession(entry)) {
        retained.push(entry);
        continue;
      }
      // This pending entry owns the muted element until a later serialized
      // status poll sees and routes the attached playback source.
      if (
        entry?.pending &&
        bridgeSources(entry).some((source) => bridgeSourceMatches(source?.element, source))
      ) {
        retained.push(entry);
        continue;
      }
      for (const source of bridgeSources(entry)) {
        if (!source?.element || suspendedBySource.has(source.element)) continue;
        if (!bridgeSourceMatches(source.element, source)) {
          restoreAudioBridgeSource(source);
          continue;
        }
        suspendedBySource.set(source.element, {
          sessionId: entry.sessionId || sessionId,
          source: source.element,
          sourceMuted: Boolean(source.muted),
          sourceUrl: source.url,
          stream: source.element.srcObject,
          suspended: true,
        });
      }
      retireAudioBridge(entry, false);
    }
    const next = [...retained, ...suspendedBySource.values()];
    if (next.length > 0) window.__openclawTeamsAudioOutputs = next;
    else delete window.__openclawTeamsAudioOutputs;
  };
  const retireOwnedCaptions = () => {
    const active = window.__openclawTeamsCaptions;
    const owned = Boolean(
      active && sessionId && (!active.sessionId || active.sessionId === sessionId)
    );
    if (!owned) return;
    if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
    active.observer?.disconnect?.();
    delete window.__openclawTeamsCaptions;
  };
  const finalizeCaptionState = (active) => {
    if (!active) return;
    if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
    active.settleTimer = undefined;
    active.observer?.disconnect?.();
    active.observer = undefined;
    active.observerInstalled = false;
    active.lines = Array.isArray(active.lines) ? active.lines : [];
    if (Array.isArray(active.visible) && active.visible.length > 0) {
      active.lines.push(...active.visible.map((entry) => ({
        at: entry.at,
        speaker: entry.speaker,
        text: entry.text,
      })));
      active.visible = [];
    }
    const excess = active.lines.length - ${TEAMS_MEETING_TRANSCRIPT_MAX_LINES$1};
    if (excess > 0) {
      active.lines.splice(0, excess);
      active.droppedLines = (active.droppedLines || 0) + excess;
    }
    active.finalized = true;
    active.finalizedAt = Date.now();
  };
  const archiveFinalizedCaptions = (active) => {
    if (active?.finalized !== true || !active.sessionId) return;
    const archive = window.__openclawTeamsCaptionArchive &&
        typeof window.__openclawTeamsCaptionArchive === "object"
      ? window.__openclawTeamsCaptionArchive
      : {};
    archive[active.sessionId] = active;
    const retained = Object.entries(archive)
      .sort((left, right) => Number(right[1]?.finalizedAt || 0) - Number(left[1]?.finalizedAt || 0))
      .slice(0, 4);
    window.__openclawTeamsCaptionArchive = Object.fromEntries(retained);
  };
  const finalizeOwnedCaptions = () => {
    const active = window.__openclawTeamsCaptions;
    const owned = Boolean(
      active && sessionId && (!active.sessionId || active.sessionId === sessionId)
    );
    if (owned) {
      active.identity ||= priorMeeting?.identity || expectedIdentity;
      finalizeCaptionState(active);
    }
  };
  const toggleState = (node, kind) => parseToggleState({
    kind,
    ariaPressed: node?.getAttribute?.("aria-pressed"),
    ariaChecked: node?.getAttribute?.("aria-checked"),
    checked: typeof node?.checked === "boolean" ? node.checked : undefined,
    label: label(node),
  });
  const notes = [];
  const currentIdentity = meetingIdentity(location.href);
  const priorMeeting = window.__openclawTeamsMeeting;
  if (expectedIdentity && currentIdentity && currentIdentity !== expectedIdentity) {
    // A confirmed SPA transition must stop resources still owned by this
    // request, while preserving any newer session already committed to the tab.
    retireOwnedAudioBridges();
    finalizeOwnedCaptions();
    const requestOwnsMeeting = Boolean(
      priorMeeting &&
      sessionId &&
      (!priorMeeting.sessionId || priorMeeting.sessionId === sessionId)
    );
    if (requestOwnsMeeting) delete window.__openclawTeamsMeeting;
    return JSON.stringify({
      inCall: false,
      manualActionRequired: true,
      manualActionReason: "teams-session-conflict",
      manualActionMessage: "The tracked Teams tab now shows a different meeting. Return to the requested meeting link, then retry.",
      title: document.title,
      url: location.href,
      notes,
    });
  }
  const meetingOwnerConflict = Boolean(
    priorMeeting?.sessionId && priorMeeting.sessionId !== sessionId
  );
  const captionOwnerConflict = Boolean(
    window.__openclawTeamsCaptions?.sessionId &&
    window.__openclawTeamsCaptions.sessionId !== sessionId
  );
  const committedOwnerConflict = meetingOwnerConflict || captionOwnerConflict;
  const canRepairCaptionOwner = Boolean(
    !meetingOwnerConflict && priorMeeting?.sessionId === sessionId
  );
  const canMutateSession = Boolean(
    !readOnly &&
    sessionId &&
    (!committedOwnerConflict || canRepairCaptionOwner || allowSessionAdoption)
  );
  const identityMatchedUrl = Boolean(expectedIdentity && currentIdentity === expectedIdentity);
  const identityVerifiedBeforeCall = identityMatchedUrl;
  const continueInBrowser = first(selectors.continueInBrowser) ||
    findTextButton(/continue on this browser|join on the web|use the web app|continue without the app/i);
  if (canMutateSession && identityVerifiedBeforeCall && continueInBrowser) {
    continueInBrowser.click();
    notes.push("Continued to the Teams web client.");
    await waitForUi();
  }
  const guestInput = first(selectors.guestName) || [...document.querySelectorAll("input")].find((input) =>
    /enter your name|type your name|your name|display name/i.test(label(input) + " " + (input.placeholder || ""))
  );
  if (canMutateSession && identityVerifiedBeforeCall && autoJoin && guestInput && !guestInput.value) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    guestInput.focus();
    if (setter) setter.call(guestInput, ${JSON.stringify(params.guestName)});
    else guestInput.value = ${JSON.stringify(params.guestName)};
    guestInput.dispatchEvent(new Event("input", { bubbles: true }));
    guestInput.dispatchEvent(new Event("change", { bubbles: true }));
  }
  const leave = first(selectors.leave);
  const continueWithoutDevices = findTextButton(/^continue without audio or video$/i);
  let dismissedDevicePrompt = false;
  if (
    canMutateSession &&
    identityVerifiedBeforeCall &&
    !leave &&
    autoJoin &&
    !allowMicrophone &&
    continueWithoutDevices
  ) {
    continueWithoutDevices.click();
    dismissedDevicePrompt = true;
    notes.push("Dismissed the Teams device prompt; selected audio is verified separately.");
    await waitForUi();
  }
  // Teams replaces the meeting URL after admission. Preserve identity only
  // while adopting the first in-call control or retaining that exact control.
  const markerAgeMs = Date.now() - (priorMeeting?.verifiedAt || 0);
  const identityAdoptedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    !priorMeeting?.inCallControl &&
    markerAgeMs >= 0 &&
    markerAgeMs < identityRetentionMs &&
    leave &&
    leave.isConnected !== false
  );
  const identityRerenderedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    priorMeeting?.inCallControl &&
    priorMeeting.inCallControl !== leave &&
    priorMeeting.inCallControl.isConnected === false &&
    priorMeeting?.inCallUrl === location.href &&
    markerAgeMs >= 0 &&
    markerAgeMs < 5_000 &&
    leave &&
    leave.isConnected !== false
  );
  const identityAwaitingRerender = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    priorMeeting?.inCallControl &&
    priorMeeting.inCallControl.isConnected === false &&
    priorMeeting?.inCallUrl === location.href &&
    markerAgeMs >= 0 &&
    markerAgeMs < 5_000 &&
    !leave
  );
  const identityPreservedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    leave &&
    leave.isConnected !== false &&
    (
      identityAdoptedInCall ||
      identityRerenderedInCall ||
      (
        priorMeeting?.inCallControl === leave &&
        priorMeeting?.inCallUrl === location.href
      )
    )
  );
  const identityVerified = identityVerifiedBeforeCall || identityPreservedInCall;
  const inCall = Boolean(identityVerified && leave);
  if (canMutateSession && identityVerified && meetingOwnerConflict) {
    // The tab can survive a Teams SPA meeting/session change. Old hidden bridges
    // must stop, while their muted source streams remain eligible for the new owner.
    adoptAudioBridgeSourcesForSession();
  }
  if (canMutateSession && !inCall && !identityAwaitingRerender) retireOwnedAudioBridges();
  if (canMutateSession && (identityVerifiedBeforeCall || identityPreservedInCall)) {
    window.__openclawTeamsMeeting = {
      ...(priorMeeting?.identity === expectedIdentity && !meetingOwnerConflict ? priorMeeting : {}),
      identity: expectedIdentity,
      sessionId: sessionId || priorMeeting?.sessionId,
      verifiedAt: Date.now(),
      ...(inCall ? { inCallControl: leave, inCallUrl: location.href } : {}),
    };
  } else if (
    canMutateSession &&
    !currentIdentity &&
    priorMeeting &&
    !identityAwaitingRerender &&
    (priorMeeting.inCallControl || markerAgeMs >= identityRetentionMs)
  ) {
    delete window.__openclawTeamsMeeting;
  }
  const microphone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
  let microphoneState = identityVerified ? toggleState(microphone, "microphone") : undefined;
  const camera = first(selectors.camera) || findTextButton(/camera|video/i);
  let cameraState = identityVerified ? toggleState(camera, "camera") : undefined;
  let controlManualActionReason;
  let controlManualActionMessage;
  if (canMutateSession && identityVerified && !inCall && camera && cameraState === "on") {
    camera.click();
    await waitForUi();
    const currentCamera = first(selectors.camera) || findTextButton(/camera|video/i);
    cameraState = toggleState(currentCamera, "camera");
    if (cameraState === "off") {
      notes.push("Turned the Teams camera off before joining.");
    }
  }
  const join = first(selectors.join) || findTextButton(/^\\s*(join now|ask to join|join meeting)\\s*$/i);
  if (identityVerified && !inCall && join && cameraState !== "off") {
    controlManualActionReason = "teams-camera-required";
    controlManualActionMessage = "Turn the Teams camera off and verify the camera control shows it is off, then retry joining.";
  }
  const isBlackHole = (value) =>
    /^blackhole 2ch(?: \\(virtual\\))?$/i.test(String(value || "").replace(/\\s+/g, " ").trim());
  const isBlackHoleNode = (node) => [
    node?.getAttribute?.("aria-label"),
    node?.getAttribute?.("title"),
    node?.label,
    node?.value,
    text(node),
  ].some(isBlackHole);
  const microphoneDeviceRoots = () => {
    // Consumer in-call controls expose the listbox itself, without the prejoin
    // selected-device button/combobox wrapper.
    const control = firstRaw(selectors.microphoneDevice) || firstRaw(selectors.microphoneDeviceMenu);
    if (!control) return { control, roots: [] };
    const roots = [control];
    const scope = control.closest?.('[data-tid="device-settings-microphone"]');
    if (scope && !roots.includes(scope)) roots.push(scope);
    const listboxId = control.getAttribute?.("aria-controls");
    const listbox = listboxId ? document.getElementById?.(listboxId) : undefined;
    if (listbox && !roots.includes(listbox)) roots.push(listbox);
    const liveMenu = firstRaw(selectors.microphoneDeviceMenu);
    if (liveMenu && !roots.includes(liveMenu)) roots.push(liveMenu);
    return { control, roots };
  };
  const selectedMicrophoneLabel = () => {
    const { control, roots } = microphoneDeviceRoots();
    const selectedOption = control?.selectedOptions?.[0];
    if (selectedOption && isBlackHoleNode(selectedOption)) {
      return label(selectedOption) || selectedOption.value;
    }
    if (control && isBlackHoleNode(control)) return label(control) || control.value;
    for (const root of roots) {
      const selected = firstWithin(root, selectors.selectedMicrophoneDevice);
      if (selected && isBlackHoleNode(selected)) {
        return label(selected) || selected.value;
      }
    }
    return undefined;
  };
  let audioInputRouted;
  let audioInputDeviceLabel;
  let audioInputRouteError;
  const ensureVirtualAudioInput = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return false;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const input = devices.find((device) => device.kind === "audioinput" && isBlackHole(device.label));
      if (!input?.deviceId) return false;
      audioInputDeviceLabel = input.label || "BlackHole 2ch";
      // Teams hides the selected-device control after admission. Reopen the in-call audio
      // options and verify the current selection before unmuting; installed devices alone
      // do not prove which microphone Teams is using.
      const preparedInput = window.__openclawTeamsMeeting;
      const preparedSelection = Boolean(
        readOnly &&
        preparedInput?.identity === expectedIdentity &&
        (!sessionId || preparedInput?.sessionId === sessionId) &&
        preparedInput?.audioInputDeviceId === input.deviceId
      );
      let selected = Boolean(selectedMicrophoneLabel()) || preparedSelection;
      if (!selected && canMutateSession) {
        const settings = first(selectors.deviceSettings);
        if (settings) {
          settings.click();
          await waitForUi();
        }
        const { control } = microphoneDeviceRoots();
        if (control?.tagName?.toLowerCase() === "select") {
          const options = [...control.options];
          const option = options.find(isBlackHoleNode);
          if (option) {
            control.value = option.value;
            control.dispatchEvent(new Event("change", { bubbles: true }));
            await waitForUi();
          }
        } else if (control) {
          clickable(control)?.click?.();
          await waitForUi();
        }
        const choices = microphoneDeviceRoots().roots.flatMap((root) =>
          selectors.audioDeviceOptions.flatMap((selector) => [
            ...(root.querySelectorAll?.(selector) || []),
          ])
        );
        const choice = choices.find(isBlackHoleNode);
        if (choice && choice.getAttribute?.("aria-selected") !== "true") {
          clickable(choice)?.click?.();
          await waitForUi();
        }
        selected = Boolean(selectedMicrophoneLabel());
      }
      if (selected && window.__openclawTeamsMeeting?.identity === expectedIdentity) {
        window.__openclawTeamsMeeting.audioInputDeviceId = input.deviceId;
      }
      return selected;
    } catch (error) {
      audioInputRouteError = error?.message || String(error);
      return false;
    }
  };
  if (identityVerified && !inCall && allowMicrophone && microphone) {
    audioInputRouted = await ensureVirtualAudioInput();
    if (!audioInputRouted) {
      if (canMutateSession && microphoneState === "on") {
        microphone.click();
        await waitForUi();
        const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
        microphoneState = toggleState(currentMicrophone, "microphone");
      }
      controlManualActionReason = "teams-audio-choice-required";
      controlManualActionMessage = "Select BlackHole 2ch as the Teams microphone and verify it is selected before enabling talk-back.";
    } else if (canMutateSession && microphoneState === "off") {
      microphone.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "on") {
        notes.push("Unmuted the Teams microphone after verifying BlackHole 2ch input.");
      }
    }
    if (audioInputRouted && microphoneState !== "on") {
      controlManualActionReason = "teams-microphone-required";
      controlManualActionMessage = "Unmute the Teams microphone and verify the microphone control shows it is on, then retry joining.";
    }
  } else if (canMutateSession && identityVerified && !inCall && !allowMicrophone && microphoneState === "on") {
      microphone.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "off") {
        notes.push("Muted the Teams microphone for observe-only mode.");
      }
  }
  if (identityVerified && inCall && allowMicrophone) {
    if (!selectedMicrophoneLabel() && canMutateSession && microphoneState === "on") {
      microphone?.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
    }
    audioInputRouted = await ensureVirtualAudioInput();
    if (audioInputRouted && canMutateSession && microphoneState === "off") {
      microphone?.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
    } else if (!audioInputRouted && canMutateSession && microphoneState === "on") {
      microphone?.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "off") {
        notes.push("Muted the Teams microphone because BlackHole 2ch input could not be reverified.");
      }
    }
  }
  if (identityVerified && !inCall && join && !allowMicrophone && microphoneState !== "off") {
    controlManualActionReason = "teams-microphone-required";
    controlManualActionMessage = "Mute the Teams microphone and verify the microphone control shows it is off, then retry joining.";
  }
  if (identityVerified && !inCall && join && allowMicrophone && !controlManualActionReason) {
    if (!microphone) {
      controlManualActionReason = "teams-microphone-required";
      controlManualActionMessage = "Open Teams device settings and verify the microphone control before enabling talk-back.";
    } else if (audioInputRouted !== true) {
      controlManualActionReason = "teams-audio-choice-required";
      controlManualActionMessage = "Select BlackHole 2ch as the Teams microphone and verify it is selected before enabling talk-back.";
    } else if (microphoneState !== "on") {
      controlManualActionReason = "teams-microphone-required";
      controlManualActionMessage = "Unmute the Teams microphone and verify the microphone control shows it is on, then retry joining.";
    }
  }
  const micMuted = microphoneState === "off" ? true : microphoneState === "on" ? false : undefined;
  const cameraOff = cameraState === "off" ? true : cameraState === "on" ? false : undefined;
  const pageText = text(document.body);
  const pageTextLower = pageText.toLowerCase();
  const lobbyWaiting = Boolean(first(selectors.lobby)) ||
    /someone will let you in shortly|waiting for someone to let you in|when someone admits you|you.?re in the lobby|we.?ve let people in the meeting know you.?re waiting/i.test(pageTextLower);
  const signInControl = first(selectors.signIn);
  const hostname = location.hostname.toLowerCase();
  const tenantLoginRequired =
    /only people with a work or school account|sign in with an account from this organization|anonymous users (?:can.?t|cannot) join|verify your email|enter the code sent to/i.test(pageTextLower);
  const loginRequired = hostname === "login.microsoftonline.com" ||
    hostname.endsWith(".microsoftonline.com") ||
    tenantLoginRequired ||
    (Boolean(signInControl) && !guestInput && !join && /sign in to (?:join|continue)|sign in to your account/i.test(pageTextLower));
  let microphonePermissionState;
  if (allowMicrophone && navigator.permissions?.query) {
    try {
      microphonePermissionState = (await navigator.permissions.query({ name: "microphone" })).state;
    } catch {}
  }
  const devicePermissionPrompt = !dismissedDevicePrompt && Boolean(
    first(selectors.permissionPrompt) || continueWithoutDevices
  );
  // Teams shows the same no-audio/video warning when only camera access is denied.
  // A granted microphone plus the verified BlackHole input is sufficient for talk-back.
  const permissionRequired = devicePermissionPrompt &&
    (!allowMicrophone || microphonePermissionState !== "granted");
  let manualActionReason;
  let manualActionMessage;
  if (committedOwnerConflict && !canMutateSession) {
    manualActionReason = "teams-session-conflict";
    manualActionMessage = "This Teams tab is owned by another active meeting session.";
  } else if (!inCall && loginRequired) {
    manualActionReason = "teams-login-required";
    manualActionMessage = tenantLoginRequired
      ? "This Teams tenant requires sign-in or email verification. Complete it in the OpenClaw browser profile, then retry."
      : "Sign in to Microsoft Teams in the OpenClaw browser profile, then retry the meeting join.";
  } else if (!inCall && lobbyWaiting) {
    manualActionReason = "teams-admission-required";
    manualActionMessage = "Admit the OpenClaw guest from the Microsoft Teams lobby, then retry speech.";
  } else if (!inCall && permissionRequired) {
    manualActionReason = "teams-permission-required";
    manualActionMessage = allowMicrophone
      ? "Allow microphone permission for Teams in the OpenClaw browser profile, then retry."
      : "Dismiss the Teams device-permission prompt or continue without devices, then retry.";
  } else if (!inCall && controlManualActionReason) {
    manualActionReason = controlManualActionReason;
    manualActionMessage = controlManualActionMessage;
  }
  let clickedJoin = false;
  if (canMutateSession && identityVerified && autoJoin && !inCall && join && !join.disabled && !manualActionReason) {
    join.click();
    clickedJoin = true;
    notes.push("Clicked the Teams guest join button.");
  }
`;
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-urls.ts
function parseTeamsMeetingIdentity(url) {
	if (!url) return;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" || parsed.port || parsed.username || parsed.password) return;
		const hostname = parsed.hostname.toLowerCase();
		if (hostname === "teams.microsoft.com") {
			const match = parsed.pathname.match(/^\/l\/meetup-join\/([^/]+)(?:\/0)?\/?$/i);
			if (!match?.[1]) return;
			const threadId = decodeURIComponent(match[1]);
			if (!/^19:[^/]+@thread\.(?:v2|tacv2)$/i.test(threadId)) return;
			return {
				kind: "work",
				key: threadId
			};
		}
		if (hostname === "teams.live.com") {
			const launcherMatch = (parsed.pathname.toLowerCase() === "/dl/launcher/launcher.html" ? parsed.searchParams.get("url") : void 0)?.match(/^\/_#\/meet\/([^/?#]+)(?:\?(.+))?$/i);
			let lightMeeting;
			if (parsed.pathname.toLowerCase() === "/light-meetings/launch") try {
				const coordinates = parsed.searchParams.get("coords");
				const decoded = coordinates && coordinates.length <= 16384 ? JSON.parse(Buffer.from(coordinates, "base64").toString("utf8")) : void 0;
				if (decoded && typeof decoded === "object") lightMeeting = decoded;
			} catch {
				return;
			}
			const match = parsed.pathname.match(/^\/meet\/([^/]+)\/?$/i) ?? launcherMatch ?? (typeof lightMeeting?.meetingCode === "string" ? [void 0, lightMeeting.meetingCode] : void 0);
			if (!match?.[1]) return;
			const meetCode = decodeURIComponent(match[1]);
			if (!/^[a-z0-9_-]+$/i.test(meetCode)) return;
			const passcode = launcherMatch ? new URLSearchParams(launcherMatch[2] ?? "").get("p") : typeof lightMeeting?.passcode === "string" ? lightMeeting.passcode : parsed.searchParams.get("p");
			return {
				kind: "consumer",
				key: `${meetCode.toLowerCase()}:p:${encodeURIComponent(passcode ?? "")}`
			};
		}
	} catch {
		return;
	}
}
function normalizeTeamsMeetingUrl(input) {
	if (typeof input !== "string" || !input.trim()) throw new Error("Microsoft Teams meeting URL is required");
	const value = input.trim();
	if (!parseTeamsMeetingIdentity(value)) throw new Error("Microsoft Teams meeting URL must use https://teams.microsoft.com/l/meetup-join/... or https://teams.live.com/meet/<id>");
	const parsed = new URL(value);
	parsed.hash = "";
	return parsed.toString();
}
function normalizeTeamsMeetingUrlForReuse(url) {
	const identity = parseTeamsMeetingIdentity(url);
	return identity ? `teams-${identity.kind}:${identity.key}` : void 0;
}
function isSameTeamsMeetingUrl(left, right) {
	const normalizedLeft = normalizeTeamsMeetingUrlForReuse(left);
	const normalizedRight = normalizeTeamsMeetingUrlForReuse(right);
	return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}
function isRecoverableTeamsMeetingTab(tab, url) {
	if (url) return isSameTeamsMeetingUrl(tab.url, url);
	if (normalizeTeamsMeetingUrlForReuse(tab.url)) return true;
	try {
		const hostname = new URL(tab.url ?? "").hostname.toLowerCase();
		return (hostname === "login.microsoftonline.com" || hostname.endsWith(".microsoftonline.com")) && /sign in|microsoft|teams/i.test(tab.title ?? "");
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-page-scripts.ts
const TEAMS_MEETING_TRANSCRIPT_MAX_LINES = 500;
function pageIdentityFunctionSource() {
	return `const meetingIdentity = (rawUrl) => {
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();
      if (parsed.protocol !== "https:") return undefined;
      if (host === "teams.microsoft.com") {
        const match = parsed.pathname.match(/^\\/l\\/meetup-join\\/([^/]+)(?:\\/0)?\\/?$/i);
        if (!match?.[1]) return undefined;
        const threadId = decodeURIComponent(match[1]);
        return /^19:[^/]+@thread\\.(?:v2|tacv2)$/i.test(threadId)
          ? "teams-work:" + threadId
          : undefined;
      }
      if (host === "teams.live.com") {
        const launcherTarget = parsed.pathname.toLowerCase() === "/dl/launcher/launcher.html"
          ? parsed.searchParams.get("url")
          : undefined;
        const launcherMatch = launcherTarget?.match(/^\\/_#\\/meet\\/([^/?#]+)(?:\\?(.+))?$/i);
        let lightMeeting;
        if (parsed.pathname.toLowerCase() === "/light-meetings/launch") {
          try {
            const coordinates = parsed.searchParams.get("coords");
            const decoded = coordinates && coordinates.length <= 16_384
              ? JSON.parse(atob(coordinates))
              : undefined;
            if (decoded && typeof decoded === "object") lightMeeting = decoded;
          } catch {}
        }
        const match = parsed.pathname.match(/^\\/meet\\/([^/]+)\\/?$/i) || launcherMatch ||
          (typeof lightMeeting?.meetingCode === "string"
            ? [undefined, lightMeeting.meetingCode]
            : undefined);
        if (!match?.[1]) return undefined;
        const code = decodeURIComponent(match[1]);
        const passcode = launcherMatch
          ? new URLSearchParams(launcherMatch[2] || "").get("p")
          : typeof lightMeeting?.passcode === "string"
            ? lightMeeting.passcode
            : parsed.searchParams.get("p");
        return /^[a-z0-9_-]+$/i.test(code)
          ? "teams-consumer:" + code.toLowerCase() + ":p:" + encodeURIComponent(passcode || "")
          : undefined;
      }
    } catch {}
    return undefined;
  };`;
}
function teamsMeetingToggleStateFunctionSource() {
	return `(input) => {
    const pressed = String(input?.ariaPressed || "").toLowerCase();
    if (pressed === "true") return "on";
    if (pressed === "false") return "off";
    const checked = String(input?.ariaChecked ?? input?.checked ?? "").toLowerCase();
    if (checked === "true") return "on";
    if (checked === "false") return "off";
    const value = String(input?.label || "").toLowerCase().replace(/\\s+/g, " ").trim();
    if (!value) return undefined;
    if (input?.kind === "camera") {
      if (/\\bturn (?:your )?camera off\\b|\\bturn off (?:your )?camera\\b|\\bstop video\\b|\\bdisable (?:your )?(?:camera|video)\\b/.test(value)) return "on";
      if (/\\bturn (?:your )?camera on\\b|\\bturn on (?:your )?camera\\b|\\bstart video\\b|\\benable (?:your )?(?:camera|video)\\b/.test(value)) return "off";
      if (/\\b(?:camera|video) (?:is |currently )?(?:off|disabled)\\b/.test(value)) return "off";
      if (/\\b(?:camera|video) (?:is |currently )?(?:on|enabled)\\b/.test(value)) return "on";
      return undefined;
    }
    if (/^mute$|\\bturn (?:your )?(?:microphone|mic) off\\b|\\bturn off (?:your )?(?:microphone|mic)\\b|\\bmute (?:your )?(?:microphone|mic)\\b|\\bdisable (?:your )?(?:microphone|mic)\\b/.test(value)) return "on";
    if (/^unmute$|\\bturn (?:your )?(?:microphone|mic) on\\b|\\bturn on (?:your )?(?:microphone|mic)\\b|\\bunmute (?:your )?(?:microphone|mic)\\b|\\benable (?:your )?(?:microphone|mic)\\b/.test(value)) return "off";
    if (/\\b(?:microphone|mic) (?:is |currently )?(?:off|muted|disabled)\\b/.test(value)) return "off";
    if (/\\b(?:microphone|mic) (?:is |currently )?(?:on|unmuted|enabled)\\b/.test(value)) return "on";
    return undefined;
  }`;
}
function teamsMeetingStatusScript(params) {
	const selectors = JSON.stringify(TEAMS_MEETING_SELECTORS);
	const expectedIdentity = normalizeTeamsMeetingUrlForReuse(params.meetingUrl);
	const toggleStateFunction = teamsMeetingToggleStateFunctionSource();
	return teamsMeetingStatusPreludeSource({
		...params,
		expectedIdentity,
		pageIdentitySource: pageIdentityFunctionSource(),
		selectors,
		toggleStateFunction
	}) + teamsMeetingStatusCallSource();
}
function teamsMeetingTranscriptScript(meetingUrl, meetingSessionId, finalize) {
	const expectedIdentity = normalizeTeamsMeetingUrlForReuse(meetingUrl);
	return `() => {
  ${pageIdentityFunctionSource()}
  const expectedIdentity = ${JSON.stringify(expectedIdentity)};
  const expectedSessionId = ${JSON.stringify(meetingSessionId)};
  const currentIdentity = meetingIdentity(location.href);
  const state = window.__openclawTeamsMeeting;
  const activeCaptions = window.__openclawTeamsCaptions;
  const archivedCaptions = window.__openclawTeamsCaptionArchive?.[expectedSessionId];
  const captions = activeCaptions &&
      (!activeCaptions.sessionId || activeCaptions.sessionId === expectedSessionId)
    ? activeCaptions
    : archivedCaptions;
  // A same-session finalized buffer belongs to the departed call even if Teams
  // immediately navigated this tab into another meeting before transcript pickup.
  const useFinalizedCaptions = Boolean(
    captions?.finalized === true &&
    captions?.identity === expectedIdentity &&
    (!captions?.sessionId || captions.sessionId === expectedSessionId)
  );
  const effectiveIdentity = useFinalizedCaptions
    ? captions.identity
    : currentIdentity || state?.identity || captions?.identity;
  if (!expectedIdentity || effectiveIdentity !== expectedIdentity) {
    return JSON.stringify({ urlMatched: false, droppedLines: 0, lines: [] });
  }
  if (!useFinalizedCaptions && state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false, droppedLines: 0, lines: [] });
  }
  if (captions?.sessionId && captions.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false, droppedLines: 0, lines: [] });
  }
  if (${JSON.stringify(finalize)} && Array.isArray(captions?.visible) && captions.visible.length > 0) {
    if (captions.settleTimer !== undefined) clearTimeout(captions.settleTimer);
    captions.settleTimer = undefined;
    captions.lines = Array.isArray(captions.lines) ? captions.lines : [];
    captions.lines.push(...captions.visible.map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text,
    })));
    captions.visible = [];
    const excess = captions.lines.length - ${TEAMS_MEETING_TRANSCRIPT_MAX_LINES};
    if (excess > 0) {
      captions.lines.splice(0, excess);
      captions.droppedLines = (captions.droppedLines || 0) + excess;
    }
  }
  if (${JSON.stringify(finalize)} && captions) {
    if (captions.settleTimer !== undefined) clearTimeout(captions.settleTimer);
    captions.settleTimer = undefined;
    captions.observer?.disconnect?.();
    captions.observer = undefined;
    captions.observerInstalled = false;
    captions.identity = expectedIdentity;
    captions.finalized = true;
    captions.finalizedAt = Date.now();
  }
  const allLines = [
    ...(Array.isArray(captions?.lines) ? captions.lines : []),
    ...(${JSON.stringify(finalize)} || !Array.isArray(captions?.visible) ? [] : captions.visible),
  ];
  const visibleOverflow = Math.max(0, allLines.length - ${TEAMS_MEETING_TRANSCRIPT_MAX_LINES});
  const lines = allLines.slice(-${TEAMS_MEETING_TRANSCRIPT_MAX_LINES});
  const result = {
    urlMatched: true,
    sessionMatched: true,
    epoch: typeof captions?.epoch === "string" ? captions.epoch : undefined,
    droppedLines: (Number.isFinite(captions?.droppedLines)
      ? Math.max(0, Math.trunc(captions.droppedLines))
      : 0) + visibleOverflow,
    lines: lines.map((line) => ({
      at: typeof line?.at === "string" ? line.at : undefined,
      speaker: typeof line?.speaker === "string" ? line.speaker : undefined,
      text: typeof line?.text === "string" ? line.text : "",
    })).filter((line) => line.text),
  };
  return JSON.stringify(result);
}`;
}
function teamsMeetingLeaveScript(params) {
	const selectors = JSON.stringify(TEAMS_MEETING_SELECTORS);
	const expectedIdentity = normalizeTeamsMeetingUrlForReuse(params.meetingUrl);
	return `() => {
  ${pageIdentityFunctionSource()}
  const selectors = ${selectors};
  const expectedIdentity = ${JSON.stringify(expectedIdentity)};
  const expectedSessionId = ${JSON.stringify(params.meetingSessionId)};
  const leaveInitiated = ${JSON.stringify(params.leaveInitiated)};
  const currentIdentity = meetingIdentity(location.href);
  const state = window.__openclawTeamsMeeting;
  const enforceSessionOwnership = Boolean(expectedSessionId);
  if (enforceSessionOwnership && state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ departed: false, sessionConflict: true, sessionMatched: false, urlMatched: true });
  }
  const sessionMatched = !enforceSessionOwnership || state?.sessionId === expectedSessionId;
  const retainedLeaveOwnership = Boolean(!sessionMatched && leaveInitiated);
  if (!sessionMatched && !retainedLeaveOwnership) {
    return JSON.stringify({ departed: false, sessionMatched: false, urlMatched: true });
  }
  const retireOwnedAudioBridges = () => {
    const entries = Array.isArray(window.__openclawTeamsAudioOutputs)
      ? window.__openclawTeamsAudioOutputs
      : [];
    const retained = [];
    const activeSessionId = expectedSessionId || state?.sessionId;
    for (const entry of entries) {
      const ownedByActiveSession = Boolean(
        !entry?.sessionId || (activeSessionId && entry.sessionId === activeSessionId)
      );
      if (!ownedByActiveSession) {
        retained.push(entry);
        continue;
      }
      const mediaSourceUrl = (element) => String(element?.currentSrc || element?.src || "");
      const sources = Array.isArray(entry?.sources)
        ? entry.sources
        : entry?.source
          ? [{ element: entry.source, muted: Boolean(entry.sourceMuted), stream: entry.stream, url: entry.sourceUrl }]
          : [];
      for (const source of sources) {
        const element = source?.element;
        const sourceMatches = source?.stream || element?.srcObject
          ? element?.srcObject === source?.stream
          : Boolean(source?.url && mediaSourceUrl(element) === source.url);
        const sourceIsEmpty = Boolean(element && !element.srcObject && !mediaSourceUrl(element));
        if (!element) continue;
        if (sourceIsEmpty) {
          element.muted = true;
          continue;
        }
        if (!sourceMatches) continue;
        const detachedLiveSource = Boolean(
          element.isConnected === false &&
          element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
        );
        if (detachedLiveSource) {
          element.muted = true;
          element.pause?.();
          element.srcObject = null;
        } else {
          element.muted = Boolean(source.muted);
        }
      }
      entry?.bridge?.pause?.();
      if (entry?.bridge) entry.bridge.srcObject = null;
      entry?.bridge?.remove?.();
    }
    if (retained.length > 0) window.__openclawTeamsAudioOutputs = retained;
    else delete window.__openclawTeamsAudioOutputs;
  };
  const first = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (!node) continue;
      return node.matches?.("button") ? node : node.querySelector?.("button") || node.closest?.("button") || node;
    }
    return undefined;
  };
  const leave = first(selectors.leave);
  const confirmation = first(selectors.leaveConfirmation);
  const postCall = first(selectors.postCall);
  const currentUrlMatches = Boolean(expectedIdentity && currentIdentity === expectedIdentity);
  const preservedCallMatches = Boolean(
    expectedIdentity &&
    !currentIdentity &&
    state?.identity === expectedIdentity &&
    state?.inCallControl === leave &&
    state?.inCallUrl === location.href &&
    leave &&
    leave.isConnected !== false
  );
  const pendingLeaveMatches = Boolean(
    expectedIdentity &&
    state?.identity === expectedIdentity &&
    state?.leavePending === true &&
    state?.inCallUrl === location.href &&
    Date.now() - state?.leavePendingAt < 10_000
  );
  const rerenderPendingMatches = Boolean(
    expectedIdentity &&
    !currentIdentity &&
    state?.identity === expectedIdentity &&
    state?.inCallControl?.isConnected === false &&
    state?.inCallUrl === location.href &&
    Date.now() - state?.verifiedAt < 5_000 &&
    !leave
  );
  const meetingIdentityMatches = Boolean(
    currentUrlMatches || preservedCallMatches || pendingLeaveMatches || rerenderPendingMatches
  );
  // Teams can replace the document between our Leave click and its post-call marker.
  // Retain request ownership only while no identity or live-call control contradicts it.
  const initiatedLeaveTransitionMatches = Boolean(
    leaveInitiated &&
    !currentIdentity &&
    !leave &&
    (!state?.identity || state.identity === expectedIdentity)
  );
  if (postCall && (meetingIdentityMatches || initiatedLeaveTransitionMatches)) {
    retireOwnedAudioBridges();
    if (sessionMatched) delete window.__openclawTeamsMeeting;
    return JSON.stringify({ departed: true, sessionMatched: true, urlMatched: true });
  }
  if (!meetingIdentityMatches && !initiatedLeaveTransitionMatches) {
    return JSON.stringify({ departed: false, urlMatched: false });
  }
  if (!sessionMatched) {
    return JSON.stringify({ departed: false, urlMatched: true });
  }
  if (confirmation) {
    confirmation.click();
    return JSON.stringify({ departed: false, leaveAction: "confirm", urlMatched: true });
  }
  if (leave) {
    window.__openclawTeamsMeeting = {
      ...state,
      identity: expectedIdentity,
      inCallControl: leave,
      inCallUrl: location.href,
      leavePending: true,
      leavePendingAt: Date.now(),
    };
    leave.click();
    return JSON.stringify({ departed: false, leaveAction: "leave", urlMatched: true });
  }
  return JSON.stringify({ departed: false, urlMatched: true });
}`;
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-platform-constants.ts
const TEAMS_MEETINGS_NODE_COMMAND = "teamsmeetings.chrome";
const TEAMS_MEETINGS_BROWSER_NODE_ADAPTER = {
	displayName: "Microsoft Teams meetings",
	nodeCommandName: TEAMS_MEETINGS_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.teams-meetings.config.chromeNode.node"
};
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-platform-adapter.ts
function teamsMeetingOrigin(meetingUrl) {
	try {
		const origin = new URL(meetingUrl).origin;
		return origin === "https://teams.microsoft.com" || origin === "https://teams.live.com" ? origin : void 0;
	} catch {
		return;
	}
}
function parsePermissionGrantNotes(result) {
	const record = result && typeof result === "object" ? result : {};
	const unsupportedPermissions = Array.isArray(record.unsupportedPermissions) ? record.unsupportedPermissions.filter((value) => typeof value === "string") : [];
	const notes = ["Granted Teams microphone permission through browser control."];
	if (unsupportedPermissions.includes("speakerSelection")) notes.push("Chrome did not accept the optional Teams speaker-selection permission.");
	return notes;
}
function isTeamsMeetingsTalkBackMode(mode) {
	return mode === "agent" || mode === "bidi";
}
function isTeamsMeetingsRealtimeRouteReady(mode, health) {
	return isTeamsMeetingsTalkBackMode(mode) && health?.inCall === true && health.micMuted === false && health.audioInputRouted === true && health.audioOutputRouted === true && health.manualActionRequired !== true;
}
function parseBrowserStatus(result) {
	const record = result && typeof result === "object" ? result : {};
	if (typeof record.result !== "string" || !record.result.trim()) return;
	let parsed;
	try {
		parsed = JSON.parse(record.result);
	} catch {
		throw new Error("Microsoft Teams browser status JSON is malformed.");
	}
	return {
		inCall: typeof parsed.inCall === "boolean" ? parsed.inCall : void 0,
		micMuted: typeof parsed.micMuted === "boolean" ? parsed.micMuted : void 0,
		cameraOff: typeof parsed.cameraOff === "boolean" ? parsed.cameraOff : void 0,
		lobbyWaiting: typeof parsed.lobbyWaiting === "boolean" ? parsed.lobbyWaiting : void 0,
		captionCaptureRequested: typeof parsed.captionCaptureRequested === "boolean" ? parsed.captionCaptureRequested : void 0,
		captioning: typeof parsed.captioning === "boolean" ? parsed.captioning : void 0,
		captionsEnabledAttempted: typeof parsed.captionsEnabledAttempted === "boolean" ? parsed.captionsEnabledAttempted : void 0,
		transcriptLines: typeof parsed.transcriptLines === "number" ? parsed.transcriptLines : void 0,
		lastCaptionAt: typeof parsed.lastCaptionAt === "string" ? parsed.lastCaptionAt : void 0,
		lastCaptionSpeaker: typeof parsed.lastCaptionSpeaker === "string" ? parsed.lastCaptionSpeaker : void 0,
		lastCaptionText: typeof parsed.lastCaptionText === "string" ? parsed.lastCaptionText : void 0,
		recentTranscript: Array.isArray(parsed.recentTranscript) ? parsed.recentTranscript.flatMap((value) => {
			if (!value || typeof value !== "object") return [];
			const line = value;
			if (typeof line.text !== "string" || !line.text.trim()) return [];
			return [{
				...typeof line.at === "string" ? { at: line.at } : {},
				...typeof line.speaker === "string" ? { speaker: line.speaker } : {},
				text: line.text
			}];
		}) : void 0,
		audioInputRouted: typeof parsed.audioInputRouted === "boolean" ? parsed.audioInputRouted : void 0,
		audioInputDeviceLabel: typeof parsed.audioInputDeviceLabel === "string" ? parsed.audioInputDeviceLabel : void 0,
		audioInputRouteError: typeof parsed.audioInputRouteError === "string" ? parsed.audioInputRouteError : void 0,
		audioOutputRouted: typeof parsed.audioOutputRouted === "boolean" ? parsed.audioOutputRouted : void 0,
		audioOutputDeviceLabel: typeof parsed.audioOutputDeviceLabel === "string" ? parsed.audioOutputDeviceLabel : void 0,
		audioOutputRouteError: typeof parsed.audioOutputRouteError === "string" ? parsed.audioOutputRouteError : void 0,
		audioOutputRouteRetryable: typeof parsed.audioOutputRouteRetryable === "boolean" ? parsed.audioOutputRouteRetryable : void 0,
		manualActionRequired: typeof parsed.manualActionRequired === "boolean" ? parsed.manualActionRequired : void 0,
		manualActionReason: typeof parsed.manualActionReason === "string" ? parsed.manualActionReason : void 0,
		manualActionMessage: typeof parsed.manualActionMessage === "string" ? parsed.manualActionMessage : void 0,
		browserUrl: typeof parsed.url === "string" ? parsed.url : void 0,
		browserTitle: typeof parsed.title === "string" ? parsed.title : void 0,
		status: "browser-control",
		notes: Array.isArray(parsed.notes) ? parsed.notes.filter((note) => typeof note === "string") : void 0
	};
}
function classifyManualAction(health) {
	if (!health.manualActionRequired || !health.manualActionReason || !health.manualActionMessage) return;
	return {
		category: health.manualActionReason === "teams-login-required" ? "login-required" : health.manualActionReason === "teams-admission-required" ? "admission-required" : health.manualActionReason === "teams-permission-required" ? "permission-required" : health.manualActionReason === "teams-audio-choice-required" ? "audio-choice-required" : health.manualActionReason === "teams-session-conflict" ? "session-conflict" : health.manualActionReason === "browser-control-unavailable" ? "browser-control-unavailable" : "custom",
		reason: health.manualActionReason,
		message: health.manualActionMessage
	};
}
function parseLeaveResult(result) {
	const record = result && typeof result === "object" ? result : {};
	if (typeof record.result !== "string" || !record.result.trim()) return { departed: false };
	try {
		const parsed = JSON.parse(record.result);
		const leaveAction = parsed.leaveAction === "leave" || parsed.leaveAction === "confirm" ? parsed.leaveAction : void 0;
		return {
			departed: parsed.departed === true,
			...leaveAction ? { leaveAction } : {},
			...typeof parsed.sessionConflict === "boolean" ? { sessionConflict: parsed.sessionConflict } : {},
			...typeof parsed.sessionMatched === "boolean" ? { sessionMatched: parsed.sessionMatched } : {},
			...typeof parsed.urlMatched === "boolean" ? { urlMatched: parsed.urlMatched } : {}
		};
	} catch {
		return { departed: false };
	}
}
function parseTranscript(result) {
	const record = result && typeof result === "object" ? result : {};
	if (typeof record.result !== "string" || !record.result.trim()) return {
		droppedLines: 0,
		lines: []
	};
	let parsed;
	try {
		parsed = JSON.parse(record.result);
	} catch {
		throw new Error("Microsoft Teams transcript JSON is malformed.");
	}
	if (!parsed || typeof parsed !== "object") throw new Error("Microsoft Teams transcript payload is invalid.");
	const payload = parsed;
	const droppedLines = typeof payload.droppedLines === "number" && Number.isSafeInteger(payload.droppedLines) ? Math.max(0, payload.droppedLines) : 0;
	const lines = Array.isArray(payload.lines) ? payload.lines.flatMap((value) => {
		if (!value || typeof value !== "object") return [];
		const line = value;
		if (typeof line.text !== "string" || !line.text.trim()) return [];
		return [{
			...typeof line.at === "string" ? { at: line.at } : {},
			...typeof line.speaker === "string" ? { speaker: line.speaker } : {},
			text: line.text
		}];
	}) : [];
	return {
		droppedLines,
		...typeof payload.epoch === "string" ? { epoch: payload.epoch } : {},
		lines,
		...typeof payload.urlMatched === "boolean" ? { urlMatched: payload.urlMatched } : {},
		...typeof payload.sessionMatched === "boolean" ? { sessionMatched: payload.sessionMatched } : {}
	};
}
const TEAMS_MEETINGS_PLATFORM_ADAPTER = {
	id: "teams-meetings",
	displayName: "Microsoft Teams meetings",
	browserLabel: "Teams meeting",
	logScope: "[teams-meetings]",
	nodeCommandName: TEAMS_MEETINGS_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.teams-meetings.config.chromeNode.node",
	urls: {
		validateAndNormalize: normalizeTeamsMeetingUrl,
		normalizeForReuse: normalizeTeamsMeetingUrlForReuse,
		isSameMeeting: isSameTeamsMeetingUrl,
		buildJoinUrl: (session) => session.url,
		accountHint: () => void 0,
		isPreferredJoinUrl: (url) => Boolean(normalizeTeamsMeetingUrlForReuse(url)),
		isRecoverableTab: isRecoverableTeamsMeetingTab,
		localeAction: () => void 0
	},
	browser: {
		allowsMicrophone: isTeamsMeetingsTalkBackMode,
		buildStatusJoinScript: (params) => teamsMeetingStatusScript({
			allowMicrophone: isTeamsMeetingsTalkBackMode(params.mode),
			allowSessionAdoption: params.allowSessionAdoption,
			autoJoin: params.autoJoin,
			captureCaptions: params.captureCaptions,
			guestName: params.guestName,
			meetingSessionId: params.meetingSessionId || void 0,
			meetingUrl: params.url,
			readOnly: params.readOnly,
			waitForInCallMs: params.waitForInCallMs
		}),
		parseStatus: parseBrowserStatus,
		classifyManualAction,
		shouldRetryJoinStatus: (health) => health.inCall === true && (health.manualActionReason === "teams-audio-choice-required" && health.audioInputRouted === true && health.audioOutputRouteRetryable === true || health.manualActionRequired !== true && health.captionCaptureRequested === true && health.captioning !== true),
		browserControlUnavailable: () => ({
			category: "browser-control-unavailable",
			reason: "browser-control-unavailable",
			message: "Open the OpenClaw browser profile, finish the Teams sign-in, admission, or permission prompt, then retry."
		}),
		buildLeaveScript: (meetingUrl) => teamsMeetingLeaveScript({
			leaveInitiated: false,
			meetingSessionId: "",
			meetingUrl
		}),
		buildSessionLeaveScript: teamsMeetingLeaveScript,
		parseLeaveResult,
		captions: {
			enabled: (mode) => mode === "transcribe",
			buildTranscriptScript: ({ finalize, meetingSessionId, meetingUrl }) => teamsMeetingTranscriptScript(meetingUrl, meetingSessionId, finalize),
			parseTranscript
		},
		permissions: ({ allowMicrophone, meetingUrl }) => {
			const origin = teamsMeetingOrigin(meetingUrl);
			return allowMicrophone && origin ? {
				origin,
				permissions: ["audioCapture"],
				optionalPermissions: ["speakerSelection"]
			} : void 0;
		},
		permissionNotes: ({ allowMicrophone, error, result }) => {
			if (!allowMicrophone) return ["Observe-only mode does not request Teams microphone access."];
			if (error) return [`Could not grant Teams media permissions automatically: ${formatErrorMessage(error)}`];
			return parsePermissionGrantNotes(result);
		}
	}
};
//#endregion
//#region extensions/teams-meetings/src/node-host.ts
function commandExists$1(command, timeoutMs) {
	return spawnSync("/bin/sh", [
		"-lc",
		"command -v \"$1\" >/dev/null 2>&1",
		"sh",
		command
	], {
		encoding: "utf8",
		timeout: timeoutMs
	}).status === 0;
}
function assertTalkBackPrerequisites(timeoutMs, commands = [DEFAULT_TEAMS_MEETINGS_AUDIO_INPUT_COMMAND, DEFAULT_TEAMS_MEETINGS_AUDIO_OUTPUT_COMMAND]) {
	if (process.platform !== "darwin") throw new Error("Microsoft Teams meeting talk-back with BlackHole 2ch is macOS-only");
	const result = spawnSync(TEAMS_MEETINGS_SYSTEM_PROFILER_COMMAND, ["SPAudioDataType"], {
		encoding: "utf8",
		timeout: timeoutMs
	});
	const stderr = result.stderr ?? (result.error ? result.error instanceof Error ? result.error.message : String(result.error) : "");
	const output = `${result.stdout ?? ""}\n${stderr}`;
	if ((typeof result.status === "number" ? result.status : result.error ? 1 : 0) !== 0 || !outputMentionsBlackHole2ch(output)) throw new Error("BlackHole 2ch audio device not found on the node.");
	for (const argv of commands) {
		const command = argv[0];
		if (!command || !commandExists$1(command, timeoutMs)) throw new Error(`Configured audio command not found on the node: ${command || "<empty>"}`);
	}
}
function readCommand(params, name) {
	const value = params[name];
	if (!Array.isArray(value) || value.length === 0 || value.some((entry) => typeof entry !== "string")) throw new Error(`${name} must be a non-empty string array.`);
	return value;
}
const teamsMeetingsNodeHost = createMeetingNodeHost({
	commandName: TEAMS_MEETINGS_NODE_COMMAND,
	displayName: "Microsoft Teams meetings",
	browserLabel: "Teams meeting",
	bridgeIdPrefix: "teams_meeting_node_",
	defaultAudioInputCommand: DEFAULT_TEAMS_MEETINGS_AUDIO_INPUT_COMMAND,
	defaultAudioOutputCommand: DEFAULT_TEAMS_MEETINGS_AUDIO_OUTPUT_COMMAND,
	talkBackModes: /* @__PURE__ */ new Set(["agent", "bidi"]),
	agentMode: "agent",
	normalizeUrl: (url) => TEAMS_MEETINGS_PLATFORM_ADAPTER.urls.validateAndNormalize(url),
	normalizeMeetingKey: (url) => TEAMS_MEETINGS_PLATFORM_ADAPTER.urls.normalizeForReuse(url),
	assertAudioAvailable: assertTalkBackPrerequisites,
	browser: {
		application: "Google Chrome",
		buildProfileArgs: (profile) => ["--args", `--profile-directory=${profile}`],
		openedStatus: "chrome-opened",
		openedNotes: ["Teams page control is handled by OpenClaw browser automation when using chrome-node."]
	}
});
async function handleTeamsMeetingsNodeHostCommand(paramsJSON) {
	if (paramsJSON) {
		let raw;
		try {
			raw = JSON.parse(paramsJSON);
		} catch {
			throw new Error("Microsoft Teams meetings node host received malformed params JSON.");
		}
		const params = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
		if (params.action === "setup") {
			const commands = [readCommand(params, "audioInputCommand"), readCommand(params, "audioOutputCommand")];
			if (params.bargeInInputCommand !== void 0) commands.push(readCommand(params, "bargeInInputCommand"));
			assertTalkBackPrerequisites(1e4, commands);
			return JSON.stringify({ ok: true });
		}
	}
	return await teamsMeetingsNodeHost.handleCommand(paramsJSON);
}
//#endregion
//#region extensions/teams-meetings/src/node-invoke-policy.ts
function createTeamsMeetingsNodeInvokePolicy(config) {
	const base = createMeetingBrowserNodeInvokePolicy({
		commandName: TEAMS_MEETINGS_NODE_COMMAND,
		displayName: "Microsoft Teams meetings",
		deniedCode: "TEAMS_MEETINGS_NODE_POLICY_DENIED",
		supportedModes: /* @__PURE__ */ new Set([
			"agent",
			"bidi",
			"transcribe"
		]),
		normalizeUrl: (url) => TEAMS_MEETINGS_PLATFORM_ADAPTER.urls.validateAndNormalize(url),
		start: config.chrome
	});
	return {
		...base,
		async handle(ctx) {
			const params = ctx.params && typeof ctx.params === "object" && !Array.isArray(ctx.params) ? ctx.params : {};
			if (ctx.command !== "teamsmeetings.chrome" || params.action !== "setup") return await base.handle(ctx);
			return await ctx.invokeNode({ params: {
				action: "setup",
				audioInputCommand: [...config.chrome.audioInputCommand],
				audioOutputCommand: [...config.chrome.audioOutputCommand],
				...config.chrome.bargeInInputCommand ? { bargeInInputCommand: [...config.chrome.bargeInInputCommand] } : {}
			} });
		}
	};
}
//#endregion
//#region extensions/teams-meetings/src/runtime-probes.ts
function talkBackMode(mode) {
	return mode === "agent" || mode === "bidi";
}
function resolveProbeTimeoutMs(input, fallback) {
	if (input === void 0) return Math.min(Math.max(fallback, 1), 12e4);
	if (!Number.isFinite(input) || input <= 0) throw new Error("timeoutMs must be a positive number");
	return Math.min(Math.trunc(input), 12e4);
}
async function testTeamsMeetingSpeech(context, request) {
	if (request.mode === "transcribe") throw new Error("test_speech requires mode: agent or bidi");
	const mode = talkBackMode(request.mode ?? context.config.defaultMode) ? request.mode ?? context.config.defaultMode : "agent";
	const resolved = {
		url: request.url,
		transport: request.transport ?? (context.config.chromeNode.node ? "chrome-node" : "chrome"),
		mode,
		agentId: context.resolveAgentId(request)
	};
	const beforeSessions = context.list();
	const before = new Set(beforeSessions.map((session) => session.id));
	const existing = beforeSessions.find((session) => context.isReusable(session, resolved));
	const existingOutputBytes = existing?.chrome?.health?.lastOutputBytes ?? 0;
	const result = await context.join({
		...request,
		...resolved,
		message: request.message ?? "Say exactly: Microsoft Teams speech test complete."
	});
	const startOutputBytes = existing?.id === result.session.id ? existingOutputBytes : 0;
	let health = result.session.chrome?.health;
	const shouldWait = result.spoken === true && health?.manualActionRequired !== true && context.hasHealthHandle(result.session.id);
	if (shouldWait && (health?.lastOutputBytes ?? 0) <= startOutputBytes) {
		const deadline = Date.now() + resolveProbeTimeoutMs(request.timeoutMs, context.config.chrome.joinTimeoutMs);
		while (Date.now() < deadline && (health?.lastOutputBytes ?? 0) <= startOutputBytes) {
			await sleep(100);
			context.refreshHealth(result.session.id);
			health = result.session.chrome?.health;
		}
	}
	const speechOutputVerified = (health?.lastOutputBytes ?? 0) > startOutputBytes;
	return {
		createdSession: !before.has(result.session.id),
		inCall: health?.inCall,
		manualActionRequired: health?.manualActionRequired,
		manualActionReason: health?.manualActionReason,
		manualActionMessage: health?.manualActionMessage,
		spoken: result.spoken ?? false,
		speechOutputVerified,
		speechOutputTimedOut: shouldWait && !speechOutputVerified,
		speechReady: health?.speechReady,
		speechBlockedReason: health?.speechBlockedReason,
		speechBlockedMessage: health?.speechBlockedMessage,
		audioOutputActive: health?.audioOutputActive,
		lastOutputBytes: health?.lastOutputBytes,
		session: result.session
	};
}
async function testTeamsMeetingListening(context, request) {
	if (request.mode && request.mode !== "transcribe") throw new Error("test_listen requires mode: transcribe");
	const resolved = {
		url: request.url,
		transport: request.transport ?? (context.config.chromeNode.node ? "chrome-node" : "chrome"),
		mode: "transcribe",
		agentId: context.resolveAgentId(request)
	};
	const beforeSessions = context.list();
	const before = new Set(beforeSessions.map((session) => session.id));
	const existing = beforeSessions.find((session) => context.isReusable(session, resolved));
	const start = {
		lines: existing?.chrome?.health?.transcriptLines ?? 0,
		at: existing?.chrome?.health?.lastCaptionAt,
		text: existing?.chrome?.health?.lastCaptionText
	};
	const result = await context.join({
		...request,
		...resolved,
		message: void 0
	});
	let health = result.session.chrome?.health;
	const advanced = () => (health?.transcriptLines ?? 0) > (existing?.id === result.session.id ? start.lines : 0) || Boolean(health?.lastCaptionAt && health.lastCaptionAt !== start.at) || Boolean(health?.lastCaptionText && health.lastCaptionText !== start.text);
	const shouldWait = health?.manualActionRequired !== true && Boolean(result.session.chrome?.launched);
	let listenVerified = advanced();
	if (shouldWait && !listenVerified) {
		const deadline = Date.now() + resolveProbeTimeoutMs(request.timeoutMs, context.config.chrome.joinTimeoutMs);
		while (Date.now() < deadline) {
			const remainingMs = deadline - Date.now();
			if (remainingMs <= 0) break;
			let deadlineTimer;
			const deadlineReached = new Promise((resolve) => {
				deadlineTimer = setTimeout(() => resolve(false), remainingMs);
			});
			if (!await Promise.race([context.refreshCaptionHealth(result.session, remainingMs).then(() => true), deadlineReached]).finally(() => {
				if (deadlineTimer !== void 0) clearTimeout(deadlineTimer);
			})) break;
			health = result.session.chrome?.health;
			if (Date.now() >= deadline) break;
			if (advanced()) listenVerified = true;
			if (listenVerified || health?.manualActionRequired) break;
			const retryDelayMs = deadline - Date.now();
			if (retryDelayMs <= 0) break;
			await sleep(Math.min(250, retryDelayMs));
		}
	}
	return {
		createdSession: !before.has(result.session.id),
		inCall: health?.inCall,
		manualActionRequired: health?.manualActionRequired,
		manualActionReason: health?.manualActionReason,
		manualActionMessage: health?.manualActionMessage,
		listenVerified,
		listenTimedOut: shouldWait && !listenVerified && health?.manualActionRequired !== true,
		captioning: health?.captioning,
		captionsEnabledAttempted: health?.captionsEnabledAttempted,
		transcriptLines: health?.transcriptLines,
		lastCaptionAt: health?.lastCaptionAt,
		lastCaptionSpeaker: health?.lastCaptionSpeaker,
		lastCaptionText: health?.lastCaptionText,
		recentTranscript: health?.recentTranscript,
		session: result.session
	};
}
//#endregion
//#region extensions/teams-meetings/src/runtime-session.ts
function createTeamsMeetingsSession(params) {
	const { config, createdAt, resolved } = params;
	return {
		id: `teams_meeting_${randomUUID()}`,
		...resolved,
		state: "active",
		createdAt,
		updatedAt: createdAt,
		participantIdentity: resolved.transport === "chrome-node" ? "Microsoft Teams guest in Chrome on a paired node" : "Microsoft Teams guest in the OpenClaw Chrome profile",
		realtime: {
			enabled: resolved.mode === "agent" || resolved.mode === "bidi",
			strategy: resolved.mode === "bidi" ? "bidi" : "agent",
			provider: resolved.mode === "bidi" ? config.realtime.voiceProvider ?? config.realtime.provider : void 0,
			model: resolved.mode === "bidi" ? config.realtime.model : void 0,
			transcriptionProvider: resolved.mode === "agent" ? config.realtime.transcriptionProvider ?? config.realtime.provider : void 0,
			toolPolicy: config.realtime.toolPolicy
		},
		notes: []
	};
}
//#endregion
//#region extensions/teams-meetings/src/agent-consult.ts
const TEAMS_MEETINGS_CONSULT_SURFACE = {
	id: "teams-meetings",
	provider: "teams-meetings",
	lane: "teams-meetings",
	surface: "a private Microsoft Teams meeting",
	userLabel: "Participant",
	assistantLabel: "Agent",
	questionSourceLabel: "participant",
	workingResponseLabel: "participant",
	extraSystemPrompt: [
		"You are a behind-the-scenes consultant for a live meeting voice agent.",
		"Prioritize a fast, speakable answer over exhaustive investigation.",
		"Use only bounded, task-relevant tool calls.",
		"Never print secrets or dump environment variables.",
		"Be accurate, brief, and speakable."
	].join(" ")
};
function resolveTeamsMeetingsRealtimeTools(policy) {
	return resolveMeetingRealtimeTools(policy);
}
async function consultOpenClawAgentForTeamsMeeting(params) {
	return await consultMeetingAgent({
		surface: TEAMS_MEETINGS_CONSULT_SURFACE,
		config: params.fullConfig,
		runtime: params.runtime,
		logger: params.logger,
		agentId: params.config.realtime.agentId,
		toolPolicy: params.config.realtime.toolPolicy,
		meetingSessionId: params.meetingSessionId,
		requesterSessionKey: params.requesterSessionKey,
		args: params.args,
		transcript: params.transcript
	});
}
async function handleTeamsMeetingsRealtimeConsultToolCall(params) {
	await handleMeetingRealtimeConsultToolCall({
		surface: TEAMS_MEETINGS_CONSULT_SURFACE,
		strategy: params.strategy,
		session: params.session,
		event: params.event,
		config: params.fullConfig,
		runtime: params.runtime,
		logger: params.logger,
		agentId: params.config.realtime.agentId,
		toolPolicy: params.config.realtime.toolPolicy,
		meetingSessionId: params.meetingSessionId,
		requesterSessionKey: params.requesterSessionKey,
		transcript: params.transcript,
		onTalkEvent: params.onTalkEvent
	});
}
//#endregion
//#region extensions/teams-meetings/src/transports/chrome.ts
const TEAMS_MEETINGS_RUNTIME_PLATFORM = {
	displayName: TEAMS_MEETINGS_PLATFORM_ADAPTER.displayName,
	logScope: TEAMS_MEETINGS_PLATFORM_ADAPTER.logScope,
	sessionIdPrefix: TEAMS_MEETINGS_PLATFORM_ADAPTER.id
};
async function openOrRecoverTeamsMeeting(params) {
	if (params.config.chrome.launch) return await openMeetingWithBrowser({
		adapter: TEAMS_MEETINGS_PLATFORM_ADAPTER,
		callBrowser: params.callBrowser,
		config: params.config.chrome,
		session: {
			meetingSessionId: params.meetingSessionId,
			mode: params.mode,
			url: params.url
		}
	});
	const recovered = await recoverMeetingBrowserTab({
		adapter: TEAMS_MEETINGS_PLATFORM_ADAPTER,
		allowSessionAdoption: true,
		autoJoin: params.config.chrome.autoJoin,
		callBrowser: params.callBrowser,
		config: params.config.chrome,
		locationLabel: params.locationLabel,
		meetingSessionId: params.meetingSessionId,
		mode: params.mode,
		requestedMeetingUrl: params.url,
		trackedMeetingUrl: params.url,
		trackedTargetId: params.trackedTargetId
	});
	return {
		launched: false,
		browser: recovered.browser,
		tab: recovered.targetId ? {
			targetId: recovered.targetId,
			openedByPlugin: false
		} : void 0
	};
}
async function rollbackTeamsBrowserJoin(params) {
	if (!params.tab) return;
	const result = await leaveMeetingWithBrowser({
		adapter: TEAMS_MEETINGS_PLATFORM_ADAPTER,
		callBrowser: params.callBrowser,
		launch: true,
		meetingSessionId: params.meetingSessionId,
		meetingUrl: params.url,
		tab: params.tab,
		timeoutMs: params.config.chrome.joinTimeoutMs
	}).catch((error) => ({
		left: false,
		note: error instanceof Error ? error.message : String(error)
	}));
	if (!result.left) params.logger.warn(`${TEAMS_MEETINGS_RUNTIME_PLATFORM.logScope} browser rollback after realtime startup failure did not complete: ${result.note}`);
}
function realtimeBindings(params) {
	return {
		platform: TEAMS_MEETINGS_RUNTIME_PLATFORM,
		consultAgent: (consult) => consultOpenClawAgentForTeamsMeeting({
			config: params.config,
			fullConfig: params.fullConfig,
			runtime: params.runtime,
			logger: params.logger,
			...consult
		}),
		tools: resolveTeamsMeetingsRealtimeTools(params.config.realtime.toolPolicy),
		handleToolCall: (call) => handleTeamsMeetingsRealtimeConsultToolCall({
			config: params.config,
			fullConfig: params.fullConfig,
			runtime: params.runtime,
			logger: params.logger,
			...call
		})
	};
}
async function assertBlackHole2chAvailable(params) {
	if (process.platform !== "darwin") throw new Error("Microsoft Teams meeting talk-back with BlackHole 2ch is macOS-only");
	const result = await params.runtime.system.runCommandWithTimeout([TEAMS_MEETINGS_SYSTEM_PROFILER_COMMAND, "SPAudioDataType"], { timeoutMs: params.timeoutMs });
	const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
	if (result.code !== 0 || !outputMentionsBlackHole2ch(output)) {
		const hint = params.runtime.system.formatNativeDependencyHint?.({
			packageName: "BlackHole 2ch",
			downloadCommand: "brew install blackhole-2ch"
		}) ?? "";
		throw new Error([
			"BlackHole 2ch audio device not found.",
			"Install BlackHole 2ch and SoX.",
			hint
		].filter(Boolean).join(" "));
	}
}
async function startLocalAudioBridge(params) {
	if (!isTeamsMeetingsTalkBackMode(params.mode)) return;
	const transport = createLocalMeetingRealtimeAudioTransport({
		inputCommand: params.config.chrome.audioInputCommand,
		outputCommand: params.config.chrome.audioOutputCommand,
		bargeInInputCommand: params.config.chrome.bargeInInputCommand,
		bargeInRmsThreshold: params.config.chrome.bargeInRmsThreshold,
		bargeInPeakThreshold: params.config.chrome.bargeInPeakThreshold,
		bargeInCooldownMs: params.config.chrome.bargeInCooldownMs,
		logger: params.logger,
		logScope: TEAMS_MEETINGS_RUNTIME_PLATFORM.logScope
	});
	const bindings = realtimeBindings(params);
	try {
		return {
			type: "command-pair",
			...params.mode === "agent" ? await startMeetingAgentRealtimeEngine({
				config: params.config,
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				platform: bindings.platform,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				transport,
				logger: params.logger,
				consultAgent: bindings.consultAgent
			}) : await startMeetingRealtimeEngine({
				config: {
					...params.config,
					realtime: {
						...params.config.realtime,
						strategy: "bidi"
					}
				},
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				...bindings,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				transport,
				logger: params.logger
			})
		};
	} catch (error) {
		await transport.dispose().catch(() => {});
		throw error;
	}
}
async function launchTeamsMeetingInChrome(params) {
	if (isTeamsMeetingsTalkBackMode(params.mode)) await assertBlackHole2chAvailable({
		runtime: params.runtime,
		timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
	});
	const callBrowser = await resolveLocalMeetingBrowserRequest(params.runtime);
	const result = await openOrRecoverTeamsMeeting({
		callBrowser,
		config: params.config,
		locationLabel: "in local Chrome",
		meetingSessionId: params.meetingSessionId,
		mode: params.mode,
		trackedTargetId: params.trackedTargetId,
		url: params.url
	});
	if (!isTeamsMeetingsRealtimeRouteReady(params.mode, result.browser)) return result;
	try {
		return {
			...result,
			audioBridge: await startLocalAudioBridge(params)
		};
	} catch (error) {
		await rollbackTeamsBrowserJoin({
			callBrowser,
			config: params.config,
			logger: params.logger,
			meetingSessionId: params.meetingSessionId,
			tab: result.tab,
			url: params.url
		});
		throw error;
	}
}
async function resolveChromeNode(params) {
	return await resolveMeetingBrowserNode({
		...params,
		adapter: TEAMS_MEETINGS_BROWSER_NODE_ADAPTER
	});
}
async function callNodeBrowser(params) {
	return await callMeetingBrowserProxyOnNode({
		...params,
		adapter: TEAMS_MEETINGS_BROWSER_NODE_ADAPTER
	});
}
function parseNodeStartResult(raw) {
	const value = raw && typeof raw === "object" && "payload" in raw ? raw.payload : raw;
	if (!value || typeof value !== "object") throw new Error("Microsoft Teams meeting node returned an invalid start result.");
	return value;
}
async function launchTeamsMeetingOnNode(params) {
	const nodeId = await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	});
	try {
		await params.runtime.nodes.invoke({
			nodeId,
			command: TEAMS_MEETINGS_NODE_COMMAND,
			params: {
				action: "stopByUrl",
				url: params.url,
				mode: params.mode
			},
			timeoutMs: 5e3
		});
	} catch (error) {
		params.logger.debug?.(`${TEAMS_MEETINGS_RUNTIME_PLATFORM.logScope} node bridge cleanup ignored: ${error instanceof Error ? error.message : String(error)}`);
	}
	const callBrowser = async (request) => await callNodeBrowser({
		runtime: params.runtime,
		nodeId,
		method: request.method,
		path: request.path,
		body: request.body,
		timeoutMs: request.timeoutMs
	});
	const browser = await openOrRecoverTeamsMeeting({
		callBrowser,
		config: params.config,
		locationLabel: "on the selected Chrome node",
		meetingSessionId: params.meetingSessionId,
		mode: params.mode,
		trackedTargetId: params.trackedTargetId,
		url: params.url
	});
	if (!isTeamsMeetingsRealtimeRouteReady(params.mode, browser.browser)) return {
		nodeId,
		launched: browser.launched,
		browser: browser.browser,
		tab: browser.tab
	};
	try {
		const result = parseNodeStartResult(await params.runtime.nodes.invoke({
			nodeId,
			command: TEAMS_MEETINGS_NODE_COMMAND,
			params: {
				action: "start",
				url: params.url,
				mode: params.mode,
				launch: false,
				browserProfile: params.config.chrome.browserProfile,
				joinTimeoutMs: params.config.chrome.joinTimeoutMs,
				audioInputCommand: params.config.chrome.audioInputCommand,
				audioOutputCommand: params.config.chrome.audioOutputCommand
			},
			timeoutMs: addTimerTimeoutGraceMs(params.config.chrome.joinTimeoutMs) ?? 1
		}));
		if (result.audioBridge?.type !== "node-command-pair") return {
			nodeId,
			launched: browser.launched || result.launched === true,
			browser: browser.browser ?? result.browser,
			tab: browser.tab
		};
		if (!result.bridgeId) throw new Error("Microsoft Teams meeting node did not return an audio bridge id.");
		const transport = createNodeMeetingRealtimeAudioTransport({
			runtime: params.runtime,
			nodeId,
			bridgeId: result.bridgeId,
			logger: params.logger,
			commandName: TEAMS_MEETINGS_NODE_COMMAND,
			logScope: TEAMS_MEETINGS_RUNTIME_PLATFORM.logScope,
			logPrefix: params.mode === "agent" ? "node agent" : "node"
		});
		const bindings = realtimeBindings(params);
		let engine;
		try {
			engine = params.mode === "agent" ? await startMeetingAgentRealtimeEngine({
				config: params.config,
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				platform: bindings.platform,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				logPrefix: "node",
				transport,
				logger: params.logger,
				consultAgent: bindings.consultAgent
			}) : await startMeetingRealtimeEngine({
				config: {
					...params.config,
					realtime: {
						...params.config.realtime,
						strategy: "bidi"
					}
				},
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				...bindings,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				logPrefix: "node",
				talkSessionId: `teams-meetings:${params.meetingSessionId}:${result.bridgeId}:node-realtime`,
				talkContext: {
					nodeId,
					bridgeId: result.bridgeId
				},
				transport,
				logger: params.logger
			});
		} catch (error) {
			await transport.dispose().catch(() => {});
			throw error;
		}
		return {
			nodeId,
			launched: browser.launched || result.launched === true,
			audioBridge: {
				type: "node-command-pair",
				nodeId,
				bridgeId: result.bridgeId,
				...engine
			},
			browser: browser.browser ?? result.browser,
			tab: browser.tab
		};
	} catch (error) {
		await params.runtime.nodes.invoke({
			nodeId,
			command: TEAMS_MEETINGS_NODE_COMMAND,
			params: {
				action: "stopByUrl",
				url: params.url,
				mode: params.mode
			},
			timeoutMs: 5e3
		}).catch(() => {});
		await rollbackTeamsBrowserJoin({
			callBrowser,
			config: params.config,
			logger: params.logger,
			meetingSessionId: params.meetingSessionId,
			tab: browser.tab,
			url: params.url
		});
		throw error;
	}
}
async function recoverCurrentTeamsMeetingTab(params) {
	const nodeId = params.transport === "chrome-node" ? params.nodeId ?? await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	}) : void 0;
	return {
		transport: params.transport,
		...nodeId ? { nodeId } : {},
		...await recoverMeetingBrowserTab({
			adapter: TEAMS_MEETINGS_PLATFORM_ADAPTER,
			callBrowser: nodeId ? async (request) => await callNodeBrowser({
				runtime: params.runtime,
				nodeId,
				method: request.method,
				path: request.path,
				body: request.body,
				timeoutMs: request.timeoutMs
			}) : await resolveLocalMeetingBrowserRequest(params.runtime),
			config: params.config.chrome,
			locationLabel: nodeId ? "on the selected Chrome node" : "in local Chrome",
			meetingSessionId: params.meetingSessionId,
			mode: params.mode,
			readOnly: params.readOnly,
			requestedMeetingUrl: params.url,
			trackedMeetingUrl: params.trackedMeetingUrl,
			trackedTargetId: params.trackedTargetId,
			timeoutMs: params.timeoutMs
		})
	};
}
async function leaveTeamsMeetingInBrowser(params) {
	const nodeId = params.nodeId;
	return await leaveMeetingWithBrowser({
		adapter: TEAMS_MEETINGS_PLATFORM_ADAPTER,
		callBrowser: nodeId ? async (request) => await callNodeBrowser({
			runtime: params.runtime,
			nodeId,
			method: request.method,
			path: request.path,
			body: request.body,
			timeoutMs: request.timeoutMs
		}) : await resolveLocalMeetingBrowserRequest(params.runtime),
		launch: params.config.chrome.launch || !params.tab.openedByPlugin,
		meetingSessionId: params.meetingSessionId,
		meetingUrl: params.meetingUrl,
		tab: params.tab,
		timeoutMs: params.config.chrome.joinTimeoutMs
	});
}
async function readTeamsMeetingTranscript(params) {
	const nodeId = params.nodeId;
	return await readMeetingTranscriptWithBrowser({
		adapter: TEAMS_MEETINGS_PLATFORM_ADAPTER,
		callBrowser: nodeId ? async (request) => await callNodeBrowser({
			runtime: params.runtime,
			nodeId,
			method: request.method,
			path: request.path,
			body: request.body,
			timeoutMs: request.timeoutMs
		}) : await resolveLocalMeetingBrowserRequest(params.runtime),
		finalize: params.finalize === true,
		meetingUrl: params.meetingUrl,
		meetingSessionId: params.meetingSessionId,
		tab: params.tab,
		timeoutMs: Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4)
	});
}
//#endregion
//#region extensions/teams-meetings/src/runtime-setup.ts
function audioCommands(config) {
	return uniqueStrings([
		config.chrome.audioInputCommand[0],
		config.chrome.audioOutputCommand[0],
		config.chrome.bargeInInputCommand?.[0]
	].filter((value) => Boolean(value?.trim())));
}
async function commandExists(runtime, command) {
	return (await runtime.system.runCommandWithTimeout([
		"/bin/sh",
		"-lc",
		"command -v \"$1\" >/dev/null 2>&1",
		"sh",
		command
	], { timeoutMs: 5e3 })).code === 0;
}
async function getTeamsMeetingsSetupStatus(params) {
	const mode = params.options?.mode ?? params.config.defaultMode;
	const transport = params.options?.transport ?? (params.config.chromeNode.node ? "chrome-node" : "chrome");
	const talkBack = mode === "agent" || mode === "bidi";
	let status = createMeetingSetupStatus([
		{
			id: "chrome-profile",
			ok: true,
			message: params.config.chrome.browserProfile ? `Chrome node profile configured: ${params.config.chrome.browserProfile}` : "Local Chrome uses the configured OpenClaw browser profile"
		},
		{
			id: "guest-join",
			ok: Boolean(params.config.chrome.guestName && params.config.chrome.autoJoin && params.config.chrome.reuseExistingTab),
			message: params.config.chrome.guestName && params.config.chrome.autoJoin && params.config.chrome.reuseExistingTab ? "Guest name, auto-join, and tab reuse are configured" : "Set chrome.guestName, chrome.autoJoin, and chrome.reuseExistingTab for unattended guest joins"
		},
		{
			id: "captions",
			ok: true,
			message: mode === "transcribe" ? "Teams caption scraping is disabled pending live selector validation; transcript snapshots are empty" : "Caption scraping is not used by talk-back modes"
		}
	]);
	if (transport === "chrome-node") try {
		const node = await resolveMeetingBrowserNodeInfo({
			runtime: params.runtime,
			requestedNode: params.config.chromeNode.node,
			adapter: TEAMS_MEETINGS_BROWSER_NODE_ADAPTER
		});
		status = addMeetingSetupCheck(status, {
			id: "chrome-node-connected",
			ok: true,
			message: `Connected Teams meeting node ready: ${node.displayName ?? node.remoteIp ?? node.nodeId}`
		});
		if (talkBack) {
			if (!node.nodeId) throw new Error("Connected Microsoft Teams meetings node did not include a node id.");
			await params.runtime.nodes.invoke({
				nodeId: node.nodeId,
				command: TEAMS_MEETINGS_BROWSER_NODE_ADAPTER.nodeCommandName,
				params: {
					action: "setup",
					audioInputCommand: params.config.chrome.audioInputCommand,
					audioOutputCommand: params.config.chrome.audioOutputCommand,
					...params.config.chrome.bargeInInputCommand ? { bargeInInputCommand: params.config.chrome.bargeInInputCommand } : {}
				},
				timeoutMs: 12e3
			});
			status = addMeetingSetupCheck(status, {
				id: "chrome-node-audio-prerequisites",
				ok: true,
				message: "Remote macOS, BlackHole 2ch, and SoX prerequisites are ready"
			});
		}
	} catch (error) {
		const connected = status.checks.some((check) => check.id === "chrome-node-connected" && check.ok);
		status = addMeetingSetupCheck(status, {
			id: connected ? "chrome-node-audio-prerequisites" : "chrome-node-connected",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	if (!talkBack) return status;
	status = addMeetingSetupCheck(status, {
		id: "audio-bridge",
		ok: params.config.chrome.audioInputCommand.length > 0 && params.config.chrome.audioOutputCommand.length > 0,
		message: `SoX command-pair audio bridge configured (${params.config.chrome.audioFormat})`
	});
	if (transport === "chrome-node") return status;
	try {
		await assertBlackHole2chAvailable({
			runtime: params.runtime,
			timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
		});
		status = addMeetingSetupCheck(status, {
			id: "chrome-local-audio-device",
			ok: true,
			message: "BlackHole 2ch audio device found"
		});
	} catch (error) {
		status = addMeetingSetupCheck(status, {
			id: "chrome-local-audio-device",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	const missing = [];
	for (const command of audioCommands(params.config)) if (!await commandExists(params.runtime, command).catch(() => false)) missing.push(command);
	return addMeetingSetupCheck(status, {
		id: "chrome-local-audio-commands",
		ok: missing.length === 0,
		message: missing.length === 0 ? "Configured Chrome audio commands are available" : `Chrome audio commands missing: ${missing.join(", ")}`
	});
}
//#endregion
//#region extensions/teams-meetings/src/runtime.ts
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function resolveTransport(request, config) {
	return request.transport ?? (config.chromeNode.node ? "chrome-node" : "chrome");
}
function withSessionAgentConfig(config, agentId) {
	return config.realtime.agentId === agentId ? config : {
		...config,
		realtime: {
			...config.realtime,
			agentId
		}
	};
}
function noteSession(session, note) {
	session.notes = [...session.notes.filter((item) => item !== note), note];
}
var TeamsMeetingsRuntime = class {
	#defaultAgentId;
	#sessions;
	#requesterSessionKeys = /* @__PURE__ */ new Map();
	constructor(params) {
		this.params = params;
		this.#defaultAgentId = normalizeAgentId(params.config.realtime.agentId ?? resolveDefaultAgentId(params.fullConfig));
		this.#sessions = new MeetingSessionRuntime({
			logger: params.logger,
			logScope: TEAMS_MEETINGS_PLATFORM_ADAPTER.logScope,
			formatError: formatErrorMessage,
			reuseExistingBrowserTab: params.config.chrome.reuseExistingTab,
			waitForInCallMs: params.config.chrome.waitForInCallMs,
			joinTimeoutMs: params.config.chrome.joinTimeoutMs,
			defaultSpeechInstructions: params.config.realtime.introMessage,
			transientSpeechBlockedReasons: /* @__PURE__ */ new Set([
				"not-in-call",
				"browser-unverified",
				"teams-microphone-muted"
			]),
			messages: {
				previousBrowserLeaveFailed: "Could not leave the previous Teams meeting tab before reassignment.",
				reassignedSessionNote: "Ended before the same Teams meeting tab was reassigned to another agent.",
				reusedSessionNote: "Reused existing active Microsoft Teams meeting session.",
				replacementBrowserLeaveFailed: "Could not leave the previous Teams meeting tab before reassignment.",
				speechBlockedFallback: "Realtime speech blocked until Microsoft Teams is ready.",
				speech: {
					audioBridgeUnavailable: "Realtime speech requires an active Chrome audio bridge.",
					browserUnverified: "Microsoft Teams browser state has not been verified yet.",
					manualActionFallback: "Resolve the Microsoft Teams browser prompt before asking OpenClaw to speak.",
					microphoneMuted: "Turn on the OpenClaw Teams microphone before asking OpenClaw to speak.",
					microphoneMutedReason: "teams-microphone-muted",
					notInCall: "Microsoft Teams has not reported that the browser guest is in the call.",
					notInCallReason: "not-in-call",
					browserUnverifiedReason: "browser-unverified",
					audioBridgeUnavailableReason: "audio-bridge-unavailable"
				}
			},
			resolveJoin: (request) => ({
				url: TEAMS_MEETINGS_PLATFORM_ADAPTER.urls.validateAndNormalize(request.url),
				transport: resolveTransport(request, params.config),
				mode: request.mode ?? params.config.defaultMode,
				agentId: normalizeAgentId(request.agentId ?? this.#defaultAgentId)
			}),
			createSession: ({ request, resolved, createdAt }) => {
				const session = createTeamsMeetingsSession({
					config: params.config,
					resolved,
					createdAt
				});
				if (request.requesterSessionKey) this.#requesterSessionKeys.set(session.id, request.requesterSessionKey);
				return session;
			},
			resolveSpeechInstructions: (request) => request.message ?? params.config.realtime.introMessage,
			isBrowserTransport: () => true,
			isTalkBackMode: isTeamsMeetingsTalkBackMode,
			isTranscribeMode: (mode) => mode === "transcribe",
			sameMeetingUrl: (left, right) => TEAMS_MEETINGS_PLATFORM_ADAPTER.urls.isSameMeeting(left, right),
			normalizeMeetingUrlForReuse: (url) => TEAMS_MEETINGS_PLATFORM_ADAPTER.urls.normalizeForReuse(url),
			getBrowser: (session) => session.chrome ? {
				launched: session.chrome.launched,
				nodeId: session.chrome.nodeId,
				tab: session.chrome.browserTab,
				health: session.chrome.health,
				hasAudioBridge: Boolean(session.chrome.audioBridge)
			} : void 0,
			setBrowserTab: (session, tab) => {
				if (session.chrome) session.chrome.browserTab = tab;
			},
			setBrowserHealth: (session, health) => {
				if (session.chrome) session.chrome.health = health;
			},
			joinTransport: async ({ request, session, context }) => await this.#joinTransport(request, session, context),
			releaseBrowserTab: async (session) => await this.#releaseBrowserTab(session),
			refreshBrowserHealth: async (session, options) => await this.#refreshBrowserHealth(session, options),
			refreshStatus: async (session) => await this.#sessions.refreshBrowserHealth(session, {
				force: true,
				readOnly: true
			}),
			refreshReusableSession: async (_session, _request, _resolved) => {},
			ensureRealtimeBridge: async (session) => await this.#ensureRealtimeBridge(session),
			captureTranscript: async (session, options) => await this.#captureTranscript(session, options),
			speakViaTransport: async () => void 0
		});
	}
	list() {
		return this.#sessions.list();
	}
	ownsSession(agentId, sessionId) {
		return this.list().some((session) => session.id === sessionId && session.agentId === agentId);
	}
	async join(request) {
		try {
			return await this.#sessions.join(request);
		} catch (error) {
			const activeIds = new Set(this.list().map((session) => session.id));
			for (const sessionId of this.#requesterSessionKeys.keys()) if (!activeIds.has(sessionId)) this.#requesterSessionKeys.delete(sessionId);
			throw error;
		}
	}
	async leave(sessionId) {
		try {
			return await this.#sessions.leave(sessionId);
		} finally {
			this.#requesterSessionKeys.delete(sessionId);
		}
	}
	async status(sessionId) {
		return await this.#sessions.status(sessionId);
	}
	async statusForAgent(agentId, sessionId) {
		if (sessionId) return this.ownsSession(agentId, sessionId) ? await this.#sessions.status(sessionId) : { found: false };
		const sessions = this.list().filter((session) => session.agentId === agentId);
		await Promise.all(sessions.map((session) => this.#sessions.status(session.id)));
		return {
			found: true,
			sessions
		};
	}
	async transcript(sessionId, options = {}) {
		return await this.#sessions.transcript(sessionId, options);
	}
	async speak(sessionId, instructions) {
		return await this.#sessions.speak(sessionId, instructions);
	}
	async setupStatus(options) {
		return await getTeamsMeetingsSetupStatus({
			config: this.params.config,
			fullConfig: this.params.fullConfig,
			runtime: this.params.runtime,
			options
		});
	}
	async testSpeech(request) {
		return await testTeamsMeetingSpeech(this.#probeContext(), request);
	}
	async testListen(request) {
		return await testTeamsMeetingListening(this.#probeContext(), request);
	}
	#probeContext() {
		return {
			config: this.params.config,
			resolveAgentId: (request) => normalizeAgentId(request.agentId ?? this.#defaultAgentId),
			list: () => this.list(),
			join: async (request) => await this.join(request),
			isReusable: (session, resolved) => this.#sessions.isReusableSession(session, resolved),
			hasHealthHandle: (sessionId) => this.#sessions.hasHealthHandle(sessionId),
			refreshHealth: (sessionId) => this.#sessions.refreshHealth(sessionId),
			refreshCaptionHealth: async (session, timeoutMs) => await this.#refreshBrowserHealth(session, { timeoutMs })
		};
	}
	async #joinTransport(request, session, context) {
		const config = withSessionAgentConfig(this.params.config, session.agentId);
		const result = session.transport === "chrome-node" ? await launchTeamsMeetingOnNode({
			runtime: this.params.runtime,
			config,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			requesterSessionKey: request.requesterSessionKey,
			mode: session.mode,
			url: session.url,
			logger: this.params.logger
		}) : await launchTeamsMeetingInChrome({
			runtime: this.params.runtime,
			config,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			requesterSessionKey: request.requesterSessionKey,
			mode: session.mode,
			url: session.url,
			logger: this.params.logger
		});
		const nodeId = "nodeId" in result ? result.nodeId : void 0;
		const tab = context.inheritedBrowserTab({
			session,
			transport: session.transport,
			nodeId,
			meetingUrl: session.url,
			tab: result.tab
		});
		session.chrome = {
			audioBackend: "blackhole-2ch",
			launched: result.launched,
			nodeId,
			browserProfile: this.params.config.chrome.browserProfile,
			browserTab: tab,
			health: result.browser
		};
		const handles = this.#attachAudioBridge(session, result.audioBridge);
		if (handles) context.attachRuntimeHandles(session, handles);
		session.notes.push(result.audioBridge ? session.transport === "chrome-node" ? "Teams guest joined in Chrome on the selected node with realtime audio through the node bridge." : "Teams guest joined in local Chrome with realtime audio through BlackHole 2ch and SoX." : session.mode === "transcribe" ? "Teams guest joined observe-only with live-caption transcript capture." : "Teams guest join is waiting for the browser to become ready before starting realtime audio.");
		this.#sessions.refreshSpeechReadiness(session);
		return {};
	}
	#attachAudioBridge(session, audioBridge) {
		if (!session.chrome || !audioBridge) return;
		session.chrome.audioBridge = {
			type: audioBridge.type,
			provider: audioBridge.providerId
		};
		return {
			stop: audioBridge.stop,
			speak: audioBridge.speak,
			getHealth: audioBridge.getHealth
		};
	}
	async #ensureRealtimeBridge(session) {
		if (!isTeamsMeetingsTalkBackMode(session.mode) || session.state !== "active" || !session.chrome || session.chrome.audioBridge || !isTeamsMeetingsRealtimeRouteReady(session.mode, session.chrome.health)) return;
		const config = withSessionAgentConfig(this.params.config, session.agentId);
		const recoveryConfig = {
			...config,
			chrome: {
				...config.chrome,
				launch: false
			},
			chromeNode: { node: session.chrome.nodeId ?? config.chromeNode.node }
		};
		const result = session.transport === "chrome-node" ? await launchTeamsMeetingOnNode({
			runtime: this.params.runtime,
			config: recoveryConfig,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			requesterSessionKey: this.#requesterSessionKeys.get(session.id),
			mode: session.mode,
			trackedTargetId: session.chrome.browserTab?.targetId,
			url: session.url,
			logger: this.params.logger
		}) : await launchTeamsMeetingInChrome({
			runtime: this.params.runtime,
			config: recoveryConfig,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			requesterSessionKey: this.#requesterSessionKeys.get(session.id),
			mode: session.mode,
			trackedTargetId: session.chrome.browserTab?.targetId,
			url: session.url,
			logger: this.params.logger
		});
		if (result.tab) {
			const currentTab = session.chrome.browserTab;
			session.chrome.browserTab = {
				...result.tab,
				openedByPlugin: result.tab.targetId === currentTab?.targetId ? currentTab.openedByPlugin : result.tab.openedByPlugin
			};
		}
		if (result.browser) session.chrome.health = {
			...session.chrome.health,
			...result.browser
		};
		session.updatedAt = nowIso();
		return this.#attachAudioBridge(session, result.audioBridge);
	}
	async #refreshBrowserHealth(session, options = {}) {
		try {
			const result = await recoverCurrentTeamsMeetingTab({
				runtime: this.params.runtime,
				config: this.params.config,
				meetingSessionId: session.id,
				mode: session.mode,
				nodeId: session.chrome?.nodeId,
				readOnly: options.readOnly,
				trackedMeetingUrl: session.url,
				trackedTargetId: session.chrome?.browserTab?.targetId,
				transport: session.transport,
				timeoutMs: options.timeoutMs,
				url: session.url
			});
			if (result.found && session.chrome) {
				if (result.tab?.targetId) {
					const currentTab = session.chrome.browserTab;
					session.chrome.browserTab = {
						targetId: result.tab.targetId,
						openedByPlugin: result.tab.targetId === currentTab?.targetId ? currentTab.openedByPlugin : false
					};
				}
				if (result.browser) session.chrome.health = {
					...session.chrome.health,
					...result.browser
				};
				session.updatedAt = nowIso();
			}
		} catch (error) {
			this.params.logger.debug?.(`${TEAMS_MEETINGS_PLATFORM_ADAPTER.logScope} browser readiness refresh ignored: ${formatErrorMessage(error)}`);
		}
	}
	async #captureTranscript(session, options = {}) {
		await this.#sessions.refreshCaptionHealth(session);
		const tab = session.chrome?.browserTab;
		if (!tab) return;
		return await readTeamsMeetingTranscript({
			runtime: this.params.runtime,
			config: this.params.config,
			finalize: options.finalize,
			meetingUrl: session.url,
			meetingSessionId: session.id,
			nodeId: session.chrome?.nodeId,
			tab
		});
	}
	async #releaseBrowserTab(session) {
		const tab = session.chrome?.browserTab;
		if (!tab) {
			noteSession(session, "No tracked Teams meeting tab; leave the browser meeting manually if it is still active.");
			session.browserLeft = false;
			return false;
		}
		if (this.list().some((other) => other.id !== session.id && other.state === "active" && other.chrome?.browserTab?.targetId === tab.targetId && other.chrome?.nodeId === session.chrome?.nodeId)) {
			noteSession(session, "Kept the shared Teams meeting tab open for another active session.");
			return;
		}
		try {
			const result = await leaveTeamsMeetingInBrowser({
				runtime: this.params.runtime,
				config: this.params.config,
				meetingSessionId: session.id,
				meetingUrl: session.url,
				nodeId: session.chrome?.nodeId,
				tab
			});
			noteSession(session, result.note);
			if (result.left && session.chrome) {
				session.chrome.browserTab = void 0;
				if (session.chrome.health) session.chrome.health = {
					...session.chrome.health,
					captioning: false,
					audioInputRouted: false,
					audioOutputRouted: false,
					providerConnected: false,
					realtimeReady: false,
					audioInputActive: false,
					audioOutputActive: false
				};
			}
			session.browserLeft = result.left;
			return result.left;
		} catch (error) {
			noteSession(session, `Browser control could not leave the Teams meeting tab: ${formatErrorMessage(error)}`);
			session.browserLeft = false;
			return false;
		}
	}
};
//#endregion
//#region extensions/teams-meetings/index.ts
const loadTeamsMeetingsCli = createLazyRuntimeModule(() => import("../../cli-ahQrZ2Th.js"));
const teamsMeetingsConfigSchema = {
	parse(value) {
		return resolveTeamsMeetingsConfig(value);
	},
	uiHints: {
		defaultMode: {
			label: "Default Mode",
			help: "Agent consults OpenClaw, bidi uses direct realtime voice, and transcribe observes only."
		},
		"chrome.browserProfile": {
			label: "Chrome Profile",
			advanced: true
		},
		"chrome.guestName": { label: "Guest Name" },
		"chrome.waitForInCallMs": {
			label: "Wait For In-Call (ms)",
			advanced: true
		},
		"chrome.audioInputCommand": {
			label: "Audio Input Command",
			advanced: true
		},
		"chrome.audioOutputCommand": {
			label: "Audio Output Command",
			advanced: true
		},
		"chromeNode.node": {
			label: "Chrome Node",
			help: "Node id/name/IP that owns Chrome, BlackHole, and SoX.",
			advanced: true
		},
		"realtime.transcriptionProvider": { label: "Realtime Transcription Provider" },
		"realtime.voiceProvider": { label: "Bidi Voice Provider" },
		"realtime.model": {
			label: "Bidi Realtime Model",
			advanced: true
		},
		"realtime.instructions": {
			label: "Realtime Instructions",
			advanced: true
		},
		"realtime.introMessage": { label: "Realtime Intro Message" },
		"realtime.agentId": {
			label: "Realtime Consult Agent",
			advanced: true
		},
		"realtime.toolPolicy": {
			label: "Realtime Tool Policy",
			advanced: true
		}
	}
};
const TeamsMeetingsToolSchema = Type.Object({
	action: Type.String({ enum: [
		"join",
		"leave",
		"status",
		"transcript",
		"speak"
	] }),
	url: Type.Optional(Type.String({ description: "Microsoft Teams meeting URL" })),
	transport: Type.Optional(Type.String({ enum: ["chrome", "chrome-node"] })),
	mode: Type.Optional(Type.String({ enum: [
		"agent",
		"bidi",
		"transcribe"
	] })),
	sessionId: Type.Optional(Type.String({ description: "Teams meeting session ID" })),
	sinceIndex: Type.Optional(Type.Integer({
		minimum: 0,
		description: "Resume transcript from this index"
	})),
	message: Type.Optional(Type.String({ description: "Instructions to speak" }))
});
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
var TeamsMeetingsInvalidRequestError = class extends Error {};
function invalidRequest(message) {
	return new TeamsMeetingsInvalidRequestError(message);
}
function normalizeTransport(value) {
	if (value === void 0) return;
	if (value === "chrome" || value === "chrome-node") return value;
	throw invalidRequest("transport must be chrome or chrome-node");
}
function normalizeMode(value) {
	if (value === void 0) return;
	if (value === "agent" || value === "bidi" || value === "transcribe") return value;
	throw invalidRequest("mode must be agent, bidi, or transcribe");
}
function requireString(value, name) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) throw invalidRequest(`${name} required`);
	return normalized;
}
function readSinceIndex(raw) {
	try {
		return readNonNegativeIntegerParam(raw, "sinceIndex");
	} catch (error) {
		throw invalidRequest(formatErrorMessage(error));
	}
}
function keepTrustedToolAgentId(raw, client) {
	const { agentId: rawAgentId, ...rest } = raw;
	if (client?.internal?.pluginRuntimeOwnerId !== "teams-meetings") return rest;
	const agentId = normalizeOptionalString(rawAgentId);
	return agentId ? {
		...rest,
		agentId
	} : rest;
}
function trustedToolAgentId(raw, client) {
	return normalizeOptionalString(keepTrustedToolAgentId(raw, client).agentId);
}
function joinRequest(raw, options) {
	if (!options?.allowTimeout && raw.timeoutMs !== void 0) throw invalidRequest("timeoutMs is supported only by testSpeech or testListen");
	let url;
	let timeoutMs;
	try {
		url = normalizeTeamsMeetingUrl(requireString(raw.url, "url"));
		timeoutMs = readPositiveIntegerParam(raw, "timeoutMs");
	} catch (error) {
		if (error instanceof TeamsMeetingsInvalidRequestError) throw error;
		throw invalidRequest(formatErrorMessage(error));
	}
	return {
		url,
		transport: normalizeTransport(raw.transport),
		mode: normalizeMode(raw.mode),
		message: normalizeOptionalString(raw.message),
		requesterSessionKey: normalizeOptionalString(raw.requesterSessionKey),
		agentId: normalizeOptionalString(raw.agentId),
		timeoutMs
	};
}
function gatewayMethod(action) {
	return `teamsmeetings.${action}`;
}
function readErrorDetails(error) {
	return error && typeof error === "object" && "details" in error ? error.details : void 0;
}
async function callGatewayFromTool(params) {
	try {
		if (params.runtime) return await params.runtime.gateway.request(gatewayMethod(params.action), params.raw, {
			timeoutMs: resolveTeamsMeetingsGatewayOperationTimeoutMs(params.config),
			scopes: ["operator.admin"]
		});
		return await callGatewayFromCli(gatewayMethod(params.action), {
			json: true,
			timeout: String(resolveTeamsMeetingsGatewayOperationTimeoutMs(params.config))
		}, params.raw, {
			progress: false,
			scopes: ["operator.admin"]
		});
	} catch (error) {
		const details = readErrorDetails(error);
		if (details && typeof details === "object") return details;
		throw error;
	}
}
var teams_meetings_default = definePluginEntry({
	id: "teams-meetings",
	name: "Microsoft Teams meetings",
	description: "Join Microsoft Teams meetings as a Chrome browser guest",
	configSchema: teamsMeetingsConfigSchema,
	register(api) {
		const config = teamsMeetingsConfigSchema.parse(api.pluginConfig);
		let runtime;
		const ensureRuntime = async () => {
			if (!config.enabled) throw new Error("Microsoft Teams meetings plugin disabled in plugin config");
			runtime ??= new TeamsMeetingsRuntime({
				config,
				fullConfig: api.config,
				runtime: api.runtime,
				logger: api.logger
			});
			return runtime;
		};
		const sendError = (respond, error, code = ErrorCodes.UNAVAILABLE) => {
			const payload = { error: formatErrorMessage(error) };
			respond(false, payload, errorShape(code, payload.error, { details: payload }));
		};
		const sendRequestError = (respond, error) => sendError(respond, error, error instanceof TeamsMeetingsInvalidRequestError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE);
		api.registerGatewayMethod("teamsmeetings.join", async ({ params, client, respond }) => {
			try {
				const raw = keepTrustedToolAgentId(asRecord(params), client);
				respond(true, await (await ensureRuntime()).join(joinRequest(raw)));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		api.registerGatewayMethod("teamsmeetings.leave", async ({ params, client, respond }) => {
			try {
				const raw = asRecord(params);
				const agentId = trustedToolAgentId(raw, client);
				const sessionId = requireString(raw.sessionId, "sessionId");
				const rt = await ensureRuntime();
				respond(true, agentId && !rt.ownsSession(agentId, sessionId) ? { found: false } : await rt.leave(sessionId));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		api.registerGatewayMethod("teamsmeetings.status", async ({ params, client, respond }) => {
			try {
				const raw = asRecord(params);
				const agentId = trustedToolAgentId(raw, client);
				const rt = await ensureRuntime();
				respond(true, agentId ? await rt.statusForAgent(agentId, normalizeOptionalString(raw.sessionId)) : await rt.status(normalizeOptionalString(raw.sessionId)));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		api.registerGatewayMethod("teamsmeetings.transcript", async ({ params, client, respond }) => {
			try {
				const raw = asRecord(params);
				const sessionId = requireString(raw.sessionId, "sessionId");
				const sinceIndex = readSinceIndex(raw);
				const agentId = trustedToolAgentId(raw, client);
				const rt = await ensureRuntime();
				respond(true, agentId && !rt.ownsSession(agentId, sessionId) ? { found: false } : await rt.transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex }));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		api.registerGatewayMethod("teamsmeetings.speak", async ({ params, client, respond }) => {
			try {
				const raw = asRecord(params);
				const sessionId = requireString(raw.sessionId, "sessionId");
				const agentId = trustedToolAgentId(raw, client);
				const rt = await ensureRuntime();
				respond(true, agentId && !rt.ownsSession(agentId, sessionId) ? {
					found: false,
					spoken: false
				} : await rt.speak(sessionId, normalizeOptionalString(raw.message)));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		api.registerGatewayMethod("teamsmeetings.setup", async ({ params, respond }) => {
			try {
				respond(true, await (await ensureRuntime()).setupStatus({
					mode: normalizeMode(params?.mode),
					transport: normalizeTransport(params?.transport)
				}));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		for (const [method, run] of [["teamsmeetings.testSpeech", (rt, raw) => rt.testSpeech(joinRequest(raw, { allowTimeout: true }))], ["teamsmeetings.testListen", (rt, raw) => rt.testListen(joinRequest(raw, { allowTimeout: true }))]]) api.registerGatewayMethod(method, async ({ params, client, respond }) => {
			try {
				const raw = keepTrustedToolAgentId(asRecord(params), client);
				respond(true, await run(await ensureRuntime(), raw));
			} catch (error) {
				sendRequestError(respond, error);
			}
		});
		api.registerTool((toolContext) => ({
			name: "teams_meetings",
			label: "Microsoft Teams meetings",
			description: "Join and manage Microsoft Teams meeting browser guests. Guest admission, tenant sign-in, and media permissions may require manual action in the OpenClaw Chrome profile.",
			parameters: TeamsMeetingsToolSchema,
			async execute(_toolCallId, params) {
				const raw = asRecord(params);
				const action = raw.action;
				const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
				const contextAgentId = toolContext.agentId ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
				const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
				try {
					if (![
						"join",
						"leave",
						"status",
						"transcript",
						"speak"
					].includes(action)) throw new Error("unknown teams_meetings action");
					const trustedRouting = Boolean(agentId && agentId !== "main");
					const useRuntime = trustedRouting ? await api.runtime.gateway.isAvailable() : false;
					if (trustedRouting && !useRuntime) throw new Error("Per-agent Microsoft Teams meeting routing requires a Gateway-hosted agent run.");
					return jsonResult(await callGatewayFromTool({
						action,
						config,
						raw: {
							...raw,
							...requesterSessionKey ? { requesterSessionKey } : {},
							...useRuntime ? { agentId } : {}
						},
						runtime: useRuntime ? api.runtime : void 0
					}));
				} catch (error) {
					return jsonResult({ error: formatErrorMessage(error) });
				}
			}
		}), { name: "teams_meetings" });
		api.registerNodeHostCommand({
			command: TEAMS_MEETINGS_NODE_COMMAND,
			cap: "teams-meetings",
			dangerous: true,
			handle: handleTeamsMeetingsNodeHostCommand
		});
		api.registerNodeInvokePolicy(createTeamsMeetingsNodeInvokePolicy(config));
		api.registerCli(async ({ program }) => {
			(await loadTeamsMeetingsCli()).registerTeamsMeetingsCli({
				program,
				config
			});
		}, {
			commands: ["teamsmeetings"],
			descriptors: [{
				name: "teamsmeetings",
				description: "Join and manage Microsoft Teams meeting guests",
				hasSubcommands: true
			}]
		});
	}
});
//#endregion
export { teams_meetings_default as default };
