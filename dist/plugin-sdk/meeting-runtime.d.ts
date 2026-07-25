import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { Kn as PluginRuntime, Mi as RealtimeVoiceToolCallEvent, Oo as RuntimeLogger, T as OpenClawPluginNodeInvokePolicy, ei as RealtimeTranscriptionProviderPlugin, gi as RealtimeVoiceAudioFormat, ji as RealtimeVoiceTool, ti as RealtimeVoiceProviderPlugin } from "../types-Bi5Leigi.js";
import { $t as TalkEventInput } from "../diagnostic-events-D5MV3iZe.js";
import { E as RealtimeVoiceAgentConsultToolPolicy, m as RealtimeVoiceBridgeSession, t as RealtimeVoiceSessionHarness } from "../realtime-session-harness-Sxa4D6-T.js";
import { Writable } from "node:stream";

//#region src/meeting-bot/realtime-audio-format.d.ts
type MeetingRealtimeAudioFormat = "pcm16-24khz" | "g711-ulaw-8khz";
declare function resolveMeetingRealtimeAudioFormat(audioFormat: MeetingRealtimeAudioFormat): RealtimeVoiceAudioFormat;
declare function convertMeetingBridgeAudioForStt(audio: Buffer, audioFormat: MeetingRealtimeAudioFormat): Buffer;
declare function convertMeetingTtsAudioForBridge(audio: Buffer, sampleRate: number, audioFormat: MeetingRealtimeAudioFormat, outputFormat?: string, platformName?: string): Buffer;
//#endregion
//#region src/meeting-bot/realtime-audio-transport.d.ts
type MeetingRealtimeAudioTransportHealth = {
  consecutiveInputErrors?: number;
  lastInputError?: string;
};
interface MeetingRealtimeAudioTransport {
  /** Delivers a prior failure immediately so provider setup cannot outrun transport teardown. */
  onFatal(handler: () => void): void;
  startInput(onAudio: (audio: Buffer) => void): void;
  stop(): Promise<void>;
  writeOutput(audio: Buffer): Promise<void>;
  clearOutput(): Promise<void>;
  dispose(): Promise<void>;
  getHealth?(): MeetingRealtimeAudioTransportHealth;
  startBargeInMonitor?(onBargeIn: (audio: Buffer) => boolean): void;
}
//#endregion
//#region src/meeting-bot/realtime-engine.d.ts
type MeetingRuntimePlatform = {
  /** Adapter-owned identity keeps platform names and log prefixes out of core. */displayName: string;
  logScope: string;
  sessionIdPrefix: string;
};
type MeetingRealtimeEngineConfig = {
  chrome: {
    audioFormat: MeetingRealtimeAudioFormat;
  };
  realtime: {
    strategy: string;
    provider?: string;
    transcriptionProvider?: string;
    voiceProvider?: string;
    model?: string;
    instructions?: string;
    introMessage?: string;
    providers: Record<string, Record<string, unknown>>;
  };
};
type MeetingAgentConsultParams = {
  meetingSessionId: string;
  requesterSessionKey?: string;
  args: unknown;
  transcript: Array<{
    role: "user" | "assistant";
    text: string;
  }>;
};
type MeetingRealtimeToolCallParams = {
  strategy: string;
  session: RealtimeVoiceBridgeSession;
  event: RealtimeVoiceToolCallEvent;
  meetingSessionId: string;
  requesterSessionKey?: string;
  transcript: Array<{
    role: "user" | "assistant";
    text: string;
  }>;
  onTalkEvent: (event: TalkEventInput) => void;
};
type MeetingRealtimeAudioEngineHealth = ReturnType<RealtimeVoiceSessionHarness["getHealth"]> & MeetingRealtimeAudioTransportHealth & {
  lastClearAt?: string;
  clearCount?: number;
  bridgeClosed: boolean;
};
type MeetingRealtimeAudioEngineHandle = {
  providerId: string;
  speak: (instructions?: string) => void;
  getHealth: () => MeetingRealtimeAudioEngineHealth;
  stop: () => Promise<void>;
};
declare function startMeetingRealtimeEngine(params: {
  config: MeetingRealtimeEngineConfig;
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  platform: MeetingRuntimePlatform;
  meetingSessionId: string;
  requesterSessionKey?: string;
  logPrefix?: "node";
  talkSessionId?: string;
  talkContext?: {
    nodeId: string;
    bridgeId: string;
  };
  transport: MeetingRealtimeAudioTransport;
  logger: RuntimeLogger;
  providers?: RealtimeVoiceProviderPlugin[];
  consultAgent: (params: MeetingAgentConsultParams) => Promise<{
    text: string;
  }>;
  tools: RealtimeVoiceTool[];
  handleToolCall: (params: MeetingRealtimeToolCallParams) => Promise<void>;
}): Promise<MeetingRealtimeAudioEngineHandle>;
//#endregion
//#region src/meeting-bot/realtime-agent-engine.d.ts
declare function startMeetingAgentRealtimeEngine(params: {
  config: MeetingRealtimeEngineConfig;
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  platform: MeetingRuntimePlatform;
  meetingSessionId: string;
  requesterSessionKey?: string;
  logPrefix?: "node";
  transport: MeetingRealtimeAudioTransport;
  logger: RuntimeLogger;
  providers?: RealtimeTranscriptionProviderPlugin[];
  consultAgent: (params: MeetingAgentConsultParams) => Promise<{
    text: string;
  }>;
}): Promise<MeetingRealtimeAudioEngineHandle>;
//#endregion
//#region src/meeting-bot/realtime-local-audio-transport.d.ts
type BridgeProcess = {
  pid?: number;
  killed?: boolean;
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  stdin?: Writable | null;
  stdout?: {
    on(event: "data", listener: (chunk: Buffer | string) => void): unknown;
    on(event: "error", listener: (error: Error) => void): unknown;
  } | null;
  stderr?: {
    on(event: "data", listener: (chunk: Buffer | string) => void): unknown;
    on(event: "error", listener: (error: Error) => void): unknown;
  } | null;
  kill(signal?: NodeJS.Signals): boolean;
  on(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): unknown;
  on(event: "error", listener: (error: Error) => void): unknown;
  once(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): unknown;
  off(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): unknown;
};
type MeetingRealtimeAudioSpawn = (command: string, args: string[], options: {
  stdio: ["pipe" | "ignore", "pipe" | "ignore", "pipe" | "ignore"];
}) => BridgeProcess;
declare function createLocalMeetingRealtimeAudioTransport(params: {
  inputCommand: string[];
  outputCommand: string[];
  bargeInInputCommand?: string[];
  bargeInRmsThreshold: number;
  bargeInPeakThreshold: number;
  bargeInCooldownMs: number;
  logger: RuntimeLogger;
  logScope: string;
  spawn?: MeetingRealtimeAudioSpawn;
}): MeetingRealtimeAudioTransport;
//#endregion
//#region src/meeting-bot/realtime-node-audio-transport.d.ts
declare function createNodeMeetingRealtimeAudioTransport(params: {
  runtime: PluginRuntime;
  nodeId: string;
  bridgeId: string;
  logger: RuntimeLogger; /** Platform registration owns this stable command name; paired nodes call it verbatim. */
  commandName: string;
  logScope: string;
  logPrefix: string;
}): MeetingRealtimeAudioTransport;
//#endregion
//#region src/meeting-bot/session-types.d.ts
/** Generic lifecycle state shared by browser and dial-in meeting sessions. */
type MeetingSessionState = "active" | "ended";
type MeetingResolvedJoin<TTransport extends string, TMode extends string> = {
  url: string;
  transport: TTransport;
  mode: TMode;
  agentId: string;
};
type MeetingTranscriptLine = {
  at?: string;
  speaker?: string;
  text: string;
};
type MeetingTranscriptSnapshot = {
  droppedLines: number;
  epoch?: string;
  lines: MeetingTranscriptLine[];
};
type MeetingBrowserTab = {
  targetId: string;
  openedByPlugin: boolean;
};
type MeetingBrowserCandidateTab = {
  targetId?: string;
  title?: string;
  url?: string;
};
type MeetingBrowserHealth<TManualReason extends string = string, TSpeechBlockedReason extends string = string> = {
  inCall?: boolean;
  micMuted?: boolean;
  manualActionRequired?: boolean;
  manualActionReason?: TManualReason;
  manualActionMessage?: string;
  speechReady?: boolean;
  speechBlockedReason?: TSpeechBlockedReason;
  speechBlockedMessage?: string;
};
type MeetingRealtimeSessionBlock = {
  enabled: boolean;
  strategy?: string;
  provider?: string;
  model?: string;
  transcriptionProvider?: string;
  toolPolicy: string;
};
/**
 * Stable shared wire fields. Platform adapters add thin browser and dial-in blocks
 * under their existing public field names so migrations do not reshape JSON.
 */
