import { c as normalizeOptionalString } from "../../string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import { a as addTimerTimeoutGraceMs } from "../../number-coercion-Crk_c9KW.js";
import { a as asRecord } from "../../record-coerce-DHZ4bFlT.js";
import { _ as uniqueStrings } from "../../string-normalization-CRyoFBPt.js";
import { r as formatErrorMessage } from "../../errors-DdbcjW1Y.js";
import { t as sleep } from "../../sleep-Ce8zcpEF.js";
import { n as normalizeAgentId } from "../../agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey } from "../../session-key-Drrs61Fd.js";
import { c as resolveDefaultAgentId } from "../../agent-scope-config-S7z_Yn4H.js";
import { c as isBlockedHostnameOrIp } from "../../ssrf-eKWXIRoD.js";
import { t as GatewayClient } from "../../client-DpNJQtBd.js";
import { t as startGatewayClientWhenEventLoopReady } from "../../client-start-readiness-DNgt3RJE.js";
import { t as ErrorCodes } from "../../gateway-error-details-CLDhuP4F.js";
import { p as readPositiveIntegerParam } from "../../common-C39GdgQ7.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { i as errorShape } from "../../error-codes-DKVDGU7l.js";
import { a as optionalPositiveIntegerSchema } from "../../typebox-BEFPvxS2.js";
import "../../string-coerce-runtime-DBMkn-gE.js";
import "../../error-runtime-DUxkdoW4.js";
import "../../number-runtime-C6TGSEc_.js";
import "../../runtime-env-BDC_axp1.js";
import "../../routing-C_9uWiFw.js";
import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import "../../ssrf-runtime-b7ye-Z-7.js";
import "../../agent-runtime-Bt1w9GKE.js";
import { n as callGatewayFromCli } from "../../gateway-rpc-BeSn3X6s.js";
import "../../gateway-runtime-BpblXBwU.js";
import "../../channel-actions-CkrqGkMr.js";
import { A as startMeetingRealtimeEngine, D as createNodeMeetingRealtimeAudioTransport, E as MeetingSessionRuntime, O as createLocalMeetingRealtimeAudioTransport, S as recoverMeetingBrowserTab, T as resolveLocalMeetingBrowserRequest, a as createMeetingSetupStatus, b as readMeetingTranscriptWithBrowser, c as getMeetingVoiceCallGatewayCall, d as speakMeetingViaVoiceCallGateway, f as consultMeetingAgent, i as addMeetingSetupCheck, k as startMeetingAgentRealtimeEngine, l as isMeetingVoiceCallMissingError, m as resolveMeetingRealtimeTools, n as createMeetingBrowserNodeInvokePolicy, o as createMeetingVoiceCallGateway, p as handleMeetingRealtimeConsultToolCall, s as endMeetingVoiceCallGatewayCall, t as createMeetingNodeHost, u as joinMeetingViaVoiceCallGateway, x as openMeetingWithBrowser, y as leaveMeetingWithBrowser } from "../../meeting-runtime-BU1dxXzu.js";
import { a as buildGoogleMeetCalendarDayWindow, c as normalizeMeetUrl, i as resolveGoogleMeetGatewayOperationTimeoutMs, n as DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND, o as findGoogleMeetCalendarEvent, r as resolveGoogleMeetConfig, s as listGoogleMeetCalendarEvents, t as DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND } from "../../config-DhNGiPJY.js";
import { _ as fetchGoogleMeetAttendance, a as isRecoverableMeetTab, c as readMeetAuthUser, d as resolveChromeNodeInfo, f as GOOGLE_MEET_NODE_COMMAND, g as fetchGoogleMeetArtifacts, h as endGoogleMeetActiveConference, i as isEnglishMeetTab, l as callBrowserProxyOnNode, n as isGoogleMeetBrowserManualActionError, o as isSameMeetUrlForReuse, p as buildGoogleMeetPreflightReport, r as forceMeetEnglishUi, s as normalizeMeetUrlForReuse, t as createMeetWithBrowserProxyOnNode, u as resolveChromeNode, v as fetchGoogleMeetSpace, y as fetchLatestGoogleMeetConferenceRecord } from "../../chrome-create-D08fa5gc.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { Type } from "typebox";
//#region extensions/google-meet/src/transports/chrome-audio-device.ts
const GOOGLE_MEET_SYSTEM_PROFILER_COMMAND = "/usr/sbin/system_profiler";
function outputMentionsBlackHole2ch(output) {
	return /\bBlackHole\s+2ch\b/i.test(output);
}
//#endregion
//#region extensions/google-meet/src/transports/types.ts
const GOOGLE_MEET_TRANSCRIPT_MAX_LINES = 2e3;
//#endregion
//#region extensions/google-meet/src/transports/google-meet-page-scripts.ts
const GOOGLE_MEET_CAPTION_SETTLE_MS = 1e3;
function meetStatusScript(params) {
	return `async () => {
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const allowMicrophone = ${JSON.stringify(params.allowMicrophone)};
  const captionSessionId = ${JSON.stringify(params.captionSessionId)};
  const captureCaptions = ${JSON.stringify(params.captureCaptions)};
  const readOnly = ${JSON.stringify(Boolean(params.readOnly))};
  const buttons = [...document.querySelectorAll('button')];
  const buttonLabel = (button) =>
    [
      button.getAttribute("aria-label"),
      button.getAttribute("data-tooltip"),
      text(button),
    ]
      .filter(Boolean)
      .join(" ");
  const buttonLabels = buttons.map(buttonLabel).filter(Boolean);
  const notes = [];
  let audioOutputRouted;
  let audioOutputDeviceLabel;
  let audioOutputRouteError;
  const findButton = (pattern) =>
    buttons.find((button) => {
      const label = buttonLabel(button);
      return pattern.test(label) && !button.disabled;
    });
  const findCallControlButton = (pattern) =>
    buttons.find((button) => {
      const label = buttonLabel(button);
      return pattern.test(label) && !/remotely mute|someone else/i.test(label) && !button.disabled;
    });
  const input = [...document.querySelectorAll('input')].find((el) =>
    /your name/i.test(el.getAttribute('aria-label') || el.placeholder || '')
  );
  if (!readOnly && ${JSON.stringify(params.autoJoin)} && input && !input.value) {
    input.focus();
    input.value = ${JSON.stringify(params.guestName)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const pageText = text(document.body).toLowerCase();
  const permissionText = [pageText, ...buttonLabels].join("\\n");
  const host = location.hostname.toLowerCase();
  const pageUrl = location.href;
  const permissionNeeded = /permission needed|microphone problem|speaker problem|allow.*(microphone|camera)|blocked.*(microphone|camera)|permission.*(microphone|camera|speaker)/i.test(permissionText);
  let mic = findCallControlButton(/^\\s*turn (?:off|on) microphone\\b/i);
  if (!mic) {
    const callControls = document.querySelector('[role="region"][aria-label="Call controls"]');
    mic = [...(callControls?.querySelectorAll('button') || [])].find((button) =>
      /^\\s*turn (?:off|on) microphone\\b/i.test(buttonLabel(button))
    );
  }
  if (!readOnly && allowMicrophone && mic && /turn on microphone/i.test(buttonLabel(mic))) {
    mic.click();
    notes.push("Attempted to turn on the Meet microphone for talk-back mode.");
  }
  if (!readOnly && !allowMicrophone && mic && /turn off microphone/i.test(mic.getAttribute('aria-label') || text(mic))) {
    mic.click();
    notes.push("Muted Meet microphone for observe-only mode.");
  }
  const joinElsewhere = findButton(/join here too/i);
  const join = !readOnly && ${JSON.stringify(params.autoJoin)}
    ? findButton(/join now|ask to join/i)
    : null;
  if (join) join.click();
  const microphoneChoice = findButton(/\\buse microphone\\b/i);
  const noMicrophoneChoice = findButton(/\\b(continue|join|use) without (microphone|mic)\\b|\\bnot now\\b/i);
  if (!readOnly && allowMicrophone && microphoneChoice) {
    microphoneChoice.click();
    notes.push("Accepted Meet microphone prompt with browser automation.");
  } else if (!readOnly && !allowMicrophone && noMicrophoneChoice) {
    noMicrophoneChoice.click();
    notes.push("Skipped Meet microphone prompt for observe-only mode.");
  }
  const inCall = buttons.some((button) => /leave call/i.test(button.getAttribute('aria-label') || text(button)));
  const routeMeetAudioOutput = async () => {
    if (
      !allowMicrophone ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.enumerateDevices
    ) return;
    const mediaElements = [...document.querySelectorAll('audio, video')]
      .filter((el) => typeof el.setSinkId === 'function');
    if (mediaElements.length === 0) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const output = devices.find((device) =>
        device.kind === 'audiooutput' && /\\bBlackHole\\s+2ch\\b/i.test(device.label || '')
      ) || devices.find((device) =>
        device.kind === 'audiooutput' && /\\bBlackHole\\b/i.test(device.label || '')
      );
      if (!output?.deviceId) {
        if (devices.some((device) => device.kind === 'audiooutput')) {
          notes.push("BlackHole 2ch speaker output was not visible to Meet.");
        }
        return;
      }
      let routed = 0;
      for (const element of mediaElements) {
        if (element.sinkId !== output.deviceId) {
          if (readOnly) {
            continue;
          }
          await element.setSinkId(output.deviceId);
          routed += 1;
        }
      }
      audioOutputRouted = mediaElements.some((element) => element.sinkId === output.deviceId);
      audioOutputDeviceLabel = output.label || "BlackHole 2ch";
      if (!readOnly && audioOutputRouted) {
        notes.push(
          routed > 0
            ? \`Routed Meet media output to \${audioOutputDeviceLabel}.\`
            : \`Meet media output already routed to \${audioOutputDeviceLabel}.\`
        );
      }
    } catch (error) {
      audioOutputRouteError = error?.message || String(error);
      notes.push(\`Could not route Meet speaker output to BlackHole 2ch: \${audioOutputRouteError}\`);
    }
  };
  if (inCall) {
    await routeMeetAudioOutput();
  }
  let captioning = false;
  let captionsEnabledAttempted = false;
  let transcriptLines = 0;
  let lastCaptionAt;
  let lastCaptionSpeaker;
  let lastCaptionText;
  let recentTranscript = [];
  const captionSelector = '[role="region"][aria-label*="aption" i], [aria-live="polite"][role="region"], div[aria-live="polite"]';
  const captionState = (() => {
    if (!captureCaptions) return undefined;
    const w = window;
    if (!inCall && !w.__openclawMeetCaptions) return undefined;
    // A reused tab starts a fresh logical transcript for each OpenClaw session.
    // Status refreshes omit the id, so they preserve the active page-owned buffer.
    if (!w.__openclawMeetCaptions || (captionSessionId && w.__openclawMeetCaptions.sessionId !== captionSessionId)) {
      if (w.__openclawMeetCaptions?.settleTimer !== undefined) {
        clearTimeout(w.__openclawMeetCaptions.settleTimer);
      }
      w.__openclawMeetCaptions?.observer?.disconnect?.();
      w.__openclawMeetCaptions = {
        sessionId: captionSessionId,
        // Epochs cross document lifetimes in the runtime transcript cursor.
        // Strong UUIDs keep a reloaded page distinct from its prior buffer.
        epoch: crypto.randomUUID(),
        enabledAttempted: false,
        observerInstalled: false,
        observer: undefined,
        droppedLines: 0,
        lines: [],
        settleTimer: undefined,
        visible: []
      };
    }
    return w.__openclawMeetCaptions;
  })();
  const normalizeCaption = (speaker, captionText) => {
    if (!captionState) return;
    const clean = String(captionText || "").replace(/\\s+/g, " ").trim();
    const cleanSpeaker = String(speaker || "").replace(/\\s+/g, " ").trim();
    if (!clean || clean.length < 2) return undefined;
    if (/^(turn on captions|turn off captions|captions)$/i.test(clean)) return undefined;
    return { speaker: cleanSpeaker || undefined, text: clean };
  };
  const commitLines = (state, entries) => {
    state.lines.push(...entries.map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text
    })));
    const excess = state.lines.length - ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  };
  const scrapeCaptions = () => {
    if (!captionState) return;
    const regions = [...document.querySelectorAll(captionSelector)];
    const rows = [];
    for (const region of regions) {
      const raw = text(region);
      if (!raw) continue;
      const pieces = raw.split(/\\n+/).map((part) => part.trim()).filter(Boolean);
      const row = pieces.length >= 2
        ? normalizeCaption(pieces[0], pieces.slice(1).join(" "))
        : normalizeCaption("", pieces[0] || raw);
      if (row) rows.push({ ...row, node: region });
    }
    if (rows.length === 0) {
      // Meet briefly removes caption rows while rerendering. Keep them mutable
      // for one settle window so a DOM gap cannot fabricate a repeated line.
      if (captionState.visible.length > 0 && captionState.settleTimer === undefined) {
        const pendingState = captionState;
        pendingState.settleTimer = setTimeout(() => {
          if (window.__openclawMeetCaptions !== pendingState) return;
          commitLines(pendingState, pendingState.visible);
          pendingState.visible = [];
          pendingState.settleTimer = undefined;
        }, ${GOOGLE_MEET_CAPTION_SETTLE_MS});
      }
      return;
    }
    if (captionState.settleTimer !== undefined) {
      clearTimeout(captionState.settleTimer);
      captionState.settleTimer = undefined;
    }
    const previous = Array.isArray(captionState.visible) ? captionState.visible : [];
    const unmatchedPrevious = [...previous];
    const nextVisible = [];
    const now = Date.now();
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const priorIndex = unmatchedPrevious.findIndex((candidate) => {
        const sameTextLifecycle =
          candidate.text === row.text ||
          row.text.startsWith(candidate.text) ||
          candidate.text.startsWith(row.text);
        const sameDomLifecycle =
          candidate.node === row.node || now - candidate.seenAt <= ${GOOGLE_MEET_CAPTION_SETTLE_MS};
        return candidate.speaker === row.speaker && sameTextLifecycle && sameDomLifecycle;
      });
      const prior = priorIndex >= 0 ? unmatchedPrevious.splice(priorIndex, 1)[0] : undefined;
      const sameSpeaker = Boolean(prior) && prior.speaker === row.speaker;
      if (sameSpeaker && prior.text === row.text) {
        prior.node = row.node;
        prior.seenAt = now;
        nextVisible.push(prior);
        continue;
      }
      if (sameSpeaker && row.text.startsWith(prior.text)) {
        prior.text = row.text;
        prior.node = row.node;
        prior.seenAt = now;
        nextVisible.push(prior);
        continue;
      }
      if (sameSpeaker && prior.text.startsWith(row.text)) {
        prior.node = row.node;
        prior.seenAt = now;
        nextVisible.push(prior);
        continue;
      }
      const entry = {
        at: new Date().toISOString(),
        node: row.node,
        seenAt: now,
        speaker: row.speaker,
        text: row.text
      };
      nextVisible.push(entry);
    }
    commitLines(captionState, unmatchedPrevious);
    captionState.visible = nextVisible;
  };
  if (captionState) {
    if (!readOnly && inCall && !captionState.enabledAttempted) {
      const captionButton = findButton(/turn on captions|show captions|captions/i);
      const captionLabel = captionButton ? (captionButton.getAttribute("aria-label") || captionButton.getAttribute("data-tooltip") || text(captionButton)) : "";
      if (captionButton) {
        captionState.enabledAttempted = true;
        captionsEnabledAttempted = true;
        if (!/turn off captions|hide captions/i.test(captionLabel)) {
          captionButton.click();
          notes.push("Attempted to enable Meet captions for observe-only transcript health.");
        }
      }
    } else if (captionState.enabledAttempted) {
      captionsEnabledAttempted = true;
    }
    if (inCall && !captionState.observerInstalled) {
      captionState.observerInstalled = true;
      captionState.observer = new MutationObserver(scrapeCaptions);
      captionState.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      notes.push("Installed Meet caption observer for observe-only transcript health.");
    }
    if (inCall) {
      scrapeCaptions();
    }
    const committedLines = Array.isArray(captionState.lines) ? captionState.lines : [];
    const visibleLines = Array.isArray(captionState.visible) ? captionState.visible : [];
    const lines = [...committedLines, ...visibleLines];
    const last = lines[lines.length - 1];
    captioning = document.querySelector(captionSelector) !== null || lines.length > 0;
    transcriptLines = (captionState.droppedLines || 0) + lines.length;
    lastCaptionAt = last?.at;
    lastCaptionSpeaker = last?.speaker;
    lastCaptionText = last?.text;
    recentTranscript = lines.slice(-5);
  }
  const lobbyWaiting = !inCall && /asking to be let in|you.?ll join when someone lets you in|waiting to be let in|ask to join/i.test(pageText);
  const leaveReason = !inCall && /you left the meeting|you.?ve left the meeting|removed from the meeting|you were removed|call ended|meeting ended/i.test(pageText)
    ? pageText.match(/you left the meeting|you.?ve left the meeting|removed from the meeting|you were removed|call ended|meeting ended/i)?.[0]
    : undefined;
  let manualActionReason;
  let manualActionMessage;
  if (!inCall && (host === "accounts.google.com" || /use your google account|to continue to google meet|choose an account|sign in to (join|continue)/i.test(pageText))) {
    manualActionReason = "google-login-required";
    manualActionMessage = "Sign in to Google in the OpenClaw browser profile, then retry the Meet join.";
  } else if (!inCall && joinElsewhere) {
    manualActionReason = "meet-session-conflict";
    manualActionMessage = "Meet is already active in another tab or device. Leave that session or reuse an English-pinned tab before retrying.";
  } else if (!inCall && /asking to be let in|you.?ll join when someone lets you in|waiting to be let in|ask to join/i.test(pageText)) {
    manualActionReason = "meet-admission-required";
    manualActionMessage = "Admit the OpenClaw browser participant in Google Meet, then retry speech.";
  } else if (permissionNeeded) {
    manualActionReason = "meet-permission-required";
    manualActionMessage = allowMicrophone
      ? "Allow microphone/camera/speaker permissions for Meet in the OpenClaw browser profile, then retry."
      : "Join without microphone/camera permissions in the OpenClaw browser profile, then retry.";
  } else if (!inCall && (allowMicrophone ? !microphoneChoice : !noMicrophoneChoice) && /do you want people to hear you in the meeting/i.test(pageText)) {
    manualActionReason = "meet-audio-choice-required";
    manualActionMessage = allowMicrophone
      ? "Meet is showing the microphone choice. Click Use microphone in the OpenClaw browser profile, then retry."
      : "Meet is showing the microphone choice. Choose the no-microphone option in the OpenClaw browser profile, then retry.";
  }
  return JSON.stringify({
    clickedJoin: Boolean(join),
    clickedMicrophoneChoice: Boolean(allowMicrophone && microphoneChoice),
    inCall,
    micMuted: mic ? /turn on microphone/i.test(buttonLabel(mic)) : undefined,
    lobbyWaiting,
    leaveReason,
    captioning,
    captionsEnabledAttempted,
    transcriptLines,
    lastCaptionAt,
    lastCaptionSpeaker,
    lastCaptionText,
    recentTranscript,
    audioOutputRouted,
    audioOutputDeviceLabel,
    audioOutputRouteError,
    manualActionRequired: Boolean(manualActionReason),
    manualActionReason,
    manualActionMessage,
    title: document.title,
    url: pageUrl,
    notes
  });
}`;
}
function meetTranscriptScript(meetingUrl, meetingSessionId, finalize) {
	const expectedMeetingUrl = normalizeMeetUrlForReuse(meetingUrl);
	return `() => {
  const expectedMeetingUrl = ${JSON.stringify(expectedMeetingUrl)};
  const expectedSessionId = ${JSON.stringify(meetingSessionId)};
  let currentMeetingUrl;
  try {
    const currentUrl = new URL(location.href);
    currentMeetingUrl = currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/\\/$/, "");
  } catch {
    return JSON.stringify({ urlMatched: false });
  }
  if (!expectedMeetingUrl || currentMeetingUrl !== expectedMeetingUrl) {
    return JSON.stringify({ urlMatched: false });
  }
  const state = window.__openclawMeetCaptions;
  if (state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false });
  }
  if (${JSON.stringify(finalize)} && Array.isArray(state?.visible) && state.visible.length > 0) {
    if (state.settleTimer !== undefined) clearTimeout(state.settleTimer);
    state.settleTimer = undefined;
    state.lines = Array.isArray(state.lines) ? state.lines : [];
    state.lines.push(...state.visible.map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text
    })));
    state.visible = [];
    const excess = state.lines.length - ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  }
  const lines = Array.isArray(state?.lines) ? state.lines : [];
  return JSON.stringify({
    urlMatched: true,
    sessionMatched: true,
    epoch: typeof state?.epoch === "string" ? state.epoch : undefined,
    droppedLines: Number.isFinite(state?.droppedLines) ? Math.max(0, Math.trunc(state.droppedLines)) : 0,
    lines: lines.map((line) => ({
      at: typeof line?.at === "string" ? line.at : undefined,
      speaker: typeof line?.speaker === "string" ? line.speaker : undefined,
      text: typeof line?.text === "string" ? line.text : ""
    })).filter((line) => line.text)
  });
}`;
}
function meetLeaveScript(meetingUrl) {
	const expectedMeetingUrl = normalizeMeetUrlForReuse(meetingUrl);
	return `() => {
  const expectedMeetingUrl = ${JSON.stringify(expectedMeetingUrl)};
  let currentMeetingUrl;
  try {
    const currentUrl = new URL(location.href);
    currentMeetingUrl = currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/\\/$/, "");
  } catch {
    return JSON.stringify({ departed: false });
  }
  if (!expectedMeetingUrl) {
    return JSON.stringify({ departed: false });
  }
  if (currentMeetingUrl !== expectedMeetingUrl) {
    return JSON.stringify({ departed: true, urlMatched: false });
  }
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  // Locale-independent fallback: Meet renders the leave control as a Material
  // Symbols icon whose ligature text is "call_end" in every UI language, so a
  // localized aria-label (e.g. "Anruf verlassen") still resolves to the button.
  const hasLeaveIcon = (button) => {
    const icon = button.querySelector ? button.querySelector("i") : null;
    return icon ? (icon.textContent || "").trim() === "call_end" : false;
  };
  const buttons = [...document.querySelectorAll('button')];
  const label = (button) => [
    button.getAttribute("aria-label"),
    button.getAttribute("data-tooltip"),
    text(button),
  ]
    .filter(Boolean)
    .join(" ");
  const postCall = buttons.some((button) => /\\b(rejoin|return to home screen)\\b/i.test(label(button)));
  if (postCall) {
    return JSON.stringify({ departed: true, urlMatched: true });
  }
  // Managed join tabs are reused only after the English-tab gate or opened
  // through the English-UI helper, so follow-up labels are pinned to English.
  const confirmation = buttons.find((button) => {
    return !button.disabled && /\\bleave meeting\\b/i.test(label(button));
  });
  if (confirmation) {
    confirmation.click();
    return JSON.stringify({ departed: false, leaveAction: "confirm", urlMatched: true });
  }
  const leave = buttons.find((button) => {
    if (button.disabled) return false;
    return /leave call/i.test(label(button)) || hasLeaveIcon(button);
  });
  if (leave) {
    leave.click();
    return JSON.stringify({ departed: false, leaveAction: "leave", urlMatched: true });
  }
  return JSON.stringify({ departed: false, urlMatched: true });
}`;
}
//#endregion
//#region extensions/google-meet/src/transports/twilio.ts
const DTMF_PATTERN = /^[0-9*#wWpP,]+$/;
function normalizeDialInNumber(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const compact = normalized.replace(/[()\s.-]/g, "");
	if (!/^\+?[0-9]{5,20}$/.test(compact)) throw new Error("dialInNumber must be a phone number");
	return compact;
}
function normalizeDtmfSequence(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const compact = normalized.replace(/\s+/g, "");
	if (!DTMF_PATTERN.test(compact)) throw new Error("dtmfSequence may only contain digits, *, #, comma, w, p");
	return compact;
}
function buildMeetDtmfSequence(params) {
	const explicit = normalizeDtmfSequence(params.dtmfSequence);
	if (explicit) return explicit;
	const pin = normalizeOptionalString(params.pin);
	if (!pin) return;
	const compactPin = pin.replace(/\s+/g, "");
	if (!/^[0-9]+#?$/.test(compactPin)) throw new Error("pin may only contain digits and an optional trailing #");
	return compactPin.endsWith("#") ? compactPin : `${compactPin}#`;
}
function prefixDtmfWait(sequence, delayMs) {
	if (!sequence || delayMs <= 0) return sequence;
	const waitCount = Math.ceil(delayMs / 500);
	if (waitCount <= 0) return sequence;
	return `${"w".repeat(waitCount)}${sequence}`;
}
//#endregion
//#region extensions/google-meet/src/transports/google-meet-platform-adapter.ts
function isGoogleMeetTalkBackMode$2(mode) {
	return mode === "agent" || mode === "bidi";
}
function parseMeetBrowserStatus(result) {
	const raw = (result && typeof result === "object" ? result : {}).result;
	if (typeof raw !== "string" || !raw.trim()) return;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error("Google Meet browser status JSON is malformed.");
	}
	return {
		inCall: parsed.inCall,
		micMuted: parsed.micMuted,
		lobbyWaiting: parsed.lobbyWaiting,
		leaveReason: parsed.leaveReason,
		captioning: parsed.captioning,
		captionsEnabledAttempted: parsed.captionsEnabledAttempted,
		transcriptLines: parsed.transcriptLines,
		lastCaptionAt: parsed.lastCaptionAt,
		lastCaptionSpeaker: parsed.lastCaptionSpeaker,
		lastCaptionText: parsed.lastCaptionText,
		recentTranscript: parsed.recentTranscript,
		audioOutputRouted: parsed.audioOutputRouted,
		audioOutputDeviceLabel: parsed.audioOutputDeviceLabel,
		audioOutputRouteError: parsed.audioOutputRouteError,
		manualActionRequired: parsed.manualActionRequired,
		manualActionReason: parsed.manualActionReason,
		manualActionMessage: parsed.manualActionMessage,
		browserUrl: parsed.url,
		browserTitle: parsed.title,
		status: "browser-control",
		notes: Array.isArray(parsed.notes) ? parsed.notes.filter((note) => typeof note === "string") : void 0
	};
}
function parsePermissionGrantNotes(result) {
	const record = result && typeof result === "object" ? result : {};
	const unsupportedPermissions = Array.isArray(record.unsupportedPermissions) ? record.unsupportedPermissions.filter((value) => typeof value === "string") : [];
	const notes = ["Granted Meet microphone/camera permissions through browser control."];
	if (unsupportedPermissions.includes("speakerSelection")) notes.push("Chrome did not accept the optional Meet speaker-selection permission.");
	return notes;
}
function parseMeetTranscriptSnapshot(result) {
	const raw = (result && typeof result === "object" ? result : {}).result;
	if (typeof raw !== "string" || !raw.trim()) return {
		droppedLines: 0,
		lines: []
	};
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error("Google Meet transcript JSON is malformed.");
	}
	if (!parsed || typeof parsed !== "object") throw new Error("Google Meet transcript payload is invalid.");
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
function parseMeetLeaveResult(result) {
	const raw = (result && typeof result === "object" ? result : {}).result;
	if (typeof raw !== "string" || !raw.trim()) return { departed: false };
	try {
		const parsed = JSON.parse(raw);
		const leaveAction = parsed.leaveAction === "leave" || parsed.leaveAction === "confirm" ? parsed.leaveAction : void 0;
		return {
			departed: parsed.departed === true,
			...leaveAction ? { leaveAction } : {},
			...typeof parsed.urlMatched === "boolean" ? { urlMatched: parsed.urlMatched } : {}
		};
	} catch {
		return { departed: false };
	}
}
function classifyMeetManualAction(health) {
	if (!health.manualActionRequired || !health.manualActionReason || !health.manualActionMessage) return;
	return {
		category: health.manualActionReason === "google-login-required" ? "login-required" : health.manualActionReason === "meet-admission-required" ? "admission-required" : health.manualActionReason === "meet-permission-required" ? "permission-required" : health.manualActionReason === "meet-audio-choice-required" ? "audio-choice-required" : health.manualActionReason === "meet-locale-required" ? "locale-required" : health.manualActionReason === "meet-session-conflict" ? "session-conflict" : health.manualActionReason === "browser-control-unavailable" ? "browser-control-unavailable" : "custom",
		reason: health.manualActionReason,
		message: health.manualActionMessage
	};
}
const GOOGLE_MEET_PLATFORM_ADAPTER = {
	id: "google-meet",
	displayName: "Google Meet",
	browserLabel: "Meet",
	logScope: "[google-meet]",
	nodeCommandName: GOOGLE_MEET_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.google-meet.config.chromeNode.node",
	urls: {
		validateAndNormalize: normalizeMeetUrl,
		normalizeForReuse: normalizeMeetUrlForReuse,
		isSameMeeting: isSameMeetUrlForReuse,
		buildJoinUrl: (session) => forceMeetEnglishUi(session.url),
		accountHint: readMeetAuthUser,
		isPreferredJoinUrl: isEnglishMeetTab,
		isRecoverableTab: isRecoverableMeetTab,
		localeAction: (tab) => {
			if (!normalizeMeetUrlForReuse(tab.url) || isEnglishMeetTab(tab.url)) return;
			return {
				category: "locale-required",
				reason: "meet-locale-required",
				message: "The existing Meet tab is not pinned to English. Open the meeting with ?hl=en, then retry recovery."
			};
		}
	},
	browser: {
		allowsMicrophone: isGoogleMeetTalkBackMode$2,
		buildStatusJoinScript: (params) => meetStatusScript({
			allowMicrophone: isGoogleMeetTalkBackMode$2(params.mode),
			autoJoin: params.autoJoin,
			captionSessionId: params.meetingSessionId || void 0,
			captureCaptions: params.captureCaptions,
			guestName: params.guestName,
			readOnly: params.readOnly
		}),
		parseStatus: parseMeetBrowserStatus,
		classifyManualAction: classifyMeetManualAction,
		browserControlUnavailable: () => ({
			category: "browser-control-unavailable",
			reason: "browser-control-unavailable",
			message: "Open the OpenClaw browser profile, finish Google Meet login, admission, or permission prompts, then retry."
		}),
		buildLeaveScript: meetLeaveScript,
		parseLeaveResult: parseMeetLeaveResult,
		captions: {
			enabled: (mode) => mode === "transcribe",
			buildTranscriptScript: ({ finalize, meetingSessionId, meetingUrl }) => meetTranscriptScript(meetingUrl, meetingSessionId, finalize),
			parseTranscript: parseMeetTranscriptSnapshot
		},
		permissions: ({ allowMicrophone }) => allowMicrophone ? {
			origin: "https://meet.google.com",
			permissions: ["audioCapture", "videoCapture"],
			optionalPermissions: ["speakerSelection"]
		} : void 0,
		permissionNotes: ({ allowMicrophone, error, result }) => {
			if (!allowMicrophone) return ["Observe-only mode skips Meet microphone/camera permission grants."];
			if (error) return [`Could not grant Meet media permissions automatically: ${formatErrorMessage(error)}`];
			return parsePermissionGrantNotes(result);
		}
	},
	create: { browser: createMeetWithBrowserProxyOnNode },
	dialIn: { buildPlan: (params) => {
		const number = normalizeDialInNumber(params.dialInNumber ?? params.defaultDialInNumber);
		const pin = params.pin ?? params.defaultPin;
		const rawDtmfSequence = buildMeetDtmfSequence({
			pin,
			dtmfSequence: params.dtmfSequence ?? params.defaultDtmfSequence
		});
		return {
			number,
			pin,
			dtmfSequence: params.dtmfSequence || params.defaultDtmfSequence ? rawDtmfSequence : prefixDtmfWait(rawDtmfSequence, params.dtmfDelayMs)
		};
	} }
};
//#endregion
//#region extensions/google-meet/src/node-host.ts
function assertBlackHoleAvailable(timeoutMs) {
	if (process.platform !== "darwin") throw new Error("Chrome Meet transport with blackhole-2ch audio is currently macOS-only");
	const result = spawnSync(GOOGLE_MEET_SYSTEM_PROFILER_COMMAND, ["SPAudioDataType"], {
		encoding: "utf8",
		timeout: timeoutMs
	});
	const stderr = result.stderr ?? (result.error ? result.error instanceof Error ? result.error.message : String(result.error) : "");
	const output = `${result.stdout ?? ""}\n${stderr}`;
	if ((typeof result.status === "number" ? result.status : result.error ? 1 : 0) !== 0 || !outputMentionsBlackHole2ch(output)) throw new Error("BlackHole 2ch audio device not found on the node.");
}
function normalizeMeetKey(value) {
	if (!value) return;
	try {
		const url = new URL(value);
		if (url.hostname.toLowerCase() !== "meet.google.com") return value;
		return /^\/([a-z]{3}-[a-z]{4}-[a-z]{3})(?:$|[/?#])/i.exec(url.pathname)?.[1]?.toLowerCase() ?? value;
	} catch {
		return value;
	}
}
const googleMeetNodeHost = createMeetingNodeHost({
	commandName: GOOGLE_MEET_NODE_COMMAND,
	displayName: "Google Meet",
	browserLabel: "Meet",
	bridgeIdPrefix: "meet_node_",
	defaultAudioInputCommand: DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND,
	defaultAudioOutputCommand: DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND,
	talkBackModes: /* @__PURE__ */ new Set([
		"agent",
		"bidi",
		"realtime"
	]),
	agentMode: "agent",
	normalizeUrl: (url) => GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(url),
	normalizeMeetingKey: normalizeMeetKey,
	assertAudioAvailable: assertBlackHoleAvailable,
	browser: {
		application: "Google Chrome",
		buildProfileArgs: (profile) => ["--args", `--profile-directory=${profile}`],
		openedStatus: "chrome-opened",
		openedNotes: ["Browser page control is handled by OpenClaw browser automation when using chrome-node."]
	}
});
async function handleGoogleMeetNodeHostCommand(paramsJSON) {
	return await googleMeetNodeHost.handleCommand(paramsJSON);
}
//#endregion
//#region extensions/google-meet/src/node-invoke-policy.ts
const GOOGLE_MEET_CHROME_NODE_COMMAND = GOOGLE_MEET_NODE_COMMAND;
const START_MODES = /* @__PURE__ */ new Set([
	"agent",
	"bidi",
	"realtime",
	"transcribe"
]);
function createGoogleMeetChromeNodeInvokePolicy(config) {
	return createMeetingBrowserNodeInvokePolicy({
		commandName: GOOGLE_MEET_CHROME_NODE_COMMAND,
		displayName: "Google Meet",
		deniedCode: "GOOGLE_MEET_NODE_POLICY_DENIED",
		supportedModes: START_MODES,
		normalizeUrl: (url) => GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(url),
		start: config.chrome
	});
}
//#endregion
//#region extensions/google-meet/src/runtime-probes.ts
function resolveMode$1(request, config) {
	return request.mode === "realtime" ? "agent" : request.mode ?? config.defaultMode;
}
function resolveProbeTimeoutMs(input, fallback) {
	if (input === void 0) return Math.min(Math.max(fallback, 1), 12e4);
	if (!Number.isFinite(input) || input <= 0) throw new Error("timeoutMs must be a positive number");
	return Math.min(Math.trunc(input), 12e4);
}
async function testGoogleMeetSpeech(context, request) {
	if (request.mode === "transcribe") throw new Error("test_speech requires mode: agent or bidi; use join mode: transcribe for observe-only sessions.");
	const requestedMode = request.mode ? resolveMode$1(request, context.config) : void 0;
	const mode = requestedMode === "agent" || requestedMode === "bidi" ? requestedMode : context.config.defaultMode === "agent" || context.config.defaultMode === "bidi" ? context.config.defaultMode : "agent";
	const resolved = {
		url: normalizeMeetUrl(request.url),
		transport: request.transport ?? context.config.defaultTransport,
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
		message: request.message ?? "Say exactly: Google Meet speech test complete."
	});
	const startOutputBytes = existing?.id === result.session.id ? existingOutputBytes : 0;
	let health = result.session.chrome?.health;
	const shouldWait = result.spoken === true && health?.manualActionRequired !== true && context.hasHealthHandle(result.session.id);
	if (shouldWait && (health?.lastOutputBytes ?? 0) <= startOutputBytes) {
		const deadline = Date.now() + Math.min(context.config.chrome.joinTimeoutMs, 5e3);
		while (Date.now() < deadline) {
			await sleep(100);
			context.refreshHealth(result.session.id);
			health = result.session.chrome?.health;
			if ((health?.lastOutputBytes ?? 0) > startOutputBytes) break;
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
async function testGoogleMeetListening(context, request) {
	const requestedMode = request.mode ? resolveMode$1(request, context.config) : void 0;
	if (requestedMode === "agent" || requestedMode === "bidi") throw new Error("test_listen requires mode: transcribe; use test_speech for talk-back sessions.");
	const resolved = {
		url: normalizeMeetUrl(request.url),
		transport: request.transport ?? context.config.defaultTransport,
		mode: "transcribe",
		agentId: context.resolveAgentId(request)
	};
	if (resolved.transport === "twilio") throw new Error("test_listen supports chrome or chrome-node transports");
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
	const shouldWait = health?.manualActionRequired !== true && Boolean((result.session.transport === "chrome" || result.session.transport === "chrome-node") && result.session.chrome?.launched);
	if (shouldWait && !advanced()) {
		const deadline = Date.now() + resolveProbeTimeoutMs(request.timeoutMs, context.config.chrome.joinTimeoutMs);
		while (Date.now() < deadline) {
			await sleep(250);
			await context.refreshCaptionHealth(result.session);
			health = result.session.chrome?.health;
			if (health?.manualActionRequired || advanced()) break;
		}
	}
	const listenVerified = advanced();
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
//#region extensions/google-meet/src/runtime-session.ts
function createGoogleMeetSession(params) {
	const { config, createdAt, resolved } = params;
	return {
		id: `meet_${randomUUID()}`,
		...resolved,
		state: "active",
		createdAt,
		updatedAt: createdAt,
		participantIdentity: resolved.transport === "twilio" ? "Twilio phone participant" : resolved.transport === "chrome-node" ? "signed-in Google Chrome profile on a paired node" : "signed-in Google Chrome profile",
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
//#region extensions/google-meet/src/setup.ts
function resolveUserPath(input) {
	if (input === "~") return os.homedir();
	if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
	return input;
}
function isProviderUnreachableWebhookUrl(webhookUrl) {
	try {
		return isBlockedHostnameOrIp(new URL(webhookUrl).hostname);
	} catch {
		return false;
	}
}
function resolveVoiceCallSetupValue(configured, fallback) {
	return normalizeOptionalString(configured) ?? normalizeOptionalString(fallback);
}
function getVoiceCallWebhookExposureCheck(voiceCallConfig) {
	const publicUrl = normalizeOptionalString(voiceCallConfig.publicUrl);
	const tunnel = asRecord(voiceCallConfig.tunnel);
	const tailscale = asRecord(voiceCallConfig.tailscale);
	const tunnelProvider = normalizeOptionalString(tunnel.provider);
	const tailscaleMode = normalizeOptionalString(tailscale.mode);
	if (publicUrl) {
		const ok = !isProviderUnreachableWebhookUrl(publicUrl);
		return {
			id: "twilio-voice-call-webhook",
			ok,
			message: ok ? `Voice-call public webhook URL configured: ${publicUrl}` : `Voice-call publicUrl is local/private and cannot be reached by Twilio: ${publicUrl}`
		};
	}
	if (tunnelProvider && tunnelProvider !== "none") return {
		id: "twilio-voice-call-webhook",
		ok: true,
		message: "Voice-call webhook exposure configured through tunnel"
	};
	if (tailscaleMode && tailscaleMode !== "off") return {
		id: "twilio-voice-call-webhook",
		ok: true,
		message: "Voice-call webhook exposure configured through Tailscale"
	};
	return {
		id: "twilio-voice-call-webhook",
		ok: false,
		message: "Set plugins.entries.voice-call.config.publicUrl or configure voice-call tunnel/tailscale exposure for Twilio dialing"
	};
}
function getGoogleMeetSetupStatus(config, options) {
	const checks = [];
	const env = options?.env ?? process.env;
	const fullConfig = asRecord(options?.fullConfig);
	const mode = options?.mode ?? config.defaultMode;
	const transport = options?.transport ?? config.defaultTransport;
	const needsChromeRealtimeAudio = (mode === "agent" || mode === "bidi") && (transport === "chrome" || transport === "chrome-node");
	const pluginEntries = asRecord(asRecord(fullConfig.plugins).entries);
	const pluginAllow = asRecord(fullConfig.plugins).allow;
	const voiceCallEntry = asRecord(pluginEntries["voice-call"]);
	const voiceCallConfig = asRecord(voiceCallEntry.config);
	const voiceCallTwilioConfig = asRecord(voiceCallConfig.twilio);
	if (config.auth.tokenPath) {
		const tokenPath = resolveUserPath(config.auth.tokenPath);
		checks.push({
			id: "google-oauth-token",
			ok: fs.existsSync(tokenPath),
			message: fs.existsSync(tokenPath) ? "Google OAuth token file found" : `Google OAuth token file missing at ${config.auth.tokenPath}`
		});
	} else checks.push({
		id: "google-oauth-token",
		ok: true,
		message: "Google OAuth token path not configured; Chrome profile auth will be used"
	});
	checks.push({
		id: "chrome-profile",
		ok: true,
		message: config.chrome.browserProfile ? "Local Chrome uses the OpenClaw browser profile; chrome.browserProfile is passed to chrome-node hosts" : "Local Chrome uses the OpenClaw browser profile; configure browser.defaultProfile to choose another profile"
	});
	if (needsChromeRealtimeAudio) {
		const hasCommandPair = Boolean(config.chrome.audioInputCommand && config.chrome.audioOutputCommand);
		const hasExternalBridge = Boolean(config.chrome.audioBridgeCommand);
		const agentModeExternalBridgeInvalid = mode === "agent" && hasExternalBridge;
		checks.push({
			id: "audio-bridge",
			ok: mode === "agent" ? hasCommandPair && !agentModeExternalBridgeInvalid : hasExternalBridge || hasCommandPair,
			message: agentModeExternalBridgeInvalid ? "Chrome agent mode requires chrome.audioInputCommand and chrome.audioOutputCommand; chrome.audioBridgeCommand is bidi-only" : hasExternalBridge ? "Chrome audio bridge command configured" : hasCommandPair ? `Chrome command-pair talk-back audio bridge configured (${config.chrome.audioFormat})` : "Chrome talk-back audio bridge not configured"
		});
	} else if (transport === "chrome" || transport === "chrome-node") checks.push({
		id: "audio-bridge",
		ok: true,
		message: "Chrome observe-only mode does not require a realtime audio bridge"
	});
	checks.push({
		id: "guest-join-defaults",
		ok: Boolean(config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab),
		message: config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab ? "Guest auto-join and tab reuse defaults are enabled" : "Set chrome.guestName, chrome.autoJoin, and chrome.reuseExistingTab for unattended guest joins"
	});
	checks.push({
		id: "chrome-node-target",
		ok: config.defaultTransport !== "chrome-node" || Boolean(config.chromeNode.node),
		message: config.defaultTransport === "chrome-node" && !config.chromeNode.node ? "chrome-node default should pin chromeNode.node when multiple nodes may be connected" : config.chromeNode.node ? `Chrome node pinned to ${config.chromeNode.node}` : "Chrome node not pinned; automatic selection works when exactly one capable node is connected"
	});
	if (needsChromeRealtimeAudio) checks.push({
		id: "intro-after-in-call",
		ok: config.chrome.waitForInCallMs > 0,
		message: config.chrome.waitForInCallMs > 0 ? `Realtime intro waits up to ${config.chrome.waitForInCallMs}ms for the Meet tab to be in-call` : "Set chrome.waitForInCallMs to delay realtime intro until the Meet tab is in-call"
	});
	if (transport === "twilio") {
		const hasRequestDialPlan = Boolean(options?.twilioDialInNumber);
		const hasDefaultDialPlan = Boolean(config.twilio.defaultDialInNumber);
		const hasDialPlan = hasRequestDialPlan || hasDefaultDialPlan;
		checks.push({
			id: "twilio-dial-plan",
			ok: hasDialPlan,
			message: hasRequestDialPlan ? "Twilio request includes a Meet dial-in number" : hasDefaultDialPlan ? "Twilio default Meet dial-in number is configured" : "Twilio joins require a Meet dial-in phone number; pass dialInNumber with optional pin/dtmfSequence or configure twilio.defaultDialInNumber"
		});
	}
	if (config.voiceCall.enabled && (transport === "twilio" || Boolean(config.twilio.defaultDialInNumber) || Object.hasOwn(pluginEntries, "voice-call"))) {
		const voiceCallAllowed = !Array.isArray(pluginAllow) || pluginAllow.includes("voice-call");
		const voiceCallEnabled = Object.hasOwn(pluginEntries, "voice-call") && voiceCallEntry.enabled !== false;
		checks.push({
			id: "twilio-voice-call-plugin",
			ok: voiceCallAllowed && voiceCallEnabled,
			message: voiceCallAllowed && voiceCallEnabled ? "Twilio transport can delegate dialing to the voice-call plugin" : "Enable plugins.entries.voice-call and include voice-call in plugins.allow for Twilio dialing"
		});
		if ((normalizeOptionalString(voiceCallConfig.provider) ?? "twilio") === "twilio") {
			const accountSid = resolveVoiceCallSetupValue(voiceCallTwilioConfig.accountSid, env.TWILIO_ACCOUNT_SID);
			const authToken = resolveVoiceCallSetupValue(voiceCallTwilioConfig.authToken, env.TWILIO_AUTH_TOKEN);
			const fromNumber = resolveVoiceCallSetupValue(voiceCallConfig.fromNumber, env.TWILIO_FROM_NUMBER);
			const twilioReady = Boolean(accountSid && authToken && fromNumber);
			checks.push({
				id: "twilio-voice-call-credentials",
				ok: twilioReady,
				message: twilioReady ? "Twilio voice-call credentials are configured" : "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER or configure voice-call Twilio credentials"
			});
			checks.push(getVoiceCallWebhookExposureCheck(voiceCallConfig));
		}
	}
	return createMeetingSetupStatus(checks);
}
function addGoogleMeetSetupCheck(status, check) {
	return addMeetingSetupCheck(status, check);
}
//#endregion
//#region extensions/google-meet/src/agent-consult.ts
const GOOGLE_MEET_CONSULT_SURFACE = {
	id: "google-meet",
	provider: "google-meet",
	lane: "google-meet",
	surface: "a private Google Meet",
	userLabel: "Participant",
	assistantLabel: "Agent",
	questionSourceLabel: "participant",
	workingResponseLabel: "participant",
	extraSystemPrompt: [
		"You are a behind-the-scenes consultant for a live meeting voice agent.",
		"Prioritize a fast, speakable answer over exhaustive investigation.",
		"For tool-backed status checks, prefer one or two bounded read-only queries before answering.",
		"Do not print secret values or dump environment variables; only check whether required configuration is present.",
		"Be accurate, brief, and speakable."
	].join(" ")
};
function resolveGoogleMeetRealtimeTools(policy) {
	return resolveMeetingRealtimeTools(policy);
}
async function consultOpenClawAgentForGoogleMeet(params) {
	return await consultMeetingAgent({
		surface: GOOGLE_MEET_CONSULT_SURFACE,
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
async function handleGoogleMeetRealtimeConsultToolCall(params) {
	await handleMeetingRealtimeConsultToolCall({
		surface: GOOGLE_MEET_CONSULT_SURFACE,
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
//#region extensions/google-meet/src/transports/chrome.ts
const GOOGLE_MEET_RUNTIME_PLATFORM = {
	displayName: GOOGLE_MEET_PLATFORM_ADAPTER.displayName,
	logScope: GOOGLE_MEET_PLATFORM_ADAPTER.logScope,
	sessionIdPrefix: GOOGLE_MEET_PLATFORM_ADAPTER.id
};
function createGoogleMeetRealtimeEngineBindings(params) {
	return {
		platform: GOOGLE_MEET_RUNTIME_PLATFORM,
		consultAgent: (consult) => consultOpenClawAgentForGoogleMeet({
			config: params.config,
			fullConfig: params.fullConfig,
			runtime: params.runtime,
			logger: params.logger,
			...consult
		}),
		tools: resolveGoogleMeetRealtimeTools(params.config.realtime.toolPolicy),
		handleToolCall: (call) => handleGoogleMeetRealtimeConsultToolCall({
			config: params.config,
			fullConfig: params.fullConfig,
			runtime: params.runtime,
			logger: params.logger,
			...call
		})
	};
}
async function assertBlackHole2chAvailable(params) {
	if (process.platform !== "darwin") throw new Error("Chrome Meet transport with blackhole-2ch audio is currently macOS-only");
	const result = await params.runtime.system.runCommandWithTimeout([GOOGLE_MEET_SYSTEM_PROFILER_COMMAND, "SPAudioDataType"], { timeoutMs: params.timeoutMs });
	const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
	if (result.code !== 0 || !outputMentionsBlackHole2ch(output)) {
		const hint = params.runtime.system.formatNativeDependencyHint?.({
			packageName: "BlackHole 2ch",
			downloadCommand: "brew install blackhole-2ch"
		}) ?? "";
		throw new Error([
			"BlackHole 2ch audio device not found.",
			"Install BlackHole 2ch and route Chrome input/output through the OpenClaw audio bridge.",
			hint
		].filter(Boolean).join(" "));
	}
}
async function launchChromeMeet(params) {
	const checkRealtimeAudioPrerequisites = async () => {
		if (!isGoogleMeetTalkBackMode$2(params.mode)) return;
		await assertBlackHole2chAvailable({
			runtime: params.runtime,
			timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
		});
		if (params.config.chrome.audioBridgeHealthCommand) {
			const health = await params.runtime.system.runCommandWithTimeout(params.config.chrome.audioBridgeHealthCommand, { timeoutMs: params.config.chrome.joinTimeoutMs });
			if (health.code !== 0) throw new Error(`Chrome audio bridge health check failed: ${health.stderr || health.stdout || health.code}`);
		}
	};
	const startRealtimeAudioBridge = async () => {
		if (!isGoogleMeetTalkBackMode$2(params.mode)) return;
		if (params.config.chrome.audioBridgeCommand) {
			if (params.mode === "agent") throw new Error("Chrome agent mode requires chrome.audioInputCommand and chrome.audioOutputCommand so OpenClaw can run STT and regular TTS directly.");
			const bridge = await params.runtime.system.runCommandWithTimeout(params.config.chrome.audioBridgeCommand, { timeoutMs: params.config.chrome.joinTimeoutMs });
			if (bridge.code !== 0) throw new Error(`failed to start Chrome audio bridge: ${bridge.stderr || bridge.stdout || bridge.code}`);
			return { type: "external-command" };
		}
		if (!params.config.chrome.audioInputCommand || !params.config.chrome.audioOutputCommand) throw new Error("Chrome talk-back mode requires chrome.audioInputCommand and chrome.audioOutputCommand, or chrome.audioBridgeCommand for an external bridge.");
		const transport = createLocalMeetingRealtimeAudioTransport({
			inputCommand: params.config.chrome.audioInputCommand,
			outputCommand: params.config.chrome.audioOutputCommand,
			bargeInInputCommand: params.config.chrome.bargeInInputCommand,
			bargeInRmsThreshold: params.config.chrome.bargeInRmsThreshold,
			bargeInPeakThreshold: params.config.chrome.bargeInPeakThreshold,
			bargeInCooldownMs: params.config.chrome.bargeInCooldownMs,
			logger: params.logger,
			logScope: GOOGLE_MEET_RUNTIME_PLATFORM.logScope
		});
		const bindings = createGoogleMeetRealtimeEngineBindings(params);
		const engine = params.mode === "agent" ? await startMeetingAgentRealtimeEngine({
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
		});
		return {
			type: "command-pair",
			inputCommand: params.config.chrome.audioInputCommand,
			outputCommand: params.config.chrome.audioOutputCommand,
			...engine
		};
	};
	await checkRealtimeAudioPrerequisites();
	if (!params.config.chrome.launch) return {
		launched: false,
		audioBridge: await startRealtimeAudioBridge()
	};
	const result = await openMeetingWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: await resolveLocalMeetingBrowserRequest(params.runtime),
		config: params.config.chrome,
		session: {
			meetingSessionId: params.meetingSessionId,
			mode: params.mode,
			url: params.url
		}
	});
	const audioBridge = isGoogleMeetTalkBackMode$2(params.mode) && result.browser?.inCall === true && result.browser.micMuted === false && result.browser.manualActionRequired !== true ? await startRealtimeAudioBridge() : void 0;
	return {
		...result,
		audioBridge
	};
}
function parseNodeStartResult(raw) {
	const value = raw && typeof raw === "object" && "payload" in raw ? raw.payload : raw;
	if (!value || typeof value !== "object") throw new Error("Google Meet node returned an invalid start result.");
	return value;
}
async function leaveChromeMeet(params) {
	return await leaveMeetingWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: await resolveLocalMeetingBrowserRequest(params.runtime),
		launch: params.config.chrome.launch,
		meetingSessionId: params.meetingSessionId,
		meetingUrl: params.meetingUrl,
		tab: params.tab,
		timeoutMs: params.config.chrome.joinTimeoutMs
	});
}
async function readChromeMeetTranscript(params) {
	return await readMeetingTranscriptWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: await resolveLocalMeetingBrowserRequest(params.runtime),
		finalize: params.finalize === true,
		meetingUrl: params.meetingUrl,
		meetingSessionId: params.meetingSessionId,
		tab: params.tab,
		timeoutMs: Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4)
	});
}
async function readChromeMeetTranscriptOnNode(params) {
	const nodeId = params.nodeId ?? await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	});
	const timeoutMs = Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4);
	return await readMeetingTranscriptWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: async (request) => await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId,
			method: request.method,
			path: request.path,
			body: request.body,
			timeoutMs: request.timeoutMs
		}),
		finalize: params.finalize === true,
		meetingUrl: params.meetingUrl,
		meetingSessionId: params.meetingSessionId,
		tab: params.tab,
		timeoutMs
	});
}
async function leaveChromeMeetOnNode(params) {
	const nodeId = params.nodeId ?? await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	});
	return await leaveMeetingWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: async (request) => await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId,
			method: request.method,
			path: request.path,
			body: request.body,
			timeoutMs: request.timeoutMs
		}),
		launch: params.config.chrome.launch,
		meetingSessionId: params.meetingSessionId,
		meetingUrl: params.meetingUrl,
		tab: params.tab,
		timeoutMs: params.config.chrome.joinTimeoutMs
	});
}
async function openMeetWithBrowserProxy(params) {
	return await openMeetingWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: async (request) => await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId: params.nodeId,
			method: request.method,
			path: request.path,
			body: request.body,
			timeoutMs: request.timeoutMs
		}),
		config: params.config.chrome,
		session: {
			mode: params.mode,
			meetingSessionId: params.meetingSessionId,
			url: params.url
		}
	});
}
async function recoverCurrentMeetTab(params) {
	return {
		transport: "chrome",
		...await recoverMeetingBrowserTab({
			adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
			callBrowser: await resolveLocalMeetingBrowserRequest(params.runtime),
			config: params.config.chrome,
			locationLabel: "in local Chrome",
			mode: params.mode ?? "bidi",
			readOnly: params.readOnly,
			requestedMeetingUrl: params.url,
			trackedMeetingUrl: params.trackedMeetingUrl,
			trackedTargetId: params.trackedTargetId
		})
	};
}
async function recoverCurrentMeetTabOnNode(params) {
	const nodeId = await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	});
	return {
		transport: "chrome-node",
		nodeId,
		...await recoverMeetingBrowserTab({
			adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
			callBrowser: async (request) => await callBrowserProxyOnNode({
				runtime: params.runtime,
				nodeId,
				method: request.method,
				path: request.path,
				body: request.body,
				timeoutMs: request.timeoutMs
			}),
			config: params.config.chrome,
			locationLabel: "on the selected Chrome node",
			mode: params.mode ?? "bidi",
			readOnly: params.readOnly,
			requestedMeetingUrl: params.url,
			trackedMeetingUrl: params.trackedMeetingUrl,
			trackedTargetId: params.trackedTargetId
		})
	};
}
async function launchChromeMeetOnNode(params) {
	const nodeId = await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	});
	try {
		await params.runtime.nodes.invoke({
			nodeId,
			command: GOOGLE_MEET_NODE_COMMAND,
			params: {
				action: "stopByUrl",
				url: params.url,
				mode: params.mode
			},
			timeoutMs: 5e3
		});
	} catch (error) {
		params.logger.debug?.(`[google-meet] node bridge cleanup before join ignored: ${error instanceof Error ? error.message : String(error)}`);
	}
	const browserControl = await openMeetWithBrowserProxy({
		runtime: params.runtime,
		nodeId,
		config: params.config,
		mode: params.mode,
		meetingSessionId: params.meetingSessionId,
		url: params.url
	});
	if (params.config.chrome.launch && isGoogleMeetTalkBackMode$2(params.mode) && (browserControl.browser?.inCall !== true || browserControl.browser.micMuted !== false || browserControl.browser.manualActionRequired === true)) return {
		nodeId,
		launched: browserControl.launched,
		browser: browserControl.browser,
		tab: browserControl.tab
	};
	const result = parseNodeStartResult(await params.runtime.nodes.invoke({
		nodeId,
		command: GOOGLE_MEET_NODE_COMMAND,
		params: {
			action: "start",
			url: params.url,
			mode: params.mode,
			launch: false,
			browserProfile: params.config.chrome.browserProfile,
			joinTimeoutMs: params.config.chrome.joinTimeoutMs,
			audioInputCommand: params.config.chrome.audioInputCommand,
			audioOutputCommand: params.config.chrome.audioOutputCommand,
			audioBridgeCommand: params.config.chrome.audioBridgeCommand,
			audioBridgeHealthCommand: params.config.chrome.audioBridgeHealthCommand
		},
		timeoutMs: addTimerTimeoutGraceMs(params.config.chrome.joinTimeoutMs) ?? 1
	}));
	if (result.audioBridge?.type === "node-command-pair") {
		if (!result.bridgeId) throw new Error("Google Meet node did not return an audio bridge id.");
		const transport = createNodeMeetingRealtimeAudioTransport({
			runtime: params.runtime,
			nodeId,
			bridgeId: result.bridgeId,
			logger: params.logger,
			commandName: GOOGLE_MEET_NODE_COMMAND,
			logScope: GOOGLE_MEET_RUNTIME_PLATFORM.logScope,
			logPrefix: params.mode === "agent" ? "node agent" : "node"
		});
		const bindings = createGoogleMeetRealtimeEngineBindings(params);
		const engine = params.mode === "agent" ? await startMeetingAgentRealtimeEngine({
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
			talkSessionId: `google-meet:${params.meetingSessionId}:${result.bridgeId}:node-realtime`,
			talkContext: {
				nodeId,
				bridgeId: result.bridgeId
			},
			transport,
			logger: params.logger
		});
		const bridge = {
			type: "node-command-pair",
			nodeId,
			bridgeId: result.bridgeId,
			...engine
		};
		return {
			nodeId,
			launched: browserControl.launched || result.launched === true,
			audioBridge: bridge,
			browser: browserControl.browser ?? result.browser,
			tab: browserControl.tab
		};
	}
	if (result.audioBridge?.type === "external-command") return {
		nodeId,
		launched: browserControl.launched || result.launched === true,
		audioBridge: { type: "external-command" },
		browser: browserControl.browser ?? result.browser,
		tab: browserControl.tab
	};
	return {
		nodeId,
		launched: browserControl.launched || result.launched === true,
		browser: browserControl.browser ?? result.browser,
		tab: browserControl.tab
	};
}
//#endregion
//#region extensions/google-meet/src/runtime-setup.ts
function collectChromeAudioCommands(config) {
	return uniqueStrings((config.chrome.audioBridgeCommand ? [config.chrome.audioBridgeCommand[0]] : [
		config.chrome.audioInputCommand?.[0],
		config.chrome.audioOutputCommand?.[0],
		config.chrome.bargeInInputCommand?.[0]
	]).filter((value) => Boolean(value?.trim())));
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
async function getGoogleMeetRuntimeSetupStatus(params) {
	const options = params.options ?? {};
	const transport = options.transport ?? params.config.defaultTransport;
	const mode = options.mode === "realtime" ? "agent" : options.mode ?? params.config.defaultMode;
	const twilioDialInNumber = transport === "twilio" ? normalizeDialInNumber(options.dialInNumber) : void 0;
	const shouldCheckChromeNode = transport === "chrome-node" || !options.transport && Boolean(params.config.chromeNode.node);
	let status = getGoogleMeetSetupStatus(params.config, {
		fullConfig: params.fullConfig,
		mode,
		transport,
		twilioDialInNumber
	});
	if (shouldCheckChromeNode) try {
		const node = await resolveChromeNodeInfo({
			runtime: params.runtime,
			requestedNode: params.config.chromeNode.node
		});
		const label = node.displayName ?? node.remoteIp ?? node.nodeId ?? "connected node";
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-node-connected",
			ok: true,
			message: `Connected Google Meet node ready: ${label}`
		});
	} catch (error) {
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-node-connected",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	if (transport !== "chrome" || mode !== "agent" && mode !== "bidi") return status;
	try {
		await assertBlackHole2chAvailable({
			runtime: params.runtime,
			timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
		});
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-local-audio-device",
			ok: true,
			message: "BlackHole 2ch audio device found"
		});
	} catch (error) {
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-local-audio-device",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	const commands = collectChromeAudioCommands(params.config);
	const missingCommands = [];
	for (const command of commands) try {
		if (!await commandExists(params.runtime, command)) missingCommands.push(command);
	} catch {
		missingCommands.push(command);
	}
	return addGoogleMeetSetupCheck(status, {
		id: "chrome-local-audio-commands",
		ok: commands.length > 0 && missingCommands.length === 0,
		message: commands.length === 0 ? "Chrome talk-back audio commands are not configured" : missingCommands.length === 0 ? `Chrome audio command${commands.length === 1 ? "" : "s"} available: ${commands.join(", ")}` : `Chrome audio command${missingCommands.length === 1 ? "" : "s"} missing: ${missingCommands.join(", ")}`
	});
}
//#endregion
//#region extensions/google-meet/src/voice-call-gateway.ts
const GOOGLE_MEET_VOICE_CALL_SURFACE = {
	clientDisplayName: "Google Meet plugin",
	configPath: "google-meet voiceCall.gatewayUrl",
	logScope: "[google-meet]",
	meetingLabel: "Meet",
	providerLabel: "Twilio"
};
async function createConnectedGatewayClient(params) {
	let client;
	await new Promise((resolve, reject) => {
		const abortStart = new AbortController();
		const timer = setTimeout(() => {
			abortStart.abort();
			reject(/* @__PURE__ */ new Error("gateway connect timeout"));
		}, params.config.requestTimeoutMs);
		client = new GatewayClient({
			url: params.config.gatewayUrl,
			token: params.config.token,
			requestTimeoutMs: params.config.requestTimeoutMs,
			clientName: "cli",
			clientDisplayName: params.surface.clientDisplayName,
			scopes: ["operator.write"],
			onHelloOk: () => {
				clearTimeout(timer);
				resolve();
			},
			onConnectError: (error) => {
				clearTimeout(timer);
				abortStart.abort();
				reject(error);
			}
		});
		startGatewayClientWhenEventLoopReady(client, {
			timeoutMs: params.config.requestTimeoutMs,
			signal: abortStart.signal
		}).then((readiness) => {
			if (!readiness.ready && !readiness.aborted) {
				clearTimeout(timer);
				reject(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
			}
		}).catch((error) => {
			clearTimeout(timer);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
	return client;
}
function createVoiceCallGateway(params) {
	return createMeetingVoiceCallGateway({
		config: params.config.voiceCall,
		runtime: params.runtime,
		surface: GOOGLE_MEET_VOICE_CALL_SURFACE,
		connectClient: createConnectedGatewayClient
	});
}
const isVoiceCallMissingError = isMeetingVoiceCallMissingError;
async function joinMeetViaVoiceCallGateway(params) {
	return await joinMeetingViaVoiceCallGateway({
		...params,
		config: params.config.voiceCall,
		surface: GOOGLE_MEET_VOICE_CALL_SURFACE
	});
}
async function endMeetVoiceCallGatewayCall(params) {
	await endMeetingVoiceCallGatewayCall(params);
}
async function getMeetVoiceCallGatewayCall(params) {
	return await getMeetingVoiceCallGatewayCall(params);
}
async function speakMeetViaVoiceCallGateway(params) {
	await speakMeetingViaVoiceCallGateway(params);
}
//#endregion
//#region extensions/google-meet/src/runtime.ts
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function buildTwilioVoiceCallSessionKey(meetingSessionId) {
	return `voice:google-meet:${meetingSessionId}`;
}
function resolveTransport(input, config) {
	return input ?? config.defaultTransport;
}
function resolveMode(input, config) {
	return input === "realtime" ? "agent" : input ?? config.defaultMode;
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
function isGoogleMeetTalkBackMode$1(mode) {
	return mode === "agent" || mode === "bidi";
}
function isBrowserTransport(transport) {
	return transport === "chrome" || transport === "chrome-node";
}
function noteSession(session, note) {
	session.notes = [...session.notes.filter((item) => item !== note), note];
}
var GoogleMeetRuntime = class {
	#createdBrowserTabs = /* @__PURE__ */ new Map();
	#agentId;
	#voiceCallGateway;
	#sessions;
	constructor(params) {
		this.params = params;
		this.#agentId = resolveDefaultAgentId(params.fullConfig);
		this.#voiceCallGateway = createVoiceCallGateway(params);
		this.#sessions = new MeetingSessionRuntime({
			logger: params.logger,
			logScope: "[google-meet]",
			formatError: formatErrorMessage,
			reuseExistingBrowserTab: params.config.chrome.reuseExistingTab,
			waitForInCallMs: params.config.chrome.waitForInCallMs,
			joinTimeoutMs: params.config.chrome.joinTimeoutMs,
			defaultSpeechInstructions: params.config.realtime.introMessage,
			transientSpeechBlockedReasons: /* @__PURE__ */ new Set([
				"not-in-call",
				"browser-unverified",
				"meet-microphone-muted"
			]),
			messages: {
				previousBrowserLeaveFailed: "Could not leave the previous Meet browser tab before reassignment.",
				reassignedSessionNote: "Ended before the same Meet tab was reassigned to another agent.",
				reusedSessionNote: "Reused existing active Meet session.",
				replacementBrowserLeaveFailed: "Could not leave the previous Meet browser tab before reassignment.",
				speechBlockedFallback: "Realtime speech blocked until Google Meet is ready.",
				speech: {
					audioBridgeUnavailable: "Realtime speech requires an active Chrome audio bridge.",
					browserUnverified: "Google Meet browser state has not been verified yet.",
					manualActionFallback: "Resolve the Google Meet browser prompt before asking OpenClaw to speak.",
					microphoneMuted: "Turn on the OpenClaw Google Meet microphone before asking OpenClaw to speak.",
					microphoneMutedReason: "meet-microphone-muted",
					notInCall: "Google Meet has not reported that the browser participant is in the call.",
					notInCallReason: "not-in-call",
					browserUnverifiedReason: "browser-unverified",
					audioBridgeUnavailableReason: "audio-bridge-unavailable"
				}
			},
			resolveJoin: (request) => ({
				url: GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(request.url),
				transport: resolveTransport(request.transport, params.config),
				mode: resolveMode(request.mode, params.config),
				agentId: normalizeAgentId(request.agentId ?? params.config.realtime.agentId ?? this.#agentId)
			}),
			createSession: ({ request: _request, resolved, createdAt }) => createGoogleMeetSession({
				config: params.config,
				resolved,
				createdAt
			}),
			resolveSpeechInstructions: (request) => request.message ?? params.config.realtime.introMessage,
			isBrowserTransport,
			isTalkBackMode: isGoogleMeetTalkBackMode$1,
			isTranscribeMode: (mode) => mode === "transcribe",
			sameMeetingUrl: (left, right) => GOOGLE_MEET_PLATFORM_ADAPTER.urls.isSameMeeting(left, right),
			normalizeMeetingUrlForReuse: (url) => GOOGLE_MEET_PLATFORM_ADAPTER.urls.normalizeForReuse(url),
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
			refreshStatus: async (session) => await this.#refreshStatus(session),
			refreshReusableSession: async (session, _request, _resolved) => {
				if (session.transport === "twilio") await this.#refreshTwilioVoiceCallStatus(session);
			},
			ensureRealtimeBridge: async (session) => await this.#ensureChromeRealtimeBridge(session),
			captureTranscript: async (session, options) => await this.#captureTranscript(session, options),
			speakViaTransport: async (session, instructions) => await this.#speakViaTransport(session, instructions)
		});
	}
	list() {
		return this.#sessions.list();
	}
	async status(sessionId) {
		return await this.#sessions.status(sessionId);
	}
	async transcript(sessionId, options = {}) {
		return await this.#sessions.transcript(sessionId, options);
	}
	async setupStatus(options = {}) {
		return await getGoogleMeetRuntimeSetupStatus({
			config: this.params.config,
			fullConfig: this.params.fullConfig,
			runtime: this.params.runtime,
			options
		});
	}
	async createViaBrowser() {
		const result = await GOOGLE_MEET_PLATFORM_ADAPTER.create.browser({
			runtime: this.params.runtime,
			config: this.params.config
		});
		if (result.openedByPlugin && result.targetId) this.#createdBrowserTabs.set(`${result.nodeId}:${result.targetId}`, result.meetingUri);
		return result;
	}
	async recoverCurrentTab(request = {}) {
		const transport = resolveTransport(request.transport, this.params.config);
		if (transport === "twilio") throw new Error("recover_current_tab only supports chrome or chrome-node transports");
		const url = request.url ? GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(request.url) : void 0;
		return transport === "chrome-node" ? await recoverCurrentMeetTabOnNode({
			runtime: this.params.runtime,
			config: this.params.config,
			url
		}) : await recoverCurrentMeetTab({
			runtime: this.params.runtime,
			config: this.params.config,
			url
		});
	}
	async join(request) {
		return await this.#sessions.join(request);
	}
	async leave(sessionId, options) {
		return await this.#sessions.leave(sessionId, options);
	}
	async speak(sessionId, instructions) {
		return await this.#sessions.speak(sessionId, instructions);
	}
	async testSpeech(request) {
		return await testGoogleMeetSpeech(this.#probeContext(), request);
	}
	async testListen(request) {
		return await testGoogleMeetListening(this.#probeContext(), request);
	}
	#probeContext() {
		return {
			config: this.params.config,
			resolveAgentId: (request) => normalizeAgentId(request.agentId ?? this.params.config.realtime.agentId ?? this.#agentId),
			list: () => this.list(),
			join: async (request) => await this.join(request),
			isReusable: (session, resolved) => this.#sessions.isReusableSession(session, resolved),
			hasHealthHandle: (sessionId) => this.#sessions.hasHealthHandle(sessionId),
			refreshHealth: (sessionId) => this.#sessions.refreshHealth(sessionId),
			refreshCaptionHealth: async (session) => await this.#sessions.refreshCaptionHealth(session)
		};
	}
	async #joinTransport(request, session, context) {
		if (isBrowserTransport(session.transport)) {
			const chromeConfig = withSessionAgentConfig(this.params.config, session.agentId);
			const result = session.transport === "chrome-node" ? await launchChromeMeetOnNode({
				runtime: this.params.runtime,
				config: chromeConfig,
				fullConfig: this.params.fullConfig,
				meetingSessionId: session.id,
				requesterSessionKey: request.requesterSessionKey,
				mode: session.mode,
				url: session.url,
				logger: this.params.logger
			}) : await launchChromeMeet({
				runtime: this.params.runtime,
				config: chromeConfig,
				fullConfig: this.params.fullConfig,
				meetingSessionId: session.id,
				requesterSessionKey: request.requesterSessionKey,
				mode: session.mode,
				url: session.url,
				logger: this.params.logger
			});
			const nodeId = "nodeId" in result ? result.nodeId : void 0;
			let tab = result.tab;
			const createdKey = session.transport === "chrome-node" && nodeId && tab ? `${nodeId}:${tab.targetId}` : void 0;
			const createdUrl = createdKey ? this.#createdBrowserTabs.get(createdKey) : void 0;
			if (createdKey) this.#createdBrowserTabs.delete(createdKey);
			if (tab && GOOGLE_MEET_PLATFORM_ADAPTER.urls.isSameMeeting(createdUrl, session.url)) tab = {
				...tab,
				openedByPlugin: true
			};
			tab = context.inheritedBrowserTab({
				session,
				transport: session.transport,
				nodeId,
				meetingUrl: session.url,
				tab
			});
			session.chrome = {
				audioBackend: this.params.config.chrome.audioBackend,
				launched: result.launched,
				nodeId,
				browserProfile: this.params.config.chrome.browserProfile,
				browserTab: tab,
				health: result.browser
			};
			const handles = this.#attachChromeAudioBridge(session, result.audioBridge);
			if (handles) context.attachRuntimeHandles(session, handles);
			session.notes.push(result.audioBridge ? session.transport === "chrome-node" ? "Chrome node transport joins as the signed-in Google profile on the selected node and routes realtime audio through the node bridge." : "Chrome transport joins as the signed-in Google profile and routes realtime audio through the configured bridge." : isGoogleMeetTalkBackMode$1(session.mode) ? "Chrome transport joins as the signed-in Google profile and expects BlackHole 2ch audio routing." : "Chrome transport joins as the signed-in Google profile without starting the realtime audio bridge.");
			this.#sessions.refreshSpeechReadiness(session);
			return {};
		}
		const dialPlan = GOOGLE_MEET_PLATFORM_ADAPTER.dialIn.buildPlan({
			dialInNumber: request.dialInNumber,
			defaultDialInNumber: this.params.config.twilio.defaultDialInNumber,
			pin: request.pin,
			defaultPin: this.params.config.twilio.defaultPin,
			dtmfSequence: request.dtmfSequence,
			defaultDtmfSequence: this.params.config.twilio.defaultDtmfSequence,
			dtmfDelayMs: this.params.config.voiceCall.dtmfDelayMs
		});
		const dialInNumber = dialPlan.number;
		if (!dialInNumber) throw new Error("Twilio transport requires a Meet dial-in phone number. Google Meet URLs do not include dial-in details; pass dialInNumber with optional pin/dtmfSequence, configure twilio.defaultDialInNumber, or use chrome/chrome-node transport.");
		const dtmfSequence = dialPlan.dtmfSequence;
		const delegatedAgentId = Boolean(normalizeOptionalString(request.agentId) || normalizeOptionalString(this.params.config.realtime.agentId)) ? session.agentId : void 0;
		const voiceCallResult = this.params.config.voiceCall.enabled ? await joinMeetViaVoiceCallGateway({
			config: this.params.config,
			gateway: this.#voiceCallGateway,
			dialInNumber,
			dtmfSequence,
			logger: this.params.logger,
			...request.requesterSessionKey ? { requesterSessionKey: request.requesterSessionKey } : {},
			agentId: delegatedAgentId,
			sessionKey: delegatedAgentId ? `agent:${delegatedAgentId}:google-meet:${session.id}` : buildTwilioVoiceCallSessionKey(session.id),
			message: isGoogleMeetTalkBackMode$1(session.mode) ? request.message ?? this.params.config.voiceCall.introMessage ?? this.params.config.realtime.introMessage : void 0
		}) : void 0;
		session.twilio = {
			dialInNumber,
			pinProvided: Boolean(dialPlan.pin),
			dtmfSequence,
			voiceCallId: voiceCallResult?.callId,
			dtmfSent: voiceCallResult?.dtmfSent,
			introSent: voiceCallResult?.introSent
		};
		if (voiceCallResult?.callId) context.attachRuntimeHandles(session, { stop: async () => {
			await endMeetVoiceCallGatewayCall({
				gateway: this.#voiceCallGateway,
				callId: voiceCallResult.callId
			});
		} });
		session.notes.push(this.params.config.voiceCall.enabled ? dtmfSequence ? "Twilio transport delegated the phone leg to the voice-call plugin, then queued configured DTMF before realtime connect." : "Twilio transport delegated the call to the voice-call plugin without configured DTMF." : "Twilio transport is an explicit dial plan; voice-call delegation is disabled.");
		return { delegatedSpoken: Boolean(voiceCallResult?.introSent) };
	}
	#attachChromeAudioBridge(session, audioBridge) {
		if (!session.chrome || !audioBridge) return;
		session.chrome.audioBridge = {
			type: audioBridge.type,
			provider: audioBridge.type === "command-pair" || audioBridge.type === "node-command-pair" ? audioBridge.providerId : void 0
		};
		return audioBridge.type === "command-pair" || audioBridge.type === "node-command-pair" ? {
			stop: audioBridge.stop,
			speak: audioBridge.speak,
			getHealth: audioBridge.getHealth
		} : void 0;
	}
	async #ensureChromeRealtimeBridge(session) {
		if (!isGoogleMeetTalkBackMode$1(session.mode) || !isBrowserTransport(session.transport) || session.state !== "active" || !session.chrome || session.chrome.audioBridge || session.chrome.health?.inCall !== true || session.chrome.health.micMuted !== false || session.chrome.health.manualActionRequired === true) return;
		const config = withSessionAgentConfig(this.params.config, session.agentId);
		const recoveryConfig = {
			...config,
			chrome: {
				...config.chrome,
				launch: false
			},
			...session.chrome.nodeId ? { chromeNode: {
				...config.chromeNode,
				node: session.chrome.nodeId
			} } : {}
		};
		const result = session.transport === "chrome-node" ? await launchChromeMeetOnNode({
			runtime: this.params.runtime,
			config: recoveryConfig,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			mode: session.mode,
			url: session.url,
			logger: this.params.logger
		}) : await launchChromeMeet({
			runtime: this.params.runtime,
			config: recoveryConfig,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			mode: session.mode,
			url: session.url,
			logger: this.params.logger
		});
		session.updatedAt = nowIso();
		return this.#attachChromeAudioBridge(session, result.audioBridge);
	}
	async #refreshBrowserHealth(session, options = {}) {
		try {
			const result = session.transport === "chrome-node" ? await recoverCurrentMeetTabOnNode({
				runtime: this.params.runtime,
				config: this.params.config,
				mode: session.mode,
				readOnly: options.readOnly,
				trackedMeetingUrl: session.url,
				trackedTargetId: session.chrome?.browserTab?.targetId,
				url: session.url
			}) : await recoverCurrentMeetTab({
				runtime: this.params.runtime,
				config: this.params.config,
				mode: session.mode,
				readOnly: options.readOnly,
				trackedMeetingUrl: session.url,
				trackedTargetId: session.chrome?.browserTab?.targetId,
				url: session.url
			});
			if (result.found && session.chrome) {
				if (result.targetId) {
					const currentTab = session.chrome.browserTab;
					session.chrome.browserTab = {
						targetId: result.targetId,
						openedByPlugin: result.targetId === currentTab?.targetId ? currentTab.openedByPlugin : false
					};
				}
				if (result.browser) session.chrome.health = {
					...session.chrome.health,
					...result.browser
				};
				session.updatedAt = nowIso();
			}
		} catch (error) {
			this.params.logger.debug?.(`[google-meet] browser readiness refresh ignored: ${formatErrorMessage(error)}`);
		}
	}
	async #refreshStatus(session) {
		if (isBrowserTransport(session.transport)) await this.#sessions.refreshBrowserHealth(session, {
			force: true,
			readOnly: true
		});
		else if (session.transport === "twilio") await this.#refreshTwilioVoiceCallStatus(session);
		else this.#sessions.refreshSpeechReadiness(session);
	}
	async #refreshTwilioVoiceCallStatus(session) {
		const callId = session.twilio?.voiceCallId;
		if (!callId || session.state !== "active") {
			this.#sessions.refreshSpeechReadiness(session);
			return;
		}
		try {
			if ((await getMeetVoiceCallGatewayCall({
				gateway: this.#voiceCallGateway,
				callId
			})).found === false) this.#sessions.markSessionEnded(session, "Voice Call is no longer active.");
		} catch (error) {
			this.params.logger.debug?.(`[google-meet] voice-call status refresh ignored: ${formatErrorMessage(error)}`);
		}
		this.#sessions.refreshSpeechReadiness(session);
	}
	async #speakViaTransport(session, instructions) {
		if (session.transport !== "twilio" || !session.twilio?.voiceCallId) return;
		try {
			await speakMeetViaVoiceCallGateway({
				gateway: this.#voiceCallGateway,
				callId: session.twilio.voiceCallId,
				message: instructions || this.params.config.voiceCall.introMessage || this.params.config.realtime.introMessage || ""
			});
		} catch (error) {
			if (!isVoiceCallMissingError(error)) throw error;
			this.#sessions.markSessionEnded(session, "Voice Call is no longer active.");
			return {
				handled: true,
				spoken: false
			};
		}
		session.twilio.introSent = true;
		session.updatedAt = nowIso();
		return {
			handled: true,
			spoken: true
		};
	}
	async #captureTranscript(session, options = {}) {
		const tab = session.chrome?.browserTab;
		if (!tab) return;
		return session.transport === "chrome-node" ? await readChromeMeetTranscriptOnNode({
			runtime: this.params.runtime,
			nodeId: session.chrome?.nodeId,
			config: this.params.config,
			...options.finalize === void 0 ? {} : { finalize: options.finalize },
			meetingUrl: session.url,
			meetingSessionId: session.id,
			tab
		}) : await readChromeMeetTranscript({
			runtime: this.params.runtime,
			config: this.params.config,
			...options.finalize === void 0 ? {} : { finalize: options.finalize },
			meetingUrl: session.url,
			meetingSessionId: session.id,
			tab
		});
	}
	async #releaseBrowserTab(session) {
		if (!isBrowserTransport(session.transport)) return;
		const tab = session.chrome?.browserTab;
		if (!tab) {
			noteSession(session, "No tracked Meet browser tab for this session; close the Meet tab manually if it is still in the call.");
			session.browserLeft = false;
			return false;
		}
		if (this.list().some((other) => other.id !== session.id && other.state === "active" && isBrowserTransport(other.transport) && other.chrome?.browserTab?.targetId === tab.targetId && other.chrome?.nodeId === session.chrome?.nodeId)) {
			noteSession(session, "Kept the shared Meet tab open because another active session uses it.");
			session.browserLeft = void 0;
			return;
		}
		let left;
		try {
			const result = session.transport === "chrome-node" ? await leaveChromeMeetOnNode({
				runtime: this.params.runtime,
				nodeId: session.chrome?.nodeId,
				config: this.params.config,
				meetingSessionId: session.id,
				meetingUrl: session.url,
				tab
			}) : await leaveChromeMeet({
				runtime: this.params.runtime,
				config: this.params.config,
				meetingSessionId: session.id,
				meetingUrl: session.url,
				tab
			});
			noteSession(session, result.note);
			left = result.left;
		} catch (error) {
			noteSession(session, `Browser control could not leave the Meet tab: ${formatErrorMessage(error)}`);
			left = false;
		}
		if (session.chrome && left) {
			session.chrome.browserTab = void 0;
			if (session.chrome.health) session.chrome.health = {
				...session.chrome.health,
				captioning: false,
				audioOutputRouted: false,
				providerConnected: false,
				realtimeReady: false,
				audioInputActive: false,
				audioOutputActive: false
			};
		}
		session.browserLeft = left;
		return left;
	}
};
//#endregion
//#region extensions/google-meet/index.ts
const loadGoogleMeetCreateModule = createLazyRuntimeModule(() => import("../../create-CQQSPlhN.js"));
const loadGoogleMeetCliModule = createLazyRuntimeModule(() => import("../../cli-DqjfpxPN.js"));
const googleMeetConfigSchema = {
	parse(value) {
		return resolveGoogleMeetConfig(value);
	},
	uiHints: {
		"defaults.meeting": {
			label: "Default Meeting",
			help: "Meet URL, meeting code, or spaces/{id} used when CLI commands omit a meeting."
		},
		"preview.enrollmentAcknowledged": {
			label: "Preview Acknowledged",
			help: "Confirms you understand the Google Meet Media API is still Developer Preview.",
			advanced: true
		},
		defaultTransport: {
			label: "Default Transport",
			help: "Chrome uses a signed-in browser profile. Chrome-node runs Chrome on a paired node. Twilio uses Meet dial-in numbers."
		},
		defaultMode: {
			label: "Default Mode",
			help: "Agent uses realtime transcription plus regular OpenClaw TTS. Bidi uses the realtime voice model directly. Transcribe observes only."
		},
		"chrome.audioBackend": {
			label: "Chrome Audio Backend",
			help: "BlackHole 2ch is required for local duplex audio routing."
		},
		"chrome.launch": { label: "Launch Chrome" },
		"chrome.browserProfile": {
			label: "Chrome Profile",
			advanced: true
		},
		"chrome.guestName": {
			label: "Guest Name",
			help: "Used when Chrome lands on the signed-out Meet guest-name screen."
		},
		"chrome.reuseExistingTab": {
			label: "Reuse Existing Meet Tab",
			help: "Avoids opening duplicate tabs for the same Meet URL."
		},
		"chrome.autoJoin": {
			label: "Auto Join Guest Screen",
			help: "Best-effort guest-name fill and Join Now click through OpenClaw browser automation."
		},
		"chrome.waitForInCallMs": {
			label: "Wait For In-Call (ms)",
			help: "Waits for Chrome to report that the Meet tab is in-call before the realtime intro speaks.",
			advanced: true
		},
		"chrome.audioFormat": {
			label: "Audio Format",
			help: "Command-pair audio format. PCM16 24 kHz is the default Chrome/Meet path; G.711 mu-law 8 kHz remains available for legacy command pairs.",
			advanced: true
		},
		"chrome.audioBufferBytes": {
			label: "Audio Buffer Bytes",
			help: "SoX processing buffer for generated Chrome command-pair audio commands. Lower values reduce latency but may underrun on busy hosts.",
			advanced: true
		},
		"chrome.audioInputCommand": {
			label: "Audio Input Command",
			help: "Command that writes meeting audio to stdout in chrome.audioFormat.",
			advanced: true
		},
		"chrome.audioOutputCommand": {
			label: "Audio Output Command",
			help: "Command that reads assistant audio from stdin in chrome.audioFormat.",
			advanced: true
		},
		"chrome.bargeInInputCommand": {
			label: "Barge-In Input Command",
			help: "Optional Gateway-hosted microphone command that writes signed 16-bit little-endian mono PCM for human interruption detection while assistant playback is active.",
			advanced: true
		},
		"chrome.bargeInRmsThreshold": {
			label: "Barge-In RMS Threshold",
			help: "RMS level on chrome.bargeInInputCommand that counts as a human interruption.",
			advanced: true
		},
		"chrome.bargeInPeakThreshold": {
			label: "Barge-In Peak Threshold",
			help: "Peak level on chrome.bargeInInputCommand that counts as a human interruption.",
			advanced: true
		},
		"chrome.bargeInCooldownMs": {
			label: "Barge-In Cooldown (ms)",
			help: "Minimum delay between repeated barge-in clears.",
			advanced: true
		},
		"chrome.audioBridgeCommand": {
			label: "Audio Bridge Command",
			advanced: true
		},
		"chrome.audioBridgeHealthCommand": {
			label: "Audio Bridge Health Command",
			advanced: true
		},
		"chromeNode.node": {
			label: "Chrome Node",
			help: "Node id/name/IP that owns Chrome, BlackHole, and SoX for chrome-node transport.",
			advanced: true
		},
		"twilio.defaultDialInNumber": {
			label: "Default Dial-In Number",
			placeholder: "+15551234567"
		},
		"twilio.defaultPin": {
			label: "Default PIN",
			advanced: true
		},
		"twilio.defaultDtmfSequence": {
			label: "Default DTMF Sequence",
			advanced: true
		},
		"voiceCall.enabled": { label: "Delegate To Voice Call" },
		"voiceCall.gatewayUrl": {
			label: "Voice Call Gateway URL",
			advanced: true
		},
		"voiceCall.token": {
			label: "Voice Call Gateway Token",
			sensitive: true,
			advanced: true
		},
		"voiceCall.requestTimeoutMs": {
			label: "Voice Call Request Timeout (ms)",
			advanced: true
		},
		"voiceCall.dtmfDelayMs": {
			label: "DTMF Wait Before PIN (ms)",
			help: "Leading Twilio wait time before playing a PIN-derived Meet DTMF sequence. Increase it if Meet asks for the PIN after DTMF was sent.",
			advanced: true
		},
		"voiceCall.postDtmfSpeechDelayMs": {
			label: "Post-DTMF Speech Delay (ms)",
			help: "Delay before requesting the realtime intro greeting after Voice Call starts the Twilio leg.",
			advanced: true
		},
		"voiceCall.introMessage": {
			label: "Voice Call Intro Message",
			advanced: true
		},
		"realtime.strategy": {
			label: "Realtime Strategy",
			help: "Legacy realtime alias setting. Use mode=agent or mode=bidi for new Meet joins."
		},
		"realtime.provider": {
			label: "Speech Provider",
			help: "Compatibility fallback for both realtime transcription and bidi voice. Prefer realtime.transcriptionProvider and realtime.voiceProvider for new configs."
		},
		"realtime.transcriptionProvider": {
			label: "Realtime Transcription Provider",
			help: "Agent mode uses this provider to transcribe meeting audio before regular OpenClaw TTS answers."
		},
		"realtime.voiceProvider": {
			label: "Bidi Voice Provider",
			help: "Bidi mode uses this realtime voice provider. Falls back to realtime.provider when unset."
		},
		"realtime.model": {
			label: "Bidi Realtime Model",
			help: "Only used by mode=bidi. Agent mode answers with the configured OpenClaw agent and regular TTS.",
			advanced: true
		},
		"realtime.instructions": {
			label: "Realtime Instructions",
			advanced: true
		},
		"realtime.introMessage": {
			label: "Realtime Intro Message",
			help: "Spoken once when the realtime bridge is ready. Set to an empty string to join silently."
		},
		"realtime.agentId": {
			label: "Realtime Consult Agent",
			help: "OpenClaw agent id used by openclaw_agent_consult. Defaults to \"main\".",
			advanced: true
		},
		"realtime.toolPolicy": {
			label: "Realtime Tool Policy",
			help: "Safe read-only tools are available by default; owner requests can unlock broader tools.",
			advanced: true
		},
		"oauth.clientId": { label: "OAuth Client ID" },
		"oauth.clientSecret": {
			label: "OAuth Client Secret",
			sensitive: true
		},
		"oauth.refreshToken": {
			label: "OAuth Refresh Token",
			sensitive: true
		},
		"oauth.accessToken": {
			label: "Cached Access Token",
			sensitive: true,
			advanced: true
		},
		"oauth.expiresAt": {
			label: "Cached Access Token Expiry",
			help: "Unix epoch milliseconds used only for the cached access-token fast path.",
			advanced: true
		}
	}
};
const GoogleMeetToolSchema = Type.Object({
	action: Type.String({
		enum: [
			"join",
			"create",
			"status",
			"transcript",
			"setup_status",
			"resolve_space",
			"preflight",
			"latest",
			"calendar_events",
			"artifacts",
			"attendance",
			"export",
			"recover_current_tab",
			"leave",
			"end_active_conference",
			"speak",
			"test_speech",
			"test_listen"
		],
		description: "Google Meet action to run. create creates and joins by default; pass join=false to only mint a URL. After a timeout or unclear browser state, call recover_current_tab before retrying join."
	}),
	join: Type.Optional(Type.Boolean({ description: "For action=create, set false to create the URL without joining." })),
	accessType: Type.Optional(Type.String({
		enum: [
			"OPEN",
			"TRUSTED",
			"RESTRICTED"
		],
		description: "For action=create with Google Meet OAuth, configure who can join without knocking."
	})),
	entryPointAccess: Type.Optional(Type.String({
		enum: ["ALL", "CREATOR_APP_ONLY"],
		description: "For action=create with Google Meet OAuth, configure allowed join entry points."
	})),
	url: Type.Optional(Type.String({ description: "Explicit https://meet.google.com/... URL" })),
	transport: Type.Optional(Type.String({
		enum: [
			"chrome",
			"chrome-node",
			"twilio"
		],
		description: "Join transport"
	})),
	mode: Type.Optional(Type.String({
		enum: [
			"agent",
			"bidi",
			"transcribe"
		],
		description: "Join mode. agent uses realtime transcription, the configured OpenClaw agent, and regular TTS. bidi uses the realtime voice model directly. transcribe joins observe-only."
	})),
	dialInNumber: Type.Optional(Type.String({ description: "Meet dial-in phone number for Twilio. Required for Twilio unless twilio.defaultDialInNumber is configured; Meet URLs cannot be dialed directly." })),
	pin: Type.Optional(Type.String({ description: "Meet phone PIN for Twilio; # is appended if omitted" })),
	dtmfSequence: Type.Optional(Type.String({ description: "Explicit DTMF sequence for Twilio" })),
	sessionId: Type.Optional(Type.String({ description: "Meet session ID" })),
	sinceIndex: Type.Optional(Type.Integer({
		description: "For transcript, resume from the previous response's nextIndex.",
		minimum: 0
	})),
	message: Type.Optional(Type.String({ description: "Realtime instructions to speak now" })),
	timeoutMs: optionalPositiveIntegerSchema({ description: "Probe timeout in milliseconds" }),
	meeting: Type.Optional(Type.String({ description: "Meet URL, meeting code, or spaces/{id}" })),
	today: Type.Optional(Type.Boolean({ description: "For latest, artifacts, or attendance, find a Meet link on today's calendar." })),
	event: Type.Optional(Type.String({ description: "For latest, artifacts, or attendance, find a matching Calendar event." })),
	calendarId: Type.Optional(Type.String({ description: "Calendar id for today/event lookup" })),
	conferenceRecord: Type.Optional(Type.String({ description: "Meet conferenceRecords/{id} resource name or id" })),
	pageSize: optionalPositiveIntegerSchema({ description: "Meet API page size for list actions" }),
	includeTranscriptEntries: Type.Optional(Type.Boolean({ description: "For artifacts, include structured transcript entries" })),
	includeDocumentBodies: Type.Optional(Type.Boolean({ description: "For artifacts/export, export linked transcript and smart-note Google Docs text through Drive." })),
	outputDir: Type.Optional(Type.String({ description: "For export, output directory" })),
	zip: Type.Optional(Type.Boolean({ description: "For export, also write a .zip archive" })),
	dryRun: Type.Optional(Type.Boolean({ description: "For export, return the manifest without writing files." })),
	includeAllConferenceRecords: Type.Optional(Type.Boolean({ description: "For artifacts, attendance, or export with meeting input, fetch all conference records instead of only the latest." })),
	mergeDuplicateParticipants: Type.Optional(Type.Boolean({ description: "For attendance, merge duplicate participant resources." })),
	lateAfterMinutes: optionalPositiveIntegerSchema({ description: "For attendance, mark participants late after this many minutes." }),
	earlyBeforeMinutes: optionalPositiveIntegerSchema({ description: "For attendance, mark early leavers before this many minutes." }),
	accessToken: Type.Optional(Type.String({ description: "Access token override" })),
	refreshToken: Type.Optional(Type.String({ description: "Refresh token override" })),
	clientId: Type.Optional(Type.String({ description: "OAuth client id override" })),
	clientSecret: Type.Optional(Type.String({ description: "OAuth client secret override" })),
	expiresAt: Type.Optional(Type.Number({ description: "Cached access token expiry ms" }))
});
function asParamRecord(params) {
	return params && typeof params === "object" && !Array.isArray(params) ? params : {};
}
function normalizeTransport(value) {
	return value === "chrome" || value === "chrome-node" || value === "twilio" ? value : void 0;
}
function normalizeMode(value) {
	if (value === "realtime") return "agent";
	return value === "agent" || value === "bidi" || value === "transcribe" ? value : void 0;
}
function isGoogleMeetTalkBackMode(mode) {
	return mode === "agent" || mode === "bidi";
}
function resolveMeetingInput(config, value) {
	const meeting = normalizeOptionalString(value) ?? config.defaults.meeting;
	if (!meeting) throw new Error("Meeting input is required");
	return meeting;
}
function shouldJoinCreatedMeet(raw) {
	return raw.join !== false && raw.join !== "false";
}
const googleMeetToolDeps = {
	callGatewayFromCli,
	platform: () => process.platform
};
const testing = {
	setCallGatewayFromCliForTests(next) {
		googleMeetToolDeps.callGatewayFromCli = next ?? callGatewayFromCli;
	},
	setPlatformForTests(next) {
		googleMeetToolDeps.platform = next ?? (() => process.platform);
	},
	isGoogleMeetAgentToolActionUnsupportedOnHost,
	resolveGoogleMeetGatewayOperationTimeoutMs
};
function googleMeetGatewayMethodForToolAction(action) {
	switch (action) {
		case "recover_current_tab": return "googlemeet.recoverCurrentTab";
		case "setup_status": return "googlemeet.setup";
		case "test_speech": return "googlemeet.testSpeech";
		case "test_listen": return "googlemeet.testListen";
		case "end_active_conference": return "googlemeet.endActiveConference";
		default: return `googlemeet.${action}`;
	}
}
function isGoogleMeetAgentToolActionUnsupportedOnHost(params) {
	if ((params.platform ?? googleMeetToolDeps.platform()) === "darwin") return false;
	const action = params.raw.action;
	if (action !== "join" && action !== "test_speech" && !(action === "create" && shouldJoinCreatedMeet(params.raw))) return false;
	const transport = normalizeTransport(params.raw.transport) ?? params.config.defaultTransport;
	const mode = action === "test_speech" ? "agent" : normalizeMode(params.raw.mode) ?? params.config.defaultMode;
	return transport === "chrome" && isGoogleMeetTalkBackMode(mode);
}
function assertGoogleMeetAgentToolActionSupported(params) {
	if (!isGoogleMeetAgentToolActionUnsupportedOnHost(params)) return;
	throw new Error("Google Meet local Chrome talk-back audio is macOS-only. On this host, use mode: transcribe, transport: twilio, or transport: chrome-node backed by a macOS node.");
}
function readGatewayErrorDetails(err) {
	if (!err || typeof err !== "object" || !("details" in err)) return;
	return err.details;
}
async function callGoogleMeetGatewayFromTool(params) {
	try {
		if (params.runtime) return await params.runtime.gateway.request(googleMeetGatewayMethodForToolAction(params.action), params.raw, {
			timeoutMs: resolveGoogleMeetGatewayOperationTimeoutMs(params.config),
			scopes: ["operator.admin"]
		});
		return await googleMeetToolDeps.callGatewayFromCli(googleMeetGatewayMethodForToolAction(params.action), {
			json: true,
			timeout: String(resolveGoogleMeetGatewayOperationTimeoutMs(params.config))
		}, params.raw, {
			progress: false,
			scopes: ["operator.admin"]
		});
	} catch (err) {
		const details = readGatewayErrorDetails(err);
		if (details && typeof details === "object") return details;
		throw err;
	}
}
function keepTrustedToolAgentId(raw, client) {
	const { agentId: rawAgentId, ...rest } = raw;
	if (client?.internal?.pluginRuntimeOwnerId !== "google-meet") return rest;
	const agentId = normalizeOptionalString(rawAgentId);
	return agentId ? {
		...rest,
		agentId
	} : rest;
}
async function createMeetFromParams(params) {
	return (await loadGoogleMeetCreateModule()).createMeetFromParams(params);
}
async function createAndJoinMeetFromParams(params) {
	return (await loadGoogleMeetCreateModule()).createAndJoinMeetFromParams(params);
}
async function resolveGoogleMeetTokenFromParams(config, raw) {
	const { resolveGoogleMeetAccessToken } = await import("../../oauth-C0i9cESy.js");
	return resolveGoogleMeetAccessToken({
		clientId: normalizeOptionalString(raw.clientId) ?? config.oauth.clientId,
		clientSecret: normalizeOptionalString(raw.clientSecret) ?? config.oauth.clientSecret,
		refreshToken: normalizeOptionalString(raw.refreshToken) ?? config.oauth.refreshToken,
		accessToken: normalizeOptionalString(raw.accessToken) ?? config.oauth.accessToken,
		expiresAt: typeof raw.expiresAt === "number" ? raw.expiresAt : config.oauth.expiresAt
	});
}
function wantsCalendarLookup(raw) {
	return raw.today === true || Boolean(normalizeOptionalString(raw.event));
}
async function resolveMeetingFromParams(params) {
	if (wantsCalendarLookup(params.raw)) {
		const window = params.raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
		const calendarEvent = await findGoogleMeetCalendarEvent({
			accessToken: params.accessToken,
			calendarId: normalizeOptionalString(params.raw.calendarId),
			eventQuery: normalizeOptionalString(params.raw.event),
			...window
		});
		return {
			meeting: calendarEvent.meetingUri,
			calendarEvent
		};
	}
	return { meeting: resolveMeetingInput(params.config, params.raw.meeting) };
}
async function resolveSpaceFromParams(config, raw) {
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	const { meeting, calendarEvent } = await resolveMeetingFromParams({
		config,
		raw,
		accessToken: token.accessToken
	});
	return {
		meeting,
		token,
		space: await fetchGoogleMeetSpace({
			accessToken: token.accessToken,
			meeting
		}),
		calendarEvent
	};
}
async function resolveArtifactQueryFromParams(config, raw) {
	const meeting = normalizeOptionalString(raw.meeting) ?? config.defaults.meeting;
	const conferenceRecord = normalizeOptionalString(raw.conferenceRecord);
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	const resolvedMeeting = conferenceRecord ? { meeting } : wantsCalendarLookup(raw) ? await resolveMeetingFromParams({
		config,
		raw,
		accessToken: token.accessToken
	}) : { meeting };
	if (!resolvedMeeting.meeting && !conferenceRecord) throw new Error("Meeting input, calendar lookup, or conferenceRecord required");
	return {
		token,
		meeting: resolvedMeeting.meeting,
		calendarEvent: resolvedMeeting.calendarEvent,
		conferenceRecord,
		pageSize: readPositiveIntegerParam(raw, "pageSize"),
		includeTranscriptEntries: raw.includeTranscriptEntries !== false,
		includeDocumentBodies: raw.includeDocumentBodies === true,
		allConferenceRecords: raw.includeAllConferenceRecords === true,
		mergeDuplicateParticipants: raw.mergeDuplicateParticipants !== false,
		lateAfterMinutes: readPositiveIntegerParam(raw, "lateAfterMinutes"),
		earlyBeforeMinutes: readPositiveIntegerParam(raw, "earlyBeforeMinutes")
	};
}
async function exportGoogleMeetBundleFromParams(config, raw) {
	const resolved = await resolveArtifactQueryFromParams(config, raw);
	const [artifacts, attendance] = await Promise.all([fetchGoogleMeetArtifacts({
		accessToken: resolved.token.accessToken,
		meeting: resolved.meeting,
		conferenceRecord: resolved.conferenceRecord,
		pageSize: resolved.pageSize,
		includeTranscriptEntries: resolved.includeTranscriptEntries,
		includeDocumentBodies: resolved.includeDocumentBodies,
		allConferenceRecords: resolved.allConferenceRecords
	}), fetchGoogleMeetAttendance({
		accessToken: resolved.token.accessToken,
		meeting: resolved.meeting,
		conferenceRecord: resolved.conferenceRecord,
		pageSize: resolved.pageSize,
		allConferenceRecords: resolved.allConferenceRecords,
		mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
		lateAfterMinutes: resolved.lateAfterMinutes,
		earlyBeforeMinutes: resolved.earlyBeforeMinutes
	})]);
	const { buildGoogleMeetExportManifest, googleMeetExportFileNames, writeMeetExportBundle } = await loadGoogleMeetCliModule();
	const calendarId = normalizeOptionalString(raw.calendarId);
	const request = {
		...resolved.meeting ? { meeting: resolved.meeting } : {},
		...resolved.conferenceRecord ? { conferenceRecord: resolved.conferenceRecord } : {},
		...resolved.calendarEvent?.event.id ? { calendarEventId: resolved.calendarEvent.event.id } : {},
		...resolved.calendarEvent?.event.summary ? { calendarEventSummary: resolved.calendarEvent.event.summary } : {},
		...calendarId ? { calendarId } : {},
		...resolved.pageSize !== void 0 ? { pageSize: resolved.pageSize } : {},
		includeTranscriptEntries: resolved.includeTranscriptEntries,
		includeDocumentBodies: resolved.includeDocumentBodies,
		allConferenceRecords: resolved.allConferenceRecords,
		mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
		...resolved.lateAfterMinutes !== void 0 ? { lateAfterMinutes: resolved.lateAfterMinutes } : {},
		...resolved.earlyBeforeMinutes !== void 0 ? { earlyBeforeMinutes: resolved.earlyBeforeMinutes } : {}
	};
	const tokenSource = resolved.token.refreshed ? "refresh-token" : "cached-access-token";
	if (raw.dryRun === true) return {
		dryRun: true,
		manifest: buildGoogleMeetExportManifest({
			artifacts,
			attendance,
			files: googleMeetExportFileNames(),
			request,
			tokenSource,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		}),
		...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
		tokenSource
	};
	const outputDir = normalizeOptionalString(raw.outputDir) ?? normalizeOptionalString(raw.output);
	return {
		...await writeMeetExportBundle({
			...outputDir ? { outputDir } : {},
			artifacts,
			attendance,
			zip: raw.zip === true,
			request,
			tokenSource,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		}),
		...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
		tokenSource
	};
}
var google_meet_default = definePluginEntry({
	id: "google-meet",
	name: "Google Meet",
	description: "Join Google Meet calls through Chrome or Twilio transports",
	configSchema: googleMeetConfigSchema,
	register(api) {
		const config = googleMeetConfigSchema.parse(api.pluginConfig);
		let runtime = null;
		const ensureRuntime = async () => {
			if (!config.enabled) throw new Error("Google Meet plugin disabled in plugin config");
			if (!runtime) runtime = new GoogleMeetRuntime({
				config,
				fullConfig: api.config,
				runtime: api.runtime,
				logger: api.logger
			});
			return runtime;
		};
		const formatGatewayError = (err) => isGoogleMeetBrowserManualActionError(err) ? err.payload : { error: formatErrorMessage(err) };
		const sendError = (respond, err, code = ErrorCodes.UNAVAILABLE) => {
			const payload = formatGatewayError(err);
			respond(false, payload, errorShape(code, typeof payload.error === "string" ? payload.error : "Google Meet request failed", { details: payload }));
		};
		api.registerGatewayMethod("googlemeet.join", async ({ params, client, respond }) => {
			try {
				const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
				respond(true, await (await ensureRuntime()).join({
					url: resolveMeetingInput(config, trustedParams.url),
					transport: normalizeTransport(trustedParams.transport),
					mode: normalizeMode(trustedParams.mode),
					dialInNumber: normalizeOptionalString(trustedParams.dialInNumber),
					pin: normalizeOptionalString(trustedParams.pin),
					dtmfSequence: normalizeOptionalString(trustedParams.dtmfSequence),
					message: normalizeOptionalString(trustedParams.message),
					requesterSessionKey: normalizeOptionalString(trustedParams.requesterSessionKey),
					agentId: normalizeOptionalString(trustedParams.agentId)
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.create", async ({ params, client, respond }) => {
			try {
				const raw = keepTrustedToolAgentId(asParamRecord(params), client);
				respond(true, shouldJoinCreatedMeet(raw) ? await createAndJoinMeetFromParams({
					config,
					runtime: api.runtime,
					raw,
					ensureRuntime
				}) : await createMeetFromParams({
					config,
					runtime: api.runtime,
					raw
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.status", async ({ params, respond }) => {
			try {
				respond(true, await (await ensureRuntime()).status(normalizeOptionalString(params?.sessionId)));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.transcript", async ({ params, respond }) => {
			try {
				const sessionId = normalizeOptionalString(params?.sessionId);
				if (!sessionId) {
					sendError(respond, /* @__PURE__ */ new Error("sessionId required"), ErrorCodes.INVALID_REQUEST);
					return;
				}
				const sinceIndex = params?.sinceIndex;
				if (sinceIndex !== void 0 && (typeof sinceIndex !== "number" || !Number.isSafeInteger(sinceIndex) || sinceIndex < 0)) {
					sendError(respond, /* @__PURE__ */ new Error("sinceIndex must be a non-negative safe integer"), ErrorCodes.INVALID_REQUEST);
					return;
				}
				respond(true, await (await ensureRuntime()).transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex }));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.recoverCurrentTab", async ({ params, respond }) => {
			try {
				respond(true, await (await ensureRuntime()).recoverCurrentTab({
					url: normalizeOptionalString(params?.url),
					transport: normalizeTransport(params?.transport)
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.setup", async ({ params, respond }) => {
			try {
				respond(true, await (await ensureRuntime()).setupStatus({
					transport: normalizeTransport(params?.transport),
					mode: normalizeMode(params?.mode),
					dialInNumber: normalizeOptionalString(params?.dialInNumber)
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.latest", async ({ params, respond }) => {
			try {
				const raw = asParamRecord(params);
				const token = await resolveGoogleMeetTokenFromParams(config, raw);
				const resolved = await resolveMeetingFromParams({
					config,
					raw,
					accessToken: token.accessToken
				});
				respond(true, {
					...await fetchLatestGoogleMeetConferenceRecord({
						accessToken: token.accessToken,
						meeting: resolved.meeting
					}),
					...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
				});
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.calendarEvents", async ({ params, respond }) => {
			try {
				const raw = asParamRecord(params);
				const token = await resolveGoogleMeetTokenFromParams(config, raw);
				const window = raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
				respond(true, await listGoogleMeetCalendarEvents({
					accessToken: token.accessToken,
					calendarId: normalizeOptionalString(raw.calendarId),
					eventQuery: normalizeOptionalString(raw.event),
					...window
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.artifacts", async ({ params, respond }) => {
			try {
				const raw = asParamRecord(params);
				const resolved = await resolveArtifactQueryFromParams(config, raw);
				respond(true, await fetchGoogleMeetArtifacts({
					accessToken: resolved.token.accessToken,
					meeting: resolved.meeting,
					conferenceRecord: resolved.conferenceRecord,
					pageSize: resolved.pageSize,
					includeTranscriptEntries: resolved.includeTranscriptEntries,
					includeDocumentBodies: resolved.includeDocumentBodies,
					allConferenceRecords: resolved.allConferenceRecords
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.attendance", async ({ params, respond }) => {
			try {
				const raw = asParamRecord(params);
				const resolved = await resolveArtifactQueryFromParams(config, raw);
				respond(true, await fetchGoogleMeetAttendance({
					accessToken: resolved.token.accessToken,
					meeting: resolved.meeting,
					conferenceRecord: resolved.conferenceRecord,
					pageSize: resolved.pageSize,
					allConferenceRecords: resolved.allConferenceRecords,
					mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
					lateAfterMinutes: resolved.lateAfterMinutes,
					earlyBeforeMinutes: resolved.earlyBeforeMinutes
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.export", async ({ params, respond }) => {
			try {
				respond(true, await exportGoogleMeetBundleFromParams(config, asParamRecord(params)));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.leave", async ({ params, respond }) => {
			try {
				const sessionId = normalizeOptionalString(params?.sessionId);
				if (!sessionId) {
					sendError(respond, /* @__PURE__ */ new Error("sessionId required"), ErrorCodes.INVALID_REQUEST);
					return;
				}
				respond(true, await (await ensureRuntime()).leave(sessionId));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.endActiveConference", async ({ params, respond }) => {
			try {
				const raw = asParamRecord(params);
				respond(true, await endGoogleMeetActiveConference({
					accessToken: (await resolveGoogleMeetTokenFromParams(config, raw)).accessToken,
					meeting: resolveMeetingInput(config, raw.meeting)
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.speak", async ({ params, respond }) => {
			try {
				const sessionId = normalizeOptionalString(params?.sessionId);
				if (!sessionId) {
					sendError(respond, /* @__PURE__ */ new Error("sessionId required"), ErrorCodes.INVALID_REQUEST);
					return;
				}
				respond(true, await (await ensureRuntime()).speak(sessionId, normalizeOptionalString(params?.message)));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.testSpeech", async ({ params, client, respond }) => {
			try {
				const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
				respond(true, await (await ensureRuntime()).testSpeech({
					url: resolveMeetingInput(config, trustedParams.url),
					transport: normalizeTransport(trustedParams.transport),
					mode: normalizeMode(trustedParams.mode),
					dialInNumber: normalizeOptionalString(trustedParams.dialInNumber),
					pin: normalizeOptionalString(trustedParams.pin),
					dtmfSequence: normalizeOptionalString(trustedParams.dtmfSequence),
					message: normalizeOptionalString(trustedParams.message),
					requesterSessionKey: normalizeOptionalString(trustedParams.requesterSessionKey),
					agentId: normalizeOptionalString(trustedParams.agentId)
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("googlemeet.testListen", async ({ params, client, respond }) => {
			try {
				const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
				respond(true, await (await ensureRuntime()).testListen({
					url: resolveMeetingInput(config, trustedParams.url),
					transport: normalizeTransport(trustedParams.transport),
					mode: normalizeMode(trustedParams.mode),
					agentId: normalizeOptionalString(trustedParams.agentId),
					timeoutMs: readPositiveIntegerParam(trustedParams, "timeoutMs")
				}));
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerTool((toolContext) => ({
			name: "google_meet",
			label: "Google Meet",
			description: "Join and track Google Meet sessions through Chrome or Twilio. Call setup_status before join/create/test_listen/test_speech; if it reports a Chrome node offline, local audio missing, or missing Twilio dial plan, surface that blocker instead of retrying or switching transports. Twilio cannot dial a Meet URL directly: provide dialInNumber plus optional pin/dtmfSequence, or configure twilio.defaultDialInNumber. Offline nodes are diagnostics only, not usable candidates. If local Chrome talk-back audio is unsupported on this OS, use mode=transcribe, transport=twilio, or a macOS chrome-node for agent/bidi Chrome. If a Meet tab is already open after a timeout, call recover_current_tab before retrying join to report login, permission, or admission blockers without opening another tab.",
			parameters: GoogleMeetToolSchema,
			async execute(_toolCallId, params) {
				const raw = asParamRecord(params);
				const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
				const contextAgentId = toolContext.agentId ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
				const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
				try {
					const needsTrustedAgentRouting = Boolean(agentId && agentId !== "main");
					const useTrustedRuntime = needsTrustedAgentRouting ? await api.runtime.gateway.isAvailable() : false;
					if (needsTrustedAgentRouting && !useTrustedRuntime) throw new Error("Per-agent Google Meet routing requires a Gateway-hosted agent run.");
					const rawWithRequester = {
						...raw,
						...requesterSessionKey ? { requesterSessionKey } : {},
						...useTrustedRuntime ? { agentId } : {}
					};
					assertGoogleMeetAgentToolActionSupported({
						config,
						raw
					});
					switch (raw.action) {
						case "join": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "join",
							raw: rawWithRequester,
							runtime: useTrustedRuntime ? api.runtime : void 0
						}));
						case "create": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "create",
							raw: rawWithRequester,
							runtime: useTrustedRuntime ? api.runtime : void 0
						}));
						case "test_speech": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "test_speech",
							raw: rawWithRequester,
							runtime: useTrustedRuntime ? api.runtime : void 0
						}));
						case "test_listen": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "test_listen",
							raw: rawWithRequester,
							runtime: useTrustedRuntime ? api.runtime : void 0
						}));
						case "status": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "status",
							raw
						}));
						case "transcript": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "transcript",
							raw
						}));
						case "recover_current_tab": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "recover_current_tab",
							raw
						}));
						case "setup_status": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "setup_status",
							raw
						}));
						case "resolve_space": {
							const { token: _token, ...result } = await resolveSpaceFromParams(config, raw);
							return jsonResult(result);
						}
						case "preflight": {
							const { meeting, token, space } = await resolveSpaceFromParams(config, raw);
							return jsonResult(buildGoogleMeetPreflightReport({
								input: meeting,
								space,
								previewAcknowledged: config.preview.enrollmentAcknowledged,
								tokenSource: token.refreshed ? "refresh-token" : "cached-access-token"
							}));
						}
						case "latest": {
							const token = await resolveGoogleMeetTokenFromParams(config, raw);
							const resolved = await resolveMeetingFromParams({
								config,
								raw,
								accessToken: token.accessToken
							});
							return jsonResult({
								...await fetchLatestGoogleMeetConferenceRecord({
									accessToken: token.accessToken,
									meeting: resolved.meeting
								}),
								...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
							});
						}
						case "calendar_events": {
							const token = await resolveGoogleMeetTokenFromParams(config, raw);
							const window = raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
							return jsonResult(await listGoogleMeetCalendarEvents({
								accessToken: token.accessToken,
								calendarId: normalizeOptionalString(raw.calendarId),
								eventQuery: normalizeOptionalString(raw.event),
								...window
							}));
						}
						case "artifacts": {
							const resolved = await resolveArtifactQueryFromParams(config, raw);
							return jsonResult(await fetchGoogleMeetArtifacts({
								accessToken: resolved.token.accessToken,
								meeting: resolved.meeting,
								conferenceRecord: resolved.conferenceRecord,
								pageSize: resolved.pageSize,
								includeTranscriptEntries: resolved.includeTranscriptEntries,
								includeDocumentBodies: resolved.includeDocumentBodies,
								allConferenceRecords: resolved.allConferenceRecords
							}));
						}
						case "attendance": {
							const resolved = await resolveArtifactQueryFromParams(config, raw);
							return jsonResult(await fetchGoogleMeetAttendance({
								accessToken: resolved.token.accessToken,
								meeting: resolved.meeting,
								conferenceRecord: resolved.conferenceRecord,
								pageSize: resolved.pageSize,
								allConferenceRecords: resolved.allConferenceRecords,
								mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
								lateAfterMinutes: resolved.lateAfterMinutes,
								earlyBeforeMinutes: resolved.earlyBeforeMinutes
							}));
						}
						case "export": return jsonResult(await exportGoogleMeetBundleFromParams(config, raw));
						case "leave":
							if (!normalizeOptionalString(raw.sessionId)) throw new Error("sessionId required");
							return jsonResult(await callGoogleMeetGatewayFromTool({
								config,
								action: "leave",
								raw
							}));
						case "end_active_conference": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: "end_active_conference",
							raw
						}));
						case "speak":
							if (!normalizeOptionalString(raw.sessionId)) throw new Error("sessionId required");
							return jsonResult(await callGoogleMeetGatewayFromTool({
								config,
								action: "speak",
								raw
							}));
						default: throw new Error("unknown google_meet action");
					}
				} catch (err) {
					return jsonResult(formatGatewayError(err));
				}
			}
		}), { name: "google_meet" });
		api.registerNodeHostCommand({
			command: GOOGLE_MEET_CHROME_NODE_COMMAND,
			cap: "google-meet",
			dangerous: true,
			handle: handleGoogleMeetNodeHostCommand
		});
		api.registerNodeInvokePolicy(createGoogleMeetChromeNodeInvokePolicy(config));
		api.registerCli(async ({ program }) => {
			const { registerGoogleMeetCli } = await loadGoogleMeetCliModule();
			registerGoogleMeetCli({
				program,
				config,
				ensureRuntime
			});
		}, {
			commands: ["googlemeet"],
			descriptors: [{
				name: "googlemeet",
				description: "Join and manage Google Meet calls",
				hasSubcommands: true
			}]
		});
	}
});
//#endregion
export { testing as __testing, testing, google_meet_default as default };
