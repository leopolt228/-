import { $ as ZodPipe, B as ZodLiteral, C as ZodEnum, Q as ZodOptional, Qi as $ZodTypeInternals, Y as ZodNumber, Z as ZodObject, Zi as $ZodType, bt as ZodUnion, c as ZodBoolean, ea as $catchall, ft as ZodTransform, it as ZodRecord, mt as ZodType, q as ZodNull, r as ZodArray, st as ZodString, ta as $strict, v as ZodDefault, xt as ZodUnknown, y as ZodDiscriminatedUnion } from "./schemas-CL7kuExa.js";

//#region src/config/zod-schema.providers-core.d.ts
declare const TelegramConfigSchema: ZodObject<{
  linkPreview: ZodOptional<ZodBoolean>;
  silentErrorReplies: ZodOptional<ZodBoolean>;
  errorPolicy: ZodOptional<ZodEnum<{
    silent: "silent";
    always: "always";
    once: "once";
  }>>;
  apiRoot: ZodOptional<ZodString>;
  trustedLocalFileRoots: ZodOptional<ZodArray<ZodString>>;
  autoTopicLabel: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    prompt: ZodOptional<ZodString>;
  }, $strict>]>>;
  ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
  reactionNotifications?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  execApprovals: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    approvers: ZodOptional<ZodArray<ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>;
    agentFilter: ZodOptional<ZodArray<ZodString>>;
    sessionFilter: ZodOptional<ZodArray<ZodString>>;
    target: ZodOptional<ZodEnum<{
      both: "both";
      channel: "channel";
      dm: "dm";
    }>>;
  }, $strict>>;
  commands: ZodOptional<ZodObject<{
    native: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    nativeSkills: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
  }, $strict>>;
  customCommands: ZodOptional<ZodArray<ZodObject<{
    command: ZodString;
    description: ZodString;
  }, $strict>>>;
  botToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  tokenFile: ZodOptional<ZodString>;
  groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    requireMention: ZodOptional<ZodBoolean>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    skills: ZodOptional<ZodArray<ZodString>>;
    enabled: ZodOptional<ZodBoolean>;
    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    systemPrompt: ZodOptional<ZodString>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
    ingest: ZodOptional<ZodBoolean>;
    disableAudioPreflight: ZodOptional<ZodBoolean>;
    groupPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>>;
    topics: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      ingest: ZodOptional<ZodBoolean>;
      disableAudioPreflight: ZodOptional<ZodBoolean>;
      groupPolicy: ZodOptional<ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
      }>>;
      skills: ZodOptional<ZodArray<ZodString>>;
      enabled: ZodOptional<ZodBoolean>;
      allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
      systemPrompt: ZodOptional<ZodString>;
      agentId: ZodOptional<ZodString>;
      errorPolicy: ZodOptional<ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
    }, $strict>>>>;
    errorPolicy: ZodOptional<ZodEnum<{
      silent: "silent";
      always: "always";
      once: "once";
    }>>;
  }, $strict>>>>;
  direct: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    dmPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
    skills: ZodOptional<ZodArray<ZodString>>;
    enabled: ZodOptional<ZodBoolean>;
    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    systemPrompt: ZodOptional<ZodString>;
    topics: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      ingest: ZodOptional<ZodBoolean>;
      disableAudioPreflight: ZodOptional<ZodBoolean>;
      groupPolicy: ZodOptional<ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
      }>>;
      skills: ZodOptional<ZodArray<ZodString>>;
      enabled: ZodOptional<ZodBoolean>;
      allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
      systemPrompt: ZodOptional<ZodString>;
      agentId: ZodOptional<ZodString>;
      errorPolicy: ZodOptional<ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
    }, $strict>>>>;
    errorPolicy: ZodOptional<ZodEnum<{
      silent: "silent";
      always: "always";
      once: "once";
    }>>;
    requireTopic: ZodOptional<ZodBoolean>;
    autoTopicLabel: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      prompt: ZodOptional<ZodString>;
    }, $strict>]>>;
  }, $strict>>>>;
  richMessages: ZodOptional<ZodBoolean>;
  network: ZodOptional<ZodObject<{
    autoSelectFamily: ZodOptional<ZodBoolean>;
    dnsResultOrder: ZodOptional<ZodEnum<{
      ipv4first: "ipv4first";
      verbatim: "verbatim";
    }>>;
    dangerouslyAllowPrivateNetwork: ZodOptional<ZodBoolean>;
  }, $strict>>;
  proxy: ZodOptional<ZodString>;
  webhookUrl: ZodOptional<ZodString>;
  webhookSecret: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  webhookPath: ZodOptional<ZodString>;
  webhookHost: ZodOptional<ZodString>;
  webhookPort: ZodOptional<ZodNumber>;
  webhookCertPath: ZodOptional<ZodString>;
  actions: ZodOptional<ZodObject<{
    reactions: ZodOptional<ZodBoolean>;
    sendMessage: ZodOptional<ZodBoolean>;
    poll: ZodOptional<ZodBoolean>;
    deleteMessage: ZodOptional<ZodBoolean>;
    editMessage: ZodOptional<ZodBoolean>;
    sticker: ZodOptional<ZodBoolean>;
    createForumTopic: ZodOptional<ZodBoolean>;
    editForumTopic: ZodOptional<ZodBoolean>;
  }, $strict>>;
  threadBindings: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    idleHours: ZodOptional<ZodNumber>;
    maxAgeHours: ZodOptional<ZodNumber>;
    spawnSessions: ZodOptional<ZodBoolean>;
    defaultSpawnContext: ZodOptional<ZodEnum<{
      fork: "fork";
      isolated: "isolated";
    }>>;
  }, $strict>>;
  name: ZodOptional<ZodString>;
  replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
  heartbeat: ZodOptional<ZodObject<{
    showOk: ZodOptional<ZodBoolean>;
    showAlerts: ZodOptional<ZodBoolean>;
    useIndicator: ZodOptional<ZodBoolean>;
  }, $strict>>;
  enabled: ZodOptional<ZodBoolean>;
  capabilities: ZodOptional<ZodUnion<readonly [ZodArray<ZodString>, ZodObject<{
    inlineButtons: ZodOptional<ZodEnum<{
      off: "off";
      all: "all";
      group: "group";
      allowlist: "allowlist";
      dm: "dm";
    }>>;
  }, $strict>]>>;
  groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  markdown: ZodOptional<ZodObject<{
    tables: ZodOptional<ZodEnum<{
      code: "code";
      off: "off";
      block: "block";
      bullets: "bullets";
    }>>;
  }, $strict>>;
  configWrites: ZodOptional<ZodBoolean>;
  dmPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  defaultTo: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
  groupPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>>>;
  mentionPatterns: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
    allowIn: ZodOptional<ZodArray<ZodString>>;
    denyIn: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>;
  contextVisibility: ZodOptional<ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    historyLimit: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  textChunkLimit: ZodOptional<ZodNumber>;
  streaming: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodEnum<{
      off: "off";
      progress: "progress";
      block: "block";
      partial: "partial";
    }>>;
    chunkMode: ZodOptional<ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    progress: ZodOptional<ZodObject<{
      label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
      labels: ZodOptional<ZodArray<ZodString>>;
      maxLines: ZodOptional<ZodNumber>;
      maxLineChars: ZodOptional<ZodNumber>;
      render: ZodOptional<ZodEnum<{
        text: "text";
        rich: "rich";
      }>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
      commentary: ZodOptional<ZodBoolean>;
      narration: ZodOptional<ZodBoolean>;
    }, $strict>>;
    block: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      coalesce: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        idleMs: ZodOptional<ZodNumber>;
      }, $strict>>;
    }, $strict>>;
    preview: ZodOptional<ZodObject<{
      chunk: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
      }, $strict>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
    }, $strict>>;
  }, $strict>>;
  healthMonitor: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    linkPreview: ZodOptional<ZodBoolean>;
    silentErrorReplies: ZodOptional<ZodBoolean>;
    errorPolicy: ZodOptional<ZodEnum<{
      silent: "silent";
      always: "always";
      once: "once";
    }>>;
    apiRoot: ZodOptional<ZodString>;
    trustedLocalFileRoots: ZodOptional<ZodArray<ZodString>>;
    autoTopicLabel: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      prompt: ZodOptional<ZodString>;
    }, $strict>]>>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    execApprovals: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
      approvers: ZodOptional<ZodArray<ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>;
      agentFilter: ZodOptional<ZodArray<ZodString>>;
      sessionFilter: ZodOptional<ZodArray<ZodString>>;
      target: ZodOptional<ZodEnum<{
        both: "both";
        channel: "channel";
        dm: "dm";
      }>>;
    }, $strict>>;
    commands: ZodOptional<ZodObject<{
      native: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
      nativeSkills: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    }, $strict>>;
    customCommands: ZodOptional<ZodArray<ZodObject<{
      command: ZodString;
      description: ZodString;
    }, $strict>>>;
    botToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    tokenFile: ZodOptional<ZodString>;
    groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      skills: ZodOptional<ZodArray<ZodString>>;
      enabled: ZodOptional<ZodBoolean>;
      allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
      systemPrompt: ZodOptional<ZodString>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      ingest: ZodOptional<ZodBoolean>;
      disableAudioPreflight: ZodOptional<ZodBoolean>;
      groupPolicy: ZodOptional<ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
      }>>;
      topics: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        requireMention: ZodOptional<ZodBoolean>;
        ingest: ZodOptional<ZodBoolean>;
        disableAudioPreflight: ZodOptional<ZodBoolean>;
        groupPolicy: ZodOptional<ZodEnum<{
          open: "open";
          disabled: "disabled";
          allowlist: "allowlist";
        }>>;
        skills: ZodOptional<ZodArray<ZodString>>;
        enabled: ZodOptional<ZodBoolean>;
        allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
        systemPrompt: ZodOptional<ZodString>;
        agentId: ZodOptional<ZodString>;
        errorPolicy: ZodOptional<ZodEnum<{
          silent: "silent";
          always: "always";
          once: "once";
        }>>;
      }, $strict>>>>;
      errorPolicy: ZodOptional<ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
    }, $strict>>>>;
    direct: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      dmPolicy: ZodOptional<ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
        pairing: "pairing";
      }>>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      skills: ZodOptional<ZodArray<ZodString>>;
      enabled: ZodOptional<ZodBoolean>;
      allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
      systemPrompt: ZodOptional<ZodString>;
      topics: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        requireMention: ZodOptional<ZodBoolean>;
        ingest: ZodOptional<ZodBoolean>;
        disableAudioPreflight: ZodOptional<ZodBoolean>;
        groupPolicy: ZodOptional<ZodEnum<{
          open: "open";
          disabled: "disabled";
          allowlist: "allowlist";
        }>>;
        skills: ZodOptional<ZodArray<ZodString>>;
        enabled: ZodOptional<ZodBoolean>;
        allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
        systemPrompt: ZodOptional<ZodString>;
        agentId: ZodOptional<ZodString>;
        errorPolicy: ZodOptional<ZodEnum<{
          silent: "silent";
          always: "always";
          once: "once";
        }>>;
      }, $strict>>>>;
      errorPolicy: ZodOptional<ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
      requireTopic: ZodOptional<ZodBoolean>;
      autoTopicLabel: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        prompt: ZodOptional<ZodString>;
      }, $strict>]>>;
    }, $strict>>>>;
    richMessages: ZodOptional<ZodBoolean>;
    network: ZodOptional<ZodObject<{
      autoSelectFamily: ZodOptional<ZodBoolean>;
      dnsResultOrder: ZodOptional<ZodEnum<{
        ipv4first: "ipv4first";
        verbatim: "verbatim";
      }>>;
      dangerouslyAllowPrivateNetwork: ZodOptional<ZodBoolean>;
    }, $strict>>;
    proxy: ZodOptional<ZodString>;
    webhookUrl: ZodOptional<ZodString>;
    webhookSecret: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    webhookPath: ZodOptional<ZodString>;
    webhookHost: ZodOptional<ZodString>;
    webhookPort: ZodOptional<ZodNumber>;
    webhookCertPath: ZodOptional<ZodString>;
    actions: ZodOptional<ZodObject<{
      reactions: ZodOptional<ZodBoolean>;
      sendMessage: ZodOptional<ZodBoolean>;
      poll: ZodOptional<ZodBoolean>;
      deleteMessage: ZodOptional<ZodBoolean>;
      editMessage: ZodOptional<ZodBoolean>;
      sticker: ZodOptional<ZodBoolean>;
      createForumTopic: ZodOptional<ZodBoolean>;
      editForumTopic: ZodOptional<ZodBoolean>;
    }, $strict>>;
    threadBindings: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      idleHours: ZodOptional<ZodNumber>;
      maxAgeHours: ZodOptional<ZodNumber>;
      spawnSessions: ZodOptional<ZodBoolean>;
      defaultSpawnContext: ZodOptional<ZodEnum<{
        fork: "fork";
        isolated: "isolated";
      }>>;
    }, $strict>>;
    name: ZodOptional<ZodString>;
    replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    heartbeat: ZodOptional<ZodObject<{
      showOk: ZodOptional<ZodBoolean>;
      showAlerts: ZodOptional<ZodBoolean>;
      useIndicator: ZodOptional<ZodBoolean>;
    }, $strict>>;
    enabled: ZodOptional<ZodBoolean>;
    capabilities: ZodOptional<ZodUnion<readonly [ZodArray<ZodString>, ZodObject<{
      inlineButtons: ZodOptional<ZodEnum<{
        off: "off";
        all: "all";
        group: "group";
        allowlist: "allowlist";
        dm: "dm";
      }>>;
    }, $strict>]>>;
    groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    markdown: ZodOptional<ZodObject<{
      tables: ZodOptional<ZodEnum<{
        code: "code";
        off: "off";
        block: "block";
        bullets: "bullets";
      }>>;
    }, $strict>>;
    configWrites: ZodOptional<ZodBoolean>;
    dmPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    defaultTo: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
    groupPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>>>;
    mentionPatterns: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
      allowIn: ZodOptional<ZodArray<ZodString>>;
      denyIn: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    contextVisibility: ZodOptional<ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: ZodOptional<ZodNumber>;
    dmHistoryLimit: ZodOptional<ZodNumber>;
    dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      historyLimit: ZodOptional<ZodNumber>;
    }, $strict>>>>;
    textChunkLimit: ZodOptional<ZodNumber>;
    streaming: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodEnum<{
        off: "off";
        progress: "progress";
        block: "block";
        partial: "partial";
      }>>;
      chunkMode: ZodOptional<ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      progress: ZodOptional<ZodObject<{
        label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
        labels: ZodOptional<ZodArray<ZodString>>;
        maxLines: ZodOptional<ZodNumber>;
        maxLineChars: ZodOptional<ZodNumber>;
        render: ZodOptional<ZodEnum<{
          text: "text";
          rich: "rich";
        }>>;
        toolProgress: ZodOptional<ZodBoolean>;
        commandText: ZodOptional<ZodEnum<{
          status: "status";
          raw: "raw";
        }>>;
        commentary: ZodOptional<ZodBoolean>;
        narration: ZodOptional<ZodBoolean>;
      }, $strict>>;
      block: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        coalesce: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          idleMs: ZodOptional<ZodNumber>;
        }, $strict>>;
      }, $strict>>;
      preview: ZodOptional<ZodObject<{
        chunk: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
        }, $strict>>;
        toolProgress: ZodOptional<ZodBoolean>;
        commandText: ZodOptional<ZodEnum<{
          status: "status";
          raw: "raw";
        }>>;
      }, $strict>>;
    }, $strict>>;
    healthMonitor: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    responsePrefix: ZodOptional<ZodString>;
    mediaMaxMb: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  defaultAccount: ZodOptional<ZodString>;
}, $strict>;
declare const DiscordConfigSchema: ZodObject<{
  ackReactionScope: ZodOptional<ZodEnum<{
    off: "off";
    all: "all";
    none: "none";
    direct: "direct";
    "group-mentions": "group-mentions";
    "group-all": "group-all";
  }>>;
  activity: ZodOptional<ZodString>;
  status: ZodOptional<ZodEnum<{
    online: "online";
    dnd: "dnd";
    idle: "idle";
    invisible: "invisible";
  }>>;
  autoPresence: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    intervalMs: ZodOptional<ZodNumber>;
    minUpdateIntervalMs: ZodOptional<ZodNumber>;
    healthyText: ZodOptional<ZodString>;
    degradedText: ZodOptional<ZodString>;
    exhaustedText: ZodOptional<ZodString>;
  }, $strict>>;
  activityType: ZodOptional<ZodUnion<readonly [ZodLiteral<0>, ZodLiteral<1>, ZodLiteral<2>, ZodLiteral<3>, ZodLiteral<4>, ZodLiteral<5>]>>;
  activityUrl: ZodOptional<ZodString>;
  inboundWorker: ZodOptional<ZodObject<{
    runTimeoutMs: ZodOptional<ZodNumber>;
  }, $strict>>;
  ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
  reactionNotifications?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  commands: ZodOptional<ZodObject<{
    native: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    nativeSkills: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
  }, $strict>>;
  token: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  applicationId: ZodOptional<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>;
  activities: ZodOptional<ZodObject<{
    clientSecret: ZodOptional<ZodString>;
    applicationId: ZodOptional<ZodString>;
  }, $strict>>;
  proxy: ZodOptional<ZodString>;
  allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
  botLoopProtection: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    maxEventsPerWindow: ZodOptional<ZodNumber>;
    windowSeconds: ZodOptional<ZodNumber>;
    cooldownSeconds: ZodOptional<ZodNumber>;
  }, $strict>>;
  dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
  mentionAliases: ZodOptional<ZodRecord<ZodString, ZodString>>;
  suppressEmbeds: ZodOptional<ZodBoolean>;
  maxLinesPerMessage: ZodOptional<ZodNumber>;
  actions: ZodOptional<ZodObject<{
    reactions: ZodOptional<ZodBoolean>;
    stickers: ZodOptional<ZodBoolean>;
    emojiUploads: ZodOptional<ZodBoolean>;
    stickerUploads: ZodOptional<ZodBoolean>;
    polls: ZodOptional<ZodBoolean>;
    permissions: ZodOptional<ZodBoolean>;
    messages: ZodOptional<ZodBoolean>;
    threads: ZodOptional<ZodBoolean>;
    pins: ZodOptional<ZodBoolean>;
    search: ZodOptional<ZodBoolean>;
    memberInfo: ZodOptional<ZodBoolean>;
    roleInfo: ZodOptional<ZodBoolean>;
    roles: ZodOptional<ZodBoolean>;
    channelInfo: ZodOptional<ZodBoolean>;
    voiceStatus: ZodOptional<ZodBoolean>;
    events: ZodOptional<ZodBoolean>;
    moderation: ZodOptional<ZodBoolean>;
    channels: ZodOptional<ZodBoolean>;
    presence: ZodOptional<ZodBoolean>;
  }, $strict>>;
  thread: ZodOptional<ZodObject<{
    inheritParent: ZodOptional<ZodBoolean>;
  }, $strict>>;
  dm: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    groupEnabled: ZodOptional<ZodBoolean>;
    groupChannels: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
  }, $strict>>;
  guilds: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    requireMention: ZodOptional<ZodBoolean>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
    users: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
    roles: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
    presenceEvents: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      channelId: ZodString;
      users: ZodOptional<ZodArray<ZodString>>;
      reconnectSuppressSeconds: ZodOptional<ZodNumber>;
      burstLimit: ZodOptional<ZodNumber>;
      burstWindowSeconds: ZodOptional<ZodNumber>;
    }, $strict>>;
    channels: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      skills: ZodOptional<ZodArray<ZodString>>;
      enabled: ZodOptional<ZodBoolean>;
      systemPrompt: ZodOptional<ZodString>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      ignoreOtherMentions: ZodOptional<ZodBoolean>;
      users: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
      roles: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
      includeThreadStarter: ZodOptional<ZodBoolean>;
      autoThread: ZodOptional<ZodBoolean>;
      autoThreadName: ZodOptional<ZodEnum<{
        message: "message";
        generated: "generated";
      }>>;
      autoArchiveDuration: ZodOptional<ZodUnion<readonly [ZodEnum<{
        60: "60";
        1440: "1440";
        4320: "4320";
        10080: "10080";
      }>, ZodLiteral<60>, ZodLiteral<1440>, ZodLiteral<4320>, ZodLiteral<10080>]>>;
    }, $strict>>>>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    slug: ZodOptional<ZodString>;
    ignoreOtherMentions: ZodOptional<ZodBoolean>;
  }, $strict>>>>;
  execApprovals: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    approvers: ZodOptional<ZodArray<ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>;
    agentFilter: ZodOptional<ZodArray<ZodString>>;
    sessionFilter: ZodOptional<ZodArray<ZodString>>;
    target: ZodOptional<ZodEnum<{
      both: "both";
      channel: "channel";
      dm: "dm";
    }>>;
    cleanupAfterResolve: ZodOptional<ZodBoolean>;
  }, $strict>>;
  agentComponents: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    ttlMs: ZodOptional<ZodNumber>;
  }, $strict>>;
  ui: ZodOptional<ZodObject<{
    components: ZodOptional<ZodObject<{
      accentColor: ZodOptional<ZodString>;
    }, $strict>>;
  }, $strict>>;
  slashCommand: ZodOptional<ZodObject<{
    ephemeral: ZodOptional<ZodBoolean>;
  }, $strict>>;
  threadBindings: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    idleHours: ZodOptional<ZodNumber>;
    maxAgeHours: ZodOptional<ZodNumber>;
    spawnSessions: ZodOptional<ZodBoolean>;
    defaultSpawnContext: ZodOptional<ZodEnum<{
      fork: "fork";
      isolated: "isolated";
    }>>;
  }, $strict>>;
  subagentProgress: ZodOptional<ZodBoolean>;
  intents: ZodOptional<ZodObject<{
    presence: ZodOptional<ZodBoolean>;
    guildMembers: ZodOptional<ZodBoolean>;
    voiceStates: ZodOptional<ZodBoolean>;
  }, $strict>>;
  voice: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    mode: ZodOptional<ZodEnum<{
      "stt-tts": "stt-tts";
      "agent-proxy": "agent-proxy";
      bidi: "bidi";
    }>>;
    agentSession: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodEnum<{
        voice: "voice";
        target: "target";
      }>>;
      target: ZodOptional<ZodString>;
    }, $strict>>;
    model: ZodOptional<ZodString>;
    realtime: ZodOptional<ZodObject<{
      provider: ZodOptional<ZodString>;
      model: ZodOptional<ZodString>;
      speakerVoice: ZodOptional<ZodString>;
      speakerVoiceId: ZodOptional<ZodString>;
      instructions: ZodOptional<ZodString>;
      toolPolicy: ZodOptional<ZodEnum<{
        none: "none";
        owner: "owner";
        "safe-read-only": "safe-read-only";
      }>>;
      consultPolicy: ZodOptional<ZodEnum<{
        auto: "auto";
        always: "always";
      }>>;
      requireWakeName: ZodOptional<ZodBoolean>;
      wakeNames: ZodOptional<ZodArray<ZodString>>;
      bootstrapContextFiles: ZodOptional<ZodArray<ZodEnum<{
        "IDENTITY.md": "IDENTITY.md";
        "USER.md": "USER.md";
        "SOUL.md": "SOUL.md";
      }>>>;
      bargeIn: ZodOptional<ZodBoolean>;
      minBargeInAudioEndMs: ZodOptional<ZodNumber>;
      debounceMs: ZodOptional<ZodNumber>;
      providers: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodRecord<ZodString, ZodUnknown>>>>;
    }, $strict>>;
    autoJoin: ZodOptional<ZodArray<ZodObject<{
      guildId: ZodString;
      channelId: ZodString;
    }, $strict>>>;
    followUsersEnabled: ZodOptional<ZodBoolean>;
    followUsers: ZodOptional<ZodArray<ZodString>>;
    allowedChannels: ZodOptional<ZodArray<ZodObject<{
      guildId: ZodString;
      channelId: ZodString;
    }, $strict>>>;
    daveEncryption: ZodOptional<ZodBoolean>;
    decryptionFailureTolerance: ZodOptional<ZodNumber>;
    connectTimeoutMs: ZodOptional<ZodNumber>;
    reconnectGraceMs: ZodOptional<ZodNumber>;
    captureSilenceGraceMs: ZodOptional<ZodNumber>;
    tts: ZodOptional<ZodOptional<ZodObject<{
      auto: ZodOptional<ZodEnum<{
        off: "off";
        always: "always";
        tagged: "tagged";
        inbound: "inbound";
      }>>;
      enabled: ZodOptional<ZodBoolean>;
      mode: ZodOptional<ZodEnum<{
        all: "all";
        final: "final";
      }>>;
      provider: ZodOptional<ZodString>;
      persona: ZodOptional<ZodString>;
      personas: ZodOptional<ZodRecord<ZodString, ZodObject<{
        label: ZodOptional<ZodString>;
        description: ZodOptional<ZodString>;
        provider: ZodOptional<ZodString>;
        fallbackPolicy: ZodOptional<ZodUnion<readonly [ZodLiteral<"preserve-persona">, ZodLiteral<"provider-defaults">, ZodLiteral<"fail">]>>;
        prompt: ZodOptional<ZodObject<{
          profile: ZodOptional<ZodString>;
          scene: ZodOptional<ZodString>;
          sampleContext: ZodOptional<ZodString>;
          style: ZodOptional<ZodString>;
          accent: ZodOptional<ZodString>;
          pacing: ZodOptional<ZodString>;
          constraints: ZodOptional<ZodArray<ZodString>>;
        }, $strict>>;
        providers: ZodOptional<ZodRecord<ZodString, ZodObject<{
          apiKey: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
            source: ZodLiteral<"env">;
            provider: ZodString;
            id: ZodString;
          }, $strict>, ZodObject<{
            source: ZodLiteral<"file">;
            provider: ZodString;
            id: ZodString;
          }, $strict>, ZodObject<{
            source: ZodLiteral<"exec">;
            provider: ZodString;
            id: ZodString;
          }, $strict>], "source">]>>;
        }, $catchall<ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean, ZodNull, ZodArray<ZodUnknown>, ZodRecord<ZodString, ZodUnknown>]>>>>>;
      }, $strict>>>;
      summaryModel: ZodOptional<ZodString>;
      modelOverrides: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        allowText: ZodOptional<ZodBoolean>;
        allowProvider: ZodOptional<ZodBoolean>;
        allowVoice: ZodOptional<ZodBoolean>;
        allowModelId: ZodOptional<ZodBoolean>;
        allowVoiceSettings: ZodOptional<ZodBoolean>;
        allowNormalization: ZodOptional<ZodBoolean>;
        allowSeed: ZodOptional<ZodBoolean>;
      }, $strict>>;
      providers: ZodOptional<ZodRecord<ZodString, ZodObject<{
        apiKey: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
          source: ZodLiteral<"env">;
          provider: ZodString;
          id: ZodString;
        }, $strict>, ZodObject<{
          source: ZodLiteral<"file">;
          provider: ZodString;
          id: ZodString;
        }, $strict>, ZodObject<{
          source: ZodLiteral<"exec">;
          provider: ZodString;
          id: ZodString;
        }, $strict>], "source">]>>;
      }, $catchall<ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean, ZodNull, ZodArray<ZodUnknown>, ZodRecord<ZodString, ZodUnknown>]>>>>>;
      prefsPath: ZodOptional<ZodString>;
      maxTextLength: ZodOptional<ZodNumber>;
      timeoutMs: ZodOptional<ZodNumber>;
    }, $strict>>>;
  }, $strict>>;
  pluralkit: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    token: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
  }, $strict>>;
  name: ZodOptional<ZodString>;
  replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
  heartbeat: ZodOptional<ZodObject<{
    showOk: ZodOptional<ZodBoolean>;
    showAlerts: ZodOptional<ZodBoolean>;
    useIndicator: ZodOptional<ZodBoolean>;
  }, $strict>>;
  enabled: ZodOptional<ZodBoolean>;
  capabilities: ZodOptional<ZodArray<ZodString>>;
  markdown: ZodOptional<ZodObject<{
    tables: ZodOptional<ZodEnum<{
      code: "code";
      off: "off";
      block: "block";
      bullets: "bullets";
    }>>;
  }, $strict>>;
  configWrites: ZodOptional<ZodBoolean>;
  dmPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
  defaultTo: ZodOptional<ZodString>;
  groupPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>>>;
  mentionPatterns: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
    allowIn: ZodOptional<ZodArray<ZodString>>;
    denyIn: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>;
  contextVisibility: ZodOptional<ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    historyLimit: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  textChunkLimit: ZodOptional<ZodNumber>;
  streaming: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodEnum<{
      off: "off";
      progress: "progress";
      block: "block";
      partial: "partial";
    }>>;
    chunkMode: ZodOptional<ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    preview: ZodOptional<ZodObject<{
      chunk: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
      }, $strict>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
    }, $strict>>;
    block: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      coalesce: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        idleMs: ZodOptional<ZodNumber>;
      }, $strict>>;
    }, $strict>>;
    progress: ZodOptional<ZodObject<{
      label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
      labels: ZodOptional<ZodArray<ZodString>>;
      maxLines: ZodOptional<ZodNumber>;
      maxLineChars: ZodOptional<ZodNumber>;
      render: ZodOptional<ZodEnum<{
        text: "text";
        rich: "rich";
      }>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
      commentary: ZodOptional<ZodBoolean>;
      narration: ZodOptional<ZodBoolean>;
    }, $strict>>;
  }, $strict>>;
  healthMonitor: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    ackReactionScope: ZodOptional<ZodEnum<{
      off: "off";
      all: "all";
      none: "none";
      direct: "direct";
      "group-mentions": "group-mentions";
      "group-all": "group-all";
    }>>;
    activity: ZodOptional<ZodString>;
    status: ZodOptional<ZodEnum<{
      online: "online";
      dnd: "dnd";
      idle: "idle";
      invisible: "invisible";
    }>>;
    autoPresence: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      intervalMs: ZodOptional<ZodNumber>;
      minUpdateIntervalMs: ZodOptional<ZodNumber>;
      healthyText: ZodOptional<ZodString>;
      degradedText: ZodOptional<ZodString>;
      exhaustedText: ZodOptional<ZodString>;
    }, $strict>>;
    activityType: ZodOptional<ZodUnion<readonly [ZodLiteral<0>, ZodLiteral<1>, ZodLiteral<2>, ZodLiteral<3>, ZodLiteral<4>, ZodLiteral<5>]>>;
    activityUrl: ZodOptional<ZodString>;
    inboundWorker: ZodOptional<ZodObject<{
      runTimeoutMs: ZodOptional<ZodNumber>;
    }, $strict>>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    commands: ZodOptional<ZodObject<{
      native: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
      nativeSkills: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    }, $strict>>;
    token: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    applicationId: ZodOptional<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>;
    activities: ZodOptional<ZodObject<{
      clientSecret: ZodOptional<ZodString>;
      applicationId: ZodOptional<ZodString>;
    }, $strict>>;
    proxy: ZodOptional<ZodString>;
    allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
    botLoopProtection: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      maxEventsPerWindow: ZodOptional<ZodNumber>;
      windowSeconds: ZodOptional<ZodNumber>;
      cooldownSeconds: ZodOptional<ZodNumber>;
    }, $strict>>;
    dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
    mentionAliases: ZodOptional<ZodRecord<ZodString, ZodString>>;
    suppressEmbeds: ZodOptional<ZodBoolean>;
    maxLinesPerMessage: ZodOptional<ZodNumber>;
    actions: ZodOptional<ZodObject<{
      reactions: ZodOptional<ZodBoolean>;
      stickers: ZodOptional<ZodBoolean>;
      emojiUploads: ZodOptional<ZodBoolean>;
      stickerUploads: ZodOptional<ZodBoolean>;
      polls: ZodOptional<ZodBoolean>;
      permissions: ZodOptional<ZodBoolean>;
      messages: ZodOptional<ZodBoolean>;
      threads: ZodOptional<ZodBoolean>;
      pins: ZodOptional<ZodBoolean>;
      search: ZodOptional<ZodBoolean>;
      memberInfo: ZodOptional<ZodBoolean>;
      roleInfo: ZodOptional<ZodBoolean>;
      roles: ZodOptional<ZodBoolean>;
      channelInfo: ZodOptional<ZodBoolean>;
      voiceStatus: ZodOptional<ZodBoolean>;
      events: ZodOptional<ZodBoolean>;
      moderation: ZodOptional<ZodBoolean>;
      channels: ZodOptional<ZodBoolean>;
      presence: ZodOptional<ZodBoolean>;
    }, $strict>>;
    thread: ZodOptional<ZodObject<{
      inheritParent: ZodOptional<ZodBoolean>;
    }, $strict>>;
    dm: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      groupEnabled: ZodOptional<ZodBoolean>;
      groupChannels: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
    }, $strict>>;
    guilds: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      users: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
      roles: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
      presenceEvents: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        channelId: ZodString;
        users: ZodOptional<ZodArray<ZodString>>;
        reconnectSuppressSeconds: ZodOptional<ZodNumber>;
        burstLimit: ZodOptional<ZodNumber>;
        burstWindowSeconds: ZodOptional<ZodNumber>;
      }, $strict>>;
      channels: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        requireMention: ZodOptional<ZodBoolean>;
        tools: ZodOptional<ZodObject<{
          allow: ZodOptional<ZodArray<ZodString>>;
          alsoAllow: ZodOptional<ZodArray<ZodString>>;
          deny: ZodOptional<ZodArray<ZodString>>;
        }, $strict>>;
        skills: ZodOptional<ZodArray<ZodString>>;
        enabled: ZodOptional<ZodBoolean>;
        systemPrompt: ZodOptional<ZodString>;
        toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
          allow: ZodOptional<ZodArray<ZodString>>;
          alsoAllow: ZodOptional<ZodArray<ZodString>>;
          deny: ZodOptional<ZodArray<ZodString>>;
        }, $strict>>>>;
        ignoreOtherMentions: ZodOptional<ZodBoolean>;
        users: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
        roles: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
        includeThreadStarter: ZodOptional<ZodBoolean>;
        autoThread: ZodOptional<ZodBoolean>;
        autoThreadName: ZodOptional<ZodEnum<{
          message: "message";
          generated: "generated";
        }>>;
        autoArchiveDuration: ZodOptional<ZodUnion<readonly [ZodEnum<{
          60: "60";
          1440: "1440";
          4320: "4320";
          10080: "10080";
        }>, ZodLiteral<60>, ZodLiteral<1440>, ZodLiteral<4320>, ZodLiteral<10080>]>>;
      }, $strict>>>>;
      ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
      reactionLevel?: ZodOptional<ZodEnum<{
        [x: string]: string;
      }>> | undefined;
      reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
      reactionNotifications?: ZodOptional<ZodEnum<{
        [x: string]: string;
      }>> | undefined;
      slug: ZodOptional<ZodString>;
      ignoreOtherMentions: ZodOptional<ZodBoolean>;
    }, $strict>>>>;
    execApprovals: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
      approvers: ZodOptional<ZodArray<ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>;
      agentFilter: ZodOptional<ZodArray<ZodString>>;
      sessionFilter: ZodOptional<ZodArray<ZodString>>;
      target: ZodOptional<ZodEnum<{
        both: "both";
        channel: "channel";
        dm: "dm";
      }>>;
      cleanupAfterResolve: ZodOptional<ZodBoolean>;
    }, $strict>>;
    agentComponents: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      ttlMs: ZodOptional<ZodNumber>;
    }, $strict>>;
    ui: ZodOptional<ZodObject<{
      components: ZodOptional<ZodObject<{
        accentColor: ZodOptional<ZodString>;
      }, $strict>>;
    }, $strict>>;
    slashCommand: ZodOptional<ZodObject<{
      ephemeral: ZodOptional<ZodBoolean>;
    }, $strict>>;
    threadBindings: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      idleHours: ZodOptional<ZodNumber>;
      maxAgeHours: ZodOptional<ZodNumber>;
      spawnSessions: ZodOptional<ZodBoolean>;
      defaultSpawnContext: ZodOptional<ZodEnum<{
        fork: "fork";
        isolated: "isolated";
      }>>;
    }, $strict>>;
    subagentProgress: ZodOptional<ZodBoolean>;
    intents: ZodOptional<ZodObject<{
      presence: ZodOptional<ZodBoolean>;
      guildMembers: ZodOptional<ZodBoolean>;
      voiceStates: ZodOptional<ZodBoolean>;
    }, $strict>>;
    voice: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      mode: ZodOptional<ZodEnum<{
        "stt-tts": "stt-tts";
        "agent-proxy": "agent-proxy";
        bidi: "bidi";
      }>>;
      agentSession: ZodOptional<ZodObject<{
        mode: ZodOptional<ZodEnum<{
          voice: "voice";
          target: "target";
        }>>;
        target: ZodOptional<ZodString>;
      }, $strict>>;
      model: ZodOptional<ZodString>;
      realtime: ZodOptional<ZodObject<{
        provider: ZodOptional<ZodString>;
        model: ZodOptional<ZodString>;
        speakerVoice: ZodOptional<ZodString>;
        speakerVoiceId: ZodOptional<ZodString>;
        instructions: ZodOptional<ZodString>;
        toolPolicy: ZodOptional<ZodEnum<{
          none: "none";
          owner: "owner";
          "safe-read-only": "safe-read-only";
        }>>;
        consultPolicy: ZodOptional<ZodEnum<{
          auto: "auto";
          always: "always";
        }>>;
        requireWakeName: ZodOptional<ZodBoolean>;
        wakeNames: ZodOptional<ZodArray<ZodString>>;
        bootstrapContextFiles: ZodOptional<ZodArray<ZodEnum<{
          "IDENTITY.md": "IDENTITY.md";
          "USER.md": "USER.md";
          "SOUL.md": "SOUL.md";
        }>>>;
        bargeIn: ZodOptional<ZodBoolean>;
        minBargeInAudioEndMs: ZodOptional<ZodNumber>;
        debounceMs: ZodOptional<ZodNumber>;
        providers: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodRecord<ZodString, ZodUnknown>>>>;
      }, $strict>>;
      autoJoin: ZodOptional<ZodArray<ZodObject<{
        guildId: ZodString;
        channelId: ZodString;
      }, $strict>>>;
      followUsersEnabled: ZodOptional<ZodBoolean>;
      followUsers: ZodOptional<ZodArray<ZodString>>;
      allowedChannels: ZodOptional<ZodArray<ZodObject<{
        guildId: ZodString;
        channelId: ZodString;
      }, $strict>>>;
      daveEncryption: ZodOptional<ZodBoolean>;
      decryptionFailureTolerance: ZodOptional<ZodNumber>;
      connectTimeoutMs: ZodOptional<ZodNumber>;
      reconnectGraceMs: ZodOptional<ZodNumber>;
      captureSilenceGraceMs: ZodOptional<ZodNumber>;
      tts: ZodOptional<ZodOptional<ZodObject<{
        auto: ZodOptional<ZodEnum<{
          off: "off";
          always: "always";
          tagged: "tagged";
          inbound: "inbound";
        }>>;
        enabled: ZodOptional<ZodBoolean>;
        mode: ZodOptional<ZodEnum<{
          all: "all";
          final: "final";
        }>>;
        provider: ZodOptional<ZodString>;
        persona: ZodOptional<ZodString>;
        personas: ZodOptional<ZodRecord<ZodString, ZodObject<{
          label: ZodOptional<ZodString>;
          description: ZodOptional<ZodString>;
          provider: ZodOptional<ZodString>;
          fallbackPolicy: ZodOptional<ZodUnion<readonly [ZodLiteral<"preserve-persona">, ZodLiteral<"provider-defaults">, ZodLiteral<"fail">]>>;
          prompt: ZodOptional<ZodObject<{
            profile: ZodOptional<ZodString>;
            scene: ZodOptional<ZodString>;
            sampleContext: ZodOptional<ZodString>;
            style: ZodOptional<ZodString>;
            accent: ZodOptional<ZodString>;
            pacing: ZodOptional<ZodString>;
            constraints: ZodOptional<ZodArray<ZodString>>;
          }, $strict>>;
          providers: ZodOptional<ZodRecord<ZodString, ZodObject<{
            apiKey: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
              source: ZodLiteral<"env">;
              provider: ZodString;
              id: ZodString;
            }, $strict>, ZodObject<{
              source: ZodLiteral<"file">;
              provider: ZodString;
              id: ZodString;
            }, $strict>, ZodObject<{
              source: ZodLiteral<"exec">;
              provider: ZodString;
              id: ZodString;
            }, $strict>], "source">]>>;
          }, $catchall<ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean, ZodNull, ZodArray<ZodUnknown>, ZodRecord<ZodString, ZodUnknown>]>>>>>;
        }, $strict>>>;
        summaryModel: ZodOptional<ZodString>;
        modelOverrides: ZodOptional<ZodObject<{
          enabled: ZodOptional<ZodBoolean>;
          allowText: ZodOptional<ZodBoolean>;
          allowProvider: ZodOptional<ZodBoolean>;
          allowVoice: ZodOptional<ZodBoolean>;
          allowModelId: ZodOptional<ZodBoolean>;
          allowVoiceSettings: ZodOptional<ZodBoolean>;
          allowNormalization: ZodOptional<ZodBoolean>;
          allowSeed: ZodOptional<ZodBoolean>;
        }, $strict>>;
        providers: ZodOptional<ZodRecord<ZodString, ZodObject<{
          apiKey: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
            source: ZodLiteral<"env">;
            provider: ZodString;
            id: ZodString;
          }, $strict>, ZodObject<{
            source: ZodLiteral<"file">;
            provider: ZodString;
            id: ZodString;
          }, $strict>, ZodObject<{
            source: ZodLiteral<"exec">;
            provider: ZodString;
            id: ZodString;
          }, $strict>], "source">]>>;
        }, $catchall<ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean, ZodNull, ZodArray<ZodUnknown>, ZodRecord<ZodString, ZodUnknown>]>>>>>;
        prefsPath: ZodOptional<ZodString>;
        maxTextLength: ZodOptional<ZodNumber>;
        timeoutMs: ZodOptional<ZodNumber>;
      }, $strict>>>;
    }, $strict>>;
    pluralkit: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      token: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
        source: ZodLiteral<"env">;
        provider: ZodString;
        id: ZodString;
      }, $strict>, ZodObject<{
        source: ZodLiteral<"file">;
        provider: ZodString;
        id: ZodString;
      }, $strict>, ZodObject<{
        source: ZodLiteral<"exec">;
        provider: ZodString;
        id: ZodString;
      }, $strict>], "source">]>>;
    }, $strict>>;
    name: ZodOptional<ZodString>;
    replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    heartbeat: ZodOptional<ZodObject<{
      showOk: ZodOptional<ZodBoolean>;
      showAlerts: ZodOptional<ZodBoolean>;
      useIndicator: ZodOptional<ZodBoolean>;
    }, $strict>>;
    enabled: ZodOptional<ZodBoolean>;
    capabilities: ZodOptional<ZodArray<ZodString>>;
    markdown: ZodOptional<ZodObject<{
      tables: ZodOptional<ZodEnum<{
        code: "code";
        off: "off";
        block: "block";
        bullets: "bullets";
      }>>;
    }, $strict>>;
    configWrites: ZodOptional<ZodBoolean>;
    dmPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: ZodOptional<ZodArray<ZodPipe<ZodPipe<ZodUnion<readonly [ZodString, ZodNumber]>, ZodTransform<string, string | number>>, ZodString>>>;
    defaultTo: ZodOptional<ZodString>;
    groupPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>>>;
    mentionPatterns: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
      allowIn: ZodOptional<ZodArray<ZodString>>;
      denyIn: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    contextVisibility: ZodOptional<ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: ZodOptional<ZodNumber>;
    dmHistoryLimit: ZodOptional<ZodNumber>;
    dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      historyLimit: ZodOptional<ZodNumber>;
    }, $strict>>>>;
    textChunkLimit: ZodOptional<ZodNumber>;
    streaming: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodEnum<{
        off: "off";
        progress: "progress";
        block: "block";
        partial: "partial";
      }>>;
      chunkMode: ZodOptional<ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      preview: ZodOptional<ZodObject<{
        chunk: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
        }, $strict>>;
        toolProgress: ZodOptional<ZodBoolean>;
        commandText: ZodOptional<ZodEnum<{
          status: "status";
          raw: "raw";
        }>>;
      }, $strict>>;
      block: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        coalesce: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          idleMs: ZodOptional<ZodNumber>;
        }, $strict>>;
      }, $strict>>;
      progress: ZodOptional<ZodObject<{
        label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
        labels: ZodOptional<ZodArray<ZodString>>;
        maxLines: ZodOptional<ZodNumber>;
        maxLineChars: ZodOptional<ZodNumber>;
        render: ZodOptional<ZodEnum<{
          text: "text";
          rich: "rich";
        }>>;
        toolProgress: ZodOptional<ZodBoolean>;
        commandText: ZodOptional<ZodEnum<{
          status: "status";
          raw: "raw";
        }>>;
        commentary: ZodOptional<ZodBoolean>;
        narration: ZodOptional<ZodBoolean>;
      }, $strict>>;
    }, $strict>>;
    healthMonitor: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    responsePrefix: ZodOptional<ZodString>;
    mediaMaxMb: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  defaultAccount: ZodOptional<ZodString>;
}, $strict>;
declare const SlackConfigSchema: ZodObject<{
  replyToModeByChatType: ZodOptional<ZodObject<{
    direct: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    group: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    channel: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
  }, $strict>>;
  thread: ZodOptional<ZodObject<{
    historyScope: ZodOptional<ZodEnum<{
      channel: "channel";
      thread: "thread";
    }>>;
    inheritParent: ZodOptional<ZodBoolean>;
    initialHistoryLimit: ZodOptional<ZodNumber>;
  }, $strict>>;
  presenceEvents: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodEnum<{
      off: "off";
      auto: "auto";
      on: "on";
    }>>;
  }, $strict>>;
  actions: ZodOptional<ZodObject<{
    reactions: ZodOptional<ZodBoolean>;
    messages: ZodOptional<ZodBoolean>;
    pins: ZodOptional<ZodBoolean>;
    search: ZodOptional<ZodBoolean>;
    permissions: ZodOptional<ZodBoolean>;
    memberInfo: ZodOptional<ZodBoolean>;
    channelInfo: ZodOptional<ZodBoolean>;
    emojiList: ZodOptional<ZodBoolean>;
  }, $strict>>;
  slashCommand: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    name: ZodOptional<ZodString>;
    sessionPrefix: ZodOptional<ZodString>;
    ephemeral: ZodOptional<ZodBoolean>;
  }, $strict>>;
  dm: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    groupEnabled: ZodOptional<ZodBoolean>;
    groupChannels: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  }, $strict>>;
  channels: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    requireMention: ZodOptional<ZodBoolean>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    skills: ZodOptional<ZodArray<ZodString>>;
    enabled: ZodOptional<ZodBoolean>;
    systemPrompt: ZodOptional<ZodString>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
    ignoreOtherMentions: ZodOptional<ZodBoolean>;
    replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
    botLoopProtection: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      maxEventsPerWindow: ZodOptional<ZodNumber>;
      windowSeconds: ZodOptional<ZodNumber>;
      cooldownSeconds: ZodOptional<ZodNumber>;
    }, $strict>>;
    users: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    presenceEvents: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodEnum<{
        off: "off";
        auto: "auto";
        on: "on";
      }>>;
    }, $strict>>;
  }, $strict>>>>;
  typingReaction: ZodOptional<ZodString>;
  ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
  reactionNotifications?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  identity: ZodDefault<ZodEnum<{
    user: "user";
    bot: "bot";
  }>>;
  enterpriseOrgInstall: ZodOptional<ZodBoolean>;
  socketMode: ZodOptional<ZodObject<{
    clientPingTimeout: ZodOptional<ZodNumber>;
    serverPingTimeout: ZodOptional<ZodNumber>;
    pingPongLoggingEnabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  relay: ZodOptional<ZodObject<{
    url: ZodOptional<ZodString>;
    authToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    gatewayId: ZodOptional<ZodString>;
  }, $strict>>;
  execApprovals: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    approvers: ZodOptional<ZodArray<ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>;
    agentFilter: ZodOptional<ZodArray<ZodString>>;
    sessionFilter: ZodOptional<ZodArray<ZodString>>;
    target: ZodOptional<ZodEnum<{
      both: "both";
      channel: "channel";
      dm: "dm";
    }>>;
  }, $strict>>;
  commands: ZodOptional<ZodObject<{
    native: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    nativeSkills: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
  }, $strict>>;
  botToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  appToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  userToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  userTokenReadOnly: ZodDefault<ZodOptional<ZodBoolean>>;
  allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
  botLoopProtection: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    maxEventsPerWindow: ZodOptional<ZodNumber>;
    windowSeconds: ZodOptional<ZodNumber>;
    cooldownSeconds: ZodOptional<ZodNumber>;
  }, $strict>>;
  dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
  requireMention: ZodOptional<ZodBoolean>;
  implicitMentions: ZodOptional<ZodObject<{
    replyToBot: ZodOptional<ZodBoolean>;
    quotedBot: ZodOptional<ZodBoolean>;
    threadParticipation: ZodOptional<ZodBoolean>;
  }, $strict>>;
  unfurlLinks: ZodOptional<ZodBoolean>;
  unfurlMedia: ZodOptional<ZodBoolean>;
  name: ZodOptional<ZodString>;
  replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
  heartbeat: ZodOptional<ZodObject<{
    showOk: ZodOptional<ZodBoolean>;
    showAlerts: ZodOptional<ZodBoolean>;
    useIndicator: ZodOptional<ZodBoolean>;
  }, $strict>>;
  enabled: ZodOptional<ZodBoolean>;
  capabilities: ZodOptional<ZodUnion<readonly [ZodArray<ZodString>, ZodObject<{
    interactiveReplies: ZodOptional<ZodBoolean>;
  }, $strict>]>>;
  markdown: ZodOptional<ZodObject<{
    tables: ZodOptional<ZodEnum<{
      code: "code";
      off: "off";
      block: "block";
      bullets: "bullets";
    }>>;
  }, $strict>>;
  configWrites: ZodOptional<ZodBoolean>;
  dmPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  defaultTo: ZodOptional<ZodString>;
  mentionPatterns: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
    allowIn: ZodOptional<ZodArray<ZodString>>;
    denyIn: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>;
  contextVisibility: ZodOptional<ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    historyLimit: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  textChunkLimit: ZodOptional<ZodNumber>;
  streaming: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodEnum<{
      off: "off";
      progress: "progress";
      block: "block";
      partial: "partial";
    }>>;
    chunkMode: ZodOptional<ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    preview: ZodOptional<ZodObject<{
      chunk: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
      }, $strict>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
    }, $strict>>;
    block: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      coalesce: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        idleMs: ZodOptional<ZodNumber>;
      }, $strict>>;
    }, $strict>>;
    nativeTransport: ZodOptional<ZodBoolean>;
    progress: ZodOptional<ZodObject<{
      label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
      labels: ZodOptional<ZodArray<ZodString>>;
      maxLines: ZodOptional<ZodNumber>;
      maxLineChars: ZodOptional<ZodNumber>;
      render: ZodOptional<ZodEnum<{
        text: "text";
        rich: "rich";
      }>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
      commentary: ZodOptional<ZodBoolean>;
      narration: ZodOptional<ZodBoolean>;
      nativeTaskCards: ZodOptional<ZodBoolean>;
    }, $strict>>;
  }, $strict>>;
  healthMonitor: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
  mode: ZodDefault<ZodOptional<ZodEnum<{
    socket: "socket";
    http: "http";
    relay: "relay";
  }>>>;
  signingSecret: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  webhookPath: ZodDefault<ZodOptional<ZodString>>;
  groupPolicy: ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>>>;
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    replyToModeByChatType: ZodOptional<ZodObject<{
      direct: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
      group: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
      channel: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    }, $strict>>;
    thread: ZodOptional<ZodObject<{
      historyScope: ZodOptional<ZodEnum<{
        channel: "channel";
        thread: "thread";
      }>>;
      inheritParent: ZodOptional<ZodBoolean>;
      initialHistoryLimit: ZodOptional<ZodNumber>;
    }, $strict>>;
    presenceEvents: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodEnum<{
        off: "off";
        auto: "auto";
        on: "on";
      }>>;
    }, $strict>>;
    actions: ZodOptional<ZodObject<{
      reactions: ZodOptional<ZodBoolean>;
      messages: ZodOptional<ZodBoolean>;
      pins: ZodOptional<ZodBoolean>;
      search: ZodOptional<ZodBoolean>;
      permissions: ZodOptional<ZodBoolean>;
      memberInfo: ZodOptional<ZodBoolean>;
      channelInfo: ZodOptional<ZodBoolean>;
      emojiList: ZodOptional<ZodBoolean>;
    }, $strict>>;
    slashCommand: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      name: ZodOptional<ZodString>;
      sessionPrefix: ZodOptional<ZodString>;
      ephemeral: ZodOptional<ZodBoolean>;
    }, $strict>>;
    dm: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      groupEnabled: ZodOptional<ZodBoolean>;
      groupChannels: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    }, $strict>>;
    channels: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      skills: ZodOptional<ZodArray<ZodString>>;
      enabled: ZodOptional<ZodBoolean>;
      systemPrompt: ZodOptional<ZodString>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      ignoreOtherMentions: ZodOptional<ZodBoolean>;
      replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
      allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
      botLoopProtection: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        maxEventsPerWindow: ZodOptional<ZodNumber>;
        windowSeconds: ZodOptional<ZodNumber>;
        cooldownSeconds: ZodOptional<ZodNumber>;
      }, $strict>>;
      users: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
      presenceEvents: ZodOptional<ZodObject<{
        mode: ZodOptional<ZodEnum<{
          off: "off";
          auto: "auto";
          on: "on";
        }>>;
      }, $strict>>;
    }, $strict>>>>;
    typingReaction: ZodOptional<ZodString>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    mode: ZodOptional<ZodEnum<{
      socket: "socket";
      http: "http";
      relay: "relay";
    }>>;
    enterpriseOrgInstall: ZodOptional<ZodBoolean>;
    socketMode: ZodOptional<ZodObject<{
      clientPingTimeout: ZodOptional<ZodNumber>;
      serverPingTimeout: ZodOptional<ZodNumber>;
      pingPongLoggingEnabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    relay: ZodOptional<ZodObject<{
      url: ZodOptional<ZodString>;
      authToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
        source: ZodLiteral<"env">;
        provider: ZodString;
        id: ZodString;
      }, $strict>, ZodObject<{
        source: ZodLiteral<"file">;
        provider: ZodString;
        id: ZodString;
      }, $strict>, ZodObject<{
        source: ZodLiteral<"exec">;
        provider: ZodString;
        id: ZodString;
      }, $strict>], "source">]>>;
      gatewayId: ZodOptional<ZodString>;
    }, $strict>>;
    signingSecret: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    webhookPath: ZodOptional<ZodString>;
    execApprovals: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
      approvers: ZodOptional<ZodArray<ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>;
      agentFilter: ZodOptional<ZodArray<ZodString>>;
      sessionFilter: ZodOptional<ZodArray<ZodString>>;
      target: ZodOptional<ZodEnum<{
        both: "both";
        channel: "channel";
        dm: "dm";
      }>>;
    }, $strict>>;
    commands: ZodOptional<ZodObject<{
      native: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
      nativeSkills: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
    }, $strict>>;
    botToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    appToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    userToken: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
      source: ZodLiteral<"env">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"file">;
      provider: ZodString;
      id: ZodString;
    }, $strict>, ZodObject<{
      source: ZodLiteral<"exec">;
      provider: ZodString;
      id: ZodString;
    }, $strict>], "source">]>>;
    userTokenReadOnly: ZodDefault<ZodOptional<ZodBoolean>>;
    allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
    botLoopProtection: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      maxEventsPerWindow: ZodOptional<ZodNumber>;
      windowSeconds: ZodOptional<ZodNumber>;
      cooldownSeconds: ZodOptional<ZodNumber>;
    }, $strict>>;
    dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
    requireMention: ZodOptional<ZodBoolean>;
    implicitMentions: ZodOptional<ZodObject<{
      replyToBot: ZodOptional<ZodBoolean>;
      quotedBot: ZodOptional<ZodBoolean>;
      threadParticipation: ZodOptional<ZodBoolean>;
    }, $strict>>;
    unfurlLinks: ZodOptional<ZodBoolean>;
    unfurlMedia: ZodOptional<ZodBoolean>;
    name: ZodOptional<ZodString>;
    replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    heartbeat: ZodOptional<ZodObject<{
      showOk: ZodOptional<ZodBoolean>;
      showAlerts: ZodOptional<ZodBoolean>;
      useIndicator: ZodOptional<ZodBoolean>;
    }, $strict>>;
    enabled: ZodOptional<ZodBoolean>;
    capabilities: ZodOptional<ZodUnion<readonly [ZodArray<ZodString>, ZodObject<{
      interactiveReplies: ZodOptional<ZodBoolean>;
    }, $strict>]>>;
    markdown: ZodOptional<ZodObject<{
      tables: ZodOptional<ZodEnum<{
        code: "code";
        off: "off";
        block: "block";
        bullets: "bullets";
      }>>;
    }, $strict>>;
    configWrites: ZodOptional<ZodBoolean>;
    dmPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    defaultTo: ZodOptional<ZodString>;
    groupPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>>>;
    mentionPatterns: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
      allowIn: ZodOptional<ZodArray<ZodString>>;
      denyIn: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    contextVisibility: ZodOptional<ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: ZodOptional<ZodNumber>;
    dmHistoryLimit: ZodOptional<ZodNumber>;
    dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      historyLimit: ZodOptional<ZodNumber>;
    }, $strict>>>>;
    textChunkLimit: ZodOptional<ZodNumber>;
    streaming: ZodOptional<ZodObject<{
      mode: ZodOptional<ZodEnum<{
        off: "off";
        progress: "progress";
        block: "block";
        partial: "partial";
      }>>;
      chunkMode: ZodOptional<ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      preview: ZodOptional<ZodObject<{
        chunk: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
        }, $strict>>;
        toolProgress: ZodOptional<ZodBoolean>;
        commandText: ZodOptional<ZodEnum<{
          status: "status";
          raw: "raw";
        }>>;
      }, $strict>>;
      block: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        coalesce: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          idleMs: ZodOptional<ZodNumber>;
        }, $strict>>;
      }, $strict>>;
      nativeTransport: ZodOptional<ZodBoolean>;
      progress: ZodOptional<ZodObject<{
        label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
        labels: ZodOptional<ZodArray<ZodString>>;
        maxLines: ZodOptional<ZodNumber>;
        maxLineChars: ZodOptional<ZodNumber>;
        render: ZodOptional<ZodEnum<{
          text: "text";
          rich: "rich";
        }>>;
        toolProgress: ZodOptional<ZodBoolean>;
        commandText: ZodOptional<ZodEnum<{
          status: "status";
          raw: "raw";
        }>>;
        commentary: ZodOptional<ZodBoolean>;
        narration: ZodOptional<ZodBoolean>;
        nativeTaskCards: ZodOptional<ZodBoolean>;
      }, $strict>>;
    }, $strict>>;
    healthMonitor: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    responsePrefix: ZodOptional<ZodString>;
    mediaMaxMb: ZodOptional<ZodNumber>;
    identity: ZodOptional<ZodEnum<{
      user: "user";
      bot: "bot";
    }>>;
  }, $strict>>>>;
  defaultAccount: ZodOptional<ZodString>;
}, $strict>;
declare const SignalConfigSchema: ZodObject<{
  actions: ZodOptional<ZodObject<{
    reactions: ZodOptional<ZodBoolean>;
  }, $strict>>;
  ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
  reactionNotifications?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  account: ZodOptional<ZodString>;
  accountUuid: ZodOptional<ZodString>;
  configPath: ZodOptional<ZodString>;
  httpUrl: ZodOptional<ZodString>;
  httpHost: ZodOptional<ZodString>;
  httpPort: ZodOptional<ZodNumber>;
  cliPath: ZodOptional<ZodString>;
  autoStart: ZodOptional<ZodBoolean>;
  startupTimeoutMs: ZodOptional<ZodNumber>;
  receiveMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"on-start">, ZodLiteral<"manual">]>>;
  ignoreAttachments: ZodOptional<ZodBoolean>;
  ignoreStories: ZodOptional<ZodBoolean>;
  sendReadReceipts: ZodOptional<ZodBoolean>;
  aliases: ZodOptional<ZodRecord<ZodString, ZodString>>;
  groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    requireMention: ZodOptional<ZodBoolean>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
    ingest: ZodOptional<ZodBoolean>;
  }, $strict>>>>;
  replyToModeByChatType: ZodOptional<ZodObject<{
    direct: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    group: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
  }, $strict>>;
  name: ZodOptional<ZodString>;
  replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
  heartbeat: ZodOptional<ZodObject<{
    showOk: ZodOptional<ZodBoolean>;
    showAlerts: ZodOptional<ZodBoolean>;
    useIndicator: ZodOptional<ZodBoolean>;
  }, $strict>>;
  enabled: ZodOptional<ZodBoolean>;
  capabilities: ZodOptional<ZodArray<ZodString>>;
  groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  markdown: ZodOptional<ZodObject<{
    tables: ZodOptional<ZodEnum<{
      code: "code";
      off: "off";
      block: "block";
      bullets: "bullets";
    }>>;
  }, $strict>>;
  configWrites: ZodOptional<ZodBoolean>;
  dmPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  defaultTo: ZodOptional<ZodString>;
  groupPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>>>;
  contextVisibility: ZodOptional<ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    historyLimit: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  textChunkLimit: ZodOptional<ZodNumber>;
  streaming: ZodOptional<ZodObject<{
    chunkMode: ZodOptional<ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      coalesce: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        idleMs: ZodOptional<ZodNumber>;
      }, $strict>>;
    }, $strict>>;
  }, $strict>>;
  healthMonitor: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
  apiMode: ZodOptional<ZodEnum<{
    native: "native";
    auto: "auto";
    container: "container";
  }>>;
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    actions: ZodOptional<ZodObject<{
      reactions: ZodOptional<ZodBoolean>;
    }, $strict>>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    account: ZodOptional<ZodString>;
    accountUuid: ZodOptional<ZodString>;
    configPath: ZodOptional<ZodString>;
    httpUrl: ZodOptional<ZodString>;
    httpHost: ZodOptional<ZodString>;
    httpPort: ZodOptional<ZodNumber>;
    cliPath: ZodOptional<ZodString>;
    autoStart: ZodOptional<ZodBoolean>;
    startupTimeoutMs: ZodOptional<ZodNumber>;
    receiveMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"on-start">, ZodLiteral<"manual">]>>;
    ignoreAttachments: ZodOptional<ZodBoolean>;
    ignoreStories: ZodOptional<ZodBoolean>;
    sendReadReceipts: ZodOptional<ZodBoolean>;
    aliases: ZodOptional<ZodRecord<ZodString, ZodString>>;
    groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      ingest: ZodOptional<ZodBoolean>;
    }, $strict>>>>;
    replyToModeByChatType: ZodOptional<ZodObject<{
      direct: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
      group: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    }, $strict>>;
    name: ZodOptional<ZodString>;
    replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
    heartbeat: ZodOptional<ZodObject<{
      showOk: ZodOptional<ZodBoolean>;
      showAlerts: ZodOptional<ZodBoolean>;
      useIndicator: ZodOptional<ZodBoolean>;
    }, $strict>>;
    enabled: ZodOptional<ZodBoolean>;
    capabilities: ZodOptional<ZodArray<ZodString>>;
    groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    markdown: ZodOptional<ZodObject<{
      tables: ZodOptional<ZodEnum<{
        code: "code";
        off: "off";
        block: "block";
        bullets: "bullets";
      }>>;
    }, $strict>>;
    configWrites: ZodOptional<ZodBoolean>;
    dmPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    defaultTo: ZodOptional<ZodString>;
    groupPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>>>;
    contextVisibility: ZodOptional<ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: ZodOptional<ZodNumber>;
    dmHistoryLimit: ZodOptional<ZodNumber>;
    dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      historyLimit: ZodOptional<ZodNumber>;
    }, $strict>>>>;
    textChunkLimit: ZodOptional<ZodNumber>;
    streaming: ZodOptional<ZodObject<{
      chunkMode: ZodOptional<ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      block: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        coalesce: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          idleMs: ZodOptional<ZodNumber>;
        }, $strict>>;
      }, $strict>>;
    }, $strict>>;
    healthMonitor: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    responsePrefix: ZodOptional<ZodString>;
    mediaMaxMb: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  defaultAccount: ZodOptional<ZodString>;
}, $strict>;
declare const IMessageConfigSchema: ZodObject<{
  coalesceSameSenderDms: ZodOptional<ZodBoolean>;
  catchup: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    maxAgeMinutes: ZodOptional<ZodNumber>;
    perRunLimit: ZodOptional<ZodNumber>;
    firstRunLookbackMinutes: ZodOptional<ZodNumber>;
    maxFailureRetries: ZodOptional<ZodNumber>;
  }, $strict>>;
  groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    [x: string]: $ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>;
    requireMention: ZodOptional<ZodBoolean>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    systemPrompt: ZodOptional<ZodString>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
  }, $strict>>>>;
  ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
  reactionNotifications?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  cliPath: ZodOptional<ZodString>;
  dbPath: ZodOptional<ZodString>;
  remoteHost: ZodOptional<ZodString>;
  actions: ZodOptional<ZodObject<{
    reactions: ZodOptional<ZodBoolean>;
    edit: ZodOptional<ZodBoolean>;
    unsend: ZodOptional<ZodBoolean>;
    reply: ZodOptional<ZodBoolean>;
    sendWithEffect: ZodOptional<ZodBoolean>;
    renameGroup: ZodOptional<ZodBoolean>;
    setGroupIcon: ZodOptional<ZodBoolean>;
    addParticipant: ZodOptional<ZodBoolean>;
    removeParticipant: ZodOptional<ZodBoolean>;
    leaveGroup: ZodOptional<ZodBoolean>;
    sendAttachment: ZodOptional<ZodBoolean>;
    polls: ZodOptional<ZodBoolean>;
  }, $strict>>;
  service: ZodOptional<ZodUnion<readonly [ZodLiteral<"imessage">, ZodLiteral<"sms">, ZodLiteral<"auto">]>>;
  sendTransport: ZodOptional<ZodEnum<{
    auto: "auto";
    bridge: "bridge";
    applescript: "applescript";
  }>>;
  region: ZodOptional<ZodString>;
  includeAttachments: ZodOptional<ZodBoolean>;
  attachmentRoots: ZodOptional<ZodArray<ZodString>>;
  remoteAttachmentRoots: ZodOptional<ZodArray<ZodString>>;
  probeTimeoutMs: ZodOptional<ZodNumber>;
  sendReadReceipts: ZodOptional<ZodBoolean>;
  name: ZodOptional<ZodString>;
  heartbeat: ZodOptional<ZodObject<{
    showOk: ZodOptional<ZodBoolean>;
    showAlerts: ZodOptional<ZodBoolean>;
    useIndicator: ZodOptional<ZodBoolean>;
  }, $strict>>;
  enabled: ZodOptional<ZodBoolean>;
  capabilities: ZodOptional<ZodArray<ZodString>>;
  groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  markdown: ZodOptional<ZodObject<{
    tables: ZodOptional<ZodEnum<{
      code: "code";
      off: "off";
      block: "block";
      bullets: "bullets";
    }>>;
  }, $strict>>;
  configWrites: ZodOptional<ZodBoolean>;
  dmPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  defaultTo: ZodOptional<ZodString>;
  groupPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>>>;
  contextVisibility: ZodOptional<ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    historyLimit: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  textChunkLimit: ZodOptional<ZodNumber>;
  streaming: ZodOptional<ZodObject<{
    chunkMode: ZodOptional<ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      coalesce: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        idleMs: ZodOptional<ZodNumber>;
      }, $strict>>;
    }, $strict>>;
  }, $strict>>;
  healthMonitor: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    coalesceSameSenderDms: ZodOptional<ZodBoolean>;
    catchup: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      maxAgeMinutes: ZodOptional<ZodNumber>;
      perRunLimit: ZodOptional<ZodNumber>;
      firstRunLookbackMinutes: ZodOptional<ZodNumber>;
      maxFailureRetries: ZodOptional<ZodNumber>;
    }, $strict>>;
    groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      [x: string]: $ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>;
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      systemPrompt: ZodOptional<ZodString>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
    }, $strict>>>>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    cliPath: ZodOptional<ZodString>;
    dbPath: ZodOptional<ZodString>;
    remoteHost: ZodOptional<ZodString>;
    actions: ZodOptional<ZodObject<{
      reactions: ZodOptional<ZodBoolean>;
      edit: ZodOptional<ZodBoolean>;
      unsend: ZodOptional<ZodBoolean>;
      reply: ZodOptional<ZodBoolean>;
      sendWithEffect: ZodOptional<ZodBoolean>;
      renameGroup: ZodOptional<ZodBoolean>;
      setGroupIcon: ZodOptional<ZodBoolean>;
      addParticipant: ZodOptional<ZodBoolean>;
      removeParticipant: ZodOptional<ZodBoolean>;
      leaveGroup: ZodOptional<ZodBoolean>;
      sendAttachment: ZodOptional<ZodBoolean>;
      polls: ZodOptional<ZodBoolean>;
    }, $strict>>;
    service: ZodOptional<ZodUnion<readonly [ZodLiteral<"imessage">, ZodLiteral<"sms">, ZodLiteral<"auto">]>>;
    sendTransport: ZodOptional<ZodEnum<{
      auto: "auto";
      bridge: "bridge";
      applescript: "applescript";
    }>>;
    region: ZodOptional<ZodString>;
    includeAttachments: ZodOptional<ZodBoolean>;
    attachmentRoots: ZodOptional<ZodArray<ZodString>>;
    remoteAttachmentRoots: ZodOptional<ZodArray<ZodString>>;
    probeTimeoutMs: ZodOptional<ZodNumber>;
    sendReadReceipts: ZodOptional<ZodBoolean>;
    name: ZodOptional<ZodString>;
    heartbeat: ZodOptional<ZodObject<{
      showOk: ZodOptional<ZodBoolean>;
      showAlerts: ZodOptional<ZodBoolean>;
      useIndicator: ZodOptional<ZodBoolean>;
    }, $strict>>;
    enabled: ZodOptional<ZodBoolean>;
    capabilities: ZodOptional<ZodArray<ZodString>>;
    groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    markdown: ZodOptional<ZodObject<{
      tables: ZodOptional<ZodEnum<{
        code: "code";
        off: "off";
        block: "block";
        bullets: "bullets";
      }>>;
    }, $strict>>;
    configWrites: ZodOptional<ZodBoolean>;
    dmPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    defaultTo: ZodOptional<ZodString>;
    groupPolicy: ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>> | ZodDefault<ZodOptional<ZodEnum<{
      open: "open";
      disabled: "disabled";
      allowlist: "allowlist";
    }>>>;
    contextVisibility: ZodOptional<ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: ZodOptional<ZodNumber>;
    dmHistoryLimit: ZodOptional<ZodNumber>;
    dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      historyLimit: ZodOptional<ZodNumber>;
    }, $strict>>>>;
    textChunkLimit: ZodOptional<ZodNumber>;
    streaming: ZodOptional<ZodObject<{
      chunkMode: ZodOptional<ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      block: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        coalesce: ZodOptional<ZodObject<{
          minChars: ZodOptional<ZodNumber>;
          maxChars: ZodOptional<ZodNumber>;
          idleMs: ZodOptional<ZodNumber>;
        }, $strict>>;
      }, $strict>>;
    }, $strict>>;
    healthMonitor: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    responsePrefix: ZodOptional<ZodString>;
    mediaMaxMb: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  defaultAccount: ZodOptional<ZodString>;
}, $strict>;
declare const MSTeamsConfigSchema: ZodObject<{
  dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
  appId: ZodOptional<ZodString>;
  appPassword: ZodOptional<ZodUnion<readonly [ZodString, ZodDiscriminatedUnion<[ZodObject<{
    source: ZodLiteral<"env">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"file">;
    provider: ZodString;
    id: ZodString;
  }, $strict>, ZodObject<{
    source: ZodLiteral<"exec">;
    provider: ZodString;
    id: ZodString;
  }, $strict>], "source">]>>;
  tenantId: ZodOptional<ZodString>;
  cloud: ZodOptional<ZodEnum<{
    Public: "Public";
    USGov: "USGov";
    USGovDoD: "USGovDoD";
    China: "China";
  }>>;
  serviceUrl: ZodOptional<ZodString>;
  authType: ZodOptional<ZodEnum<{
    secret: "secret";
    federated: "federated";
  }>>;
  certificatePath: ZodOptional<ZodString>;
  certificateThumbprint: ZodOptional<ZodString>;
  useManagedIdentity: ZodOptional<ZodBoolean>;
  managedIdentityClientId: ZodOptional<ZodString>;
  webhook: ZodOptional<ZodObject<{
    port: ZodOptional<ZodNumber>;
    path: ZodOptional<ZodString>;
  }, $strict>>;
  typingIndicator: ZodOptional<ZodBoolean>;
  mediaAllowHosts: ZodOptional<ZodArray<ZodString>>;
  mediaAuthAllowHosts: ZodOptional<ZodArray<ZodString>>;
  graphMediaFallback: ZodOptional<ZodBoolean>;
  requireMention: ZodOptional<ZodBoolean>;
  replyStyle: ZodOptional<ZodEnum<{
    thread: "thread";
    "top-level": "top-level";
  }>>;
  teams: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    requireMention: ZodOptional<ZodBoolean>;
    tools: ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>;
    toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      allow: ZodOptional<ZodArray<ZodString>>;
      alsoAllow: ZodOptional<ZodArray<ZodString>>;
      deny: ZodOptional<ZodArray<ZodString>>;
    }, $strict>>>>;
    replyStyle: ZodOptional<ZodEnum<{
      thread: "thread";
      "top-level": "top-level";
    }>>;
    channels: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      requireMention: ZodOptional<ZodBoolean>;
      tools: ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>;
      toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
        allow: ZodOptional<ZodArray<ZodString>>;
        alsoAllow: ZodOptional<ZodArray<ZodString>>;
        deny: ZodOptional<ZodArray<ZodString>>;
      }, $strict>>>>;
      replyStyle: ZodOptional<ZodEnum<{
        thread: "thread";
        "top-level": "top-level";
      }>>;
    }, $strict>>>>;
  }, $strict>>>>;
  sharePointSiteId: ZodOptional<ZodString>;
  welcomeCard: ZodOptional<ZodBoolean>;
  promptStarters: ZodOptional<ZodArray<ZodString>>;
  groupWelcomeCard: ZodOptional<ZodBoolean>;
  feedbackEnabled: ZodOptional<ZodBoolean>;
  feedbackReflection: ZodOptional<ZodBoolean>;
  feedbackReflectionCooldownMs: ZodOptional<ZodNumber>;
  delegatedAuth: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    scopes: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>;
  sso: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    connectionName: ZodOptional<ZodString>;
  }, $strict>>;
  heartbeat: ZodOptional<ZodObject<{
    showOk: ZodOptional<ZodBoolean>;
    showAlerts: ZodOptional<ZodBoolean>;
    useIndicator: ZodOptional<ZodBoolean>;
  }, $strict>>;
  enabled: ZodOptional<ZodBoolean>;
  capabilities: ZodOptional<ZodArray<ZodString>>;
  groupAllowFrom: ZodOptional<ZodArray<ZodString>>;
  markdown: ZodOptional<ZodObject<{
    tables: ZodOptional<ZodEnum<{
      code: "code";
      off: "off";
      block: "block";
      bullets: "bullets";
    }>>;
  }, $strict>>;
  configWrites: ZodOptional<ZodBoolean>;
  dmPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: ZodOptional<ZodArray<ZodString>>;
  defaultTo: ZodOptional<ZodString>;
  groupPolicy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>> | ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
  }>>>;
  contextVisibility: ZodOptional<ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  dms: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    historyLimit: ZodOptional<ZodNumber>;
  }, $strict>>>>;
  textChunkLimit: ZodOptional<ZodNumber>;
  streaming: ZodOptional<ZodObject<{
    mode: ZodOptional<ZodEnum<{
      off: "off";
      progress: "progress";
      block: "block";
      partial: "partial";
    }>>;
    chunkMode: ZodOptional<ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    preview: ZodOptional<ZodObject<{
      chunk: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        breakPreference: ZodOptional<ZodUnion<readonly [ZodLiteral<"paragraph">, ZodLiteral<"newline">, ZodLiteral<"sentence">]>>;
      }, $strict>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
    }, $strict>>;
    progress: ZodOptional<ZodObject<{
      label: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
      labels: ZodOptional<ZodArray<ZodString>>;
      maxLines: ZodOptional<ZodNumber>;
      maxLineChars: ZodOptional<ZodNumber>;
      render: ZodOptional<ZodEnum<{
        text: "text";
        rich: "rich";
      }>>;
      toolProgress: ZodOptional<ZodBoolean>;
      commandText: ZodOptional<ZodEnum<{
        status: "status";
        raw: "raw";
      }>>;
      commentary: ZodOptional<ZodBoolean>;
      narration: ZodOptional<ZodBoolean>;
    }, $strict>>;
    block: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      coalesce: ZodOptional<ZodObject<{
        minChars: ZodOptional<ZodNumber>;
        maxChars: ZodOptional<ZodNumber>;
        idleMs: ZodOptional<ZodNumber>;
      }, $strict>>;
    }, $strict>>;
  }, $strict>>;
  healthMonitor: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
}, $strict>;
//#endregion
export { SlackConfigSchema as a, SignalConfigSchema as i, IMessageConfigSchema as n, TelegramConfigSchema as o, MSTeamsConfigSchema as r, DiscordConfigSchema as t };