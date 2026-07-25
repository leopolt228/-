import { B as ZodLiteral, C as ZodEnum, Q as ZodOptional, Qi as $ZodTypeInternals, Y as ZodNumber, Z as ZodObject, Zi as $ZodType, bt as ZodUnion, c as ZodBoolean, it as ZodRecord, mt as ZodType, r as ZodArray, st as ZodString, ta as $strict, v as ZodDefault, xt as ZodUnknown, y as ZodDiscriminatedUnion } from "./schemas-CL7kuExa.js";
//#region src/config/zod-schema.providers-googlechat.d.ts
declare const GoogleChatConfigSchema: ZodObject<{
  allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
  botLoopProtection: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    maxEventsPerWindow: ZodOptional<ZodNumber>;
    windowSeconds: ZodOptional<ZodNumber>;
    cooldownSeconds: ZodOptional<ZodNumber>;
  }, $strict>>;
  dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
  requireMention: ZodOptional<ZodBoolean>;
  groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
    requireMention: ZodOptional<ZodBoolean>;
    botLoopProtection: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      maxEventsPerWindow: ZodOptional<ZodNumber>;
      windowSeconds: ZodOptional<ZodNumber>;
      cooldownSeconds: ZodOptional<ZodNumber>;
    }, $strict>>;
    users: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    systemPrompt: ZodOptional<ZodString>;
  }, $strict>>>>;
  serviceAccount: ZodOptional<ZodUnion<readonly [ZodString, ZodRecord<ZodString, ZodUnknown>, ZodDiscriminatedUnion<[ZodObject<{
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
  serviceAccountRef: ZodOptional<ZodDiscriminatedUnion<[ZodObject<{
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
  }, $strict>], "source">>;
  serviceAccountFile: ZodOptional<ZodString>;
  audienceType: ZodOptional<ZodEnum<{
    "app-url": "app-url";
    "project-number": "project-number";
  }>>;
  audience: ZodOptional<ZodString>;
  appPrincipal: ZodOptional<ZodString>;
  webhookPath: ZodOptional<ZodString>;
  webhookUrl: ZodOptional<ZodString>;
  botUser: ZodOptional<ZodString>;
  dm: ZodOptional<ZodObject<{
    enabled: ZodOptional<ZodBoolean>;
  }, $strict>>;
  typingIndicator: ZodOptional<ZodEnum<{
    message: "message";
    none: "none";
    reaction: "reaction";
  }>>;
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
  dmPolicy: ZodDefault<ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    allowBots: ZodOptional<ZodBoolean> | ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"mentions">]>>;
    botLoopProtection: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      maxEventsPerWindow: ZodOptional<ZodNumber>;
      windowSeconds: ZodOptional<ZodNumber>;
      cooldownSeconds: ZodOptional<ZodNumber>;
    }, $strict>>;
    dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
    requireMention: ZodOptional<ZodBoolean>;
    groups: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
      requireMention: ZodOptional<ZodBoolean>;
      botLoopProtection: ZodOptional<ZodObject<{
        enabled: ZodOptional<ZodBoolean>;
        maxEventsPerWindow: ZodOptional<ZodNumber>;
        windowSeconds: ZodOptional<ZodNumber>;
        cooldownSeconds: ZodOptional<ZodNumber>;
      }, $strict>>;
      users: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
      systemPrompt: ZodOptional<ZodString>;
    }, $strict>>>>;
    serviceAccount: ZodOptional<ZodUnion<readonly [ZodString, ZodRecord<ZodString, ZodUnknown>, ZodDiscriminatedUnion<[ZodObject<{
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
    serviceAccountRef: ZodOptional<ZodDiscriminatedUnion<[ZodObject<{
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
    }, $strict>], "source">>;
    serviceAccountFile: ZodOptional<ZodString>;
    audienceType: ZodOptional<ZodEnum<{
      "app-url": "app-url";
      "project-number": "project-number";
    }>>;
    audience: ZodOptional<ZodString>;
    appPrincipal: ZodOptional<ZodString>;
    webhookPath: ZodOptional<ZodString>;
    webhookUrl: ZodOptional<ZodString>;
    botUser: ZodOptional<ZodString>;
    dm: ZodOptional<ZodObject<{
      enabled: ZodOptional<ZodBoolean>;
    }, $strict>>;
    typingIndicator: ZodOptional<ZodEnum<{
      message: "message";
      none: "none";
      reaction: "reaction";
    }>>;
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
//#endregion
//#region src/config/zod-schema.providers-whatsapp.d.ts
declare const WhatsAppConfigSchema: ZodObject<{
  accounts: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    name: ZodOptional<ZodString>;
    authDir: ZodOptional<ZodString>;
    mediaMaxMb: ZodOptional<ZodNumber>;
    debounceMs: ZodOptional<ZodNumber> | ZodDefault<ZodOptional<ZodNumber>>;
    pluginHooks: ZodOptional<ZodObject<{
      messageReceived: ZodOptional<ZodBoolean>;
    }, $strict>>;
    ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
    reactionNotifications?: ZodOptional<ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    sendReadReceipts: ZodOptional<ZodBoolean>;
    messagePrefix: ZodOptional<ZodString>;
    selfChatMode: ZodOptional<ZodBoolean>;
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
    direct: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
      systemPrompt: ZodOptional<ZodString>;
    }, $strict>>>>;
    replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
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
  }, $strict>>>>;
  defaultAccount: ZodOptional<ZodString>;
  mediaMaxMb: ZodDefault<ZodOptional<ZodNumber>>;
  actions: ZodOptional<ZodObject<{
    reactions: ZodOptional<ZodBoolean>;
    sendMessage: ZodOptional<ZodBoolean>;
    polls: ZodOptional<ZodBoolean>;
    calls: ZodOptional<ZodBoolean>;
  }, $strict>>;
  debounceMs: ZodOptional<ZodNumber> | ZodDefault<ZodOptional<ZodNumber>>;
  pluginHooks: ZodOptional<ZodObject<{
    messageReceived: ZodOptional<ZodBoolean>;
  }, $strict>>;
  ackReaction?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>> | undefined;
  reactionNotifications?: ZodOptional<ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  sendReadReceipts: ZodOptional<ZodBoolean>;
  messagePrefix: ZodOptional<ZodString>;
  selfChatMode: ZodOptional<ZodBoolean>;
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
  direct: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    systemPrompt: ZodOptional<ZodString>;
  }, $strict>>>>;
  replyToMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]>>;
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
}, $strict>;
//#endregion
export { GoogleChatConfigSchema as n, WhatsAppConfigSchema as t };