type MeetingSessionRecord<TTransport extends string = string, TMode extends string = string, TRealtime extends MeetingRealtimeSessionBlock = MeetingRealtimeSessionBlock> = {
  id: string;
  url: string;
  transport: TTransport;
  mode: TMode;
  agentId: string;
  state: MeetingSessionState;
  transcriptEvicted?: boolean;
  browserLeft?: boolean;
  createdAt: string;
  updatedAt: string;
  participantIdentity: string;
  realtime: TRealtime;
  notes: string[];
};
//#endregion
//#region src/meeting-bot/session-runtime-types.d.ts
type MeetingSessionRuntimeHandles<THealth extends MeetingBrowserHealth> = {
  stop?: () => Promise<void>;
  speak?: (instructions?: string) => void;
  getHealth?: () => Partial<THealth>;
};
type MeetingBrowserSessionView<THealth extends MeetingBrowserHealth, TTab extends MeetingBrowserTab> = {
  launched: boolean;
  nodeId?: string;
  tab?: TTab;
  health?: THealth;
  hasAudioBridge: boolean;
};
type MeetingSessionRuntimeJoinContext<TSession extends MeetingSessionRecord<TTransport, TMode>, TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth, TTab extends MeetingBrowserTab> = {
  attachRuntimeHandles(session: TSession, handles: MeetingSessionRuntimeHandles<THealth>): void;
  inheritedBrowserTab(params: {
    session: TSession;
    transport: TTransport;
    nodeId?: string;
    meetingUrl: string;
    tab?: TTab;
  }): TTab | undefined;
};
//#endregion
//#region src/meeting-bot/session-runtime.d.ts
type MeetingSessionRuntimeMessages<TSpeechBlockedReason extends string> = {
  previousBrowserLeaveFailed: string;
  reassignedSessionNote: string;
  reusedSessionNote: string;
  replacementBrowserLeaveFailed: string;
  speechBlockedFallback: string;
  speech: {
    audioBridgeUnavailable: string;
    browserUnverified: string;
    manualActionFallback: string;
    microphoneMuted: string;
    microphoneMutedReason: TSpeechBlockedReason;
    notInCall: string;
    notInCallReason: TSpeechBlockedReason;
    browserUnverifiedReason: TSpeechBlockedReason;
    audioBridgeUnavailableReason: TSpeechBlockedReason;
  };
};
type MeetingSessionRuntimeOptions<TSession extends MeetingSessionRecord<TTransport, TMode>, TRequest, TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth<TManualReason, TSpeechBlockedReason>, TTab extends MeetingBrowserTab, TManualReason extends string, TSpeechBlockedReason extends string> = {
  logger: RuntimeLogger;
  logScope: string;
  formatError(error: unknown): string;
  messages: MeetingSessionRuntimeMessages<TSpeechBlockedReason>;
  reuseExistingBrowserTab: boolean;
  waitForInCallMs: number;
  joinTimeoutMs: number;
  transientSpeechBlockedReasons: ReadonlySet<TSpeechBlockedReason>;
  resolveJoin(request: TRequest): MeetingResolvedJoin<TTransport, TMode>;
  createSession(params: {
    request: TRequest;
    resolved: MeetingResolvedJoin<TTransport, TMode>;
    createdAt: string;
  }): TSession;
  resolveSpeechInstructions(request: TRequest): string | undefined;
  isBrowserTransport(transport: TTransport): boolean;
  isTalkBackMode(mode: TMode): boolean;
  isTranscribeMode(mode: TMode): boolean;
  sameMeetingUrl(left: string | undefined, right: string | undefined): boolean;
  normalizeMeetingUrlForReuse(url: string): string | undefined;
  getBrowser(session: TSession): MeetingBrowserSessionView<THealth, TTab> | undefined;
  setBrowserTab(session: TSession, tab: TTab | undefined): void;
  setBrowserHealth(session: TSession, health: THealth | undefined): void;
  joinTransport(params: {
    request: TRequest;
    session: TSession;
    context: MeetingSessionRuntimeJoinContext<TSession, TTransport, TMode, THealth, TTab>;
  }): Promise<{
    delegatedSpoken?: boolean;
  }>;
  releaseBrowserTab(session: TSession): Promise<boolean | undefined>;
  refreshBrowserHealth(session: TSession, options?: {
    force?: boolean;
    readOnly?: boolean;
  }): Promise<void>;
  refreshStatus(session: TSession): Promise<void>;
  refreshReusableSession(session: TSession, request: TRequest, resolved: MeetingResolvedJoin<TTransport, TMode>): Promise<{
    keepBrowserTab: boolean;
  } | void>;
  ensureRealtimeBridge(session: TSession): Promise<MeetingSessionRuntimeHandles<THealth> | undefined>;
  captureTranscript(session: TSession, options?: {
    finalize?: boolean;
  }): Promise<MeetingTranscriptSnapshot | undefined>;
  speakViaTransport(session: TSession, instructions?: string): Promise<{
    handled: boolean;
    spoken: boolean;
  } | undefined>;
  defaultSpeechInstructions?: string;
};
type MeetingSessionLeaveResult<TSession> = {
  found: boolean;
  session?: TSession;
  browserLeft?: boolean;
};
/** Shared lifecycle owner; platform strategies perform transport-specific I/O only. */
declare class MeetingSessionRuntime<TSession extends MeetingSessionRecord<TTransport, TMode>, TRequest, TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth<TManualReason, TSpeechBlockedReason>, TTab extends MeetingBrowserTab, TManualReason extends string, TSpeechBlockedReason extends string> {
  #private;
  private readonly options;
  constructor(options: MeetingSessionRuntimeOptions<TSession, TRequest, TTransport, TMode, THealth, TTab, TManualReason, TSpeechBlockedReason>);
  list(): TSession[];
  getSession(sessionId: string): TSession | undefined;
  status(sessionId?: string): Promise<{
    found: boolean;
    session?: TSession;
    sessions?: TSession[];
  }>;
  transcript(sessionId: string, options?: {
    sinceIndex?: number;
  }): Promise<{
    found: boolean;
    sessionId?: string;
    startIndex?: number;
    nextIndex?: number;
    droppedLines?: number;
    evicted?: boolean;
    lines?: MeetingTranscriptLine[];
  }>;
  isReusableSession(session: TSession, resolved: MeetingResolvedJoin<TTransport, TMode>): boolean;
  join(request: TRequest): Promise<{
    session: TSession;
    spoken?: boolean;
  }>;
  leave(sessionId: string, options?: {
    keepBrowserTab?: boolean;
  }): Promise<MeetingSessionLeaveResult<TSession>>;
  speak(sessionId: string, instructions?: string): Promise<{
    found: boolean;
    spoken: boolean;
    session?: TSession;
  }>;
  speakWhenReady(session: TSession, instructions: string): Promise<boolean>;
  hasHealthHandle(sessionId: string): boolean;
  refreshHealth(sessionId?: string): void;
  refreshBrowserHealth(session: TSession, options?: {
    force?: boolean;
    readOnly?: boolean;
  }): Promise<void>;
  refreshCaptionHealth(session: TSession): Promise<void>;
  refreshSpeechReadiness(session: TSession): {
    ready: boolean;
    reason?: TSpeechBlockedReason;
    message?: string;
  };
  markSessionEnded(session: TSession, reason: string): void;
}
//#endregion
//#region src/meeting-bot/platform-adapter.d.ts
type MeetingManualActionCategory = "login-required" | "admission-required" | "permission-required" | "audio-choice-required" | "locale-required" | "session-conflict" | "browser-control-unavailable" | "custom";
type MeetingManualAction = {
  category: MeetingManualActionCategory;
  reason: string;
  message: string;
};
type MeetingBrowserRequestParams = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  body?: unknown;
  timeoutMs: number;
};
type MeetingBrowserRequestCaller = (params: MeetingBrowserRequestParams) => Promise<unknown>;
type MeetingBrowserJoinSession<Mode extends string> = {
  meetingSessionId: string;
  mode: Mode;
  url: string;
};
type MeetingBrowserStatusScriptParams<Mode extends string> = MeetingBrowserJoinSession<Mode> & {
  allowSessionAdoption: boolean;
  autoJoin: boolean;
  captureCaptions: boolean;
  guestName: string;
  readOnly?: boolean;
  waitForInCallMs: number;
};
type MeetingBrowserLeaveStep = {
  departed: boolean;
  leaveAction?: "leave" | "confirm";
  sessionConflict?: boolean;
  sessionMatched?: boolean;
  urlMatched?: boolean;
};
type MeetingBrowserPermissionPlan = {
  origin: string;
  permissions: string[];
  optionalPermissions?: string[];
};
type MeetingBrowserAdapter<Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = {
  allowsMicrophone(mode: Mode): boolean;
  buildStatusJoinScript(params: MeetingBrowserStatusScriptParams<Mode>): string;
  parseStatus(result: unknown): Health | undefined;
  classifyManualAction(health: Health): MeetingManualAction | undefined;
  shouldRetryJoinStatus?(health: Health): boolean;
  browserControlUnavailable(error: unknown): MeetingManualAction;
  buildLeaveScript(meetingUrl: string): string;
  buildSessionLeaveScript?(params: {
    leaveInitiated: boolean;
    meetingSessionId: string;
    meetingUrl: string;
  }): string;
  parseLeaveResult(result: unknown): MeetingBrowserLeaveStep;
  captions: {
    enabled(mode: Mode): boolean;
    buildTranscriptScript(params: {
      finalize: boolean;
      meetingSessionId: string;
      meetingUrl: string;
    }): string;
    parseTranscript(result: unknown): Transcript & {
      sessionMatched?: boolean;
      urlMatched?: boolean;
    };
  };
  permissions(params: {
    allowMicrophone: boolean;
    meetingUrl: string;
  }): MeetingBrowserPermissionPlan | undefined;
  permissionNotes(params: {
    allowMicrophone: boolean;
    error?: unknown;
    result?: unknown;
  }): string[];
};
interface MeetingPlatformAdapter<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot, CreateParams = never, CreateResult = never, DialInParams = never, DialInPlan = never> {
  id: string;
  displayName: string;
  browserLabel: string;
  logScope: string;
  nodeCommandName: string;
  nodeConfigPath: string;
  urls: {
    validateAndNormalize(input: unknown): string;
    normalizeForReuse(url: string | undefined): string | undefined;
    isSameMeeting(a: string | undefined, b: string | undefined): boolean;
    buildJoinUrl(session: Session & {
      url: string;
    }): string;
    accountHint(url: string | undefined): string | undefined;
    isPreferredJoinUrl(url: string | undefined): boolean;
    isRecoverableTab(tab: MeetingBrowserCandidateTab, url?: string): boolean;
    localeAction(tab: MeetingBrowserCandidateTab): MeetingManualAction | undefined;
  };
  browser: MeetingBrowserAdapter<Mode, Health, Transcript>;
  create?: {
    browser(params: CreateParams): Promise<CreateResult>;
  };
  dialIn?: {
    buildPlan(params: DialInParams): DialInPlan;
  };
}
//#endregion
//#region src/meeting-bot/browser-controller.d.ts
type MeetingBrowserControllerConfig = {
  launch: boolean;
  reuseExistingTab: boolean;
  autoJoin: boolean;
  guestName: string;
  joinTimeoutMs: number;
  waitForInCallMs: number;
};
type BrowserAdapter$1<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = Pick<MeetingPlatformAdapter<Session, Mode, Health, Transcript>, "browser" | "browserLabel" | "urls">;
declare function openMeetingWithBrowser<Session extends MeetingBrowserJoinSession<Mode>, Mode extends string, Health extends MeetingBrowserHealth & {
  browserTitle?: string;
  browserUrl?: string;
  notes?: string[];
}, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter$1<Session, Mode, Health, Transcript>;
  callBrowser: MeetingBrowserRequestCaller;
  config: MeetingBrowserControllerConfig;
  session: Session;
}): Promise<{
  launched: boolean;
  browser?: Health;
  tab?: MeetingBrowserTab;
}>;
declare function recoverMeetingBrowserTab<Session, Mode extends string, Health extends MeetingBrowserHealth & {
  browserTitle?: string;
  browserUrl?: string;
  notes?: string[];
}, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter$1<Session, Mode, Health, Transcript>;
  allowSessionAdoption?: boolean;
  autoJoin?: boolean;
  callBrowser: MeetingBrowserRequestCaller;
  config: MeetingBrowserControllerConfig;
  locationLabel: string;
  meetingSessionId?: string;
  mode: Mode;
  requestedMeetingUrl: string | undefined;
  readOnly?: boolean;
  timeoutMs?: number;
  trackedMeetingUrl: string | undefined;
  trackedTargetId: string | undefined;
}): Promise<{
  found: boolean;
  targetId?: string;
  tab?: MeetingBrowserCandidateTab;
  browser?: Health;
  message: string;
}>;
//#endregion
//#region src/meeting-bot/browser-session-control.d.ts
type BrowserAdapter<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = Pick<MeetingPlatformAdapter<Session, Mode, Health, Transcript>, "browser" | "browserLabel">;
declare function leaveMeetingWithBrowser<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter<Session, Mode, Health, Transcript>;
  callBrowser: MeetingBrowserRequestCaller;
  launch: boolean;
  meetingSessionId?: string;
  meetingUrl: string;
  tab: MeetingBrowserTab;
  timeoutMs: number;
}): Promise<{
  left: boolean;
  note: string;
}>;
declare function readMeetingTranscriptWithBrowser<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter<Session, Mode, Health, Transcript>;
  callBrowser: MeetingBrowserRequestCaller;
  finalize: boolean;
  meetingUrl: string;
  meetingSessionId: string;
  tab: MeetingBrowserTab;
  timeoutMs: number;
}): Promise<Transcript>;
//#endregion
//#region src/meeting-bot/browser-request.d.ts
declare function asMeetingBrowserTabs(result: unknown): MeetingBrowserCandidateTab[];
declare function readMeetingBrowserTab(result: unknown): MeetingBrowserCandidateTab | undefined;
declare function resolveLocalMeetingBrowserRequest(runtime: PluginRuntime): Promise<MeetingBrowserRequestCaller>;
//#endregion
//#region src/meeting-bot/browser-node.d.ts
type MeetingBrowserNodeInfo = {
  caps?: string[];
  commands?: string[];
  connected?: boolean;
  nodeId?: string;
  displayName?: string;
  remoteIp?: string;
};
type NodeAdapter = Pick<MeetingPlatformAdapter<unknown, string, MeetingBrowserHealth, MeetingTranscriptSnapshot>, "displayName" | "nodeCommandName" | "nodeConfigPath">;
declare function resolveMeetingBrowserNodeInfo(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  requestedNode?: string;
}): Promise<MeetingBrowserNodeInfo>;
declare function resolveMeetingBrowserNode(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  requestedNode?: string;
}): Promise<string>;
declare function callMeetingBrowserProxyOnNode(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  nodeId: string;
} & MeetingBrowserRequestParams): Promise<unknown>;
declare function createMeetingBrowserNodeCaller(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  nodeId: string;
}): MeetingBrowserRequestCaller;
//#endregion
//#region src/meeting-bot/agent-consult.d.ts
type MeetingAgentConsultSurface = {
  id: string;
  provider: string;
  lane: string;
  surface: string;
  userLabel: string;
  assistantLabel: string;
  questionSourceLabel: string;
  workingResponseLabel: string;
  extraSystemPrompt: string;
};
declare function resolveMeetingRealtimeTools(policy: RealtimeVoiceAgentConsultToolPolicy): RealtimeVoiceTool[];
declare function consultMeetingAgent(params: {
  surface: MeetingAgentConsultSurface;
  config: OpenClawConfig;
  runtime: PluginRuntime;
  logger: RuntimeLogger;
  agentId?: string;
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  meetingSessionId: string;
  requesterSessionKey?: string;
  args: unknown;
  transcript: Array<{
    role: "user" | "assistant";
    text: string;
  }>;
}): Promise<{
  text: string;
}>;
declare function handleMeetingRealtimeConsultToolCall(params: {
  surface: MeetingAgentConsultSurface;
  strategy: string;
  session: RealtimeVoiceBridgeSession;
  event: RealtimeVoiceToolCallEvent;
  config: OpenClawConfig;
  runtime: PluginRuntime;
  logger: RuntimeLogger;
  agentId?: string;
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  meetingSessionId: string;
  requesterSessionKey?: string;
  transcript: Array<{
    role: "user" | "assistant";
    text: string;
  }>;
  onTalkEvent?: (event: TalkEventInput) => void;
}): Promise<void>;
//#endregion
//#region src/meeting-bot/voice-call-gateway.d.ts
type MeetingVoiceCallGatewayClient = {
  request(method: string, params: Record<string, unknown>, options: {
    timeoutMs: number;
  }): Promise<unknown>;
  stopAndWait(options: {
    timeoutMs: number;
  }): Promise<void>;
};
type MeetingVoiceCallGateway = {
  trustedPluginIdentity: boolean;
  request: <T>(method: string, params: Record<string, unknown>) => Promise<T>;
};
type MeetingVoiceCallConfig = {
  gatewayUrl?: string;
  token?: string;
  requestTimeoutMs: number;
  postDtmfSpeechDelayMs: number;
};
type MeetingVoiceCallSurface = {
  clientDisplayName: string;
  configPath: string;
  logScope: string;
  meetingLabel: string;
  providerLabel: string;
};
type MeetingVoiceCallStatusResult = {
  found?: boolean;
  call?: unknown;
};
type MeetingVoiceCallJoinResult = {
  callId: string;
  dtmfSent: boolean;
  introSent: boolean;
};
declare function createMeetingVoiceCallGateway(params: {
  config: MeetingVoiceCallConfig;
  runtime: PluginRuntime;
  surface: MeetingVoiceCallSurface;
  connectClient: (params: {
    config: MeetingVoiceCallConfig;
    surface: MeetingVoiceCallSurface;
  }) => Promise<MeetingVoiceCallGatewayClient>;
}): MeetingVoiceCallGateway;
declare function isMeetingVoiceCallMissingError(error: unknown): boolean;
declare function joinMeetingViaVoiceCallGateway(params: {
  config: MeetingVoiceCallConfig;
  gateway: MeetingVoiceCallGateway;
  surface: MeetingVoiceCallSurface;
  dialInNumber: string;
  dtmfSequence?: string;
  logger?: RuntimeLogger;
  message?: string;
  requesterSessionKey?: string;
  agentId?: string;
  sessionKey?: string;
}): Promise<MeetingVoiceCallJoinResult>;
declare function endMeetingVoiceCallGatewayCall(params: {
  gateway: MeetingVoiceCallGateway;
  callId: string;
}): Promise<void>;
declare function getMeetingVoiceCallGatewayCall(params: {
  gateway: MeetingVoiceCallGateway;
  callId: string;
}): Promise<MeetingVoiceCallStatusResult>;
declare function speakMeetingViaVoiceCallGateway(params: {
  gateway: MeetingVoiceCallGateway;
  callId: string;
  message: string;
}): Promise<void>;
//#endregion
//#region src/meeting-bot/setup-checks.d.ts
type MeetingSetupCheck = {
  id: string;
  ok: boolean;
  message: string;
};
type MeetingSetupStatus = {
  ok: boolean;
  checks: MeetingSetupCheck[];
};
declare function createMeetingSetupStatus(checks: MeetingSetupCheck[]): MeetingSetupStatus;
declare function addMeetingSetupCheck(status: MeetingSetupStatus, check: MeetingSetupCheck): MeetingSetupStatus;
//#endregion
//#region src/meeting-bot/sox-audio-command.d.ts
type MeetingSoxAudioFormat = {
  sampleRate: number;
  channels: number;
  encoding: string;
  bits: number;
  endian?: "little" | "big";
};
type MeetingSoxAudioCommandParams = {
  bufferBytes: number;
  device?: string;
  deviceType?: string;
  format: MeetingSoxAudioFormat;
  inputExecutable?: string;
  outputExecutable?: string;
};
declare function buildMeetingSoxAudioCommands(params: MeetingSoxAudioCommandParams): {
  inputCommand: string[];
  outputCommand: string[];
};
//#endregion
//#region src/meeting-bot/node-invoke-policy.d.ts
type MeetingBrowserNodeStartConfig = {
  launch: boolean;
  browserProfile?: string;
  joinTimeoutMs: number;
  audioInputCommand?: string[];
  audioOutputCommand?: string[];
  audioBridgeCommand?: string[];
  audioBridgeHealthCommand?: string[];
};
type MeetingBrowserNodePolicyOptions = {
  commandName: string;
  displayName: string;
  deniedCode: string;
  supportedModes: ReadonlySet<string>;
  normalizeUrl(input: unknown): string;
  start: MeetingBrowserNodeStartConfig;
};
declare function createMeetingBrowserNodeInvokePolicy(options: MeetingBrowserNodePolicyOptions): OpenClawPluginNodeInvokePolicy;
//#endregion
//#region src/meeting-bot/node-host.d.ts
type MeetingNodeHostOptions = {
  commandName: string;
  displayName: string;
  browserLabel: string;
  bridgeIdPrefix: string;
  defaultAudioInputCommand: readonly string[];
  defaultAudioOutputCommand: readonly string[];
  talkBackModes: ReadonlySet<string>;
  agentMode: string;
  normalizeUrl(input: unknown): string;
  normalizeMeetingKey(url?: string): string | undefined;
  assertAudioAvailable(timeoutMs: number): void;
  browser: {
    application: string;
    buildProfileArgs(profile: string): string[];
    openedStatus: string;
    openedNotes: string[];
  };
};
declare function createMeetingNodeHost(options: MeetingNodeHostOptions): {
  handleCommand(paramsJSON?: string | null): Promise<string>;
};
//#endregion
export { type MeetingAgentConsultParams, type MeetingAgentConsultSurface, type MeetingBrowserCandidateTab, type MeetingBrowserControllerConfig, type MeetingBrowserHealth, type MeetingBrowserJoinSession, type MeetingBrowserLeaveStep, type MeetingBrowserNodeInfo, type MeetingBrowserNodePolicyOptions, type MeetingBrowserNodeStartConfig, type MeetingBrowserPermissionPlan, type MeetingBrowserRequestCaller, type MeetingBrowserRequestParams, type MeetingBrowserSessionView, type MeetingBrowserStatusScriptParams, type MeetingBrowserTab, type MeetingManualAction, type MeetingManualActionCategory, type MeetingNodeHostOptions, type MeetingPlatformAdapter, type MeetingRealtimeAudioEngineHandle, type MeetingRealtimeAudioEngineHealth, type MeetingRealtimeAudioFormat, type MeetingRealtimeAudioTransport, type MeetingRealtimeAudioTransportHealth, type MeetingRealtimeEngineConfig, type MeetingRealtimeSessionBlock, type MeetingRealtimeToolCallParams, type MeetingRuntimePlatform, type MeetingSessionLeaveResult, type MeetingSessionRecord, MeetingSessionRuntime, type MeetingSessionRuntimeHandles, type MeetingSessionRuntimeJoinContext, type MeetingSessionRuntimeMessages, type MeetingSessionRuntimeOptions, type MeetingSessionState, type MeetingSetupCheck, type MeetingSetupStatus, type MeetingSoxAudioCommandParams, type MeetingSoxAudioFormat, type MeetingTranscriptLine, type MeetingTranscriptSnapshot, type MeetingVoiceCallConfig, type MeetingVoiceCallGateway, type MeetingVoiceCallGatewayClient, type MeetingVoiceCallJoinResult, type MeetingVoiceCallStatusResult, type MeetingVoiceCallSurface, addMeetingSetupCheck, asMeetingBrowserTabs, buildMeetingSoxAudioCommands, callMeetingBrowserProxyOnNode, consultMeetingAgent, convertMeetingBridgeAudioForStt, convertMeetingTtsAudioForBridge, createLocalMeetingRealtimeAudioTransport, createMeetingBrowserNodeCaller, createMeetingBrowserNodeInvokePolicy, createMeetingNodeHost, createMeetingSetupStatus, createMeetingVoiceCallGateway, createNodeMeetingRealtimeAudioTransport, endMeetingVoiceCallGatewayCall, getMeetingVoiceCallGatewayCall, handleMeetingRealtimeConsultToolCall, isMeetingVoiceCallMissingError, joinMeetingViaVoiceCallGateway, leaveMeetingWithBrowser, openMeetingWithBrowser, readMeetingBrowserTab, readMeetingTranscriptWithBrowser, recoverMeetingBrowserTab, resolveLocalMeetingBrowserRequest, resolveMeetingBrowserNode, resolveMeetingBrowserNodeInfo, resolveMeetingRealtimeAudioFormat, resolveMeetingRealtimeTools, speakMeetingViaVoiceCallGateway, startMeetingAgentRealtimeEngine, startMeetingRealtimeEngine };