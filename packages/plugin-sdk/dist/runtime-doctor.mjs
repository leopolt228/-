// packages/plugin-sdk/src/runtime-doctor.ts
import fs from "node:fs/promises";
import path from "node:path";
import { existsSync as existsSync4 } from "node:fs";
import { InsertQueryNode, Kysely as KyselyInstance, SqliteDialect } from "kysely";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import fs3 from "node:fs";
import JSON5 from "json5";
import path2 from "node:path";
import fs2 from "node:fs";
import os2 from "node:os";
import path4 from "node:path";
import os from "node:os";
import path3 from "node:path";
import { Chalk } from "chalk";
import fs5 from "node:fs";
import os3 from "node:os";
import path6 from "node:path";
import { Logger as TsLogger } from "tslog";
import { AsyncLocalStorage } from "node:async_hooks";
import { configureFsSafePython } from "@openclaw/fs-safe/config";
import {
  appendRegularFileSync
} from "@openclaw/fs-safe/advanced";
import fs4 from "node:fs";
import { tmpdir as getOsTmpDir } from "node:os";
import path5 from "node:path";
import path7 from "node:path";
import fs6 from "node:fs";
import path8 from "node:path";
import { createRequire as createRequire2 } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import path11 from "node:path";
import { randomUUID as randomUUID2 } from "node:crypto";
import { chmodSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path9 from "node:path";
import os4 from "node:os";
import path10 from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import path12 from "node:path";
import { existsSync as existsSync2, mkdirSync as mkdirSync2 } from "node:fs";
import path13 from "node:path";
import path14 from "node:path";
import { createHash } from "node:crypto";
import { existsSync as existsSync3 } from "node:fs";
import { realpathSync } from "node:fs";
import path16 from "node:path";
import "yaml";
import chalk, { Chalk as Chalk2 } from "chalk";
import "execa";
import "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/json";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import fs7 from "node:fs";
import os5 from "node:os";
import path15 from "node:path";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
import "@openclaw/fs-safe/advanced";
import fs8 from "node:fs/promises";
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}
var DEFAULT_TRUTHY = ["true", "1", "yes", "on"];
var DEFAULT_FALSY = ["false", "0", "no", "off"];
var DEFAULT_TRUTHY_SET = new Set(DEFAULT_TRUTHY);
var DEFAULT_FALSY_SET = new Set(DEFAULT_FALSY);
function asBoolean(value) {
  return typeof value === "boolean" ? value : void 0;
}
function asObjectRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value;
}
function isDangerousNameMatchingEnabled(config) {
  return config?.dangerouslyAllowNameMatching === true;
}
function collectProviderDangerousNameMatchingScopes(cfg, provider) {
  const scopes = [];
  const channels = asObjectRecord(cfg.channels);
  if (!channels) {
    return scopes;
  }
  const providerCfg = asObjectRecord(channels[provider]);
  if (!providerCfg) {
    return scopes;
  }
  const providerPrefix = `channels.${provider}`;
  const providerDangerousFlagPath = `${providerPrefix}.dangerouslyAllowNameMatching`;
  const providerDangerousNameMatchingEnabled = isDangerousNameMatchingEnabled(providerCfg);
  scopes.push({
    prefix: providerPrefix,
    account: providerCfg,
    dangerousNameMatchingEnabled: providerDangerousNameMatchingEnabled,
    dangerousFlagPath: providerDangerousFlagPath
  });
  const accounts = asObjectRecord(providerCfg.accounts);
  if (!accounts) {
    return scopes;
  }
  for (const key of Object.keys(accounts)) {
    const account = asObjectRecord(accounts[key]);
    if (!account) {
      continue;
    }
    const accountPrefix = `${providerPrefix}.accounts.${key}`;
    const accountDangerousNameMatching = asBoolean(account.dangerouslyAllowNameMatching);
    scopes.push({
      prefix: accountPrefix,
      account,
      // Account config can override the provider opt-in; nullish means inherit provider state.
      dangerousNameMatchingEnabled: accountDangerousNameMatching ?? providerDangerousNameMatchingEnabled,
      dangerousFlagPath: accountDangerousNameMatching == null ? providerDangerousFlagPath : `${accountPrefix}.dangerouslyAllowNameMatching`
    });
  }
  return scopes;
}
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
function asObjectRecord2(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function cloneDm(entry) {
  const dm = asObjectRecord2(entry.dm);
  return dm ? { ...dm } : null;
}
function allowFromListsMatch(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return false;
  }
  const normalizedLeft = normalizeStringEntries(left);
  const normalizedRight = normalizeStringEntries(right);
  if (normalizedLeft.length !== normalizedRight.length) {
    return false;
  }
  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}
function normalizeLegacyDmAliases(params) {
  let changed = false;
  let updated = params.entry;
  const rawDm = updated.dm;
  const dm = cloneDm(updated);
  let dmChanged = false;
  const topDmPolicy = updated.dmPolicy;
  const legacyDmPolicy = dm?.policy;
  if (topDmPolicy === void 0 && legacyDmPolicy !== void 0) {
    updated = { ...updated, dmPolicy: legacyDmPolicy };
    changed = true;
    if (dm) {
      delete dm.policy;
      dmChanged = true;
    }
    params.changes.push(`Moved ${params.pathPrefix}.dm.policy \u2192 ${params.pathPrefix}.dmPolicy.`);
  } else if (topDmPolicy !== void 0 && legacyDmPolicy !== void 0 && topDmPolicy === legacyDmPolicy) {
    if (dm) {
      delete dm.policy;
      dmChanged = true;
      params.changes.push(`Removed ${params.pathPrefix}.dm.policy (dmPolicy already set).`);
    }
  }
  if (params.promoteAllowFrom !== false) {
    const topAllowFrom = updated.allowFrom;
    const legacyAllowFrom = dm?.allowFrom;
    if (topAllowFrom === void 0 && legacyAllowFrom !== void 0) {
      updated = { ...updated, allowFrom: legacyAllowFrom };
      changed = true;
      if (dm) {
        delete dm.allowFrom;
        dmChanged = true;
      }
      params.changes.push(
        `Moved ${params.pathPrefix}.dm.allowFrom \u2192 ${params.pathPrefix}.allowFrom.`
      );
    } else if (topAllowFrom !== void 0 && legacyAllowFrom !== void 0 && allowFromListsMatch(topAllowFrom, legacyAllowFrom)) {
      if (dm) {
        delete dm.allowFrom;
        dmChanged = true;
        params.changes.push(`Removed ${params.pathPrefix}.dm.allowFrom (allowFrom already set).`);
      }
    }
  }
  if (dm && asObjectRecord2(rawDm) && dmChanged) {
    const keys = Object.keys(dm);
    if (keys.length === 0) {
      if (updated.dm !== void 0) {
        const { dm: _ignored, ...rest } = updated;
        updated = rest;
        changed = true;
        params.changes.push(`Removed empty ${params.pathPrefix}.dm after migration.`);
      }
    } else {
      updated = { ...updated, dm };
      changed = true;
    }
  }
  return { entry: updated, changed };
}
function asObjectRecord3(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function parseAliasStreamingMode(value) {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress" ? normalized : null;
}
function resolveLegacyAliasStreamingMode(entry, defaultMode) {
  const nestedMode = asObjectRecord3(entry.streaming)?.mode;
  const parsed = parseAliasStreamingMode(nestedMode ?? entry.streaming) ?? parseAliasStreamingMode(entry.streamMode);
  if (parsed) {
    return parsed;
  }
  if (typeof entry.streaming === "boolean") {
    return entry.streaming ? "partial" : "off";
  }
  return defaultMode;
}
function hasLegacyAccountStreamingAliases(value, match) {
  const accounts = asObjectRecord3(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((account) => match(account));
}
function ensureNestedRecord(owner, key) {
  const existing = asObjectRecord3(owner[key]);
  if (existing) {
    return { ...existing };
  }
  return {};
}
function normalizeLegacyStreamingAliases(params) {
  const beforeStreaming = params.entry.streaming;
  const hadLegacyStreamMode = params.entry.streamMode !== void 0;
  const hasLegacyFlatFields = params.entry.chunkMode !== void 0 || params.entry.blockStreaming !== void 0 || params.entry.blockStreamingCoalesce !== void 0 || params.includePreviewChunk === true && params.entry.draftChunk !== void 0 || params.entry.nativeStreaming !== void 0;
  const shouldNormalize = hadLegacyStreamMode || typeof beforeStreaming === "boolean" || typeof beforeStreaming === "string" || hasLegacyFlatFields;
  if (!shouldNormalize) {
    return { entry: params.entry, changed: false };
  }
  const updated = { ...params.entry };
  let changed = false;
  const streaming = ensureNestedRecord(updated, "streaming");
  const block = ensureNestedRecord(streaming, "block");
  const preview = ensureNestedRecord(streaming, "preview");
  let movedStreamMode = false;
  if ((hadLegacyStreamMode || typeof beforeStreaming === "boolean" || typeof beforeStreaming === "string") && streaming.mode === void 0) {
    streaming.mode = params.resolvedMode;
    if (hadLegacyStreamMode) {
      movedStreamMode = true;
      params.changes.push(
        `Moved ${params.pathPrefix}.streamMode \u2192 ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`
      );
    } else if (typeof beforeStreaming === "boolean") {
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (boolean) \u2192 ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`
      );
    } else if (typeof beforeStreaming === "string") {
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (scalar) \u2192 ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`
      );
    }
    changed = true;
  }
  if (hadLegacyStreamMode) {
    if (!movedStreamMode) {
      params.changes.push(
        `Removed ${params.pathPrefix}.streamMode (${params.pathPrefix}.streaming.mode already set).`
      );
    }
    delete updated.streamMode;
    changed = true;
  }
  const moveOrRemoveAlias = (flatKey, target, slot, nestedPath) => {
    if (updated[flatKey] === void 0) {
      return;
    }
    const nested = `${params.pathPrefix}.streaming.${nestedPath}`;
    if (target[slot] === void 0) {
      target[slot] = updated[flatKey];
      params.changes.push(`Moved ${params.pathPrefix}.${flatKey} \u2192 ${nested}.`);
    } else {
      params.changes.push(`Removed ${params.pathPrefix}.${flatKey} (${nested} already set).`);
    }
    delete updated[flatKey];
    changed = true;
  };
  moveOrRemoveAlias("chunkMode", streaming, "chunkMode", "chunkMode");
  moveOrRemoveAlias("blockStreaming", block, "enabled", "block.enabled");
  if (params.includePreviewChunk === true) {
    moveOrRemoveAlias("draftChunk", preview, "chunk", "preview.chunk");
  }
  moveOrRemoveAlias("blockStreamingCoalesce", block, "coalesce", "block.coalesce");
  if (updated.nativeStreaming !== void 0 && params.resolvedNativeTransport !== void 0) {
    if (streaming.nativeTransport === void 0) {
      streaming.nativeTransport = params.resolvedNativeTransport;
      params.changes.push(
        `Moved ${params.pathPrefix}.nativeStreaming \u2192 ${params.pathPrefix}.streaming.nativeTransport.`
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.nativeStreaming (${params.pathPrefix}.streaming.nativeTransport already set).`
      );
    }
    delete updated.nativeStreaming;
    changed = true;
  } else if (typeof beforeStreaming === "boolean" && streaming.nativeTransport === void 0 && params.resolvedNativeTransport !== void 0) {
    streaming.nativeTransport = params.resolvedNativeTransport;
    params.changes.push(
      `Moved ${params.pathPrefix}.streaming (boolean) \u2192 ${params.pathPrefix}.streaming.nativeTransport.`
    );
    changed = true;
  }
  if (changed && beforeStreaming === void 0 && streaming.mode === void 0 && params.aliasOnlyMode !== void 0) {
    streaming.mode = params.aliasOnlyMode;
    params.changes.push(
      `Set ${params.pathPrefix}.streaming.mode (${params.aliasOnlyMode}) to keep the previous default while migrating flat streaming keys.`
    );
    changed = true;
  }
  if (Object.keys(preview).length > 0) {
    streaming.preview = preview;
  }
  if (Object.keys(block).length > 0) {
    streaming.block = block;
  }
  updated.streaming = streaming;
  return { entry: updated, changed };
}
function buildRootFlatDeliverySeed(entry, includePreviewChunk) {
  const seed = {};
  if (entry.chunkMode !== void 0) {
    seed.chunkMode = entry.chunkMode;
  }
  const block = {};
  if (entry.blockStreaming !== void 0) {
    block.enabled = entry.blockStreaming;
  }
  if (entry.blockStreamingCoalesce !== void 0) {
    block.coalesce = entry.blockStreamingCoalesce;
  }
  if (Object.keys(block).length > 0) {
    seed.block = block;
  }
  if (includePreviewChunk === true && entry.draftChunk !== void 0) {
    seed.preview = { chunk: entry.draftChunk };
  }
  return Object.keys(seed).length > 0 ? seed : null;
}
function seedMaterializedAccountStreaming(params) {
  const { created } = params;
  const rootNested = params.rootNestedBefore ?? {};
  const rootFlat = params.rootFlat ?? {};
  let seeded = fillMissingRecordFields(structuredClone(rootNested), created).value;
  seeded = fillMissingRecordFields(seeded, rootFlat).value;
  seeded = fillMissingRecordFields(seeded, params.rootAfter).value;
  if (created.chunkMode !== void 0) {
    seeded = { ...seeded, chunkMode: created.chunkMode };
  }
  const createdCoalesce = asObjectRecord3(asObjectRecord3(created.block)?.coalesce);
  if (createdCoalesce) {
    const rootCoalesce = asObjectRecord3(asObjectRecord3(rootNested.block)?.coalesce) ?? asObjectRecord3(asObjectRecord3(rootFlat.block)?.coalesce);
    seeded = {
      ...seeded,
      block: {
        ...asObjectRecord3(seeded.block),
        coalesce: { ...structuredClone(rootCoalesce ?? {}), ...structuredClone(createdCoalesce) }
      }
    };
  }
  const rootNestedPreviewChunk = asObjectRecord3(rootNested.preview)?.chunk;
  if (rootNestedPreviewChunk !== void 0 && asObjectRecord3(created.preview)?.chunk !== void 0) {
    seeded = {
      ...seeded,
      preview: {
        ...asObjectRecord3(seeded.preview),
        chunk: structuredClone(rootNestedPreviewChunk)
      }
    };
  }
  return seeded;
}
function fillMissingRecordFields(target, source) {
  let filled = false;
  const value = { ...target };
  for (const [key, sourceValue] of Object.entries(source)) {
    if (sourceValue === void 0) {
      continue;
    }
    const existing = value[key];
    if (existing === void 0) {
      value[key] = structuredClone(sourceValue);
      filled = true;
      continue;
    }
    const existingRecord = asObjectRecord3(existing);
    const sourceRecord = asObjectRecord3(sourceValue);
    if (!existingRecord || !sourceRecord) {
      continue;
    }
    const merged = fillMissingRecordFields(existingRecord, sourceRecord);
    if (merged.filled) {
      value[key] = merged.value;
      filled = true;
    }
  }
  return { value, filled };
}
function normalizeLegacyChannelAliases(params) {
  let updated = params.entry;
  let changed = false;
  const rootFlatDeliverySeed = params.seedAccountStreamingFromRoot === true ? buildRootFlatDeliverySeed(
    params.entry,
    params.resolveStreamingOptions(params.entry).includePreviewChunk
  ) : null;
  const rootNestedStreamingBefore = params.seedAccountStreamingFromRoot === true ? asObjectRecord3(params.entry.streaming) : null;
  if (params.normalizeDm === true) {
    const dm = normalizeLegacyDmAliases({
      entry: updated,
      pathPrefix: params.pathPrefix,
      changes: params.changes,
      promoteAllowFrom: params.rootDmPromoteAllowFrom
    });
    updated = dm.entry;
    changed = dm.changed;
  }
  const streaming = normalizeLegacyStreamingAliases({
    entry: updated,
    pathPrefix: params.pathPrefix,
    changes: params.changes,
    ...params.resolveStreamingOptions(updated)
  });
  updated = streaming.entry;
  changed = changed || streaming.changed;
  const rawAccounts = asObjectRecord3(updated.accounts);
  if (!rawAccounts) {
    return { entry: updated, changed };
  }
  const rootStreaming = asObjectRecord3(updated.streaming);
  let accountsChanged = false;
  const accounts = { ...rawAccounts };
  for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
    const account = asObjectRecord3(rawAccount);
    if (!account) {
      continue;
    }
    let accountEntry = account;
    let accountChanged = false;
    const accountPathPrefix = `${params.pathPrefix}.accounts.${accountId}`;
    if (params.normalizeAccountDm === true) {
      const accountDm = normalizeLegacyDmAliases({
        entry: accountEntry,
        pathPrefix: accountPathPrefix,
        changes: params.changes
      });
      accountEntry = accountDm.entry;
      accountChanged = accountDm.changed;
    }
    const accountStreamingOptions = { ...params.resolveStreamingOptions(accountEntry) };
    if (rootStreaming) {
      delete accountStreamingOptions.aliasOnlyMode;
    }
    const beforeAccountStreaming = accountEntry.streaming;
    const accountStreaming = normalizeLegacyStreamingAliases({
      entry: accountEntry,
      pathPrefix: accountPathPrefix,
      changes: params.changes,
      ...accountStreamingOptions
    });
    accountEntry = accountStreaming.entry;
    accountChanged = accountChanged || accountStreaming.changed;
    if (params.seedAccountStreamingFromRoot === true && accountStreaming.changed && beforeAccountStreaming === void 0 && rootStreaming) {
      const created = asObjectRecord3(accountEntry.streaming);
      if (created) {
        const seeded = seedMaterializedAccountStreaming({
          created,
          rootNestedBefore: rootNestedStreamingBefore,
          rootFlat: rootFlatDeliverySeed,
          rootAfter: rootStreaming
        });
        if (JSON.stringify(seeded) !== JSON.stringify(created)) {
          accountEntry = { ...accountEntry, streaming: seeded };
          params.changes.push(
            `Copied ${params.pathPrefix}.streaming into ${accountPathPrefix}.streaming to keep inherited settings while migrating flat streaming keys.`
          );
        }
      }
    } else if (rootFlatDeliverySeed && beforeAccountStreaming !== void 0) {
      const accountStreamingObject = asObjectRecord3(accountEntry.streaming);
      if (accountStreamingObject) {
        let seededAccount = accountStreamingObject;
        if (rootFlatDeliverySeed.chunkMode !== void 0 && seededAccount.chunkMode === void 0) {
          seededAccount = { ...seededAccount, chunkMode: rootFlatDeliverySeed.chunkMode };
        }
        const rootFlatBlock = asObjectRecord3(rootFlatDeliverySeed.block);
        const rootFlatBlockEnabled = rootFlatBlock?.enabled;
        if (rootFlatBlockEnabled !== void 0 && asObjectRecord3(seededAccount.block)?.enabled === void 0) {
          seededAccount = {
            ...seededAccount,
            block: {
              ...asObjectRecord3(seededAccount.block),
              enabled: rootFlatBlockEnabled
            }
          };
        }
        const rootFlatCoalesce = asObjectRecord3(rootFlatBlock?.coalesce);
        if (rootFlatCoalesce) {
          const accountCoalesce = asObjectRecord3(asObjectRecord3(seededAccount.block)?.coalesce);
          const mergedCoalesce = {
            ...structuredClone(rootFlatCoalesce),
            ...structuredClone(accountCoalesce ?? {})
          };
          if (JSON.stringify(mergedCoalesce) !== JSON.stringify(accountCoalesce ?? {})) {
            seededAccount = {
              ...seededAccount,
              block: {
                ...asObjectRecord3(seededAccount.block),
                coalesce: mergedCoalesce
              }
            };
          }
        }
        const rootFlatPreviewChunk = asObjectRecord3(rootFlatDeliverySeed.preview)?.chunk;
        if (rootFlatPreviewChunk !== void 0 && asObjectRecord3(seededAccount.preview)?.chunk === void 0) {
          seededAccount = {
            ...seededAccount,
            preview: {
              ...asObjectRecord3(seededAccount.preview),
              chunk: structuredClone(rootFlatPreviewChunk)
            }
          };
        }
        if (seededAccount !== accountStreamingObject) {
          accountEntry = { ...accountEntry, streaming: seededAccount };
          accountChanged = true;
          params.changes.push(
            `Copied flat ${params.pathPrefix} delivery keys into ${accountPathPrefix}.streaming to keep inherited settings while migrating flat streaming keys.`
          );
        }
      }
    }
    const accountExtra = params.normalizeAccountExtra?.({
      account: accountEntry,
      accountId,
      pathPrefix: accountPathPrefix,
      changes: params.changes
    });
    if (accountExtra) {
      accountEntry = accountExtra.entry;
      accountChanged = accountChanged || accountExtra.changed;
    }
    if (accountChanged) {
      accounts[accountId] = accountEntry;
      accountsChanged = true;
    }
  }
  if (accountsChanged) {
    updated = { ...updated, accounts };
    changed = true;
  }
  return { entry: updated, changed };
}
function hasLegacyStreamingAliases(value, options) {
  const entry = asObjectRecord3(value);
  if (!entry) {
    return false;
  }
  return entry.streamMode !== void 0 || typeof entry.streaming === "boolean" || typeof entry.streaming === "string" || entry.chunkMode !== void 0 || entry.blockStreaming !== void 0 || entry.blockStreamingCoalesce !== void 0 || options?.includePreviewChunk === true && entry.draftChunk !== void 0 || options?.includeNativeTransport === true && entry.nativeStreaming !== void 0;
}
function buildAliasRuleMessage(params) {
  const { streaming, prefix } = params;
  const native = streaming.resolveNativeTransport !== void 0;
  const flat = [
    ...streaming.deliveryOnly ? [] : ["streamMode", "streaming (scalar)"],
    "chunkMode",
    "blockStreaming",
    ...streaming.includePreviewChunk ? ["draftChunk"] : [],
    "blockStreamingCoalesce",
    ...native ? ["nativeStreaming"] : []
  ];
  const nested = [
    ...streaming.deliveryOnly ? [] : ["mode"],
    "chunkMode",
    ...streaming.includePreviewChunk ? ["preview.chunk"] : [],
    "block.enabled",
    "block.coalesce",
    ...native ? ["nativeTransport"] : []
  ];
  const prefixedCount = params.root && !streaming.deliveryOnly ? 2 : 1;
  const keys = flat.map((key, index) => index < prefixedCount ? `${prefix}.${key}` : key);
  const keyList = `${keys.slice(0, -1).join(", ")}, and ${keys.at(-1)}`;
  return `${keyList} are legacy; use ${prefix}.streaming.{${nested.join(",")}}. Run "openclaw doctor --fix".`;
}
function hasLegacyDmAliases(value) {
  const dm = asObjectRecord3(asObjectRecord3(value)?.dm);
  return dm !== null && (Object.hasOwn(dm, "policy") || Object.hasOwn(dm, "allowFrom"));
}
function defineChannelAliasMigration(spec) {
  const { streaming } = spec;
  const pathPrefix = `channels.${spec.channelId}`;
  const hasLegacyAliases = (value) => {
    if (streaming.deliveryOnly === true) {
      const entry = asObjectRecord3(value);
      return entry !== null && (entry.chunkMode !== void 0 || entry.blockStreaming !== void 0 || entry.blockStreamingCoalesce !== void 0);
    }
    return hasLegacyStreamingAliases(value, {
      includePreviewChunk: streaming.includePreviewChunk,
      includeNativeTransport: streaming.resolveNativeTransport !== void 0
    });
  };
  const resolveStreamingOptions = (entry) => ({
    resolvedMode: streaming.resolveMode?.(entry) ?? resolveLegacyAliasStreamingMode(entry, streaming.defaultMode),
    aliasOnlyMode: streaming.absentObjectDefault,
    includePreviewChunk: streaming.includePreviewChunk,
    resolvedNativeTransport: streaming.resolveNativeTransport?.(entry)
  });
  const normalizeChannelConfig = (params) => {
    const changes = params.changes ?? [];
    const channels = params.cfg.channels;
    const entry = asObjectRecord3(channels?.[spec.channelId]);
    if (!entry) {
      return { config: params.cfg, changes };
    }
    if (streaming.deliveryOnly === true && !hasLegacyAliases(entry) && !hasLegacyAccountStreamingAliases(entry.accounts, hasLegacyAliases) && !(spec.dm?.root && hasLegacyDmAliases(entry)) && !(spec.dm?.accounts && hasLegacyAccountStreamingAliases(entry.accounts, hasLegacyDmAliases))) {
      return { config: params.cfg, changes };
    }
    const result = normalizeLegacyChannelAliases({
      entry,
      pathPrefix,
      changes,
      normalizeDm: spec.dm?.root,
      rootDmPromoteAllowFrom: spec.dm?.rootPromoteAllowFrom,
      normalizeAccountDm: spec.dm?.accounts,
      seedAccountStreamingFromRoot: spec.accountStreamingReplacesRoot,
      resolveStreamingOptions,
      normalizeAccountExtra: spec.normalizeAccountExtra
    });
    if (!result.changed) {
      return { config: params.cfg, changes };
    }
    return {
      config: {
        ...params.cfg,
        channels: { ...channels, [spec.channelId]: result.entry }
      },
      changes
    };
  };
  const legacyConfigRules = [
    {
      path: ["channels", spec.channelId],
      message: buildAliasRuleMessage({ streaming, prefix: pathPrefix, root: true }),
      match: hasLegacyAliases
    },
    {
      path: ["channels", spec.channelId, "accounts"],
      message: buildAliasRuleMessage({
        streaming,
        prefix: `${pathPrefix}.accounts.<id>`,
        root: false
      }),
      match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyAliases)
    }
  ];
  if (spec.dm?.root) {
    legacyConfigRules.push({
      path: ["channels", spec.channelId],
      message: `${pathPrefix}.dm.policy and ${pathPrefix}.dm.allowFrom are legacy; use ${pathPrefix}.dmPolicy and ${pathPrefix}.allowFrom. Run "openclaw doctor --fix".`,
      match: hasLegacyDmAliases
    });
  }
  if (spec.dm?.accounts) {
    legacyConfigRules.push({
      path: ["channels", spec.channelId, "accounts"],
      message: `${pathPrefix}.accounts.<id>.dm.policy and dm.allowFrom are legacy; use ${pathPrefix}.accounts.<id>.dmPolicy and allowFrom. Run "openclaw doctor --fix".`,
      match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyDmAliases)
    });
  }
  return {
    legacyConfigRules,
    hasLegacyAliases,
    normalizeChannelConfig
  };
}
function resolvePluginInstallCandidatePaths(install) {
  if (!install || install.source !== "path") {
    return [];
  }
  return [install.sourcePath, install.installPath].map((value) => normalizeOptionalString(value) ?? "").filter(Boolean);
}
async function detectPluginInstallPathIssue(params) {
  const candidatePaths = resolvePluginInstallCandidatePaths(params.install);
  if (candidatePaths.length === 0) {
    return null;
  }
  for (const candidatePath of candidatePaths) {
    try {
      await fs.access(path.resolve(candidatePath));
      return {
        kind: "custom-path",
        pluginId: params.pluginId,
        path: candidatePath
      };
    } catch {
    }
  }
  return {
    kind: "missing-path",
    pluginId: params.pluginId,
    path: candidatePaths[0] ?? "(unknown)"
  };
}
function formatPluginInstallPathIssue(params) {
  const formatCommand = params.formatCommand ?? ((command) => command);
  if (params.issue.kind === "custom-path") {
    return [
      `${params.pluginLabel} is installed from a custom path: ${params.issue.path}`,
      `Main updates will not automatically replace that plugin with the repo's default ${params.pluginLabel} package.`,
      `Reinstall with "${formatCommand(params.defaultInstallCommand)}" when you want to return to the standard ${params.pluginLabel} plugin.`,
      ...params.repoInstallCommand ? [
        `If you are intentionally running from a repo checkout, reinstall that checkout explicitly with "${formatCommand(params.repoInstallCommand)}" after updates.`
      ] : []
    ];
  }
  return [
    `${params.pluginLabel} is installed from a custom path that no longer exists: ${params.issue.path}`,
    `Reinstall with "${formatCommand(params.defaultInstallCommand)}".`,
    ...params.repoInstallCommand ? [
      `If you are running from a repo checkout, you can also use "${formatCommand(params.repoInstallCommand)}".`
    ] : []
  ];
}
var kyselyByDatabase = /* @__PURE__ */ new WeakMap();
var compileOnlySqliteDialect = new SqliteDialect({
  // The lazy database factory leaves compilation usable while direct execution fails fast.
  database: async () => {
    throw new Error(
      "getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries."
    );
  }
});
function getNodeSqliteKysely(db) {
  const existing = kyselyByDatabase.get(db);
  if (existing) {
    return existing;
  }
  const kysely = new KyselyInstance({
    dialect: compileOnlySqliteDialect
  });
  kyselyByDatabase.set(db, kysely);
  return kysely;
}
function executeCompiledSqliteQuerySync(db, compiledQuery) {
  const statement = db.prepare(compiledQuery.sql);
  const parameters = compiledQuery.parameters;
  if (statement.columns().length > 0) {
    return { rows: statement.all(...parameters) };
  }
  const { changes, lastInsertRowid } = statement.run(...parameters);
  const result = {
    numAffectedRows: BigInt(changes),
    rows: []
  };
  if (InsertQueryNode.is(compiledQuery.query) && changes > 0) {
    return {
      ...result,
      insertId: BigInt(lastInsertRowid)
    };
  }
  return result;
}
function executeSqliteQuerySync(db, query) {
  return executeCompiledSqliteQuerySync(db, query.compile());
}
function executeSqliteQueryTakeFirstSync(db, query) {
  return executeSqliteQuerySync(db, query).rows[0];
}
function clearNodeSqliteKyselyCacheForDatabase(db) {
  kyselyByDatabase.delete(db);
}
function readProperty(value, key) {
  try {
    return value[key];
  } catch {
    return void 0;
  }
}
function formatStatusAndCode(value) {
  if ((typeof value !== "object" || value === null) && typeof value !== "function") {
    return void 0;
  }
  try {
    if (Object.keys(value).some((key) => key !== "status" && key !== "code")) {
      return void 0;
    }
  } catch {
  }
  const statusValue = readProperty(value, "status");
  const codeValue = readProperty(value, "code");
  if (statusValue === void 0 && codeValue === void 0) {
    return void 0;
  }
  const statusText = typeof statusValue === "string" || typeof statusValue === "number" ? String(statusValue) : "unknown";
  const codeText = typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "unknown";
  return `status=${statusText} code=${codeText}`;
}
function stringifyUnknown(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") {
    return String(value);
  }
  try {
    const json = JSON.stringify(value);
    if (json !== void 0) {
      return json;
    }
  } catch {
  }
  try {
    return Object.prototype.toString.call(value);
  } catch {
    return "Unknown error";
  }
}
function formatErrorMessage(value, options) {
  let formatted;
  if (value instanceof Error) {
    formatted = value.message || value.name || "Error";
    let cause = readProperty(value, "cause");
    const seen = /* @__PURE__ */ new Set([value]);
    const seenMessages = /* @__PURE__ */ new Set([formatted]);
    const appendCauseMessage = (message) => {
      if (!message || seenMessages.has(message)) {
        return;
      }
      formatted += ` | ${message}`;
      seenMessages.add(message);
    };
    while (cause && !seen.has(cause)) {
      seen.add(cause);
      if (cause instanceof Error) {
        appendCauseMessage(cause.message);
        const code = readProperty(cause, "code");
        if (typeof code === "string" || typeof code === "number") {
          appendCauseMessage(String(code));
        }
        cause = readProperty(cause, "cause");
      } else if (typeof cause === "string") {
        appendCauseMessage(cause);
        break;
      } else {
        appendCauseMessage(formatStatusAndCode(cause));
        break;
      }
    }
  } else {
    formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
  }
  return options.redact(formatted);
}
var HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
var HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
var HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
var HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
var HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
var HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
var HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
var HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
var HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
var CREDENTIAL_STYLE_HEADER_REDACT_PATTERN = String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
var STRUCTURED_AUTH_HEADER_RE = new RegExp(
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`,
  "giu"
);
var AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
var AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
var AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
function skipHorizontalWhitespace(value, start) {
  let cursor = start;
  while (value[cursor] === " " || value[cursor] === "	") {
    cursor += 1;
  }
  return cursor;
}
function readSerializedLineEnd(value, start) {
  let cursor = start;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  if (slashCount === 0) {
    return null;
  }
  if (value[cursor] === "n") {
    return cursor + 1;
  }
  if (value[cursor] !== "r") {
    return null;
  }
  cursor += 1;
  slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  return slashCount > 0 && value[cursor] === "n" ? cursor + 1 : null;
}
function readSerializedTabEnd(value, start) {
  let cursor = start;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  return slashCount > 0 && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
  let cursor = start;
  for (; ; ) {
    cursor = skipHorizontalWhitespace(value, cursor);
    const tabEnd = readSerializedTabEnd(value, cursor);
    if (tabEnd !== null) {
      cursor = tabEnd;
      continue;
    }
    const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
    if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) {
      return cursor;
    }
    cursor = lineEnd;
  }
}
function readAuthParamName(value, start) {
  const match = AUTH_PARAM_NAME_RE.exec(value.slice(start));
  return match ? { name: match[0].toLowerCase(), end: start + match[0].length } : null;
}
function isAuthHeaderStart(value, index) {
  const previous = value[index - 1];
  let serializedLineBoundary = false;
  if (previous === "n" || previous === "r") {
    let slashCursor = index - 2;
    let slashCount2 = 0;
    while (slashCount2 < 64 && value[slashCursor] === "\\") {
      slashCount2 += 1;
      slashCursor -= 1;
    }
    serializedLineBoundary = slashCount2 > 0;
  }
  if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) {
    return false;
  }
  const proxyName = "proxy-authorization";
  const directName = "authorization";
  const candidate = value.slice(index, index + proxyName.length).toLowerCase();
  const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
  if (!name) {
    return false;
  }
  let cursor = index + name.length;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  if (value[cursor] === '"' || value[cursor] === "'") {
    cursor += 1;
  } else if (slashCount > 0) {
    return false;
  }
  cursor = skipHorizontalWhitespace(value, cursor);
  return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
  let cursor = start;
  for (; ; ) {
    cursor = skipAuthWhitespace(value, cursor);
    if (cursor > start && isAuthHeaderStart(value, cursor)) {
      return null;
    }
    if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") {
      return null;
    }
    if (value[cursor] === ",") {
      cursor += 1;
      continue;
    }
    const param = readAuthParamName(value, cursor);
    if (param) {
      const equals = skipAuthWhitespace(value, param.end);
      if (value[equals] === "=" && value[equals + 1] !== "=") {
        return cursor;
      }
    }
    while (cursor < value.length) {
      const whitespaceEnd = skipAuthWhitespace(value, cursor);
      if (whitespaceEnd > cursor) {
        cursor = whitespaceEnd;
        continue;
      }
      if (cursor > start && isAuthHeaderStart(value, cursor)) {
        return null;
      }
      const char = value[cursor];
      if (char === "\r" || char === "\n" || char === ";") {
        return null;
      }
      cursor += 1;
      if (char === ",") {
        break;
      }
    }
  }
}
function usesAuthParams(scheme) {
  return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function findAuthFieldEnd(value, start) {
  let cursor = start;
  while (cursor < value.length) {
    const whitespaceEnd = skipAuthWhitespace(value, cursor);
    if (whitespaceEnd > cursor) {
      cursor = whitespaceEnd;
      continue;
    }
    if (cursor > start && isAuthHeaderStart(value, cursor)) {
      break;
    }
    const char = value[cursor];
    if (char === "\r" || char === "\n" || char === ";" || char === "\\" || char === '"' || char === "'" || char === "}" || char === "]") {
      break;
    }
    cursor += 1;
  }
  return cursor;
}
function readParamValue(value, start, options) {
  let escapedQuoteSlashCount = 0;
  while (value[start + escapedQuoteSlashCount] === "\\") {
    escapedQuoteSlashCount += 1;
  }
  const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === '"';
  const quote = value[start] === '"' || value[start] === "'" ? value[start] : void 0;
  if (quote || escapedQuotes) {
    let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
    while (cursor < value.length) {
      if (value[cursor] === "\r" || value[cursor] === "\n") {
        const whitespaceEnd = skipAuthWhitespace(value, cursor);
        if (whitespaceEnd === cursor) {
          break;
        }
        cursor = whitespaceEnd;
        continue;
      }
      if (escapedQuotes && value[cursor] === "\\") {
        let slashEnd = cursor + 1;
        while (value[slashEnd] === "\\") {
          slashEnd += 1;
        }
        if (value[slashEnd] === '"') {
          const slashCount = slashEnd - cursor;
          if (slashCount % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) {
            return slashEnd + 1;
          }
          cursor = slashEnd + 1;
          continue;
        }
        cursor = slashEnd;
        continue;
      }
      if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
        cursor += 2;
        continue;
      }
      if (!escapedQuotes && value[cursor] === quote) {
        return cursor + 1;
      }
      cursor += 1;
    }
    return cursor > start + 1 ? cursor : null;
  }
  if (options.signedHeaders) {
    const match2 = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(
      value.slice(start)
    );
    if (!match2) {
      return null;
    }
    const end = start + match2[0].length;
    const next = value[end];
    return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
  }
  const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(
    value.slice(start)
  );
  return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
  const ranges = [];
  for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
    const scheme = (header[2] ?? "").toLowerCase();
    let cursor = (header.index ?? 0) + header[0].length;
    const rangeStart = cursor;
    let rangeEnd = cursor;
    const directParam = readAuthParamName(value, cursor);
    const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
    if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
      const firstNonWhitespace = skipAuthWhitespace(value, cursor);
      if (value[firstNonWhitespace] !== "," && !usesAuthParams(scheme)) {
        continue;
      }
      const firstParamStart = findNextAuthParamStart(value, cursor);
      if (firstParamStart === null) {
        continue;
      }
      cursor = firstParamStart;
    }
    for (; ; ) {
      const param = readAuthParamName(value, cursor);
      if (!param) {
        break;
      }
      cursor = skipAuthWhitespace(value, param.end);
      if (value[cursor] !== "=") {
        break;
      }
      cursor = skipAuthWhitespace(value, cursor + 1);
      const valueEnd = readParamValue(value, cursor, {
        awsScope: scheme.startsWith("aws4-") && param.name === "credential",
        signedHeaders: param.name === "signedheaders"
      });
      if (valueEnd === null) {
        const nextParamStart2 = findNextAuthParamStart(value, cursor);
        if (nextParamStart2 !== null) {
          cursor = nextParamStart2;
          continue;
        }
        rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
        break;
      }
      rangeEnd = valueEnd;
      const separator = skipAuthWhitespace(value, valueEnd);
      if (value[separator] !== ",") {
        if (value[separator] !== void 0 && value[separator] !== "\r" && value[separator] !== "\n" && value[separator] !== ";" && value[separator] !== "\\" && value[separator] !== '"' && value[separator] !== "'" && value[separator] !== "}" && value[separator] !== "]") {
          const nextParamStart2 = findNextAuthParamStart(value, separator);
          if (nextParamStart2 !== null) {
            cursor = nextParamStart2;
            continue;
          }
          rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
        }
        break;
      }
      const nextParamStart = findNextAuthParamStart(value, separator + 1);
      if (nextParamStart === null) {
        break;
      }
      cursor = nextParamStart;
    }
    if (rangeEnd > rangeStart) {
      ranges.push({ start: rangeStart, end: rangeEnd });
    }
  }
  return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
  const ranges = findStructuredAuthParamRanges(value);
  if (ranges.length === 0) {
    return value;
  }
  const merged = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  const parts = [];
  let cursor = 0;
  for (const range of merged) {
    parts.push(value.slice(cursor, range.start), replacement);
    cursor = range.end;
  }
  parts.push(value.slice(cursor));
  return parts.join("");
}
var STRUCTURED_AUTH_MARKER_PREFIX = ";__openclaw_structured_auth_redacted_";
var SECRET_PATTERNS = [
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g,
  /[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^&\s"'<>]+)/gi,
  /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/g,
  /(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
  /(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
  /--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)\s+(["']?)([^\s"']+)\1/gi,
  new RegExp(
    String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
    "gi"
  ),
  new RegExp(CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, "gi"),
  /(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
  /\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])/g,
  /(^|[\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^\s&#]+)/gi,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
  /(ghp_[A-Za-z0-9]{20,})/g,
  /(github_pat_[A-Za-z0-9_]{20,})/g,
  /(xox[baprs]-[A-Za-z0-9-]{10,})/g,
  /(xapp-[A-Za-z0-9-]{10,})/g,
  /(gsk_[A-Za-z0-9_-]{10,})/g,
  /(AIza[0-9A-Za-z\-_]{20,})/g,
  /(ya29\.[0-9A-Za-z_\-./+=]{10,})/g,
  /(1\/\/0[0-9A-Za-z_\-./+=]{10,})/g,
  /(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
  /(pplx-[A-Za-z0-9_-]{10,})/g,
  /(npm_[A-Za-z0-9]{10,})/g,
  /(AKID[A-Za-z0-9]{10,})/g,
  /(LTAI[A-Za-z0-9]{10,})/g,
  /(hf_[A-Za-z0-9]{10,})/g,
  /(r8_[A-Za-z0-9]{10,})/g,
  /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
  /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g
];
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asFiniteNumberInRange(value, range) {
  const number = asFiniteNumber(value);
  if (number === void 0) {
    return void 0;
  }
  if (range.min !== void 0) {
    if (range.minExclusive ? number <= range.min : number < range.min) {
      return void 0;
    }
  }
  if (range.max !== void 0) {
    if (range.maxExclusive ? number >= range.max : number > range.max) {
      return void 0;
    }
  }
  return number;
}
function normalizeNumericString(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed : void 0;
}
function parseStrictInteger(value) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) ? value : void 0;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = normalizeNumericString(value);
  if (!normalized || !/^[+-]?\d+$/.test(normalized)) {
    return void 0;
  }
  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : void 0;
}
function asPositiveSafeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
var MAX_DATE_TIMESTAMP_MS = 864e13;
function asDateTimestampMs(value) {
  return asFiniteNumberInRange(value, {
    min: -MAX_DATE_TIMESTAMP_MS,
    max: MAX_DATE_TIMESTAMP_MS
  });
}
function timestampMsToIsoString(value) {
  const timestampMs = asDateTimestampMs(value);
  return timestampMs === void 0 ? void 0 : new Date(timestampMs).toISOString();
}
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
function resolveNonNegativeIntegerOption(value, fallback) {
  return resolveIntegerOption(value, fallback, { min: 0 });
}
function parseStrictNonNegativeInteger(value) {
  const parsed = parseStrictInteger(value);
  return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
function resolveExpiresAtMsFromDurationMs(value, opts = {}) {
  const durationMs = asPositiveSafeInteger(value);
  if (durationMs === void 0) {
    return void 0;
  }
  const nowMs = asDateTimestampMs(opts.nowMs ?? Date.now());
  const bufferMs = asFiniteNumber(opts.bufferMs ?? 0);
  if (nowMs === void 0 || bufferMs === void 0) {
    return void 0;
  }
  const expiresAt = nowMs + durationMs - bufferMs;
  if (!Number.isSafeInteger(expiresAt) || timestampMsToIsoString(expiresAt) === void 0) {
    return void 0;
  }
  const minRemainingMs = opts.minRemainingMs;
  if (minRemainingMs === void 0) {
    return expiresAt;
  }
  const minExpiresAt = nowMs + minRemainingMs;
  if (!Number.isSafeInteger(minExpiresAt) || timestampMsToIsoString(minExpiresAt) === void 0) {
    return expiresAt;
  }
  return Math.max(expiresAt, minExpiresAt);
}
function resolveIntegerOption2(value, fallback, params) {
  return resolveIntegerOption(value, fallback, params);
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var DEFAULT_MAX_SESSIONS = 5e3;
var DEFAULT_IDLE_TTL_MS = 24 * 60 * 60 * 1e3;
function createInMemorySessionStore(options = {}) {
  const maxSessions = resolveIntegerOption2(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 });
  const idleTtlMs = resolveIntegerOption2(options.idleTtlMs, DEFAULT_IDLE_TTL_MS, { min: 1e3 });
  const now = options.now ?? Date.now;
  const sessions = /* @__PURE__ */ new Map();
  const runIdToSessionId = /* @__PURE__ */ new Map();
  const touchSession = (session, nowMs) => {
    session.lastTouchedAt = nowMs;
  };
  const removeSession = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return false;
    }
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.abortController?.abort();
    sessions.delete(sessionId);
    return true;
  };
  const reapIdleSessions = (nowMs) => {
    const idleBefore = nowMs - idleTtlMs;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.activeRunId || session.abortController) {
        continue;
      }
      if (session.lastTouchedAt > idleBefore) {
        continue;
      }
      removeSession(sessionId);
    }
  };
  const evictOldestIdleSession = () => {
    let oldestSessionId = null;
    let oldestLastTouchedAt = Number.POSITIVE_INFINITY;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.activeRunId || session.abortController) {
        continue;
      }
      if (session.lastTouchedAt >= oldestLastTouchedAt) {
        continue;
      }
      oldestLastTouchedAt = session.lastTouchedAt;
      oldestSessionId = sessionId;
    }
    if (!oldestSessionId) {
      return false;
    }
    return removeSession(oldestSessionId);
  };
  const createSession = (params) => {
    const nowMs = now();
    const sessionId = params.sessionId ?? randomUUID();
    const existingSession = sessions.get(sessionId);
    if (existingSession) {
      existingSession.sessionKey = params.sessionKey;
      if ("ledgerSessionId" in params) {
        existingSession.ledgerSessionId = params.ledgerSessionId;
      }
      existingSession.cwd = params.cwd;
      touchSession(existingSession, nowMs);
      return existingSession;
    }
    reapIdleSessions(nowMs);
    if (sessions.size >= maxSessions && !evictOldestIdleSession()) {
      throw new Error(
        `ACP session limit reached (max ${maxSessions}). Close idle ACP clients and retry.`
      );
    }
    const session = {
      sessionId,
      sessionKey: params.sessionKey,
      ...params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {},
      cwd: params.cwd,
      createdAt: nowMs,
      lastTouchedAt: nowMs,
      abortController: null,
      activeRunId: null
    };
    sessions.set(sessionId, session);
    return session;
  };
  const hasSession = (sessionId) => sessions.has(sessionId);
  const getSession = (sessionId) => {
    const session = sessions.get(sessionId);
    if (session) {
      touchSession(session, now());
    }
    return session;
  };
  const getSessionByRunId = (runId) => {
    const sessionId = runIdToSessionId.get(runId);
    if (!sessionId) {
      return void 0;
    }
    const session = sessions.get(sessionId);
    if (session) {
      touchSession(session, now());
    }
    return session;
  };
  const setActiveRun = (sessionId, runId, abortController) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.activeRunId && session.activeRunId !== runId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.activeRunId = runId;
    session.abortController = abortController;
    runIdToSessionId.set(runId, sessionId);
    touchSession(session, now());
  };
  const clearActiveRun = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.activeRunId = null;
    session.abortController = null;
    touchSession(session, now());
  };
  const cancelActiveRun = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session?.abortController) {
      return false;
    }
    session.abortController.abort();
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.abortController = null;
    session.activeRunId = null;
    touchSession(session, now());
    return true;
  };
  const deleteSession = (sessionId) => removeSession(sessionId);
  const clearAllSessionsForTest = () => {
    for (const session of sessions.values()) {
      session.abortController?.abort();
    }
    sessions.clear();
    runIdToSessionId.clear();
  };
  return {
    createSession,
    hasSession,
    getSession,
    getSessionByRunId,
    setActiveRun,
    clearActiveRun,
    cancelActiveRun,
    deleteSession,
    clearAllSessionsForTest
  };
}
var defaultAcpSessionStore = createInMemorySessionStore();
var ACP_ERROR_CODES = [
  "ACP_BACKEND_MISSING",
  "ACP_BACKEND_UNAVAILABLE",
  "ACP_BACKEND_UNSUPPORTED_CONTROL",
  "ACP_DISPATCH_DISABLED",
  "ACP_INVALID_RUNTIME_OPTION",
  "ACP_SESSION_INIT_FAILED",
  "ACP_TURN_FAILED"
];
var ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}
var SAFE_REGEX_CACHE_MAX = 256;
var safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
  return {
    lastToken: null,
    containsRepetition: false,
    hasAlternation: false,
    branchMinLength: 0,
    branchMaxLength: 0,
    altMinLength: null,
    altMaxLength: null
  };
}
function addLength(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return Number.POSITIVE_INFINITY;
  }
  return left + right;
}
function multiplyLength(length, factor) {
  if (!Number.isFinite(length)) {
    return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
  }
  return length * factor;
}
function recordAlternative(frame) {
  if (frame.altMinLength === null || frame.altMaxLength === null) {
    frame.altMinLength = frame.branchMinLength;
    frame.altMaxLength = frame.branchMaxLength;
    return;
  }
  frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
  frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
  const ch = source[index];
  const consumed = source[index + 1] === "?" ? 2 : 1;
  if (ch === "*") {
    return { consumed, minRepeat: 0, maxRepeat: null };
  }
  if (ch === "+") {
    return { consumed, minRepeat: 1, maxRepeat: null };
  }
  if (ch === "?") {
    return { consumed, minRepeat: 0, maxRepeat: 1 };
  }
  if (ch !== "{") {
    return null;
  }
  let i = index + 1;
  while (i < source.length && /\d/.test(source.charAt(i))) {
    i += 1;
  }
  if (i === index + 1) {
    return null;
  }
  const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
  let maxRepeat = minRepeat;
  if (source[i] === ",") {
    i += 1;
    const maxStart = i;
    while (i < source.length && /\d/.test(source.charAt(i))) {
      i += 1;
    }
    maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
  }
  if (source[i] !== "}") {
    return null;
  }
  i += 1;
  if (source[i] === "?") {
    i += 1;
  }
  if (maxRepeat !== null && maxRepeat < minRepeat) {
    return null;
  }
  return { consumed: i - index, minRepeat, maxRepeat };
}
function tokenizePattern(source) {
  const tokens = [];
  let inCharClass = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (inCharClass) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === "]") {
        inCharClass = false;
      }
      continue;
    }
    if (ch === "\\") {
      i += 1;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "[") {
      inCharClass = true;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "group-open" });
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "group-close" });
      continue;
    }
    if (ch === "|") {
      tokens.push({ kind: "alternation" });
      continue;
    }
    const quantifier = readQuantifier(source, i);
    if (quantifier) {
      tokens.push({ kind: "quantifier", quantifier });
      i += quantifier.consumed - 1;
      continue;
    }
    tokens.push({ kind: "simple-token" });
  }
  return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
  const frames = [createParseFrame()];
  const emitToken = (token) => {
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    frame.lastToken = token;
    if (token.containsRepetition) {
      frame.containsRepetition = true;
    }
    frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
    frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
  };
  const emitSimpleToken = () => {
    emitToken({
      containsRepetition: false,
      hasAmbiguousAlternation: false,
      minLength: 1,
      maxLength: 1
    });
  };
  for (const token of tokens) {
    if (token.kind === "simple-token") {
      emitSimpleToken();
      continue;
    }
    if (token.kind === "group-open") {
      frames.push(createParseFrame());
      continue;
    }
    if (token.kind === "group-close") {
      if (frames.length > 1) {
        const frame2 = frames.pop();
        if (frame2.hasAlternation) {
          recordAlternative(frame2);
        }
        const groupMinLength = frame2.hasAlternation ? frame2.altMinLength ?? 0 : frame2.branchMinLength;
        const groupMaxLength = frame2.hasAlternation ? frame2.altMaxLength ?? 0 : frame2.branchMaxLength;
        emitToken({
          containsRepetition: frame2.containsRepetition,
          hasAmbiguousAlternation: frame2.hasAlternation && frame2.altMinLength !== null && frame2.altMaxLength !== null && frame2.altMinLength !== frame2.altMaxLength,
          minLength: groupMinLength,
          maxLength: groupMaxLength
        });
      }
      continue;
    }
    if (token.kind === "alternation") {
      const frame2 = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
      frame2.hasAlternation = true;
      recordAlternative(frame2);
      frame2.branchMinLength = 0;
      frame2.branchMaxLength = 0;
      frame2.lastToken = null;
      continue;
    }
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    const previousToken = frame.lastToken;
    if (!previousToken) {
      continue;
    }
    if (previousToken.containsRepetition) {
      return true;
    }
    if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) {
      return true;
    }
    const previousMinLength = previousToken.minLength;
    const previousMaxLength = previousToken.maxLength;
    previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
    previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
    previousToken.containsRepetition = true;
    frame.containsRepetition = true;
    frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
    const branchMaxBase = Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY;
    frame.branchMaxLength = addLength(branchMaxBase, previousToken.maxLength);
  }
  return false;
}
function hasNestedRepetition(source) {
  return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
  const trimmed = source.trim();
  if (!trimmed) {
    return { regex: null, source: trimmed, flags, reason: "empty" };
  }
  const cacheKey = `${flags}::${trimmed}`;
  if (safeRegexCache.has(cacheKey)) {
    return safeRegexCache.get(cacheKey) ?? {
      regex: null,
      source: trimmed,
      flags,
      reason: "invalid-regex"
    };
  }
  let result;
  if (hasNestedRepetition(trimmed)) {
    result = { regex: null, source: trimmed, flags, reason: "unsafe-nested-repetition" };
  } else {
    try {
      result = { regex: new RegExp(trimmed, flags), source: trimmed, flags, reason: null };
    } catch {
      result = { regex: null, source: trimmed, flags, reason: "invalid-regex" };
    }
  }
  safeRegexCache.set(cacheKey, result);
  if (safeRegexCache.size > SAFE_REGEX_CACHE_MAX) {
    const oldestKey = safeRegexCache.keys().next().value;
    if (oldestKey) {
      safeRegexCache.delete(oldestKey);
    }
  }
  return result;
}
function normalizeRejectReason(result) {
  if (result.reason === null || result.reason === "empty") {
    return null;
  }
  return result.reason;
}
function compileConfigRegex(pattern, flags = "") {
  const result = compileSafeRegexDetailed(pattern, flags);
  if (result.reason === "empty") {
    return null;
  }
  return {
    regex: result.regex,
    pattern: result.source,
    flags: result.flags,
    reason: normalizeRejectReason(result)
  };
}
var FLAG_TERMINATOR = "--";
var ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
var ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set(["--profile", "--log-level", "--container"]);
function isValueToken(arg) {
  if (!arg || arg === FLAG_TERMINATOR) {
    return false;
  }
  if (!arg.startsWith("-")) {
    return true;
  }
  return /^-\d+(?:\.\d+)?$/.test(arg);
}
function consumeRootOptionToken(args, index) {
  const arg = args[index];
  if (!arg) {
    return 0;
  }
  if (ROOT_BOOLEAN_FLAGS.has(arg)) {
    return 1;
  }
  if (arg.startsWith("--profile=") || arg.startsWith("--log-level=") || arg.startsWith("--container=")) {
    return 1;
  }
  if (ROOT_VALUE_FLAGS.has(arg)) {
    return isValueToken(args[index + 1]) ? 2 : 1;
  }
  return 0;
}
var ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
var ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
var ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
var ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
var ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
  "y"
);
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");
function getCommandDescriptorNames(descriptors) {
  return descriptors.map((descriptor) => descriptor.name);
}
function getCommandsWithSubcommands(descriptors) {
  return descriptors.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name);
}
function getParentDefaultHelpCommands(descriptors) {
  return descriptors.filter((descriptor) => descriptor.parentDefaultHelp).map((descriptor) => descriptor.name);
}
function defineCommandDescriptorCatalog(descriptors) {
  return {
    descriptors,
    getDescriptors: () => descriptors,
    getNames: () => getCommandDescriptorNames(descriptors),
    getCommandsWithSubcommands: () => getCommandsWithSubcommands(descriptors),
    getParentDefaultHelpCommands: () => getParentDefaultHelpCommands(descriptors)
  };
}
var coreCliCommandCatalog = defineCommandDescriptorCatalog([
  {
    name: "setup",
    description: "Chat with OpenClaw; onboard when setup is incomplete",
    hasSubcommands: false
  },
  {
    name: "crestodian",
    // hidden alias
    description: "Deprecated: use openclaw setup",
    hasSubcommands: false,
    hidden: true
  },
  {
    name: "onboard",
    description: "Guided setup for auth, models, Gateway, workspace, channels, and skills",
    hasSubcommands: true
  },
  {
    name: "configure",
    description: "Interactive configuration for credentials, channels, gateway, and agent defaults",
    hasSubcommands: false
  },
  {
    name: "config",
    description: "Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.",
    hasSubcommands: true
  },
  {
    name: "backup",
    description: "Create and verify backup archives and SQLite snapshots",
    hasSubcommands: true
  },
  {
    name: "migrate",
    description: "Import state from another agent system",
    hasSubcommands: true
  },
  {
    name: "doctor",
    description: "Health checks + quick fixes for the gateway and channels",
    hasSubcommands: false
  },
  {
    name: "dashboard",
    description: "Open the Control UI with your current token",
    hasSubcommands: false
  },
  {
    name: "reset",
    description: "Reset local config/state (keeps the CLI installed)",
    hasSubcommands: false
  },
  {
    name: "uninstall",
    description: "Uninstall the gateway service + local data (CLI remains)",
    hasSubcommands: false
  },
  {
    name: "message",
    description: "Send, read, and manage messages and channel actions",
    hasSubcommands: true
  },
  {
    name: "mcp",
    description: "Manage OpenClaw mcp.servers config and channel bridge",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "transcripts",
    description: "Inspect stored transcripts",
    hasSubcommands: true
  },
  {
    name: "agent",
    description: "Run an agent turn via the Gateway (use --local for embedded)",
    hasSubcommands: false
  },
  {
    name: "agents",
    description: "Manage isolated agents (workspaces + auth + routing)",
    hasSubcommands: true
  },
  {
    name: "status",
    description: "Show channel health and recent session recipients",
    hasSubcommands: false
  },
  {
    name: "health",
    description: "Fetch health from the running gateway",
    hasSubcommands: false
  },
  {
    name: "audit",
    description: "Inspect metadata-only run, tool, and message lifecycle records",
    hasSubcommands: false
  },
  {
    name: "sessions",
    description: "List stored conversation sessions",
    hasSubcommands: true
  },
  {
    name: "commitments",
    description: "List and manage inferred follow-up commitments",
    hasSubcommands: true
  },
  {
    name: "tasks",
    description: "Inspect durable background tasks and TaskFlow state",
    hasSubcommands: true
  }
]);
var CORE_CLI_COMMAND_DESCRIPTORS = coreCliCommandCatalog.descriptors;
var PRIVATE_QA_DIST_RELATIVE_PATH = path2.join("dist", "plugin-sdk", "qa-lab.js");
function isPrivateQaCliEnabled(env = process.env) {
  return env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
var subCliCommandCatalog = defineCommandDescriptorCatalog([
  { name: "acp", description: "Run an ACP bridge backed by the Gateway", hasSubcommands: true },
  {
    name: "gateway",
    description: "Run, inspect, and query the WebSocket Gateway",
    hasSubcommands: true
  },
  {
    name: "daemon",
    description: "Manage the Gateway service (launchd/systemd/schtasks)",
    hasSubcommands: true
  },
  { name: "logs", description: "Tail gateway file logs via RPC", hasSubcommands: false },
  {
    name: "system",
    description: "System tools (events, heartbeat, presence)",
    hasSubcommands: true
  },
  {
    name: "models",
    description: "Model discovery, scanning, and configuration",
    hasSubcommands: true
  },
  {
    name: "promos",
    description: "Discover and claim promotional model offers from ClawHub",
    hasSubcommands: true
  },
  {
    name: "infer",
    description: "Run provider-backed inference commands through a stable CLI surface",
    hasSubcommands: true
  },
  {
    name: "capability",
    description: "Run provider capability commands (fallback alias: infer)",
    hasSubcommands: true
  },
  {
    name: "approvals",
    description: "Manage approval policy and pending requests",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "exec-approvals",
    description: "Manage exec approvals (alias for approvals)",
    hasSubcommands: true
  },
  {
    name: "exec-policy",
    description: "Show or synchronize requested exec policy with host approvals",
    hasSubcommands: true
  },
  {
    name: "nodes",
    description: "Manage gateway-owned nodes (pairing, status, invoke, and media)",
    hasSubcommands: true
  },
  {
    name: "devices",
    description: "Device pairing and auth tokens",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "users",
    description: "Manage durable user profiles and email aliases",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "node",
    description: "Run and manage the headless node host service",
    hasSubcommands: true
  },
  {
    name: "worker",
    description: "Run the restricted cloud worker runtime",
    hasSubcommands: false
  },
  {
    name: "sandbox",
    description: "Manage sandbox containers (Docker-based agent isolation)",
    hasSubcommands: true
  },
  {
    name: "fleet",
    description: "Provision and manage isolated tenant cells (experimental)",
    hasSubcommands: true
  },
  {
    name: "worktrees",
    description: "Create, inspect, restore, and clean up managed worktrees",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "attach",
    description: "Attach Claude Code to a gateway session with scoped MCP tools",
    hasSubcommands: false
  },
  {
    name: "tui",
    description: "Open a terminal UI connected to the Gateway",
    hasSubcommands: false
  },
  {
    name: "terminal",
    description: "Open a local terminal UI (alias for tui --local)",
    hasSubcommands: false
  },
  {
    name: "chat",
    description: "Open a local terminal UI (alias for tui --local)",
    hasSubcommands: false
  },
  {
    name: "cron",
    description: "Manage cron jobs (via Gateway)",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "dns",
    description: "DNS helpers for wide-area discovery (Tailscale + CoreDNS)",
    hasSubcommands: true
  },
  {
    name: "docs",
    description: "Search the live OpenClaw docs",
    hasSubcommands: false
  },
  {
    name: "qa",
    description: "Run QA scenarios and launch the private QA debugger UI",
    hasSubcommands: true
  },
  {
    name: "proxy",
    description: "Run the OpenClaw debug proxy and inspect captured traffic",
    hasSubcommands: true
  },
  {
    name: "hooks",
    description: "Manage internal agent hooks",
    hasSubcommands: true
  },
  {
    name: "webhooks",
    description: "Webhook helpers and integrations",
    hasSubcommands: true
  },
  {
    name: "qr",
    description: "Generate a mobile pairing QR code and setup code",
    hasSubcommands: false
  },
  {
    name: "clawbot",
    description: "Legacy clawbot command aliases",
    hasSubcommands: true
  },
  {
    name: "pairing",
    description: "Secure DM pairing (approve inbound requests)",
    hasSubcommands: true
  },
  {
    name: "plugins",
    description: "Manage OpenClaw plugins and extensions",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "channels",
    description: "Manage connected chat channels and accounts",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "directory",
    description: "Lookup contact and group IDs (self, peers, groups) for supported chat channels",
    hasSubcommands: true
  },
  {
    name: "security",
    description: "Audit local config and state for common security foot-guns",
    hasSubcommands: true
  },
  {
    name: "secrets",
    description: "Secrets runtime controls",
    hasSubcommands: true
  },
  {
    name: "skills",
    description: "List and inspect available skills",
    hasSubcommands: true
  },
  {
    name: "update",
    description: "Update OpenClaw and inspect update channel status",
    hasSubcommands: true
  },
  {
    name: "completion",
    description: "Generate shell completion script",
    hasSubcommands: false
  }
]);
function filterPrivateQaItems(items, getName) {
  if (isPrivateQaCliEnabled()) {
    return items;
  }
  return items.filter((item) => getName(item) !== "qa");
}
var SUB_CLI_DESCRIPTORS = filterPrivateQaItems(
  subCliCommandCatalog.descriptors,
  (descriptor) => descriptor.name
);
var ROOT_COMMAND_DESCRIPTORS = [...CORE_CLI_COMMAND_DESCRIPTORS, ...SUB_CLI_DESCRIPTORS];
var KNOWN_ROOT_COMMANDS = new Set(
  ROOT_COMMAND_DESCRIPTORS.map((descriptor) => descriptor.name)
);
var ROOT_COMMANDS_WITH_SUBCOMMANDS = new Set(
  ROOT_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.hasSubcommands).map(
    (descriptor) => descriptor.name
  )
);
function getCommandPathWithRootOptions(argv, depth = 2) {
  return getCommandPathInternal(argv, depth, { skipRootOptions: true });
}
function getCommandPathInternal(argv, depth, opts) {
  const args = argv.slice(2);
  const path17 = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg) {
      continue;
    }
    if (arg === "--") {
      break;
    }
    if (opts.skipRootOptions) {
      const consumed = consumeRootOptionToken(args, i);
      if (consumed > 0) {
        i += consumed - 1;
        continue;
      }
    }
    if (arg.startsWith("-")) {
      continue;
    }
    path17.push(arg);
    if (path17.length >= depth) {
      break;
    }
  }
  return path17;
}
function tryProcessCwd() {
  try {
    return process.cwd();
  } catch {
    return void 0;
  }
}
function normalize(value) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return void 0;
  }
  return trimmed;
}
function normalizeSafe(homedir) {
  try {
    return normalize(homedir());
  } catch {
    return void 0;
  }
}
function resolveTermuxHome(env) {
  const prefix = normalize(env.PREFIX);
  if (!prefix || !normalize(env.ANDROID_DATA)) {
    return void 0;
  }
  if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) {
    return void 0;
  }
  return path3.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
  return normalize(env.HOME) ?? normalize(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveRawHomeDir(env, homedir) {
  const explicitHome = normalize(env.OPENCLAW_HOME);
  if (!explicitHome) {
    return resolveRawOsHomeDir(env, homedir);
  }
  if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
    const fallbackHome = resolveRawOsHomeDir(env, homedir);
    return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : void 0;
  }
  return explicitHome;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawHomeDir(env, homedir);
  return raw ? path3.resolve(raw) : void 0;
}
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
  const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
  if (resolved) {
    return path3.resolve(resolved);
  }
  throw new Error(
    "Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory."
  );
}
function expandHomePrefix(input, opts) {
  if (!input.startsWith("~")) {
    return input;
  }
  const home = normalize(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
  if (!home) {
    return input;
  }
  return input.replace(/^~(?=$|[\\/])/, home);
}
function resolveHomeRelativePath(input, opts) {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    const expanded = expandHomePrefix(trimmed, {
      home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
      env: opts?.env,
      homedir: opts?.homedir
    });
    return path3.resolve(expanded);
  }
  return path3.resolve(trimmed);
}
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
  if (!input) {
    return "";
  }
  return resolveHomeRelativePath(input, { env, homedir });
}
function resolveIsNixMode(env = process.env) {
  return env.OPENCLAW_NIX_MODE === "1";
}
var isNixMode = resolveIsNixMode();
var LEGACY_STATE_DIRNAMES = [".clawdbot"];
var NEW_STATE_DIRNAME = ".openclaw";
var CONFIG_FILENAME = "openclaw.json";
var LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
function resolveDefaultHomeDir() {
  return resolveRequiredHomeDir(process.env, os2.homedir);
}
function envHomedir(env) {
  return () => resolveRequiredHomeDir(env, os2.homedir);
}
function legacyStateDirs(homedir = resolveDefaultHomeDir) {
  return LEGACY_STATE_DIRNAMES.map((dir) => path4.join(homedir(), dir));
}
function newStateDir(homedir = resolveDefaultHomeDir) {
  return path4.join(homedir(), NEW_STATE_DIRNAME);
}
function resolveStateDir(env = process.env, homedir = envHomedir(env)) {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath2(override, env, effectiveHomedir);
  }
  const newDir = newStateDir(effectiveHomedir);
  if (env.OPENCLAW_TEST_FAST === "1") {
    return newDir;
  }
  const legacyDirs = legacyStateDirs(effectiveHomedir);
  const hasNew = fs2.existsSync(newDir);
  if (hasNew) {
    return newDir;
  }
  const existingLegacy = legacyDirs.find((dir) => {
    try {
      return fs2.existsSync(dir);
    } catch {
      return false;
    }
  });
  if (existingLegacy) {
    return existingLegacy;
  }
  return newDir;
}
function resolveUserPath2(input, env = process.env, homedir = envHomedir(env)) {
  return resolveHomeRelativePath(input, { env, homedir });
}
var STATE_DIR = resolveStateDir();
function resolveCanonicalConfigPath(env = process.env, stateDir = resolveStateDir(env, envHomedir(env))) {
  const override = env.OPENCLAW_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath2(override, env, envHomedir(env));
  }
  return path4.join(stateDir, CONFIG_FILENAME);
}
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
  if (env.OPENCLAW_TEST_FAST === "1") {
    return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
  }
  const candidates = resolveDefaultConfigCandidates(env, homedir);
  const existing = candidates.find((candidate) => {
    try {
      return fs2.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
function resolveConfigPath(env = process.env, stateDir = resolveStateDir(env, envHomedir(env)), homedir = envHomedir(env)) {
  const override = env.OPENCLAW_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath2(override, env, homedir);
  }
  if (env.OPENCLAW_TEST_FAST === "1") {
    return path4.join(stateDir, CONFIG_FILENAME);
  }
  const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
  const candidates = [
    path4.join(stateDir, CONFIG_FILENAME),
    ...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(stateDir, name))
  ];
  const existing = candidates.find((candidate) => {
    try {
      return fs2.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  if (stateOverride) {
    return path4.join(stateDir, CONFIG_FILENAME);
  }
  const defaultStateDir = resolveStateDir(env, homedir);
  if (path4.resolve(stateDir) === path4.resolve(defaultStateDir)) {
    return resolveConfigPathCandidate(env, homedir);
  }
  return path4.join(stateDir, CONFIG_FILENAME);
}
var CONFIG_PATH = resolveConfigPathCandidate();
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
  if (explicit) {
    return [resolveUserPath2(explicit, env, effectiveHomedir)];
  }
  const candidates = [];
  const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
  if (openclawStateDir) {
    const resolved = resolveUserPath2(openclawStateDir, env, effectiveHomedir);
    candidates.push(path4.join(resolved, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(resolved, name)));
  }
  const defaultDirs = [newStateDir(effectiveHomedir), ...legacyStateDirs(effectiveHomedir)];
  for (const dir of defaultDirs) {
    candidates.push(path4.join(dir, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(dir, name)));
  }
  return candidates;
}
var cachedLoggingConfig;
function shouldSkipMutatingLoggingConfigRead(argv = process.argv) {
  const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
  return primary === "config" && (secondary === "schema" || secondary === "validate");
}
function readLoggingConfig() {
  if (shouldSkipMutatingLoggingConfigRead()) {
    return void 0;
  }
  try {
    const configPath = resolveConfigPath();
    if (cachedLoggingConfig?.path === configPath) {
      return cachedLoggingConfig.logging;
    }
    if (!fs3.existsSync(configPath)) {
      return void 0;
    }
    const parsed = JSON5.parse(fs3.readFileSync(configPath, "utf8"));
    const logging = isRecord(parsed) ? parsed.logging : void 0;
    const resolved = isRecord(logging) ? logging : void 0;
    cachedLoggingConfig = {
      path: configPath,
      logging: resolved
    };
    return resolved;
  } catch {
    return void 0;
  }
}
var REDACT_REGEX_CHUNK_THRESHOLD = 32768;
var REDACT_REGEX_CHUNK_SIZE = 16384;
function replacePatternBounded(text, pattern, replacer, options) {
  const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
  const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
  if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold) {
    return text.replace(pattern, replacer);
  }
  let output = "";
  for (let index = 0; index < text.length; index += chunkSize) {
    output += text.slice(index, index + chunkSize).replace(pattern, replacer);
  }
  return output;
}
var registeredValues = /* @__PURE__ */ new Map();
var compiledMatcher;
var firstChars = /* @__PURE__ */ new Set();
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function rebuildProbe() {
  firstChars = new Set([...registeredValues.keys()].map((value) => value.charAt(0)));
  compiledMatcher = void 0;
}
function redactRegisteredSecretValues(text, mask) {
  if (!text || registeredValues.size === 0) {
    return text;
  }
  let couldMatch = false;
  for (const firstChar of firstChars) {
    if (text.includes(firstChar)) {
      couldMatch = true;
      break;
    }
  }
  if (!couldMatch) {
    return text;
  }
  compiledMatcher ??= new RegExp(
    [...registeredValues.keys()].toSorted((left, right) => right.length - left.length).map(escapeRegExp).join("|"),
    "g"
  );
  return text.replace(compiledMatcher, (value) => mask(value));
}
function resetSecretRedactionRegistryForTest() {
  registeredValues.clear();
  rebuildProbe();
}
if (process.env.VITEST || process.env.NODE_ENV === "test") {
  globalThis[/* @__PURE__ */ Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
}
var DEFAULT_REDACT_MODE = "tools";
var DEFAULT_REDACT_MIN_LENGTH = 18;
var DEFAULT_REDACT_KEEP_START = 6;
var DEFAULT_REDACT_KEEP_END = 4;
var PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
var PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
var AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
var FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
var STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
var BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
  "access_token",
  "auth_token",
  "hook_token",
  "refresh_token",
  "id_token",
  "token",
  "api_key",
  "apikey",
  "client_secret",
  "app_secret",
  "password",
  "pass",
  "passwd",
  "auth",
  "jwt",
  "session",
  "code",
  "signature",
  "x_amz_signature",
  "x_amz_security_token",
  "secret",
  "credential",
  "private_key",
  "authorization",
  "key",
  "card_number",
  "card_cvc",
  "card_cvv",
  "cvc",
  "cvv",
  "security_code",
  "payment_credential",
  "shared_payment_token"
]);
var FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
var FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(
  String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`,
  "gu"
);
var FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
var FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
var FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
var FORM_BODY_VALUE = "[^&\\s<>]*";
var URL_QUERY_VALUE = "[^&#\\s<>]*";
var FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
var FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
var FORM_BODY_SUBSTRING_RE = new RegExp(
  String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`,
  "gu"
);
var ENCODED_FORM_PAIR_RE = new RegExp(
  String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`,
  "gu"
);
var FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(
  String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`,
  "giu"
);
var URL_QUERY_PAIR_RE = new RegExp(
  String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`,
  "gu"
);
var SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
var SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
var SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set(['"', "'", "`"]);
var FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
var FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
var PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
var STRUCTURED_SECRET_FIELD_RE = new RegExp(
  String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`,
  "i"
);
var STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
var STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
var APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
var BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
  "case",
  "claw",
  "demo",
  "file",
  "main",
  "name",
  "open",
  "path",
  "slug",
  "test"
]);
var STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(
  String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`,
  "i"
);
var ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
var ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
var STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
var STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
var BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
var IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
var TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
var TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
var HTTP_AUTH_HEADER_REDACT_PATTERNS = [
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
  CREDENTIAL_STYLE_HEADER_REDACT_PATTERN
];
var AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
var AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
var AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
var STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
var SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
  ENV_ASSIGNMENT_REDACT_PATTERN,
  ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_REDACT_PATTERN
]);
var CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
  TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
  TELEGRAM_TOKEN_REDACT_PATTERN,
  AUTHORIZATION_BEARER_REDACT_PATTERN,
  AUTHORIZATION_BASIC_REDACT_PATTERN,
  AUTHORIZATION_BOT_REDACT_PATTERN,
  STANDALONE_BEARER_REDACT_PATTERN,
  ...HTTP_AUTH_HEADER_REDACT_PATTERNS
]);
var shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
var chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
var DEFAULT_REDACT_PATTERNS = [
  // ENV-style assignments. Keep this case-sensitive so diagnostics like
  // `Unrecognized key: "llm"` do not lose the actual config key.
  ENV_ASSIGNMENT_REDACT_PATTERN,
  ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
  // URL query parameters. Keep this separate from ENV-style assignments so
  // lower-case URL secrets stay redacted without hiding config-key diagnostics.
  String.raw`/[?&](?:${AUTH_QUERY_KEYS}|${PAYMENT_CREDENTIAL_QUERY_KEYS})=([^&#\s<>]+)/gi`,
  // JSON fields.
  String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|credential|authorization|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material|${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`,
  // HTTP client diagnostics often stringify request config objects using
  // JSON or util.inspect-style fields rather than env/CLI syntax.
  String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
  String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
  // CLI flags.
  String.raw`--(?:api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
  // Authorization headers.
  AUTHORIZATION_BEARER_REDACT_PATTERN,
  AUTHORIZATION_BASIC_REDACT_PATTERN,
  AUTHORIZATION_BOT_REDACT_PATTERN,
  ...HTTP_AUTH_HEADER_REDACT_PATTERNS,
  String.raw`(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)`,
  STANDALONE_BEARER_REDACT_PATTERN,
  // URL userinfo and common connection-string password slots.
  String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
  String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
  // First pair in form-urlencoded bodies embedded in larger log lines.
  String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
  // Standalone token assignments in CLI or HTTP diagnostics. URL query params
  // are handled above so non-secret params survive and long values stay hinted.
  STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_REDACT_PATTERN,
  // PEM blocks.
  String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,
  // Common token prefixes.
  String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
  String.raw`(ghp_[A-Za-z0-9]{10,})`,
  String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
  String.raw`(gho_[A-Za-z0-9]{10,})`,
  String.raw`(ghu_[A-Za-z0-9]{10,})`,
  String.raw`(ghs_[A-Za-z0-9]{10,})`,
  String.raw`(ghr_[A-Za-z0-9]{10,})`,
  String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
  String.raw`(gloas-[A-Fa-f0-9]{32,})`,
  String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
  String.raw`(xapp-[A-Za-z0-9-]{10,})`,
  String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
  String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
  String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
  String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
  String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
  String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
  String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
  String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
  String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
  String.raw`(fal_[A-Za-z0-9_-]{10,})`,
  String.raw`(fc-[A-Za-z0-9]{10,})`,
  String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
  // Prefixes made only of standard-base64 characters need a non-base64 left boundary so they
  // do not fire inside unrelated base64 blobs (e.g. data-URL media), corrupting the payload.
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
  String.raw`(sk_live_[A-Za-z0-9]{10,})`,
  String.raw`(sk_test_[A-Za-z0-9]{10,})`,
  String.raw`(rk_live_[A-Za-z0-9]{10,})`,
  String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
  String.raw`(npm_[A-Za-z0-9]{10,})`,
  String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
  String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
  String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
  String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
  String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
  String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
  String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
  String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
  String.raw`(bkua_[a-z0-9]{40})`,
  String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
  String.raw`(sbp_[a-z0-9]{40})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
  String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
  String.raw`(glsa_[A-Za-z0-9_]{41})`,
  String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
  String.raw`(nfp_[A-Za-z0-9_]{36})`,
  String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
  String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
  String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
  String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
  String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
  String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
  String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
  String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
  String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
  String.raw`(tvly-[A-Za-z0-9]{10,})`,
  String.raw`(exa_[A-Za-z0-9]{10,})`,
  String.raw`(syt_[A-Za-z0-9]{10,})`,
  String.raw`(retaindb_[A-Za-z0-9]{10,})`,
  String.raw`(hsk-[A-Za-z0-9]{10,})`,
  String.raw`(mem0_[A-Za-z0-9]{10,})`,
  String.raw`(brv_[A-Za-z0-9]{10,})`,
  String.raw`(xai-[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
  // Additional access-key and token-style prefixes.
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
  String.raw`(AKID[A-Za-z0-9]{10,})`,
  String.raw`(LTAI[A-Za-z0-9]{10,})`,
  String.raw`(hf_[A-Za-z0-9]{10,})`,
  String.raw`(api_org_[A-Za-z0-9]{20,})`,
  String.raw`(r8_[A-Za-z0-9]{10,})`,
  // Telegram Bot API URLs embed the token as `/bot<token>/...` (no word-boundary before digits).
  TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
  TELEGRAM_TOKEN_REDACT_PATTERN
];
var defaultResolvedPatterns;
var DEFAULT_REDACT_PREFILTER_SOURCES = [
  // Sensitive key names shared by the env/JSON/query/form/header/assignment families.
  String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
  String.raw`security[-_]?code|\bpass=|jwt=|session=|code=`,
  String.raw`\bBearer\s+`,
  // URL userinfo and connection-string password slots (`scheme://user:pass@host`).
  String.raw`:\/\/[^\/\s:@]*:[^\/\s@]+@`,
  // Vendor token prefixes and webhook hosts, ordered like DEFAULT_REDACT_PATTERNS.
  String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|\bSG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
  String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
  String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
  String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
  // Obfuscated form/URL keys: percent escapes can rewrite any key letter, while plus or
  // invisible splices break the literal key-name triggers above mid-word. After a splice the
  // tail may mix further splices with key characters (e.g. an interior plus a trailing
  // filler), but at least one key character must follow a splice so bare `+=` or line-leading
  // `===` separators do not trip the fast path.
  String.raw`%[0-9A-Fa-f]{2}[A-Za-z0-9_%.-]*=`,
  String.raw`(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=`
];
var DEFAULT_REDACT_PREFILTER_RE = new RegExp(
  `(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`,
  "iu"
);
function normalizeMode(value) {
  return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
  let pattern = null;
  if (raw instanceof RegExp) {
    if (raw.flags.includes("g")) {
      pattern = raw;
    } else {
      pattern = new RegExp(raw.source, `${raw.flags}g`);
    }
  } else if (raw.trim()) {
    const match = raw.match(/^\/(.+)\/([gimsuy]*)$/);
    if (match) {
      const flags = expectDefined(match[2], "redact regex capture 2").includes("g") ? match[2] : `${match[2]}g`;
      pattern = compileConfigRegex(expectDefined(match[1], "redact regex capture 1"), flags)?.regex ?? null;
    } else {
      pattern = compileConfigRegex(raw, "gi")?.regex ?? null;
    }
  }
  if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) {
    shellReferencePreservingPatterns.add(pattern);
  }
  if (pattern && typeof raw === "string" && (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) || raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) {
    chunkUnsafePatterns.add(pattern);
  }
  return pattern;
}
function resolvePatterns(value) {
  if (!value?.length) {
    defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter(
      (re) => Boolean(re)
    );
    return defaultResolvedPatterns;
  }
  return value.map(parsePattern).filter((re) => Boolean(re));
}
function includesDefaultRedactPatterns(value) {
  if (!value?.length) {
    return true;
  }
  const source = new Set(value.filter((pattern) => typeof pattern === "string"));
  return DEFAULT_REDACT_PATTERNS.every((pattern) => source.has(pattern));
}
function maskToken(token) {
  if (token === "***") {
    return token;
  }
  if (token.length < DEFAULT_REDACT_MIN_LENGTH) {
    return "***";
  }
  const start = sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START);
  const end = sliceUtf16Safe(token, -DEFAULT_REDACT_KEEP_END);
  return `${start}\u2026${end}`;
}
function splitSecretValueForMask(token) {
  const openingQuote = token[0] ?? "";
  if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
    const closingQuoteIndex = token.lastIndexOf(openingQuote);
    if (closingQuoteIndex > 0) {
      const suffix = token.slice(closingQuoteIndex + 1);
      if (SECRET_VALUE_SUFFIX_RE.test(suffix)) {
        return {
          maskable: token.slice(1, closingQuoteIndex),
          suffix,
          maskStart: 0,
          maskEnd: closingQuoteIndex + 1
        };
      }
    }
    const tokenWithoutLeadingQuote = token.slice(1);
    const trailingDelimiter2 = tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
    const maskable2 = trailingDelimiter2 && trailingDelimiter2.length < tokenWithoutLeadingQuote.length ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter2.length) : tokenWithoutLeadingQuote;
    return {
      maskable: maskable2,
      suffix: trailingDelimiter2 && trailingDelimiter2.length < tokenWithoutLeadingQuote.length ? trailingDelimiter2 : "",
      maskStart: 0,
      maskEnd: 1 + maskable2.length
    };
  }
  const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
  const maskable = trailingDelimiter && trailingDelimiter.length < token.length ? token.slice(0, -trailingDelimiter.length) : token;
  return {
    maskable,
    suffix: maskable === token ? "" : trailingDelimiter,
    maskStart: 0,
    maskEnd: maskable.length
  };
}
function maskSecretValue(token, options) {
  const { maskable, suffix } = splitSecretValueForMask(token);
  return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
  const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
  try {
    return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
  } catch {
    return stripped.toLowerCase().replaceAll("-", "_");
  }
}
function isSensitiveBodyKey(key) {
  return BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
  return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function redactFormEncodedPairs(value, options) {
  return value.split("&").map((pair) => {
    const equalsIndex = pair.indexOf("=");
    if (equalsIndex < 0) {
      return pair;
    }
    const key = pair.slice(0, equalsIndex);
    if (options?.onlyEncodedOrInvisibleKeys && !hasEncodedOrInvisibleFormKey(key)) {
      return pair;
    }
    if (!isSensitiveBodyKey(key)) {
      return pair;
    }
    const token = pair.slice(equalsIndex + 1);
    const masked = maskSecretValue(token, { hinted: options?.maskValues === "hinted" });
    return `${key}=${masked}`;
  }).join("&");
}
function redactUrlQueryPairs(text) {
  if (!text || !text.includes("?")) {
    return text;
  }
  return text.replace(URL_QUERY_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) {
      return match;
    }
    return `${prefix}${key}=${maskSecretValue(token, { hinted: true })}`;
  });
}
function redactEncodedFormPairs(text) {
  if (!text || !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) {
    return text;
  }
  return text.replace(ENCODED_FORM_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) {
      return match;
    }
    return `${prefix}${key}=${maskSecretValue(token)}`;
  });
}
function redactFormBodyContextSinglePairs(text) {
  if (!text || !/[=:]/u.test(text)) {
    return text;
  }
  return text.replace(
    FORM_BODY_CONTEXT_SINGLE_PAIR_RE,
    (match, prefix, _quote, key, token, suffix) => {
      if (!isSensitiveBodyKey(key)) {
        return match;
      }
      return `${prefix}${key}=${maskSecretValue(token)}${suffix}`;
    }
  );
}
function redactFormBodyLine(text) {
  if (!text) {
    return text;
  }
  const contextRedacted = redactFormBodyContextSinglePairs(redactEncodedFormPairs(text));
  if (!contextRedacted.includes("&")) {
    return contextRedacted;
  }
  if (FORM_BODY_RE.test(contextRedacted)) {
    return redactFormEncodedPairs(contextRedacted);
  }
  const redacted = contextRedacted.replace(
    FORM_BODY_SUBSTRING_RE,
    (match, prefix, body) => {
      const redactedBody = redactFormEncodedPairs(body);
      return redactedBody === body ? match : `${prefix}${redactedBody}`;
    }
  );
  return redactFormBodyContextSinglePairs(redactEncodedFormPairs(redacted));
}
function redactFormBody(text) {
  if (!text) {
    return text;
  }
  if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
    return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map(
      (segment) => FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment)
    ).join("");
  }
  return redactFormBodyLine(text);
}
function redactPemBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return "***";
  }
  return `${lines[0]}
\u2026redacted\u2026
${lines[lines.length - 1]}`;
}
function isShellReferenceToKey(key, value) {
  if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
    return false;
  }
  const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
  if (bare) {
    return bare[1] === key;
  }
  const braced = value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/);
  return braced?.[1] === key;
}
function readEnvAssignmentKey(match) {
  return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
  const key = readEnvAssignmentKey(match);
  return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
  return /^[-=?+]\}$/.test(token);
}
function hasBackreferenceToGroup(pattern, groupNumber) {
  return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
  const tokens = groups.map((value, index) => ({ index, value })).filter(({ value }) => typeof value === "string" && value.length > 0);
  const selected = (tokens.length > 1 ? tokens[tokens.length - 1] : tokens[0]) ?? {
    index: -1,
    value: match
  };
  return {
    ...selected,
    captureCount: tokens.length
  };
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
  if (matchOffset < 0 || !input) {
    return null;
  }
  try {
    const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
    const indexedPattern = new RegExp(pattern.source, flags);
    indexedPattern.lastIndex = matchOffset;
    const indexedMatch = indexedPattern.exec(input);
    const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
    if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match) {
      return null;
    }
    if (!captureIndices) {
      return null;
    }
    return captureIndices[0] - matchOffset;
  } catch {
    return null;
  }
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
  const indexedTokenStart = getIndexedCaptureStart(
    pattern,
    input,
    match,
    matchOffset,
    selected.index
  );
  const preferFirstCapture = selected.captureCount === 1 && selected.index >= 0 && hasBackreferenceToGroup(pattern, selected.index + 1);
  return indexedTokenStart ?? (preferFirstCapture ? match.indexOf(selected.value) : match.lastIndexOf(selected.value));
}
function redactMatch(match, groups, pattern, context) {
  if (match.includes("PRIVATE KEY-----")) {
    return redactPemBlock(match);
  }
  const selected = selectSecretCapture(match, groups);
  const token = selected.value;
  if (splitSecretValueForMask(token).maskable === "***") {
    return match;
  }
  const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
  if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) {
    return match;
  }
  const masked = isShellReferencePattern ? maskToken(token) : maskSecretValue(token, { hinted: true });
  if (token === match) {
    return masked;
  }
  const tokenIndex = getSecretCaptureStart(
    pattern,
    context?.input ?? "",
    match,
    context?.offset ?? -1,
    selected
  );
  if (tokenIndex < 0) {
    return match;
  }
  return `${match.slice(0, tokenIndex)}${masked}${match.slice(tokenIndex + token.length)}`;
}
function redactText(text, patterns, options) {
  let next = text;
  if (options?.redactStructuredAuthHeaders) {
    next = redactStructuredAuthHeaders(next, "***");
  }
  if (options?.redactFormBodies) {
    next = redactUrlQueryPairs(next);
    next = redactFormBody(next);
  }
  for (const pattern of patterns) {
    const replacer = (...args) => {
      const hasNamedGroups = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null;
      const inputIndex = hasNamedGroups ? args.length - 2 : args.length - 1;
      const offsetIndex = inputIndex - 1;
      const match = typeof args[0] === "string" ? args[0] : "";
      const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
      const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
      const input = typeof args[inputIndex] === "string" ? args[inputIndex] : "";
      return redactMatch(match, groups, pattern, { input, offset });
    };
    next = options?.fullContext || chunkUnsafePatterns.has(pattern) ? next.replace(pattern, replacer) : replacePatternBounded(next, pattern, replacer);
  }
  return next;
}
function couldMatchDefaultRedactPatterns(text) {
  return DEFAULT_REDACT_PREFILTER_RE.test(text);
}
function looksLikeAppSpecificPassword(candidate) {
  return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
  return replacePatternBounded(
    text,
    APP_SPECIFIC_PASSWORD_RE,
    (match, token) => looksLikeAppSpecificPassword(token) ? redactMatch(match, [token], APP_SPECIFIC_PASSWORD_RE) : match
  );
}
function resolveConfigRedaction() {
  const cfg = readLoggingConfig();
  return {
    mode: normalizeMode(cfg?.redactSensitive),
    patterns: cfg?.redactPatterns
  };
}
function resolveRedactOptions(options) {
  const resolved = options ?? resolveConfigRedaction();
  const mode = normalizeMode(resolved.mode);
  if (mode === "off") {
    return {
      mode,
      patterns: [],
      redactFormBodies: false
    };
  }
  const patterns = resolvePatterns(resolved.patterns);
  const includesDefaults = patterns.length > 0 && includesDefaultRedactPatterns(resolved.patterns);
  return {
    mode,
    patterns,
    redactFormBodies: includesDefaults,
    redactStructuredAuthHeaders: includesDefaults
  };
}
function redactSensitiveText2(text, options) {
  if (!text) {
    return text;
  }
  const exactRedacted = redactRegisteredSecretValues(text, maskToken);
  const resolvedOptions = options ?? resolveConfigRedaction();
  if (normalizeMode(resolvedOptions.mode) === "off") {
    return exactRedacted;
  }
  if (!resolvedOptions.patterns?.length && !couldMatchDefaultRedactPatterns(exactRedacted)) {
    return exactRedacted;
  }
  const resolved = resolveRedactOptions(resolvedOptions);
  if (!resolved.patterns.length) {
    return exactRedacted;
  }
  return redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
    redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
  });
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
  const userPatterns = loggingConfig?.redactPatterns;
  const patterns = userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0;
  return { mode: "tools", patterns };
}
function isSensitiveFieldKey(key) {
  return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function redactSensitiveFieldValueWithOptions(key, value, options, path17 = [key]) {
  const exactRedacted = redactRegisteredSecretValues(value, maskToken);
  const resolved = resolveRedactOptions(options);
  if (resolved.mode === "off") {
    return exactRedacted;
  }
  const redacted = redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
    redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
  });
  const shouldRedactAppPassword = redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key);
  if (shouldRedactAppPassword) {
    const appRedacted = redactAppSpecificPasswords(redacted);
    if (appRedacted !== value) {
      return appRedacted;
    }
  }
  if (redacted !== value) {
    return redacted;
  }
  const normalizedStructuredKey = key.toLowerCase();
  if (shouldRedactStructuredAuthorizationCode(normalizedStructuredKey, path17)) {
    return maskToken(value);
  }
  if (normalizedStructuredKey === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(exactRedacted)) {
    return exactRedacted;
  }
  if (isSensitiveFieldKey(key)) {
    if (isShellReferenceToKey(key, exactRedacted)) {
      return exactRedacted;
    }
    return maskToken(exactRedacted);
  }
  return exactRedacted;
}
function pathEndsWith(path17, suffix) {
  if (path17.length < suffix.length) {
    return false;
  }
  return suffix.every((part, index) => path17[path17.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path17) {
  if (normalizedKey !== "code") {
    return false;
  }
  const normalizedPath = path17.map((part) => part.toLowerCase());
  if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) {
    return false;
  }
  return true;
}
function shouldRedactStructuredPrimitiveField(key, path17) {
  const normalizedKey = key.toLowerCase();
  return shouldRedactStructuredAuthorizationCode(normalizedKey, path17) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path17 = key ? [key] : []) {
  if (typeof value === "string") {
    return redactSensitiveFieldValueWithOptions(key, value, options, path17);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return shouldRedactStructuredPrimitiveField(key, path17) ? "***" : value;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path17));
    seen.delete(value);
    return out;
  }
  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }
    if (!isPlainRedactableObject(value)) {
      return value;
    }
    seen.add(value);
    const out = {};
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      out[nestedKey] = redactStructuredSecretValue(nestedKey, nestedValue, seen, options, [
        ...path17,
        nestedKey
      ]);
    }
    seen.delete(value);
    return out;
  }
  return value;
}
function redactSecrets(value) {
  const options = resolveToolPayloadRedaction();
  if (typeof value === "string") {
    return redactSensitiveText2(value, options);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value !== "object") {
    return value;
  }
  return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
function formatErrorMessage2(err) {
  return formatErrorMessage(err, { redact: redactSensitiveText2 });
}
var SQLITE_WAL_RESET_FIXED_VERSION = { major: 3, minor: 51, patch: 3 };
var SQLITE_WAL_RESET_BACKPORTS = [
  { major: 3, minor: 44, patch: 6 },
  { major: 3, minor: 50, patch: 7 }
];
var SQLITE_VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/u;
function parseSqliteVersion(value) {
  const match = SQLITE_VERSION_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  const major = Number.parseInt(match[1] ?? "", 10);
  const minor = Number.parseInt(match[2] ?? "", 10);
  const patch = Number.parseInt(match[3] ?? "", 10);
  if (![major, minor, patch].every(Number.isSafeInteger)) {
    return null;
  }
  return { major, minor, patch };
}
function compareSqliteVersions(left, right) {
  if (left.major !== right.major) {
    return left.major - right.major;
  }
  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }
  return left.patch - right.patch;
}
function isSqliteWalResetSafeVersion(value) {
  return true;
  const version = parseSqliteVersion(value);
  if (!version) {
    return false;
  }
  if (compareSqliteVersions(version, SQLITE_WAL_RESET_FIXED_VERSION) >= 0) {
    return true;
  }
  return SQLITE_WAL_RESET_BACKPORTS.some(
    (backport) => version.major === backport.major && version.minor === backport.minor && version.patch >= backport.patch
  );
}
function resolveGlobalSingleton(key, create) {
  const globalStore2 = globalThis;
  if (Object.hasOwn(globalStore2, key)) {
    return globalStore2[key];
  }
  const created = create();
  globalStore2[key] = created;
  return created;
}
var warningFilterKey = /* @__PURE__ */ Symbol.for("openclaw.warning-filter");
function shouldIgnoreWarning(warning) {
  if (warning.code === "DEP0040" && warning.message?.includes("punycode")) {
    return true;
  }
  if (warning.code === "DEP0060" && warning.message?.includes("util._extend")) {
    return true;
  }
  if (warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature")) {
    return true;
  }
  return false;
}
function normalizeWarningArgs(args) {
  const warningArg = args[0];
  const secondArg = args[1];
  const thirdArg = args[2];
  let name;
  let code;
  let message;
  if (warningArg instanceof Error) {
    name = warningArg.name;
    message = warningArg.message;
    code = warningArg.code;
  } else if (typeof warningArg === "string") {
    message = warningArg;
  }
  if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
    const options = secondArg;
    if (typeof options.type === "string") {
      name = options.type;
    }
    if (typeof options.code === "string") {
      code = options.code;
    }
  } else {
    if (typeof secondArg === "string") {
      name = secondArg;
    }
    if (typeof thirdArg === "string") {
      code = thirdArg;
    }
  }
  return { name, code, message };
}
function installProcessWarningFilter() {
  const state = resolveGlobalSingleton(warningFilterKey, () => ({
    installed: false
  }));
  if (state.installed) {
    return;
  }
  const originalEmitWarning = process.emitWarning.bind(process);
  const wrappedEmitWarning = ((...args) => {
    if (shouldIgnoreWarning(normalizeWarningArgs(args))) {
      return;
    }
    if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
      const warning = args[0];
      const emitted = Object.assign(new Error(warning.message), {
        name: warning.name,
        code: warning.code
      });
      process.emit("warning", emitted);
      return;
    }
    Reflect.apply(originalEmitWarning, process, args);
  });
  process.emitWarning = wrappedEmitWarning;
  state.installed = true;
}
var require2 = createRequire(import.meta.url);
var validatedSqliteModule;
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
  if (isSqliteWalResetSafeVersion(version)) {
    return;
  }
  const variables = process.config?.variables;
  const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
  const wording = isShared ? "uses shared system" : "embeds";
  const remediation = isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 22.22.3+, 24.15.0+, or 25.9.0+ before retrying.";
  throw new Error(
    `OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${wording} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${remediation}`
  );
}
function assertSafeSqliteRuntime(sqlite) {
  if (validatedSqliteModule === sqlite) {
    return;
  }
  const database = new sqlite.DatabaseSync(":memory:");
  try {
    const row = database.prepare("SELECT sqlite_version() AS version").get();
    const version = typeof row?.version === "string" ? row.version : "unknown";
    assertSqliteWalResetSafeVersion(version, process.versions.node);
    validatedSqliteModule = sqlite;
  } finally {
    database.close();
  }
}
function requireNodeSqlite() {
  installProcessWarningFilter();
  try {
    const sqlite = require2("node:sqlite");
    assertSafeSqliteRuntime(sqlite);
    return sqlite;
  } catch (err) {
    const message = formatErrorMessage2(err);
    throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, {
      cause: err
    });
  }
}
var SQLITE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
function repairCanonicalSqliteUniqueIndexes(db, databaseLabel, indexes) {
  const drifted = indexes.filter((index) => {
    assertSqliteIdentifier(index.name);
    const row = db.prepare("SELECT sql FROM main.sqlite_schema WHERE type = 'index' AND name = ?").get(index.name);
    return typeof row?.sql !== "string" || normalizeCreateIndexSql(row.sql) !== normalizeCreateIndexSql(createIndexSql(index, index.name, false));
  });
  if (drifted.length === 0) {
    return;
  }
  const savepoint = "repair_canonical_unique_indexes";
  let activeIndex;
  db.exec(`SAVEPOINT ${savepoint};`);
  try {
    for (const index of drifted) {
      activeIndex = index;
      const probeName = findUnusedProbeIndexName(db, index.name);
      db.exec(createIndexSql(index, probeName, true));
      db.exec(`DROP INDEX main.${index.name};`);
      db.exec(createIndexSql(index, index.name, true));
      db.exec(`DROP INDEX main.${probeName};`);
    }
    db.exec(`RELEASE SAVEPOINT ${savepoint};`);
  } catch (error) {
    try {
      db.exec(`ROLLBACK TO SAVEPOINT ${savepoint};`);
    } finally {
      db.exec(`RELEASE SAVEPOINT ${savepoint};`);
    }
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `SQLite canonical unique index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`,
      { cause: error }
    );
  }
}
function createIndexSql(index, name, qualifyMain) {
  assertSqliteIdentifier(name);
  return `CREATE UNIQUE INDEX ${qualifyMain ? `main.${name}` : name} ${index.definition};`;
}
function findUnusedProbeIndexName(db, canonicalName) {
  const prefix = `openclaw_probe_${canonicalName}`;
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? prefix : `${prefix}_${suffix}`;
    const row = db.prepare("SELECT 1 AS found FROM main.sqlite_schema WHERE name = ?").get(candidate);
    if (!row) {
      return candidate;
    }
  }
  throw new Error(`could not allocate a probe index name for ${canonicalName}`);
}
function assertSqliteIdentifier(identifier) {
  if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error(`invalid SQLite identifier: ${identifier}`);
  }
}
function normalizeCreateIndexSql(sql) {
  return sql.trim().replace(/;\s*$/u, "").replace(/^CREATE\s+UNIQUE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?/iu, "CREATE UNIQUE INDEX ").replace(/\s+/gu, " ").trim();
}
var MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SQLITE_CORRUPT_ERRCODE = 11;
var SQLITE_NOTADB_ERRCODE = 26;
function isTerminalSqliteIntegrityError(error) {
  if (error.name !== "SqliteIntegrityError") {
    return false;
  }
  const cause = error.cause;
  if (!cause) {
    return true;
  }
  if (typeof cause.errcode !== "number") {
    return false;
  }
  const primaryCode = cause.errcode & 255;
  return primaryCode === SQLITE_CORRUPT_ERRCODE || primaryCode === SQLITE_NOTADB_ERRCODE;
}
function assertSqliteIntegrity(database, databaseLabel) {
  const integrityCheck = runSqliteCheck(database, databaseLabel, "integrity_check");
  runSqliteForeignKeyCheck(database, databaseLabel);
  return { integrityCheck };
}
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
  runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
  const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
  let rows;
  try {
    rows = database.prepare(`PRAGMA ${pragma}${argument};`).all();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createSqliteIntegrityError(
      `SQLite ${pragma} failed for ${databaseLabel}: ${message}`,
      error
    );
  }
  const results = rows.map((row) => row[pragma] ?? Object.values(row)[0]);
  if (results.length === 1 && results[0] === "ok") {
    return "ok";
  }
  const details = results.map((result) => String(result)).join("; ") || "no result";
  throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${details}`);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
  let violationCount = 0;
  const violations = [];
  try {
    const statement = database.prepare("PRAGMA foreign_key_check;");
    statement.setReadBigInts(true);
    for (const violation of statement.iterate()) {
      violationCount += 1;
      retainSortedForeignKeyViolation(violations, violation);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createSqliteIntegrityError(
      `SQLite foreign_key_check failed for ${databaseLabel}: ${message}`,
      error
    );
  }
  if (violations.length === 0) {
    return;
  }
  const details = violations.map(formatSqliteForeignKeyViolation);
  if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) {
    details.push("additional violations omitted");
  }
  throw createSqliteIntegrityError(
    `SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`
  );
}
function createSqliteIntegrityError(message, cause) {
  const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
  error.name = "SqliteIntegrityError";
  return error;
}
function retainSortedForeignKeyViolation(retained, violation) {
  retained.push(violation);
  retained.sort(compareSqliteForeignKeyViolations);
  if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) {
    retained.pop();
  }
}
function compareSqliteForeignKeyViolations(left, right) {
  const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
  if (tableOrder !== 0) {
    return tableOrder;
  }
  if (left.rowid === null || right.rowid === null) {
    if (left.rowid !== right.rowid) {
      return left.rowid === null ? -1 : 1;
    }
  } else if (left.rowid !== right.rowid) {
    return left.rowid < right.rowid ? -1 : 1;
  }
  const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
  if (parentOrder !== 0) {
    return parentOrder;
  }
  if (left.fkid === right.fkid) {
    return 0;
  }
  return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
  const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
  return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
var activeStream = null;
function clearActiveProgressLine() {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1B[2K");
}
var globalVerbose = false;
function isVerbose() {
  return globalVerbose;
}
var RESET_SEQUENCE = "\x1B[0m\x1B[?25h\x1B[?1000l\x1B[?1002l\x1B[?1003l\x1B[?1006l\x1B[?2004l\x1B[<u\x1B[>4;0m";
function reportRestoreFailure(scope, err, reason) {
  const suffix = reason ? ` (${reason})` : "";
  const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
  try {
    process.stderr.write(`${message}
`);
  } catch (writeErr) {
    console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
  }
}
function restoreTerminalState(reason, options = {}) {
  const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
  const resetStream = options.resetStream ?? process.stdout;
  try {
    clearActiveProgressLine();
  } catch (err) {
    reportRestoreFailure("progress line", err, reason);
  }
  const stdin = process.stdin;
  if (stdin.isTTY && typeof stdin.setRawMode === "function") {
    try {
      stdin.setRawMode(false);
    } catch (err) {
      reportRestoreFailure("raw mode", err, reason);
    }
    if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) {
      try {
        stdin.resume();
      } catch (err) {
        reportRestoreFailure("stdin resume", err, reason);
      }
    }
  }
  if (resetStream.isTTY) {
    try {
      resetStream.write(RESET_SEQUENCE);
    } catch (err) {
      reportRestoreFailure("terminal reset", err, reason);
    }
  }
}
function shouldEmitRuntimeLog(env = process.env) {
  if (env.VITEST !== "true") {
    return true;
  }
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") {
    return true;
  }
  const maybeMockedLog = console.log;
  return typeof maybeMockedLog.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
  if (env.VITEST !== "true") {
    return true;
  }
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") {
    return true;
  }
  const stdout = process.stdout;
  return typeof stdout.write.mock === "object";
}
function isPipeClosedError(err) {
  const code = err?.code;
  return code === "EPIPE" || code === "EIO";
}
function writeStdout(value) {
  if (!shouldEmitRuntimeStdout()) {
    return;
  }
  clearActiveProgressLine();
  const line = value.endsWith("\n") ? value : `${value}
`;
  try {
    process.stdout.write(line);
  } catch (err) {
    if (isPipeClosedError(err)) {
      return;
    }
    throw err;
  }
}
function createRuntimeIo() {
  return {
    log: (...args) => {
      if (!shouldEmitRuntimeLog()) {
        return;
      }
      clearActiveProgressLine();
      console.log(...args);
    },
    error: (...args) => {
      clearActiveProgressLine();
      console.error(...args);
    },
    writeStdout,
    writeJson: (value, space = 2) => {
      writeStdout(JSON.stringify(value, null, space > 0 ? space : void 0));
    }
  };
}
var defaultRuntime = {
  ...createRuntimeIo(),
  exit: (code, opts) => {
    restoreTerminalState("runtime exit", {
      resumeStdinIfPaused: false,
      resetStream: opts?.resetStream
    });
    process.exit(code);
    throw new Error("unreachable");
  }
};
var ALLOWED_LOG_LEVELS = [
  "silent",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace"
];
function tryParseLogLevel(level) {
  if (typeof level !== "string") {
    return void 0;
  }
  const candidate = level.trim();
  return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
  return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
  const map = {
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
    silent: Number.POSITIVE_INFINITY
  };
  return map[level];
}
var LOGGING_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.loggingState");
function createLoggingState() {
  return {
    cachedLogger: null,
    cachedSettings: null,
    cachedConsoleSettings: null,
    overrideSettings: null,
    invalidEnvLogLevelValue: null,
    consolePatched: false,
    forceConsoleToStderr: false,
    consoleTimestampPrefix: false,
    consoleSubsystemFilter: null,
    resolvingConsoleSettings: false,
    streamErrorHandlersInstalled: false,
    rawConsole: null
  };
}
var globalStore = globalThis;
var loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
globalStore[LOGGING_STATE_KEY] = loggingState;
function resolveEnvLogLevelOverride() {
  const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
  if (!trimmed) {
    loggingState.invalidEnvLogLevelValue = null;
    return void 0;
  }
  const parsed = tryParseLogLevel(trimmed);
  if (parsed) {
    loggingState.invalidEnvLogLevelValue = null;
    return parsed;
  }
  if (loggingState.invalidEnvLogLevelValue !== trimmed) {
    loggingState.invalidEnvLogLevelValue = trimmed;
    process.stderr.write(
      `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).
`
    );
  }
  return void 0;
}
var TRACE_ID_RE = /^[0-9a-f]{32}$/;
var SPAN_ID_RE = /^[0-9a-f]{16}$/;
var TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
var DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.diagnosticTraceScope.state.v1");
function isNonZeroHex(value) {
  return !/^0+$/.test(value);
}
function createDiagnosticTraceScopeState() {
  return {
    marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
    storage: new AsyncLocalStorage()
  };
}
function isDiagnosticTraceScopeState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return candidate.marker === DIAGNOSTIC_TRACE_SCOPE_STATE_KEY && candidate.storage instanceof AsyncLocalStorage;
}
function getDiagnosticTraceScopeState() {
  const globalRecord = globalThis;
  const existing = globalRecord[DIAGNOSTIC_TRACE_SCOPE_STATE_KEY];
  if (isDiagnosticTraceScopeState(existing)) {
    return existing;
  }
  const state = createDiagnosticTraceScopeState();
  Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false
  });
  return state;
}
function isValidDiagnosticTraceId(value) {
  return typeof value === "string" && TRACE_ID_RE.test(value) && isNonZeroHex(value);
}
function isValidDiagnosticSpanId(value) {
  return typeof value === "string" && SPAN_ID_RE.test(value) && isNonZeroHex(value);
}
function isValidDiagnosticTraceFlags(value) {
  return typeof value === "string" && TRACE_FLAGS_RE.test(value);
}
function getActiveDiagnosticTraceContext() {
  return getDiagnosticTraceScopeState().storage.getStore();
}
var BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function isBlockedObjectKey(key) {
  return BLOCKED_OBJECT_KEYS.has(key);
}
var MAX_ASYNC_DIAGNOSTIC_EVENTS = 1e4;
var MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN = 100;
var DIAGNOSTIC_EVENTS_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.diagnosticEvents.state.v1");
var dispatchedTrustedDiagnosticMetadata = /* @__PURE__ */ new WeakSet();
var ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
  "tool.execution.started",
  "tool.execution.completed",
  "tool.execution.error",
  "tool.execution.blocked",
  "skill.used",
  "exec.process.completed",
  "exec.approval.followup_suppressed",
  "message.delivery.started",
  "message.delivery.completed",
  "message.delivery.error",
  "talk.event",
  "model.call.started",
  "model.call.completed",
  "model.call.error",
  "run.progress",
  "run.execution_phase",
  "harness.run.completed",
  "harness.run.error",
  "context.assembled",
  "log.record"
]);
var PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
  "tool.execution.completed",
  "tool.execution.error",
  "tool.execution.blocked"
]);
function createDiagnosticEventsState() {
  return {
    marker: DIAGNOSTIC_EVENTS_STATE_KEY,
    enabled: true,
    seq: 0,
    listeners: /* @__PURE__ */ new Set(),
    trustedListeners: /* @__PURE__ */ new Set(),
    toolExecutionListeners: /* @__PURE__ */ new Set(),
    toolExecutionSeq: 0,
    dispatchDepth: 0,
    asyncQueue: [],
    asyncDrainScheduled: false,
    asyncDroppedEvents: 0,
    asyncDroppedTrustedEvents: 0,
    asyncDroppedUntrustedEvents: 0,
    asyncDroppedPriorityEvents: 0
  };
}
function isDiagnosticEventsState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return candidate.marker === DIAGNOSTIC_EVENTS_STATE_KEY && typeof candidate.enabled === "boolean" && typeof candidate.seq === "number" && candidate.listeners instanceof Set && (candidate.trustedListeners === void 0 || candidate.trustedListeners instanceof Set) && (candidate.toolExecutionListeners === void 0 || candidate.toolExecutionListeners instanceof Set) && typeof candidate.dispatchDepth === "number" && Array.isArray(candidate.asyncQueue) && typeof candidate.asyncDrainScheduled === "boolean";
}
function getDiagnosticEventsState() {
  const globalRecord = globalThis;
  const existing = globalRecord[DIAGNOSTIC_EVENTS_STATE_KEY];
  if (isDiagnosticEventsState(existing)) {
    existing.asyncDroppedEvents ??= 0;
    existing.asyncDroppedTrustedEvents ??= 0;
    existing.asyncDroppedUntrustedEvents ??= 0;
    existing.asyncDroppedPriorityEvents ??= 0;
    existing.trustedListeners ??= /* @__PURE__ */ new Set();
    existing.toolExecutionListeners ??= /* @__PURE__ */ new Set();
    existing.toolExecutionSeq ??= 0;
    return existing;
  }
  const state = createDiagnosticEventsState();
  Object.defineProperty(globalThis, DIAGNOSTIC_EVENTS_STATE_KEY, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false
  });
  return state;
}
function dispatchDiagnosticEvent(state, enriched, metadata, privateData, options = {}) {
  if (state.dispatchDepth > 100) {
    console.error(
      `[diagnostic-events] recursion guard tripped at depth=${state.dispatchDepth}, dropping type=${enriched.type}`
    );
    return;
  }
  state.dispatchDepth += 1;
  try {
    if (!options.trustedListenersOnly) {
      for (const listener of state.listeners) {
        try {
          listener(
            cloneDiagnosticEventForListener(enriched),
            createDiagnosticMetadataForListener(metadata)
          );
        } catch (err) {
          const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
          console.error(
            `[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`
          );
        }
      }
    }
    for (const listener of state.trustedListeners) {
      try {
        listener(
          cloneDiagnosticEventForListener(enriched),
          createDiagnosticMetadataForListener(metadata),
          cloneDiagnosticPrivateDataForListener(privateData)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
        console.error(
          `[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`
        );
      }
    }
  } finally {
    state.dispatchDepth -= 1;
  }
}
function createDiagnosticMetadataForListener(metadata) {
  const listenerMetadata = Object.freeze({ ...metadata });
  if (listenerMetadata.trusted) {
    dispatchedTrustedDiagnosticMetadata.add(listenerMetadata);
  }
  return listenerMetadata;
}
function cloneDiagnosticEventForListener(event) {
  return deepFreezeDiagnosticValue(structuredClone(event));
}
function cloneDiagnosticPrivateDataForListener(privateData) {
  if (!privateData) {
    return Object.freeze({});
  }
  return deepFreezeDiagnosticValue(structuredClone(privateData));
}
function isPriorityAsyncDiagnosticEvent(entry) {
  return entry.metadata.trusted && PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(entry.event.type);
}
function noteAsyncDiagnosticDrop(state, entry) {
  state.asyncDroppedEvents += 1;
  if (entry.metadata.trusted) {
    state.asyncDroppedTrustedEvents += 1;
  } else {
    state.asyncDroppedUntrustedEvents += 1;
  }
  if (isPriorityAsyncDiagnosticEvent(entry)) {
    state.asyncDroppedPriorityEvents += 1;
  }
}
function makeRoomForPriorityAsyncDiagnosticEvent(state) {
  const nonPriorityIndex = state.asyncQueue.findIndex(
    (entry) => !isPriorityAsyncDiagnosticEvent(entry)
  );
  if (nonPriorityIndex >= 0) {
    return state.asyncQueue.splice(nonPriorityIndex, 1)[0];
  }
  return state.asyncQueue.shift();
}
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      deepFreezeDiagnosticValue(item, seen);
    }
    return Object.freeze(value);
  }
  for (const nested of Object.values(value)) {
    deepFreezeDiagnosticValue(nested, seen);
  }
  return Object.freeze(value);
}
function scheduleAsyncDiagnosticDrain(state) {
  if (state.asyncDrainScheduled) {
    return;
  }
  state.asyncDrainScheduled = true;
  setImmediate(() => {
    state.asyncDrainScheduled = false;
    const batch = state.asyncQueue.splice(0, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN);
    for (const entry of batch) {
      dispatchDiagnosticEvent(state, entry.event, entry.metadata, entry.privateData, {
        trustedListenersOnly: entry.trustedListenersOnly
      });
    }
    if (state.asyncQueue.length > 0) {
      scheduleAsyncDiagnosticDrain(state);
      return;
    }
    dispatchAsyncDiagnosticDropSummary(state);
  });
}
function dispatchAsyncDiagnosticDropSummary(state) {
  if (state.asyncDroppedEvents <= 0) {
    return;
  }
  const droppedEvents = state.asyncDroppedEvents;
  const droppedTrustedEvents = state.asyncDroppedTrustedEvents;
  const droppedUntrustedEvents = state.asyncDroppedUntrustedEvents;
  const droppedPriorityEvents = state.asyncDroppedPriorityEvents;
  state.asyncDroppedEvents = 0;
  state.asyncDroppedTrustedEvents = 0;
  state.asyncDroppedUntrustedEvents = 0;
  state.asyncDroppedPriorityEvents = 0;
  const event = enrichDiagnosticEvent(state, {
    type: "diagnostic.async_queue.dropped",
    droppedEvents,
    ...droppedTrustedEvents > 0 ? { droppedTrustedEvents } : {},
    ...droppedUntrustedEvents > 0 ? { droppedUntrustedEvents } : {},
    ...droppedPriorityEvents > 0 ? { droppedPriorityEvents } : {},
    queueLength: state.asyncQueue.length,
    maxQueueLength: MAX_ASYNC_DIAGNOSTIC_EVENTS,
    drainBatchSize: MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN
  });
  dispatchDiagnosticEvent(state, event, createInternalDiagnosticMetadata(false));
}
function enrichDiagnosticEvent(state, event) {
  const enriched = {};
  for (const [key, value] of Object.entries(event)) {
    if (isBlockedObjectKey(key)) {
      continue;
    }
    enriched[key] = value;
  }
  enriched.trace ??= getActiveDiagnosticTraceContext();
  state.seq += 1;
  enriched.seq = state.seq;
  enriched.ts = Date.now();
  return enriched;
}
function createInternalDiagnosticMetadata(trusted) {
  return { internal: true, trusted };
}
function emitDiagnosticEventWithTrust(event, trusted, options = {}) {
  const state = getDiagnosticEventsState();
  if (trusted && isToolExecutionEventInput(event)) {
    dispatchTrustedToolExecutionEvent(state, event);
  }
  if (!state.enabled) {
    return;
  }
  if (event.type === "security.event" && options.allowSecurityEvent !== true) {
    return;
  }
  const enriched = enrichDiagnosticEvent(state, event);
  const { internal = false, privateData } = options;
  const trustedTraceContext = options.trustedTraceContext === true;
  const metadata = {
    ...internal ? createInternalDiagnosticMetadata(trusted) : { trusted },
    ...trustedTraceContext ? { trustedTraceContext } : {}
  };
  if (ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
    if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
      if (!trusted || !PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
        noteAsyncDiagnosticDrop(state, { event: enriched, metadata, privateData });
        return;
      }
      const droppedEntry = makeRoomForPriorityAsyncDiagnosticEvent(state);
      if (droppedEntry) {
        noteAsyncDiagnosticDrop(state, droppedEntry);
      }
    }
    state.asyncQueue.push({ event: enriched, metadata, privateData });
    scheduleAsyncDiagnosticDrain(state);
    return;
  }
  dispatchDiagnosticEvent(state, enriched, metadata, privateData);
}
function isToolExecutionEventInput(event) {
  return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
  state.toolExecutionSeq += 1;
  let enriched;
  try {
    enriched = deepFreezeDiagnosticValue(
      structuredClone({ ...event, seq: state.toolExecutionSeq, ts: Date.now() })
    );
  } catch (error) {
    console.error(
      `[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`
    );
    return;
  }
  for (const listener of state.toolExecutionListeners) {
    try {
      listener(enriched);
    } catch (error) {
      console.error(
        `[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`
      );
    }
  }
}
function emitDiagnosticEvent(event) {
  emitDiagnosticEventWithTrust(event, false);
}
function emitDiagnosticEventWithTrustedTraceContext(event) {
  emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
var hasPythonModeOverride = process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;
if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
}
var POSIX_OPENCLAW_TMP_DIR = "/tmp/openclaw";
function isNodeErrorWithCode(err, code) {
  return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolvePreferredOpenClawTmpDir(options = {}) {
  const accessMode = fs4.constants.W_OK | fs4.constants.X_OK;
  const accessSync = options.accessSync ?? fs4.accessSync;
  const chmodSync2 = options.chmodSync ?? fs4.chmodSync;
  const lstatSync = options.lstatSync ?? fs4.lstatSync;
  const mkdirSync3 = options.mkdirSync ?? fs4.mkdirSync;
  const warn3 = options.warn ?? ((message) => console.warn(message));
  const getuid = options.getuid ?? (() => {
    try {
      return typeof process.getuid === "function" ? process.getuid() : void 0;
    } catch {
      return void 0;
    }
  });
  const tmpdir = typeof options.tmpdir === "function" ? options.tmpdir : getOsTmpDir;
  const platform = options.platform ?? process.platform;
  const uid = getuid();
  const isSecureDirForUser = (st) => {
    if (uid === void 0) {
      return true;
    }
    if (typeof st.uid === "number" && st.uid !== uid) {
      return false;
    }
    return typeof st.mode !== "number" || (st.mode & 18) === 0;
  };
  const fallback = () => {
    const suffix = uid === void 0 ? "openclaw" : `openclaw-${uid}`;
    const joiner = platform === "win32" ? path5.win32.join : path5.join;
    return joiner(tmpdir(), suffix);
  };
  const isTrustedTmpDir = (st) => st.isDirectory() && !st.isSymbolicLink() && isSecureDirForUser(st);
  const resolveDirState = (candidatePath) => {
    try {
      const candidate = lstatSync(candidatePath);
      if (!isTrustedTmpDir(candidate)) {
        return "invalid";
      }
      accessSync(candidatePath, accessMode);
      return "available";
    } catch (err) {
      return isNodeErrorWithCode(err, "ENOENT") ? "missing" : "invalid";
    }
  };
  const tryRepairWritableBits = (candidatePath) => {
    try {
      const st = lstatSync(candidatePath);
      if (!st.isDirectory() || st.isSymbolicLink()) {
        return false;
      }
      if (uid !== void 0 && typeof st.uid === "number" && st.uid !== uid) {
        return false;
      }
      if (typeof st.mode !== "number") {
        return false;
      }
      if ((st.mode & 18) === 0) {
        return resolveDirState(candidatePath) === "available";
      }
      try {
        chmodSync2(candidatePath, 448);
      } catch (chmodErr) {
        if (isNodeErrorWithCode(chmodErr, "EPERM") || isNodeErrorWithCode(chmodErr, "EACCES") || isNodeErrorWithCode(chmodErr, "ENOENT")) {
          return resolveDirState(candidatePath) === "available";
        }
        throw chmodErr;
      }
      warn3(`[openclaw] tightened permissions on temp dir: ${candidatePath}`);
      return resolveDirState(candidatePath) === "available";
    } catch {
      return false;
    }
  };
  const ensureTrustedFallbackDir = () => {
    const fallbackPath = fallback();
    const state = resolveDirState(fallbackPath);
    if (state === "available") {
      return fallbackPath;
    }
    if (state === "invalid") {
      if (tryRepairWritableBits(fallbackPath)) {
        return fallbackPath;
      }
      throw new Error(`Unsafe fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    try {
      mkdirSync3(fallbackPath, { recursive: true, mode: 448 });
      chmodSync2(fallbackPath, 448);
    } catch {
      throw new Error(`Unable to create fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    if (resolveDirState(fallbackPath) !== "available" && !tryRepairWritableBits(fallbackPath)) {
      throw new Error(`Unsafe fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    return fallbackPath;
  };
  if (platform === "win32") {
    return ensureTrustedFallbackDir();
  }
  const preferredDir = POSIX_OPENCLAW_TMP_DIR;
  const preferredState = resolveDirState(preferredDir);
  if (preferredState === "available") {
    return preferredDir;
  }
  if (preferredState === "invalid") {
    if (tryRepairWritableBits(preferredDir)) {
      return preferredDir;
    }
    return ensureTrustedFallbackDir();
  }
  try {
    accessSync(path5.dirname(preferredDir), accessMode);
    mkdirSync3(preferredDir, { recursive: true, mode: 448 });
    chmodSync2(preferredDir, 448);
    if (resolveDirState(preferredDir) !== "available" && !tryRepairWritableBits(preferredDir)) {
      return ensureTrustedFallbackDir();
    }
    return preferredDir;
  } catch {
    return ensureTrustedFallbackDir();
  }
}
var LOG_PREFIX = "openclaw";
var LOG_SUFFIX = ".log";
function canUseNodeFs() {
  const getBuiltinModule = process.getBuiltinModule;
  if (typeof getBuiltinModule !== "function") {
    return false;
  }
  try {
    return getBuiltinModule("fs") !== void 0;
  } catch {
    return false;
  }
}
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
var validTimeZoneCache = /* @__PURE__ */ new Map();
var timestampFormatterCache = /* @__PURE__ */ new Map();
var hostTimeZone;
function isValidTimeZone(tz) {
  const cached = validTimeZoneCache.get(tz);
  if (cached !== void 0) {
    return cached;
  }
  let valid;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz }).format();
    valid = true;
  } catch {
    valid = false;
  }
  validTimeZoneCache.set(tz, valid);
  return valid;
}
function resolveEffectiveTimeZone(timeZone) {
  const explicit = timeZone ?? process.env.TZ;
  return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
  return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
  const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
  let fmt = timestampFormatterCache.get(effectiveTimeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en", {
      timeZone: effectiveTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      fractionalSecondDigits: 3,
      timeZoneName: "longOffset"
    });
    timestampFormatterCache.set(effectiveTimeZone, fmt);
  }
  const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    fractionalSecond: parts.fractionalSecond,
    offset: formatOffset(parts.timeZoneName ?? "GMT")
  };
}
function formatTimestamp(date, options) {
  const style = options?.style ?? "medium";
  const parts = getTimestampParts(date, options?.timeZone);
  switch (style) {
    case "short":
      return `${parts.hour}:${parts.minute}:${parts.second}${parts.offset}`;
    case "medium":
      return `${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
    case "long":
      return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
  }
  throw new Error("Unsupported timestamp style");
}
function resolveDefaultLogDir() {
  return canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : POSIX_OPENCLAW_TMP_DIR;
}
function resolveDefaultLogFile(defaultLogDir) {
  return canUseNodeFs() ? path6.join(defaultLogDir, "openclaw.log") : `${POSIX_OPENCLAW_TMP_DIR}/openclaw.log`;
}
var DEFAULT_LOG_DIR = resolveDefaultLogDir();
var DEFAULT_LOG_FILE = resolveDefaultLogFile(DEFAULT_LOG_DIR);
var MAX_LOG_AGE_MS = 24 * 60 * 60 * 1e3;
var DEFAULT_MAX_LOG_FILE_BYTES = 100 * 1024 * 1024;
var MAX_ROTATED_LOG_FILES = 5;
var MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8 * 1024;
var MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4 * 1024;
var loadLoggerConfigDefault = () => readLoggingConfig();
var loadLoggerConfig = loadLoggerConfigDefault;
var MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
var MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2 * 1024;
var MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
var MAX_FILE_LOG_MESSAGE_CHARS = 4 * 1024;
var MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
var DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
var defaultHostnameResolver = () => os3.hostname();
var hostnameResolver = defaultHostnameResolver;
var cachedHostname = null;
function clampDiagnosticLogText(value, maxChars) {
  return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
  return clampDiagnosticLogText(
    redactSensitiveText2(clampDiagnosticLogText(value, maxChars)),
    maxChars
  );
}
function normalizeDiagnosticLogName(value) {
  if (!value || value.trim().startsWith("{")) {
    return void 0;
  }
  const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
  return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
  if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) {
    return;
  }
  const normalizedKey = key.trim();
  if (isBlockedObjectKey(normalizedKey)) {
    return;
  }
  if (redactSensitiveText2(normalizedKey) !== normalizedKey) {
    return;
  }
  if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) {
    return;
  }
  if (typeof value === "string") {
    attributes[normalizedKey] = sanitizeDiagnosticLogText(
      value,
      MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS
    );
    state.count += 1;
    return;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    attributes[normalizedKey] = value;
    state.count += 1;
    return;
  }
  if (typeof value === "boolean") {
    attributes[normalizedKey] = value;
    state.count += 1;
  }
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
  if (!source) {
    return;
  }
  for (const key in source) {
    if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) {
      break;
    }
    if (!Object.hasOwn(source, key) || key === "trace") {
      continue;
    }
    assignDiagnosticLogAttribute(attributes, state, key, source[key]);
  }
}
function isPlainLogRecordObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const candidate = value;
  if (!isValidDiagnosticTraceId(candidate.traceId)) {
    return void 0;
  }
  if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) {
    return void 0;
  }
  if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) {
    return void 0;
  }
  if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) {
    return void 0;
  }
  return {
    traceId: candidate.traceId,
    ...candidate.spanId ? { spanId: candidate.spanId } : {},
    ...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
    ...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
  };
}
function extractTraceContext(value) {
  const direct = normalizeTraceContext(value);
  if (direct) {
    return direct;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  return normalizeTraceContext(value.trace);
}
function getSortedNumericLogArgs(logObj) {
  return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0])).map(([, value]) => value);
}
function clampFileLogText(value, maxChars) {
  return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  return void 0;
}
function readFirstContextString(sources, keys) {
  for (const source of sources) {
    if (!source) {
      continue;
    }
    for (const key of keys) {
      const value = normalizeFileLogContextValue(source[key]);
      if (value) {
        return value;
      }
    }
  }
  return void 0;
}
function stringifyFileLogMessagePart(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Error) {
    return value.message || value.name;
  }
  if (isPlainLogRecordObject(value) && typeof value.message === "string") {
    return value.message;
  }
  if (value === null || value === void 0) {
    return void 0;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return void 0;
  }
}
function buildFileLogMessage(numericArgs) {
  const parts = numericArgs.map(stringifyFileLogMessagePart).filter((part) => Boolean(part && part.trim()));
  if (parts.length === 0) {
    return void 0;
  }
  return clampFileLogText(parts.join(" "), MAX_FILE_LOG_MESSAGE_CHARS);
}
function resolveLogHostname() {
  if (cachedHostname) {
    return cachedHostname;
  }
  const hostname = hostnameResolver().trim();
  if (!hostname) {
    return "unknown";
  }
  cachedHostname = hostname;
  return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return meta;
  }
  return { ...meta, hostname };
}
function extractLogBindingPrefix(numericArgs) {
  if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(numericArgs[0]);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return {
          bindings: parsed,
          args: numericArgs.slice(1)
        };
      }
    } catch {
    }
  }
  return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
  const fromBindings = extractTraceContext(bindings);
  if (fromBindings) {
    return fromBindings;
  }
  for (const arg of numericArgs) {
    const fromArg = extractTraceContext(arg);
    if (fromArg) {
      return fromArg;
    }
  }
  return void 0;
}
function resolveLogTraceContext(bindings, numericArgs) {
  const explicitTrace = findLogTraceContext(bindings, numericArgs);
  if (explicitTrace) {
    return { trace: explicitTrace, trustedTraceContext: false };
  }
  const activeTrace = getActiveDiagnosticTraceContext();
  return activeTrace ? { trace: activeTrace, trustedTraceContext: true } : { trustedTraceContext: false };
}
function buildTraceFileLogFields(logObj) {
  const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const { trace } = resolveLogTraceContext(bindings, args);
  if (!trace) {
    return void 0;
  }
  return {
    traceId: trace.traceId,
    ...trace.spanId ? { spanId: trace.spanId } : {},
    ...trace.parentSpanId ? { parentSpanId: trace.parentSpanId } : {},
    ...trace.traceFlags ? { traceFlags: trace.traceFlags } : {}
  };
}
function buildStructuredFileLogFields(logObj) {
  const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
  const sources = [structuredArg, bindings, logObj];
  const messageArgs = structuredArg && typeof structuredArg.message !== "string" ? args.slice(1) : args;
  const message = buildFileLogMessage(messageArgs);
  const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
  const sessionId = readFirstContextString(sources, ["session_id", "sessionId", "sessionKey"]);
  const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
  return {
    hostname: resolveLogHostname(),
    ...message ? { message } : {},
    ...agentId ? { agent_id: agentId } : {},
    ...sessionId ? { session_id: sessionId } : {},
    ...channel ? { channel } : {}
  };
}
function buildDiagnosticLogRecord(logObj) {
  const meta = logObj["_meta"];
  const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
  const structuredArg = numericArgs[0];
  const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
  if (structuredBindings) {
    numericArgs.shift();
  }
  let message = "";
  if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") {
    message = sanitizeDiagnosticLogText(
      String(numericArgs.pop()),
      MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS
    );
  } else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
    message = String(numericArgs[0]);
    numericArgs.length = 0;
  }
  if (!message) {
    message = "log";
  }
  const attributes = /* @__PURE__ */ Object.create(null);
  const attributeState = { count: 0 };
  addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
  addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
  const code = {};
  if (meta?.path?.fileLine) {
    const line = Number(meta.path.fileLine);
    if (Number.isFinite(line)) {
      code.line = line;
    }
  }
  if (meta?.path?.method) {
    code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
  }
  const loggerName = normalizeDiagnosticLogName(meta?.name);
  const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
  return {
    event: {
      type: "log.record",
      level: meta?.logLevelName ?? "INFO",
      message,
      ...loggerName ? { loggerName } : {},
      ...loggerParents?.length ? { loggerParents } : {},
      ...Object.keys(attributes).length > 0 ? { attributes } : {},
      ...Object.keys(code).length > 0 ? { code } : {},
      ...trace ? { trace } : {}
    },
    trustedTraceContext
  };
}
function isLogRedactionDisabled() {
  return readLoggingConfig()?.redactSensitive === "off";
}
function redactLogRecordForTransport(record) {
  return isLogRedactionDisabled() ? record : redactSecrets(record);
}
function attachDiagnosticEventTransport(logger) {
  logger.attachTransport((logObj) => {
    try {
      const record = buildDiagnosticLogRecord(redactLogRecordForTransport(logObj));
      const emit = record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent;
      emit(record.event);
    } catch {
    }
  });
}
function canUseSilentVitestFileLogFastPath(envLevel) {
  return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
  if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") {
    return path6.join(
      process.cwd(),
      ".artifacts",
      "test-logs",
      `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`
    );
  }
  return defaultRollingPathForToday();
}
function resolveSettings() {
  if (!canUseNodeFs()) {
    return {
      level: "silent",
      file: DEFAULT_LOG_FILE,
      maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES
    };
  }
  const envLevel = resolveEnvLogLevelOverride();
  if (canUseSilentVitestFileLogFastPath(envLevel)) {
    return {
      level: "silent",
      file: defaultRollingPathForToday(),
      maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES
    };
  }
  const cfg = loggingState.overrideSettings ?? loadLoggerConfig();
  const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
  const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
  const level = envLevel ?? fromConfig;
  const file = cfg?.file ?? resolveDefaultActiveLogFile();
  const maxFileBytes = resolveMaxLogFileBytes(cfg?.maxFileBytes);
  return { level, file, maxFileBytes };
}
function settingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.file !== b.file || a.maxFileBytes !== b.maxFileBytes;
}
function isFileLogLevelEnabled(level) {
  const settings = loggingState.cachedSettings ?? resolveSettings();
  if (!loggingState.cachedSettings) {
    loggingState.cachedSettings = settings;
  }
  if (level === "silent") {
    return false;
  }
  if (settings.level === "silent") {
    return false;
  }
  return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function buildLogger(settings) {
  const logger = new TsLogger({
    name: "openclaw",
    // Custom structured redaction runs at each transport boundary; avoid tslog pre-masking divergent records.
    maskValuesOfKeys: [],
    minLevel: levelToMinLevel(settings.level),
    type: "hidden"
    // no ansi formatting
  });
  if (settings.level === "silent") {
    attachDiagnosticEventTransport(logger);
    return logger;
  }
  const rollingFile = isRollingPath(settings.file);
  let activeFile = resolveActiveLogFile(settings.file);
  fs5.mkdirSync(path6.dirname(activeFile), { recursive: true });
  if (rollingFile) {
    pruneOldRollingLogs(path6.dirname(activeFile));
  }
  let currentFileBytes = getCurrentLogFileBytes(activeFile);
  let warnedAboutRotationFailure = false;
  logger.attachTransport((logObj) => {
    try {
      const nextActiveFile = resolveActiveLogFile(settings.file);
      if (nextActiveFile !== activeFile) {
        activeFile = nextActiveFile;
        fs5.mkdirSync(path6.dirname(activeFile), { recursive: true });
        if (rollingFile) {
          pruneOldRollingLogs(path6.dirname(activeFile));
        }
        currentFileBytes = getCurrentLogFileBytes(activeFile);
      }
      const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
      const traceFields = buildTraceFileLogFields(logObj);
      const structuredFields = buildStructuredFileLogFields(logObj);
      const record = {
        ...logObj,
        _meta: withResolvedLogMetaHostname(
          logObj["_meta"],
          expectDefined(structuredFields.hostname, "structured log hostname")
        ),
        time,
        ...structuredFields,
        ...traceFields
      };
      const line = redactSensitiveText2(JSON.stringify(redactLogRecordForTransport(record)));
      const payload = `${line}
`;
      const payloadBytes = Buffer.byteLength(payload, "utf8");
      const nextBytes = currentFileBytes + payloadBytes;
      if (currentFileBytes > 0 && nextBytes > settings.maxFileBytes) {
        if (rotateLogFile(activeFile)) {
          currentFileBytes = getCurrentLogFileBytes(activeFile);
          warnedAboutRotationFailure = false;
        } else if (!warnedAboutRotationFailure) {
          warnedAboutRotationFailure = true;
          process.stderr.write(
            `[openclaw] log file rotation failed; continuing writes file=${activeFile} maxFileBytes=${settings.maxFileBytes}
`
          );
        }
      }
      if (appendLogLine(activeFile, payload)) {
        currentFileBytes += payloadBytes;
      }
    } catch {
    }
  });
  attachDiagnosticEventTransport(logger);
  return logger;
}
function resolveMaxLogFileBytes(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getCurrentLogFileBytes(file) {
  try {
    return fs5.statSync(file).size;
  } catch {
    return 0;
  }
}
function appendLogLine(file, line) {
  try {
    appendRegularFileSync({ filePath: file, content: line });
    return true;
  } catch {
    return false;
  }
}
function getLogger() {
  const settings = resolveSettings();
  const cachedLogger = loggingState.cachedLogger;
  const cachedSettings = loggingState.cachedSettings;
  if (!cachedLogger || settingsChanged(cachedSettings, settings)) {
    loggingState.cachedLogger = buildLogger(settings);
    loggingState.cachedSettings = settings;
  }
  return loggingState.cachedLogger;
}
function getChildLogger(bindings, opts) {
  const base = getLogger();
  const minLevel = opts?.level ? levelToMinLevel(opts.level) : base.settings.minLevel;
  const name = bindings ? JSON.stringify(bindings) : void 0;
  return base.getSubLogger({
    name,
    minLevel,
    prefix: bindings ? [name ?? ""] : []
  });
}
function defaultRollingPathForToday() {
  return rollingPathForDate(DEFAULT_LOG_DIR, /* @__PURE__ */ new Date());
}
function rollingPathForDate(dir, date) {
  const today = formatLocalDate(date);
  return path6.join(dir, `${LOG_PREFIX}-${today}${LOG_SUFFIX}`);
}
function resolveActiveLogFile(file) {
  const expandedFile = expandHomePrefix(file);
  if (!isRollingPath(expandedFile)) {
    return expandedFile;
  }
  return rollingPathForDate(path6.dirname(expandedFile), /* @__PURE__ */ new Date());
}
function isRollingPath(file) {
  const base = path6.basename(file);
  return base.startsWith(`${LOG_PREFIX}-`) && base.endsWith(LOG_SUFFIX) && base.length === `${LOG_PREFIX}-YYYY-MM-DD${LOG_SUFFIX}`.length;
}
function pruneOldRollingLogs(dir) {
  try {
    const entries = fs5.readdirSync(dir, { withFileTypes: true });
    const cutoff = Date.now() - MAX_LOG_AGE_MS;
    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }
      if (!entry.name.startsWith(`${LOG_PREFIX}-`) || !entry.name.endsWith(LOG_SUFFIX)) {
        continue;
      }
      const fullPath = path6.join(dir, entry.name);
      try {
        const stat = fs5.statSync(fullPath);
        if (stat.mtimeMs < cutoff) {
          fs5.rmSync(fullPath, { force: true });
        }
      } catch {
      }
    }
  } catch {
  }
}
function rotatedLogPath(file, index) {
  const ext = path6.extname(file);
  const base = file.slice(0, file.length - ext.length);
  return `${base}.${index}${ext}`;
}
function rotateLogFile(file) {
  try {
    fs5.mkdirSync(path6.dirname(file), { recursive: true });
    fs5.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
    for (let index = MAX_ROTATED_LOG_FILES - 1; index >= 1; index -= 1) {
      const from = rotatedLogPath(file, index);
      if (!fs5.existsSync(from)) {
        continue;
      }
      fs5.renameSync(from, rotatedLogPath(file, index + 1));
    }
    if (fs5.existsSync(file)) {
      fs5.renameSync(file, rotatedLogPath(file, 1));
    }
    return true;
  } catch {
    return false;
  }
}
var loadConfigFallbackDefault = () => void 0;
var loadConfigFallback = loadConfigFallbackDefault;
function normalizeConsoleLevel(level) {
  if (isVerbose()) {
    return "debug";
  }
  if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") {
    return "silent";
  }
  return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
  if (style === "compact" || style === "json" || style === "pretty") {
    return style;
  }
  if (!process.stdout.isTTY) {
    return "compact";
  }
  return "pretty";
}
function resolveConsoleSettings() {
  const envLevel = resolveEnvLogLevelOverride();
  if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) {
    return { level: "silent", style: normalizeConsoleStyle(void 0) };
  }
  let cfg = loggingState.overrideSettings ?? readLoggingConfig();
  if (!cfg && !shouldSkipMutatingLoggingConfigRead()) {
    if (loggingState.resolvingConsoleSettings) {
      cfg = void 0;
    } else {
      loggingState.resolvingConsoleSettings = true;
      try {
        cfg = loadConfigFallback();
      } finally {
        loggingState.resolvingConsoleSettings = false;
      }
    }
  }
  const level = envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel);
  const style = normalizeConsoleStyle(cfg?.consoleStyle);
  return { level, style };
}
function consoleSettingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.style !== b.style;
}
function getConsoleSettings() {
  const settings = resolveConsoleSettings();
  const cached = loggingState.cachedConsoleSettings;
  if (!cached || consoleSettingsChanged(cached, settings)) {
    loggingState.cachedConsoleSettings = settings;
  }
  return loggingState.cachedConsoleSettings;
}
function normalizeConsoleSubsystem(subsystem) {
  if (typeof subsystem !== "string") {
    return null;
  }
  const normalized = subsystem.trim();
  return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
  const filter = loggingState.consoleSubsystemFilter;
  if (!filter || filter.length === 0) {
    return true;
  }
  const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
  if (!normalizedSubsystem) {
    return false;
  }
  return filter.some(
    (prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`)
  );
}
function formatConsoleTimestamp(style) {
  const now = /* @__PURE__ */ new Date();
  if (style === "pretty") {
    return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
  }
  return formatTimestamp(now, { style: "long" });
}
function normalizeSubsystemLabel(subsystem) {
  if (typeof subsystem !== "string") {
    return "unknown";
  }
  const normalized = subsystem.trim();
  return normalized.length > 0 ? normalized : "unknown";
}
function shouldLogToConsole(level, settings) {
  if (level === "silent") {
    return false;
  }
  if (settings.level === "silent") {
    return false;
  }
  const current = levelToMinLevel(level);
  const min = levelToMinLevel(settings.level);
  return current >= min;
}
var inspectValue = (() => {
  const getBuiltinModule = process.getBuiltinModule;
  if (typeof getBuiltinModule !== "function") {
    return null;
  }
  try {
    const utilNamespace = getBuiltinModule("util");
    return typeof utilNamespace.inspect === "function" ? utilNamespace.inspect : null;
  } catch {
    return null;
  }
})();
function isRichConsoleEnv() {
  const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
  if (process.env.COLORTERM || process.env.TERM_PROGRAM) {
    return true;
  }
  return term.length > 0 && term !== "dumb";
}
function getColorForConsole() {
  const hasForceColor2 = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
  if (hasForceColor2) {
    return new Chalk({ level: 1 });
  }
  if (process.env.NO_COLOR && !hasForceColor2) {
    return new Chalk({ level: 0 });
  }
  const hasTty = process.stdout.isTTY || process.stderr.isTTY;
  return hasTty || isRichConsoleEnv() ? new Chalk({ level: 1 }) : new Chalk({ level: 0 });
}
var SUBSYSTEM_COLORS = ["cyan", "green", "yellow", "blue", "magenta", "red"];
var SUBSYSTEM_COLOR_OVERRIDES = {
  "gmail-watcher": "blue"
};
var SUBSYSTEM_PREFIXES_TO_DROP = ["gateway", "channels", "providers"];
var SUBSYSTEM_MAX_SEGMENTS = 2;
var CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
  "clickclack",
  "discord",
  "feishu",
  "googlechat",
  "imessage",
  "irc",
  "line",
  "matrix",
  "mattermost",
  "msteams",
  "nextcloud-talk",
  "nostr",
  "openclaw-weixin",
  "qqbot",
  "signal",
  "slack",
  "synology-chat",
  "telegram",
  "tlon",
  "twitch",
  "webchat",
  "wecom",
  "whatsapp",
  "yuanbao",
  "zalo",
  "zalouser"
]);
function isChannelSubsystemPrefix(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (!normalized) {
    return false;
  }
  return CHANNEL_SUBSYSTEM_PREFIXES.has(normalized);
}
function pickSubsystemColor(color, subsystem) {
  const override = SUBSYSTEM_COLOR_OVERRIDES[subsystem];
  if (override) {
    return color[override];
  }
  let hash = 0;
  for (let i = 0; i < subsystem.length; i += 1) {
    hash = hash * 31 + subsystem.charCodeAt(i) | 0;
  }
  const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
  const name = expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
  return color[name];
}
function formatSubsystemForConsole(subsystem) {
  const parts = subsystem.split("/").filter(Boolean);
  const original = parts.join("/") || subsystem;
  while (parts.length > 0) {
    const first2 = parts.at(0);
    if (first2 === void 0 || !SUBSYSTEM_PREFIXES_TO_DROP.includes(first2)) {
      break;
    }
    parts.shift();
  }
  const first = parts.at(0);
  if (first === void 0) {
    return original;
  }
  if (isChannelSubsystemPrefix(first)) {
    return first;
  }
  if (parts.length > SUBSYSTEM_MAX_SEGMENTS) {
    return parts.slice(-SUBSYSTEM_MAX_SEGMENTS).join("/");
  }
  return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
  if (!displaySubsystem) {
    return message;
  }
  if (message.startsWith("[")) {
    const closeIdx = message.indexOf("]");
    if (closeIdx > 1) {
      const bracketTag = message.slice(1, closeIdx);
      if (normalizeLowercaseStringOrEmpty(bracketTag) === normalizeLowercaseStringOrEmpty(displaySubsystem)) {
        let i2 = closeIdx + 1;
        while (message[i2] === " ") {
          i2 += 1;
        }
        return message.slice(i2);
      }
    }
  }
  const prefix = message.slice(0, displaySubsystem.length);
  if (normalizeLowercaseStringOrEmpty(prefix) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) {
    return message;
  }
  const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
  if (next !== ":" && next !== " ") {
    return message;
  }
  let i = displaySubsystem.length;
  while (message[i] === " ") {
    i += 1;
  }
  if (message[i] === ":") {
    i += 1;
  }
  while (message[i] === " ") {
    i += 1;
  }
  return message.slice(i);
}
function formatConsoleLine(opts) {
  const displaySubsystem = opts.style === "json" ? opts.subsystem : formatSubsystemForConsole(opts.subsystem);
  if (opts.style === "json") {
    return redactSensitiveText2(
      JSON.stringify({
        time: formatConsoleTimestamp("json"),
        level: opts.level,
        subsystem: displaySubsystem,
        message: opts.message,
        ...opts.meta
      })
    );
  }
  const color = getColorForConsole();
  const prefix = `[${displaySubsystem}]`;
  const prefixColor = pickSubsystemColor(color, displaySubsystem);
  const levelColor = opts.level === "error" || opts.level === "fatal" ? color.red : opts.level === "warn" ? color.yellow : opts.level === "debug" || opts.level === "trace" ? color.gray : color.cyan;
  const redactedMessage = redactSensitiveText2(opts.message);
  const displayMessage = stripRedundantSubsystemPrefixForConsole(redactedMessage, displaySubsystem);
  const time = (() => {
    if (opts.style === "pretty") {
      return color.gray(formatConsoleTimestamp("pretty"));
    }
    if (loggingState.consoleTimestampPrefix) {
      return color.gray(formatConsoleTimestamp(opts.style));
    }
    return "";
  })();
  const prefixToken = prefixColor(prefix);
  const head = [time, prefixToken].filter(Boolean).join(" ");
  return `${head} ${levelColor(displayMessage)}`;
}
function writeConsoleLine(level, line, opts = {}) {
  clearActiveProgressLine();
  const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
  const redacted = opts.redacted ? sanitized : redactSensitiveText2(sanitized);
  const sink = loggingState.rawConsole ?? console;
  if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") {
    (sink.error ?? console.error)(redacted);
  } else if (level === "warn") {
    (sink.warn ?? console.warn)(redacted);
  } else {
    (sink.log ?? console.log)(redacted);
  }
}
function shouldSuppressProbeConsoleLine(params) {
  if (isVerbose()) {
    return false;
  }
  if (params.level === "error" || params.level === "fatal") {
    return false;
  }
  const subsystem = normalizeSubsystemLabel(params.subsystem);
  const message = typeof params.message === "string" ? params.message : "";
  const isProbeSuppressedSubsystem = subsystem === "agent/embedded" || subsystem.startsWith("agent/embedded/") || subsystem === "model-fallback" || subsystem.startsWith("model-fallback/");
  if (!isProbeSuppressedSubsystem) {
    return false;
  }
  const runLikeId = typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0;
  if (runLikeId?.startsWith("probe-")) {
    return true;
  }
  return /(sessionId|runId)=probe-/.test(message);
}
function logToFile(fileLogger, level, message, meta) {
  if (level === "silent") {
    return;
  }
  const safeLevel = level;
  const method = fileLogger[safeLevel];
  if (typeof method !== "function") {
    return;
  }
  if (meta && Object.keys(meta).length > 0) {
    method.call(fileLogger, meta, message);
  } else {
    method.call(fileLogger, message);
  }
}
function createSubsystemLogger(subsystem) {
  const resolvedSubsystem = normalizeSubsystemLabel(subsystem);
  const emitLog = (level, message, meta) => {
    const consoleSettings = getConsoleSettings();
    const consoleEnabled = shouldLogToConsole(level, { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
    const fileEnabled = isFileLogLevelEnabled(level);
    if (!consoleEnabled && !fileEnabled) {
      return;
    }
    let consoleMessageOverride;
    let fileMeta = meta;
    if (meta && Object.keys(meta).length > 0) {
      const { consoleMessage: consoleMessage2, ...rest } = meta;
      if (typeof consoleMessage2 === "string") {
        consoleMessageOverride = consoleMessage2;
      }
      fileMeta = Object.keys(rest).length > 0 ? rest : void 0;
    }
    if (fileEnabled) {
      logToFile(getChildLogger({ subsystem: resolvedSubsystem }), level, message, fileMeta);
    }
    if (!consoleEnabled) {
      return;
    }
    const consoleMessage = consoleMessageOverride ?? message;
    if (shouldSuppressProbeConsoleLine({
      level,
      subsystem: resolvedSubsystem,
      message: consoleMessage,
      meta: fileMeta
    })) {
      return;
    }
    writeConsoleLine(
      level,
      formatConsoleLine({
        level,
        subsystem: resolvedSubsystem,
        message: consoleSettings.style === "json" ? message : consoleMessage,
        style: consoleSettings.style,
        meta: fileMeta
      }),
      { redacted: true }
    );
  };
  const logger = {
    subsystem: resolvedSubsystem,
    isEnabled(level, target = "any") {
      const isConsoleEnabled = shouldLogToConsole(level, { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
      const isFileEnabled = isFileLogLevelEnabled(level);
      if (target === "console") {
        return isConsoleEnabled;
      }
      if (target === "file") {
        return isFileEnabled;
      }
      return isConsoleEnabled || isFileEnabled;
    },
    trace(message, meta) {
      emitLog("trace", message, meta);
    },
    debug(message, meta) {
      emitLog("debug", message, meta);
    },
    info(message, meta) {
      emitLog("info", message, meta);
    },
    warn(message, meta) {
      emitLog("warn", message, meta);
    },
    error(message, meta) {
      emitLog("error", message, meta);
    },
    fatal(message, meta) {
      emitLog("fatal", message, meta);
    },
    raw(message) {
      if (isFileLogLevelEnabled("info")) {
        logToFile(getChildLogger({ subsystem: resolvedSubsystem }), "info", message, { raw: true });
      }
      if (shouldLogToConsole("info", { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
        if (shouldSuppressProbeConsoleLine({
          level: "info",
          subsystem: resolvedSubsystem,
          message
        })) {
          return;
        }
        writeConsoleLine("info", message);
      }
    },
    child(name) {
      return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
    }
  };
  return logger;
}
var transactionDepthByDatabase = /* @__PURE__ */ new WeakMap();
var SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
var SQLITE_BUSY_RESULT_CODE = 5;
var SQLITE_LOCKED_RESULT_CODE = 6;
var SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
var DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
var DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
var nextSavepointId = 0;
var transactionLog = createSubsystemLogger("sqlite/transaction");
function nextSavepointName() {
  nextSavepointId += 1;
  return `openclaw_tx_${nextSavepointId}`;
}
function isPromiseLike(value) {
  return Boolean(value && typeof value.then === "function");
}
function assertSyncTransactionResult(value) {
  if (isPromiseLike(value)) {
    throw new Error(
      "SQLite write transactions must be synchronous; Promise returns are not supported."
    );
  }
}
function sqliteErrorCode(error) {
  const code = error && typeof error === "object" ? error.code : void 0;
  return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
  const errcode = error && typeof error === "object" ? error.errcode : void 0;
  return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
  const errcode = sqliteExtendedResultCode(error);
  return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
  const code = sqliteErrorCode(error);
  if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) {
    return true;
  }
  const primaryCode = sqlitePrimaryResultCode(error);
  return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
function slowBusyWaitThresholdMs(options) {
  if (options?.busyTimeoutMs === void 0) {
    return DEFAULT_SLOW_BUSY_WAIT_MS;
  }
  return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, Math.max(1, options.busyTimeoutMs));
}
function slowTransactionHoldThresholdMs(options) {
  return options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS;
}
function transactionLogger(options) {
  return options?.logger ?? transactionLog;
}
function logSlowTransactionHold(params) {
  if (params.elapsedMs < slowTransactionHoldThresholdMs(params.options)) {
    return;
  }
  transactionLogger(params.options).warn("slow SQLite transaction hold", {
    async: false,
    ...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
    elapsedMs: params.elapsedMs,
    ...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
    pid: process.pid,
    thresholdMs: slowTransactionHoldThresholdMs(params.options)
  });
}
function logSlowTransactionStep(params) {
  if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) {
    return;
  }
  transactionLogger(params.options).warn("slow SQLite transaction lock wait", {
    async: false,
    ...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
    ...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
    elapsedMs: params.elapsedMs,
    ...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
    pid: process.pid,
    step: params.step
  });
}
function execTimedTransactionStep(params) {
  const startedAt = Date.now();
  try {
    params.db.exec(params.sql);
    const elapsedMs = Date.now() - startedAt;
    logSlowTransactionStep({
      elapsedMs,
      options: params.options,
      step: params.step
    });
    return elapsedMs;
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    if (isSqliteLockError(error)) {
      const sqliteErrcode = sqliteExtendedResultCode(error);
      const sqlitePrimaryCode = sqlitePrimaryResultCode(error);
      transactionLogger(params.options).warn("SQLite transaction lock wait failed", {
        async: false,
        ...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
        ...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
        code: sqliteErrorCode(error),
        elapsedMs,
        failureKind: "lock-contention",
        ...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
        pid: process.pid,
        ...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
        ...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
        step: params.step
      });
    }
    throw error;
  }
}
function beginTransaction(db, options, mode) {
  execTimedTransactionStep({
    db,
    options,
    sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
    step: "begin"
  });
}
function commitImmediateTransaction(db, options) {
  execTimedTransactionStep({
    db,
    options,
    sql: "COMMIT",
    step: "commit"
  });
}
function abortImmediateTransaction(db) {
  try {
    db.exec("ROLLBACK");
  } catch {
    try {
      db.close();
    } catch {
    }
  }
}
function getTransactionDepth(db) {
  return transactionDepthByDatabase.get(db) ?? 0;
}
function setTransactionDepth(db, depth) {
  if (depth <= 0) {
    transactionDepthByDatabase.delete(db);
    return;
  }
  transactionDepthByDatabase.set(db, depth);
}
function runSqliteTransactionSync(db, operation, mode, options) {
  const depth = getTransactionDepth(db);
  if (depth > 0) {
    const savepointName = nextSavepointName();
    db.exec(`SAVEPOINT ${savepointName}`);
    setTransactionDepth(db, depth + 1);
    try {
      const result2 = operation();
      assertSyncTransactionResult(result2);
      db.exec(`RELEASE SAVEPOINT ${savepointName}`);
      return result2;
    } catch (error) {
      try {
        db.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`);
      } finally {
        db.exec(`RELEASE SAVEPOINT ${savepointName}`);
      }
      throw error;
    } finally {
      setTransactionDepth(db, depth);
    }
  }
  beginTransaction(db, options, mode);
  setTransactionDepth(db, 1);
  let transactionStillActive = true;
  let result;
  const transactionStartedAt = Date.now();
  try {
    result = operation();
    assertSyncTransactionResult(result);
  } catch (error) {
    try {
      abortImmediateTransaction(db);
      transactionStillActive = false;
    } catch {
    }
    throw error;
  } finally {
    if (!transactionStillActive) {
      setTransactionDepth(db, 0);
    }
  }
  try {
    logSlowTransactionHold({
      elapsedMs: Date.now() - transactionStartedAt,
      options
    });
    commitImmediateTransaction(db, options);
    transactionStillActive = false;
    return result;
  } catch (error) {
    try {
      abortImmediateTransaction(db);
      transactionStillActive = false;
    } catch {
    }
    throw error;
  } finally {
    if (!transactionStillActive) {
      setTransactionDepth(db, 0);
    }
  }
}
function runSqliteImmediateTransactionSync(db, operation, options) {
  return runSqliteTransactionSync(db, operation, "immediate", options);
}
var STRICT_MIGRATION_TABLE_PREFIX = "__openclaw_strict_migration_";
var SQLITE_ROWID_ALIASES = ["_rowid_", "rowid", "oid"];
function quoteSqliteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}
function readMainTableList(db) {
  return db.prepare("PRAGMA table_list").all().filter(
    (row) => row.schema === "main" && typeof row.name === "string" && !row.name.startsWith("sqlite_")
  );
}
function readTableColumns(db, tableName) {
  return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
  return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
    if (typeof row.name !== "string" || row.name.length === 0) {
      throw new Error(`SQLite table ${tableName} has an invalid column name`);
    }
    return row.name;
  });
}
function readTableRowidModel(db, tableName, tableRow) {
  if (Number(tableRow.wr ?? 0) === 1) {
    return { alias: null, storage: "without-rowid" };
  }
  const columns = readTableColumns(db, tableName);
  const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
  const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
  const primaryKeyType = primaryKeyColumns[0]?.type;
  if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) {
    return { alias: null, storage: "integer-primary-key" };
  }
  const declaredNames = new Set(
    columns.flatMap(
      (column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []
    )
  );
  const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
  if (!alias) {
    throw new Error(
      `SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`
    );
  }
  return { alias, storage: "implicit" };
}
function readCanonicalStrictTables(schemaSql) {
  const sqlite = requireNodeSqlite();
  const canonical = new sqlite.DatabaseSync(":memory:");
  try {
    canonical.exec(schemaSql);
    const tables = readMainTableList(canonical).filter((row) => row.type === "table");
    const nonStrict = tables.flatMap(
      (row) => Number(row.strict ?? 0) === 1 || typeof row.name !== "string" ? [] : [row.name]
    );
    if (nonStrict.length > 0) {
      throw new Error(
        `Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`
      );
    }
    return tables.map((row) => {
      if (typeof row.name !== "string") {
        throw new Error("Canonical SQLite schema contains an unnamed table");
      }
      const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
      if (typeof schemaRow?.sql !== "string") {
        throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
      }
      const rowidModel = readTableRowidModel(canonical, row.name, row);
      return {
        columns: readVisibleColumns(canonical, row.name),
        createSql: schemaRow.sql,
        name: row.name,
        rowidAlias: rowidModel.alias,
        rowidStorage: rowidModel.storage,
        usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
      };
    }).toSorted((left, right) => left.name.localeCompare(right.name));
  } finally {
    canonical.close();
  }
}
function rewriteCreateTableName(createSql, replacementName) {
  const openingParen = createSql.indexOf("(");
  if (openingParen === -1) {
    throw new Error("Canonical SQLite table CREATE statement has no column list");
  }
  return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
  return db.prepare(
    "SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')"
  ).all().flatMap((row) => {
    if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) {
      return [];
    }
    return [{ name: row.name, sql: row.sql, type: row.type }];
  }).toSorted((left, right) => {
    const typeOrder = { view: 0, index: 1, trigger: 2 };
    return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
  });
}
function readAutoincrementHighWater(db, tableName) {
  const sequenceTable = db.prepare(
    "SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'"
  ).get();
  if (!sequenceTable) {
    return null;
  }
  const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
  if (row === void 0) {
    return null;
  }
  const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
  if (!normalized) {
    throw new Error(
      `SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`
    );
  }
  return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
  if (previousHighWater === null) {
    return;
  }
  const currentHighWater = readAutoincrementHighWater(db, tableName);
  const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
  db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
  db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(
    tableName,
    restored
  );
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
  const current = new Set(currentColumns);
  const canonical = new Set(canonicalColumns);
  const missing = canonicalColumns.filter((column) => !current.has(column));
  const extra = currentColumns.filter((column) => !canonical.has(column));
  if (missing.length === 0 && extra.length === 0) {
    return;
  }
  const details = [
    missing.length > 0 ? `missing ${missing.join(", ")}` : "",
    extra.length > 0 ? `extra ${extra.join(", ")}` : ""
  ].filter(Boolean).join("; ");
  throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
  const row = db.prepare("PRAGMA foreign_keys").get();
  return Number(row?.foreign_keys ?? 0) === 1;
}
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
  if (!db.isTransaction) {
    throw new Error("SQLite STRICT schema migration requires an active transaction");
  }
  const canonicalTables = readCanonicalStrictTables(schemaSql);
  db.exec(schemaSql);
  const currentTableRows = new Map(
    readMainTableList(db).filter((row) => row.type === "table" && typeof row.name === "string").map((row) => [row.name, row])
  );
  const tablesToMigrate = canonicalTables.filter(
    (table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1
  );
  if (tablesToMigrate.length === 0) {
    return { migratedTables: [] };
  }
  if (readForeignKeysEnabled(db)) {
    throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
  }
  const names = new Set(tablesToMigrate.map((table) => table.name));
  const preservedObjects = readPreservedSchemaObjects(db, names);
  for (const object of preservedObjects) {
    if (object.type === "trigger") {
      db.exec(`DROP TRIGGER ${quoteSqliteIdentifier(object.name)};`);
    }
  }
  for (const object of preservedObjects) {
    if (object.type === "view") {
      db.exec(`DROP VIEW ${quoteSqliteIdentifier(object.name)};`);
    }
  }
  for (const [index, table] of tablesToMigrate.entries()) {
    const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
    if (currentTableRows.has(migrationTable)) {
      throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
    }
    const currentColumns = readVisibleColumns(db, table.name);
    assertMatchingColumns(table.name, currentColumns, table.columns);
    const currentTableRow = currentTableRows.get(table.name);
    if (!currentTableRow) {
      throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
    }
    const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
    if (currentRowidModel.storage !== table.rowidStorage) {
      throw new Error(
        `SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`
      );
    }
    const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
    db.exec(rewriteCreateTableName(table.createSql, migrationTable));
    const columns = table.columns.map(quoteSqliteIdentifier);
    if (table.rowidAlias) {
      columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
    }
    const copyColumns = columns.join(", ");
    try {
      db.exec(
        `INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`
      );
    } catch (error) {
      throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
    }
    db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
    db.exec(
      `ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`
    );
    restoreAutoincrementHighWater(db, table.name, previousHighWater);
  }
  db.exec(schemaSql);
  const findObject = db.prepare(
    "SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1"
  );
  for (const object of preservedObjects) {
    if (!findObject.get(object.type, object.name)) {
      db.exec(object.sql);
    }
  }
  assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
  return { migratedTables: tablesToMigrate.map((table) => table.name) };
}
function createSqliteTerminalOpenLatch(options) {
  const failures = /* @__PURE__ */ new Map();
  return {
    get: (pathname) => failures.get(path7.resolve(pathname)),
    record: (pathname, error) => {
      const resolvedPath = path7.resolve(pathname);
      failures.set(resolvedPath, error);
      options.closeByPath(resolvedPath);
    },
    clear: (pathname) => {
      failures.delete(path7.resolve(pathname));
    },
    clearAll: () => {
      failures.clear();
    }
  };
}
function readSqliteUserVersion(db) {
  const row = db.prepare("PRAGMA user_version").get();
  return Number(row?.user_version ?? 0);
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
  const error = new Error(
    `${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this OpenClaw build supports ${supportedVersion}. Upgrade OpenClaw before opening this database. Do not downgrade OpenClaw or modify the database. To run this older build, use a separate state directory or restore a compatible backup. See https://docs.openclaw.ai/reference/database-schemas.`
  );
  error.name = "SqliteSchemaVersionError";
  return error;
}
var DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1e3;
var DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 30 * 60 * 1e3;
var INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS = 512;
var LINUX_NFS_SUPER_MAGIC = 26985;
var LINUX_SMB_SUPER_MAGIC = 20859;
var LINUX_CIFS_SUPER_MAGIC = 4283649346;
var LINUX_SMB2_SUPER_MAGIC = 4266872130;
var PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
var MOUNT_COMMAND_TIMEOUT_MS = 1e3;
var NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set(["cifs", "smbfs", "smb2", "smb3"]);
var JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
var JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
function configureSqliteBusyTimeout(db, busyTimeoutMs) {
  const normalizedTimeoutMs = normalizeNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
  db.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs};`);
  return normalizedTimeoutMs;
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
  const row = db.prepare("PRAGMA page_count").get();
  if (row?.page_count === 0) {
    db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
  }
}
function configureSqlitePreSchemaPragmas(db, options = {}) {
  if (options.busyTimeoutMs !== void 0) {
    configureSqliteBusyTimeout(db, options.busyTimeoutMs);
  }
  enableIncrementalAutoVacuumForFreshDatabase(db);
}
function normalizeNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return value;
}
function findExistingVolumePaths(targetPath) {
  let current = path8.resolve(targetPath);
  while (true) {
    let stats;
    try {
      stats = fs6.statSync(current);
    } catch {
      const parent = path8.dirname(current);
      if (parent === current) {
        return null;
      }
      current = parent;
      continue;
    }
    const existingPath = fs6.realpathSync(current);
    return {
      canonicalPath: stats.isDirectory() ? existingPath : path8.dirname(existingPath),
      originalPath: stats.isDirectory() ? current : path8.dirname(current)
    };
  }
}
function decodeMountPath(value) {
  return value.replace(
    /\\([0-7]{3})/g,
    (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8))
  );
}
function parseProcMountInfoEntries(contents) {
  const entries = [];
  for (const line of contents.split("\n")) {
    const separator = line.indexOf(" - ");
    if (separator === -1) {
      continue;
    }
    const fields = line.slice(0, separator).split(" ");
    const suffixFields = line.slice(separator + 3).split(" ");
    const mountPoint = fields[4];
    const fsType = suffixFields[0];
    if (mountPoint && fsType) {
      entries.push({
        mountPoint: decodeMountPath(mountPoint),
        fsType,
        ...suffixFields[1] ? { source: decodeMountPath(suffixFields[1]) } : {}
      });
    }
  }
  return entries;
}
function parseMountCommandEntries(contents) {
  const entries = [];
  for (const line of contents.split("\n")) {
    const linuxMatch = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line);
    if (linuxMatch) {
      const source = linuxMatch[1];
      const mountPoint = linuxMatch[2];
      const fsType = linuxMatch[3];
      if (source && mountPoint && fsType) {
        entries.push({ source, mountPoint, fsType });
      }
      continue;
    }
    const bsdMatch = /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
    if (bsdMatch) {
      const source = bsdMatch[1];
      const mountPoint = bsdMatch[2];
      const fsType = bsdMatch[3];
      if (source && mountPoint && fsType) {
        entries.push({ source, mountPoint, fsType });
      }
    }
  }
  return entries;
}
function isMountCommandTimeout(error) {
  return error !== null && typeof error === "object" && "code" in error && error.code === "ETIMEDOUT";
}
function readMountEntries() {
  try {
    return {
      ok: true,
      value: parseProcMountInfoEntries(fs6.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
    };
  } catch {
  }
  try {
    return {
      ok: true,
      value: parseMountCommandEntries(
        String(
          process.getBuiltinModule("node:child_process").execFileSync("mount", [], {
            killSignal: "SIGKILL",
            timeout: MOUNT_COMMAND_TIMEOUT_MS
          })
        )
      )
    };
  } catch (error) {
    return isMountCommandTimeout(error) ? { ok: false, error: "timeout" } : { ok: true, value: [] };
  }
}
function isPathWithinMount(targetPath, mountPoint) {
  const resolvedTarget = path8.resolve(targetPath);
  const resolvedMountPoint = path8.resolve(mountPoint);
  return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path8.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path8.sep}`);
}
function isSshfsMountSource(source) {
  if (!source) {
    return false;
  }
  const normalized = source.toLowerCase();
  return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
  const normalized = entry.fsType.toLowerCase();
  if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized)) {
    return "rollback";
  }
  if (normalized === "fuse.sshfs") {
    return "unsupported";
  }
  if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) {
    return "unsupported";
  }
  return "wal";
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
  const mountEntry = mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
  return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
function combineMountEntryJournalPolicies(targetPaths) {
  const mountResult = readMountEntries();
  if (!mountResult.ok) {
    return "rollback";
  }
  const policies = new Set(
    targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountResult.value))
  );
  if (policies.has("unsupported")) {
    return "unsupported";
  }
  return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
  return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
  return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
  if (process.platform === "win32") {
    const normalizedTargetPath = path8.win32.normalize(targetPath);
    if (isWindowsUncPath(normalizedTargetPath)) {
      return "rollback";
    }
    if (isWindowsDrivePath(normalizedTargetPath)) {
      try {
        return isWindowsUncPath(path8.win32.normalize(fs6.realpathSync.native(targetPath))) ? "rollback" : "wal";
      } catch {
        return "rollback";
      }
    }
  }
  const checkedPaths = findExistingVolumePaths(targetPath);
  if (!checkedPaths) {
    return "wal";
  }
  const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
  if (typeof fs6.statfsSync !== "function") {
    return combineMountEntryJournalPolicies(mountLookupPaths);
  }
  try {
    const filesystemType = fs6.statfsSync(checkedPaths.canonicalPath).type;
    if (filesystemType === LINUX_NFS_SUPER_MAGIC || filesystemType === LINUX_SMB_SUPER_MAGIC || filesystemType === LINUX_CIFS_SUPER_MAGIC || filesystemType === LINUX_SMB2_SUPER_MAGIC) {
      return "rollback";
    }
  } catch {
    return combineMountEntryJournalPolicies(mountLookupPaths);
  }
  return combineMountEntryJournalPolicies(mountLookupPaths);
}
function readJournalModeResult(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  const record = row;
  const value = record.journal_mode ?? Object.values(record)[0];
  return typeof value === "string" ? value.toLowerCase() : null;
}
function hasInMemoryMainDatabase(db) {
  const rows = db.prepare("PRAGMA database_list;").all();
  const main = rows.find((row) => row.name === "main");
  return main?.file === "";
}
function readCheckpointBusyResult(row) {
  if (!row || typeof row !== "object") {
    return false;
  }
  const record = row;
  const value = record.busy ?? Object.values(record)[0];
  return value === 1 || value === 1n;
}
function requireRollbackJournalMode(db, options) {
  const row = db.prepare("PRAGMA journal_mode = DELETE;").get();
  const journalMode = readJournalModeResult(row);
  if (journalMode !== "delete") {
    const label = options.databaseLabel ?? "sqlite database";
    const location = options.databasePath ? ` at ${options.databasePath}` : "";
    const actual = journalMode ?? "unknown";
    throw new Error(
      `${label}${location} is on a network-backed volume but SQLite kept journal_mode=${actual}; refusing to continue with WAL on network storage.`
    );
  }
}
function enableWalJournalMode(db, retryTimeoutMs, options) {
  const deadline = Date.now() + retryTimeoutMs;
  let restoreBusyTimeout = false;
  try {
    while (true) {
      try {
        db.exec("PRAGMA journal_mode = WAL;");
        const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode;").get());
        if (journalMode === "wal") {
          return true;
        }
        if (journalMode === "memory" && hasInMemoryMainDatabase(db)) {
          return false;
        }
        const label = options.databaseLabel ?? "sqlite database";
        const location = options.databasePath ? ` at ${options.databasePath}` : "";
        throw new Error(
          `${label}${location} could not enable WAL; SQLite kept journal_mode=${journalMode ?? "unknown"}.`
        );
      } catch (error) {
        const remainingMs = deadline - Date.now();
        if (!isSqliteLockError(error) || remainingMs <= 0) {
          throw error;
        }
        if (!restoreBusyTimeout) {
          configureSqliteBusyTimeout(db, 0);
          restoreBusyTimeout = true;
        }
        Atomics.wait(
          JOURNAL_MODE_RETRY_SLEEP,
          0,
          0,
          Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs)
        );
      }
    }
  } finally {
    if (restoreBusyTimeout) {
      configureSqliteBusyTimeout(db, retryTimeoutMs);
    }
  }
}
function enableMacosCheckpointFullfsync(db) {
  if (process.platform !== "darwin") {
    return;
  }
  try {
    db.exec("PRAGMA checkpoint_fullfsync = 1;");
  } catch {
  }
}
function refuseUnsupportedFilesystem(options) {
  const label = options.databaseLabel ?? "sqlite database";
  const location = options.databasePath ? ` at ${options.databasePath}` : "";
  throw new Error(
    `${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`
  );
}
function configureSqliteWalMaintenance(db, options = {}) {
  const busyTimeoutMs = options.busyTimeoutMs === void 0 ? 0 : configureSqliteBusyTimeout(db, options.busyTimeoutMs);
  const autoCheckpointPages = normalizeNonNegativeInteger(
    options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,
    "autoCheckpointPages"
  );
  const checkpointIntervalMs = normalizeNonNegativeInteger(
    options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS,
    "checkpointIntervalMs"
  );
  const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
  const checkpointMode = options.checkpointMode ?? "TRUNCATE";
  const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
  const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
  if (journalPolicy === "unsupported") {
    refuseUnsupportedFilesystem(options);
  }
  if (journalPolicy === "rollback") {
    requireRollbackJournalMode(db, options);
    return {
      checkpoint: () => true,
      close: () => true
    };
  }
  if (!enableWalJournalMode(db, busyTimeoutMs, options)) {
    return {
      checkpoint: () => true,
      close: () => true
    };
  }
  enableMacosCheckpointFullfsync(db);
  db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
  const runCheckpoint = (mode) => {
    try {
      const row = db.prepare(`PRAGMA wal_checkpoint(${mode});`).get();
      if (readCheckpointBusyResult(row)) {
        const label = options.databaseLabel ?? "sqlite database";
        const error = new Error(`${label} WAL checkpoint ${mode} remained busy`);
        options.onCheckpointError?.(error);
        return false;
      }
      return true;
    } catch (error) {
      options.onCheckpointError?.(error);
      return false;
    }
  };
  const runIncrementalVacuum = () => {
    try {
      db.exec(`PRAGMA incremental_vacuum(${INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS});`);
    } catch (error) {
      options.onCheckpointError?.(error);
    }
  };
  const checkpoint = () => runCheckpoint(checkpointMode);
  let timer = null;
  if (timerIntervalMs > 0) {
    timer = setInterval(() => {
      runCheckpoint(periodicCheckpointMode);
      runIncrementalVacuum();
    }, timerIntervalMs);
    timer.unref?.();
  }
  return {
    checkpoint,
    close: (closeOptions) => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return runCheckpoint(closeOptions?.checkpointMode ?? checkpointMode);
    }
  };
}
function configureSqliteConnectionPragmas(db, options = {}) {
  const { foreignKeys, synchronous, ...walOptions } = options;
  const maintenance = configureSqliteWalMaintenance(db, walOptions);
  if (synchronous) {
    db.exec(`PRAGMA synchronous = ${synchronous};`);
  }
  if (foreignKeys) {
    db.exec("PRAGMA foreign_keys = ON;");
  }
  return maintenance;
}
var CRON_JOB_EXECUTION_TIMEOUT_ERROR = "cron: job execution timed out";
var MAX_ENTRIES = 10;
var MAX_ENTRY_CHARS = 1e3;
var MAX_SUMMARY_CHARS = 2e3;
function normalizeSeverity(value) {
  return value === "info" || value === "warn" || value === "error" ? value : "error";
}
function normalizeSource(value) {
  switch (value) {
    case "cron-preflight":
    case "cron-setup":
    case "model-preflight":
    case "agent-run":
    case "tool":
    case "exec":
    case "delivery":
      return value;
    default:
      return "agent-run";
  }
}
function normalizeTimestamp(value, nowMs) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : nowMs();
}
function normalizeDiagnosticMessage(value, redactText2) {
  if (typeof value !== "string") {
    return {};
  }
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return {};
  }
  const redacted = redactText2(normalized);
  if (redacted.length <= MAX_ENTRY_CHARS) {
    return { message: redacted };
  }
  return { message: `${truncateUtf16Safe(redacted, MAX_ENTRY_CHARS - 1)}\u2026`, truncated: true };
}
function trimSummary(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return void 0;
  }
  if (normalized.length <= MAX_SUMMARY_CHARS) {
    return normalized;
  }
  return `${truncateUtf16Safe(normalized, MAX_SUMMARY_CHARS - 1)}\u2026`;
}
function normalizeCronRunDiagnostics(value, opts) {
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const record = value;
  const nowMs = opts?.nowMs ?? Date.now;
  const redactText2 = opts?.redactText ?? ((text) => text);
  const entriesRaw = Array.isArray(record.entries) ? record.entries : [];
  const entries = [];
  for (const item of entriesRaw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const entry = item;
    const normalized = normalizeDiagnosticMessage(entry.message, redactText2);
    if (!normalized.message) {
      continue;
    }
    entries.push({
      ts: normalizeTimestamp(entry.ts, nowMs),
      source: normalizeSource(entry.source),
      severity: normalizeSeverity(entry.severity),
      message: normalized.message,
      ...typeof entry.toolName === "string" && entry.toolName.trim() ? { toolName: entry.toolName.trim() } : {},
      ...typeof entry.exitCode === "number" && Number.isFinite(entry.exitCode) ? { exitCode: entry.exitCode } : entry.exitCode === null ? { exitCode: null } : {},
      ...entry.truncated === true || normalized.truncated ? { truncated: true } : {}
    });
    if (entries.length > MAX_ENTRIES) {
      entries.shift();
    }
  }
  const summary = trimSummary(
    typeof record.summary === "string" ? redactText2(record.summary) : void 0
  );
  if (entries.length === 0 && !summary) {
    return void 0;
  }
  return { ...summary ? { summary } : {}, entries };
}
var CRON_TASK_DETAIL_KIND = "cron-run";
var CRON_FAILOVER_REASONS = /* @__PURE__ */ new Set([
  "auth",
  "auth_permanent",
  "format",
  "rate_limit",
  "overloaded",
  "billing",
  "server_error",
  "timeout",
  "model_not_found",
  "session_expired",
  "context_overflow",
  "empty_response",
  "no_error_details",
  "unclassified",
  "unknown"
]);
function toJsonValue(value) {
  const serialized = JSON.stringify(value);
  return serialized === void 0 ? void 0 : JSON.parse(serialized);
}
function normalizeCronRunLogErrorReason(value) {
  return typeof value === "string" && CRON_FAILOVER_REASONS.has(value) ? value : void 0;
}
function parseCronRunLogEntryObject(obj, opts) {
  const jobId = normalizeOptionalString(opts?.jobId);
  if (!obj || typeof obj !== "object") {
    return null;
  }
  const entryObj = obj;
  if (entryObj.action !== "finished") {
    return null;
  }
  if (typeof entryObj.jobId !== "string" || entryObj.jobId.trim().length === 0) {
    return null;
  }
  if (typeof entryObj.ts !== "number" || !Number.isFinite(entryObj.ts)) {
    return null;
  }
  if (jobId && entryObj.jobId !== jobId) {
    return null;
  }
  const usage = entryObj.usage && typeof entryObj.usage === "object" ? entryObj.usage : void 0;
  const normalizedError = typeof entryObj.error === "string" ? entryObj.error : void 0;
  const normalizedProvider = typeof entryObj.provider === "string" && entryObj.provider.trim() ? entryObj.provider : void 0;
  const entry = {
    ts: entryObj.ts,
    jobId: entryObj.jobId,
    action: "finished",
    status: entryObj.status,
    error: normalizedError,
    errorReason: normalizeCronRunLogErrorReason(entryObj.errorReason) ?? void 0,
    summary: entryObj.summary,
    runId: typeof entryObj.runId === "string" && entryObj.runId.trim() ? entryObj.runId : void 0,
    diagnostics: normalizeCronRunDiagnostics(entryObj.diagnostics),
    runAtMs: entryObj.runAtMs,
    durationMs: entryObj.durationMs,
    nextRunAtMs: entryObj.nextRunAtMs,
    triggerFired: entryObj.triggerFired === true ? true : void 0,
    model: typeof entryObj.model === "string" && entryObj.model.trim() ? entryObj.model : void 0,
    provider: normalizedProvider,
    usage: usage ? {
      input_tokens: typeof usage.input_tokens === "number" ? usage.input_tokens : void 0,
      output_tokens: typeof usage.output_tokens === "number" ? usage.output_tokens : void 0,
      total_tokens: typeof usage.total_tokens === "number" ? usage.total_tokens : void 0,
      cache_read_tokens: typeof usage.cache_read_tokens === "number" ? usage.cache_read_tokens : void 0,
      cache_write_tokens: typeof usage.cache_write_tokens === "number" ? usage.cache_write_tokens : void 0
    } : void 0
  };
  if (typeof entryObj.delivered === "boolean") {
    entry.delivered = entryObj.delivered;
  }
  if (entryObj.deliveryStatus === "delivered" || entryObj.deliveryStatus === "not-delivered" || entryObj.deliveryStatus === "unknown" || entryObj.deliveryStatus === "not-requested") {
    entry.deliveryStatus = entryObj.deliveryStatus;
  }
  if (typeof entryObj.deliveryError === "string") {
    entry.deliveryError = entryObj.deliveryError;
  }
  if (entryObj.failureNotificationDelivery && typeof entryObj.failureNotificationDelivery === "object") {
    const failureNotificationDelivery = entryObj.failureNotificationDelivery;
    if (failureNotificationDelivery.status === "delivered" || failureNotificationDelivery.status === "not-delivered" || failureNotificationDelivery.status === "unknown" || failureNotificationDelivery.status === "not-requested") {
      entry.failureNotificationDelivery = {
        status: failureNotificationDelivery.status,
        ...typeof failureNotificationDelivery.delivered === "boolean" ? { delivered: failureNotificationDelivery.delivered } : {},
        ...typeof failureNotificationDelivery.error === "string" ? { error: failureNotificationDelivery.error } : {}
      };
    }
  }
  if (entryObj.delivery && typeof entryObj.delivery === "object") {
    entry.delivery = entryObj.delivery;
  }
  if (typeof entryObj.sessionId === "string" && entryObj.sessionId.trim()) {
    entry.sessionId = entryObj.sessionId;
  }
  if (typeof entryObj.sessionKey === "string" && entryObj.sessionKey.trim()) {
    entry.sessionKey = entryObj.sessionKey;
  }
  return entry;
}
function cronRunLogEntryToTaskDetail(entry, options) {
  const detail = toJsonValue({
    kind: CRON_TASK_DETAIL_KIND,
    status: entry.status,
    storeKey: options.storeKey,
    errorReason: entry.errorReason,
    diagnostics: entry.diagnostics,
    delivered: entry.delivered,
    deliveryStatus: entry.deliveryStatus,
    deliveryError: entry.deliveryError,
    failureNotificationDelivery: entry.failureNotificationDelivery,
    delivery: entry.delivery,
    sessionId: entry.sessionId,
    // TaskRecord.runId remains the internal cancellation identity.
    runId: entry.runId,
    runAtMs: entry.runAtMs,
    durationMs: entry.durationMs,
    nextRunAtMs: entry.nextRunAtMs,
    triggerFired: entry.triggerFired,
    triggerStateChanged: options.triggerEval?.fired === true ? options.triggerEval.stateChanged : void 0,
    triggerState: options.triggerEval?.fired === true && options.triggerEval.stateChanged ? options.triggerEval.state : void 0,
    scriptStateChanged: options.scriptResult?.scriptStateChanged === true ? true : void 0,
    scriptState: options.scriptResult?.scriptStateChanged === true ? options.scriptResult.scriptState : void 0,
    model: entry.model,
    provider: entry.provider,
    usage: entry.usage
  });
  return detail ?? { kind: CRON_TASK_DETAIL_KIND };
}
function cronRunStatusToTaskStatus(entry) {
  if (entry.status === "ok" || entry.status === "skipped") {
    return "succeeded";
  }
  return entry.error === CRON_JOB_EXECUTION_TIMEOUT_ERROR ? "timed_out" : "failed";
}
var MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
function normalizeSqliteNumber(value) {
  if (typeof value === "bigint") {
    if (value > MAX_SAFE_INTEGER_BIGINT || value < -MAX_SAFE_INTEGER_BIGINT) {
      return void 0;
    }
    return Number(value);
  }
  return typeof value === "number" ? value : void 0;
}
var CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
var CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function tableExists(db, name) {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").get(name)
  );
}
function parseDetail(raw) {
  if (!raw) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function collectMirroredTasks(db) {
  const rows = db.prepare(
    `SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`
  ).all();
  const bySource = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const detail = parseDetail(row.detail_json);
    if (!row.source_id || detail?.kind !== "cron-run") {
      continue;
    }
    const identities = bySource.get(row.source_id) ?? [];
    identities.push({
      endedAt: normalizeSqliteNumber(row.ended_at) ?? null,
      ...typeof detail.runId === "string" && detail.runId ? { runId: detail.runId } : {}
    });
    bySource.set(row.source_id, identities);
  }
  return bySource;
}
function hasMirroredIdentity(identities, runId, endedAt) {
  return identities.some(
    (identity) => runId && identity.runId ? identity.runId === runId : identity.endedAt === endedAt
  );
}
function integerToBoolean(value) {
  return value === null || value === void 0 ? void 0 : Number(value) !== 0;
}
function parseLegacyRow(row) {
  let rawEntry;
  try {
    rawEntry = JSON.parse(row.entry_json ?? "");
  } catch {
    return null;
  }
  const parsed = parseCronRunLogEntryObject(rawEntry, { jobId: row.job_id });
  if (!parsed) {
    return null;
  }
  return {
    ...parsed,
    ts: normalizeSqliteNumber(row.ts) ?? parsed.ts,
    jobId: row.job_id,
    status: row.status ?? parsed.status,
    error: row.error ?? parsed.error,
    summary: row.summary ?? parsed.summary,
    delivered: integerToBoolean(row.delivered) ?? parsed.delivered,
    deliveryStatus: row.delivery_status ?? parsed.deliveryStatus,
    deliveryError: row.delivery_error ?? parsed.deliveryError,
    sessionId: row.session_id ?? parsed.sessionId,
    sessionKey: row.session_key ?? parsed.sessionKey,
    runId: row.run_id ?? parsed.runId,
    runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
    durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
    nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
    model: row.model ?? parsed.model,
    provider: row.provider ?? parsed.provider
  };
}
function ordinalKey(jobId, ts) {
  return `${jobId}\0${ts}`;
}
function migrateLegacyCronRunLogsToTaskRuns(db) {
  if (!tableExists(db, "cron_run_logs")) {
    return { imported: 0, alreadyMirrored: 0, malformed: 0, skipped: true };
  }
  const mirrored = collectMirroredTasks(db);
  const ordinals = /* @__PURE__ */ new Map();
  const insert = db.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `);
  let imported = 0;
  let alreadyMirrored = 0;
  let malformed = 0;
  let offset = 0;
  while (true) {
    const rows = db.prepare(
      `SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`
    ).all(CRON_RUN_LOG_IMPORT_BATCH_SIZE, offset);
    if (rows.length === 0) {
      break;
    }
    offset += rows.length;
    for (const row of rows) {
      const entry = parseLegacyRow(row);
      if (!entry) {
        malformed++;
        continue;
      }
      const key = ordinalKey(entry.jobId, entry.ts);
      const ordinal = (ordinals.get(key) ?? 0) + 1;
      ordinals.set(key, ordinal);
      const identities = mirrored.get(entry.jobId) ?? [];
      if (hasMirroredIdentity(identities, entry.runId, entry.ts)) {
        alreadyMirrored++;
        continue;
      }
      const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
      const status = cronRunStatusToTaskStatus(entry);
      insert.run({
        task_id: taskId,
        source_id: entry.jobId,
        child_session_key: entry.sessionKey ?? null,
        run_id: taskId,
        task: entry.jobId,
        status,
        created_at: entry.runAtMs ?? entry.ts,
        started_at: entry.runAtMs ?? null,
        ended_at: entry.ts,
        error: entry.error ?? null,
        terminal_summary: entry.summary ?? null,
        terminal_outcome: status === "succeeded" ? "succeeded" : null,
        detail_json: JSON.stringify(
          cronRunLogEntryToTaskDetail(entry, { storeKey: row.store_key })
        )
      });
      imported++;
    }
  }
  db.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);
  const result = { imported, alreadyMirrored, malformed, skipped: false };
  const now = Date.now();
  db.prepare(
    `INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`
  ).run(CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID, now, now, JSON.stringify(result));
  return result;
}
var CORE_PACKAGE_NAME = "openclaw";
var PACKAGE_JSON_CANDIDATES = [
  "../package.json",
  "../../package.json",
  "../../../package.json",
  "./package.json"
];
var BUILD_INFO_CANDIDATES = [
  "../build-info.json",
  "../../build-info.json",
  "./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
  try {
    const require3 = createRequire2(moduleUrl);
    for (const candidate of candidates) {
      try {
        const parsed = require3(candidate);
        const version = normalizeOptionalString(parsed.version);
        if (!version) {
          continue;
        }
        if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) {
          continue;
        }
        return version;
      } catch {
      }
    }
    return null;
  } catch {
    return null;
  }
}
function firstNonEmpty(...values) {
  for (const value of values) {
    const trimmed = normalizeOptionalString(value);
    if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") {
      return trimmed;
    }
  }
  return void 0;
}
function readInjectedVersion() {
  return typeof __OPENCLAW_VERSION__ === "string" ? __OPENCLAW_VERSION__ : void 0;
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
  return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, {
    requirePackageName: true
  });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
  return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function resolveVersionFromModuleUrl(moduleUrl) {
  return readVersionFromPackageJsonForModuleUrl(moduleUrl) || readVersionFromBuildInfoForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
  return firstNonEmpty(params.injectedVersion) || resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
var VERSION = resolveBinaryVersion({
  moduleUrl: import.meta.url,
  injectedVersion: readInjectedVersion(),
  bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
});
var CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set(["ENOTSUP", "EOPNOTSUPP", "EINVAL"]);
var PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
  try {
    return (statSync(target).mode & 63) === 0;
  } catch {
    return false;
  }
}
function filesystemRejectsChmod(target) {
  let probePath;
  try {
    const probeDir = statSync(target).isDirectory() ? target : path9.dirname(target);
    probePath = path9.join(probeDir, `.openclaw-chmod-probe-${randomUUID2()}`);
    writeFileSync(probePath, "", { flag: "wx", mode: PRIVATE_PROBE_FILE_MODE });
  } catch {
    return false;
  }
  try {
    chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
    return false;
  } catch (err) {
    return err.code === "EPERM";
  } finally {
    try {
      unlinkSync(probePath);
    } catch {
    }
  }
}
function canIgnorePrivateChmodError(target, code) {
  if (code && CHMOD_UNSUPPORTED_CODES.has(code)) {
    return true;
  }
  if (code === "EROFS") {
    return hasRestrictivePermissions(target);
  }
  if (code !== "EPERM") {
    return false;
  }
  return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
function applyPrivateModeSync(target, mode) {
  try {
    chmodSync(target, mode);
    return { applied: true };
  } catch (err) {
    if (!canIgnorePrivateChmodError(target, err.code)) {
      throw err;
    }
    return { applied: false, error: err };
  }
}
function resolveOpenClawStateRootDir(env) {
  if (env.OPENCLAW_STATE_DIR?.trim()) {
    return resolveStateDir(env);
  }
  if (env.VITEST || env.NODE_ENV === "test") {
    const workerId = parseStrictNonNegativeInteger(
      env.VITEST_WORKER_ID ?? env.VITEST_POOL_ID ?? ""
    );
    const shardSuffix = workerId !== void 0 ? `${process.pid}-${workerId}` : isMainThread ? String(process.pid) : `${process.pid}-${threadId}`;
    return path10.join(os4.tmpdir(), "openclaw-test-state", shardSuffix);
  }
  return resolveStateDir(env);
}
function resolveOpenClawStateSqliteDir(env = process.env) {
  return path10.join(resolveOpenClawStateRootDir(env), "state");
}
function resolveOpenClawStateSqlitePath(env = process.env) {
  return path10.join(resolveOpenClawStateSqliteDir(env), "openclaw.sqlite");
}
var OPENCLAW_QUARANTINE_SCHEMA_VERSION = 1;
var OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
var OPENCLAW_QUARANTINE_DIR_MODE = 448;
var OPENCLAW_QUARANTINE_FILE_MODE = 384;
function resolveQuarantineStorePath(env) {
  return path11.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
function ensureQuarantineStoreDirectory(storePath) {
  const dir = path11.dirname(storePath);
  mkdirSync(dir, { recursive: true, mode: OPENCLAW_QUARANTINE_DIR_MODE });
  applyPrivateModeSync(dir, OPENCLAW_QUARANTINE_DIR_MODE);
}
function configureQuarantineWriter(database, storePath) {
  database.exec(`
    PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
  const userVersion = readQuarantineSchemaVersion(database, storePath);
  if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) {
    throw new Error(
      `OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`
    );
  }
  if (userVersion === OPENCLAW_QUARANTINE_SCHEMA_VERSION) {
    return;
  }
  database.exec(`
    BEGIN IMMEDIATE;
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT
    ) STRICT;
    PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    COMMIT;
  `);
}
function readQuarantineSchemaVersion(database, storePath) {
  const row = database.prepare("PRAGMA user_version").get();
  const userVersion = row?.user_version;
  if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) {
    throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
  }
  return userVersion;
}
function withQuarantineWriter(env, operation) {
  const storePath = resolveQuarantineStorePath(env);
  const existed = existsSync(storePath);
  ensureQuarantineStoreDirectory(storePath);
  const sqlite = requireNodeSqlite();
  const database = new sqlite.DatabaseSync(storePath);
  let completed = false;
  try {
    if (!existed) {
      applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
    }
    configureQuarantineWriter(database, storePath);
    const result = operation(database);
    completed = true;
    return result;
  } finally {
    database.close();
    if (completed || !existed) {
      applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
    }
  }
}
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
  const storePath = resolveQuarantineStorePath(options.env ?? process.env);
  if (!existsSync(storePath)) {
    return void 0;
  }
  const sqlite = requireNodeSqlite();
  const database = new sqlite.DatabaseSync(storePath);
  try {
    database.exec(`PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
    const userVersion = readQuarantineSchemaVersion(database, storePath);
    if (userVersion === 0) {
      return void 0;
    }
    if (userVersion !== OPENCLAW_QUARANTINE_SCHEMA_VERSION) {
      throw new Error(
        `OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`
      );
    }
    const row = database.prepare(
      "SELECT kind, reason, quarantined_at FROM quarantined_databases WHERE path = ? LIMIT 1"
    ).get(path11.resolve(pathname));
    if (!row) {
      return void 0;
    }
    if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at)) {
      throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
    }
    return { kind: row.kind, quarantinedAt: row.quarantined_at, reason: row.reason };
  } finally {
    database.close();
  }
}
function clearOpenClawDatabaseQuarantine(pathname, options = {}) {
  const env = options.env ?? process.env;
  if (!existsSync(resolveQuarantineStorePath(env))) {
    return true;
  }
  try {
    return withQuarantineWriter(env, (database) => {
      database.exec("BEGIN IMMEDIATE;");
      try {
        database.prepare("DELETE FROM quarantined_databases WHERE path = ?").run(path11.resolve(pathname));
        database.exec("COMMIT;");
        return true;
      } catch (error) {
        database.exec("ROLLBACK;");
        throw error;
      }
    });
  } catch {
    return false;
  }
}
function tableHasColumn(db, tableName, columnName) {
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return rows.some((row) => row.name === columnName);
}
function tablePrimaryKeyColumns(db, tableName) {
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return rows.filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists2(db, tableName) {
  const row = db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
  return row?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
  const columnName = columnSql.trim().split(/\s+/, 1)[0];
  if (!columnName || !tableExists2(db, tableName) || tableHasColumn(db, tableName, columnName)) {
    return false;
  }
  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
  return true;
}
var AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
var AUDIT_EVENT_LEGACY_COLUMNS = [
  "sequence",
  "event_id",
  "source_id",
  "source_sequence",
  "occurred_at",
  "kind",
  "action",
  "status",
  "error_code",
  "actor_type",
  "actor_id",
  "agent_id",
  "session_key",
  "session_id",
  "run_id",
  "tool_call_id",
  "tool_name"
];
var AUDIT_EVENT_V2_COLUMNS = [
  "sequence",
  "event_id",
  "source_id",
  "schema_version",
  "source_sequence",
  "occurred_at",
  "kind",
  "action",
  "status",
  "error_code",
  "actor_type",
  "actor_id",
  "agent_id",
  "session_key",
  "session_id",
  "run_id",
  "tool_call_id",
  "tool_name",
  "direction",
  "channel",
  "conversation_kind",
  "message_outcome",
  "reason_code",
  "delivery_kind",
  "failure_stage",
  "duration_ms",
  "result_count",
  "account_ref",
  "conversation_ref",
  "message_ref",
  "target_ref"
];
function tableColumnInfo(db, tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all();
}
function tableHasExactColumns(db, tableName, expected) {
  const names = tableColumnInfo(db, tableName).map((column) => column.name);
  return names.length === expected.length && names.every((name, index) => name === expected[index]);
}
function tableHasRequiredColumns(db, tableName, required) {
  const columns = new Map(tableColumnInfo(db, tableName).map((column) => [column.name, column]));
  return required.every((name) => Number(columns.get(name)?.notnull ?? 0) === 1);
}
function tableSql(db, tableName) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
  return typeof row?.sql === "string" ? row.sql : void 0;
}
function tableHasUniqueColumn(db, tableName, columnName) {
  const indexes = db.prepare(`PRAGMA index_list(${tableName})`).all();
  return indexes.some((index) => {
    if (Number(index.unique ?? 0) !== 1 || typeof index.name !== "string") {
      return false;
    }
    const escaped = index.name.replaceAll("'", "''");
    const columns = db.prepare(`PRAGMA index_info('${escaped}')`).all();
    return columns.length === 1 && columns[0]?.name === columnName;
  });
}
function hasCanonicalAuditEventTable(db, expectedColumns, requiredColumns) {
  const sql = tableSql(db, "audit_events")?.toLowerCase();
  return tableHasExactColumns(db, "audit_events", expectedColumns) && tablePrimaryKeyColumns(db, "audit_events").join(",") === "sequence" && tableHasRequiredColumns(db, "audit_events", requiredColumns) && typeof sql === "string" && /\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(sql) && tableHasUniqueColumn(db, "audit_events", "event_id") && tableHasUniqueColumn(db, "audit_events", "source_id");
}
function hasCanonicalAuditIdentityKeyTable(db) {
  if (!tableExists2(db, "audit_identity_keys")) {
    return false;
  }
  const sql = tableSql(db, "audit_identity_keys")?.toLowerCase();
  return tableHasExactColumns(db, "audit_identity_keys", ["id", "key_id", "key", "created_at"]) && tablePrimaryKeyColumns(db, "audit_identity_keys").join(",") === "id" && tableHasRequiredColumns(db, "audit_identity_keys", ["id", "key_id", "key", "created_at"]) && typeof sql === "string" && /\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(sql);
}
function hasCanonicalAuditEventsSchema(db) {
  if (!tableExists2(db, "audit_events")) {
    return readSqliteUserVersion(db) < AUDIT_EVENT_STATE_SCHEMA_VERSION && !tableExists2(db, "audit_identity_keys");
  }
  return hasCanonicalAuditEventTable(db, AUDIT_EVENT_V2_COLUMNS, [
    "event_id",
    "source_id",
    "schema_version",
    "source_sequence",
    "occurred_at",
    "kind",
    "action",
    "status",
    "actor_type",
    "actor_id"
  ]) && hasCanonicalAuditIdentityKeyTable(db);
}
function canRepairLegacyAuditEventsSchema(db) {
  if (!tableExists2(db, "audit_events") || tableExists2(db, "audit_events_migration_new") || tableHasColumn(db, "audit_events", "schema_version")) {
    return false;
  }
  const identityTableIsSafe = !tableExists2(db, "audit_identity_keys") || hasCanonicalAuditIdentityKeyTable(db);
  return identityTableIsSafe && hasCanonicalAuditEventTable(db, AUDIT_EVENT_LEGACY_COLUMNS, [
    "event_id",
    "source_id",
    "source_sequence",
    "occurred_at",
    "kind",
    "action",
    "status",
    "actor_type",
    "actor_id",
    "agent_id",
    "run_id"
  ]);
}
function readAuditEventSequenceHighWater(db) {
  if (!tableExists2(db, "sqlite_sequence")) {
    return void 0;
  }
  const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = 'audit_events'").get();
  if (row === void 0) {
    return void 0;
  }
  if (typeof row.seq !== "string" || !/^\d+$/.test(row.seq)) {
    throw new Error("audit event sequence high-water mark is invalid");
  }
  const sequence = BigInt(row.seq);
  if (sequence > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("audit event sequence high-water mark exceeds the supported integer range");
  }
  return Number(sequence);
}
function restoreAuditEventSequenceHighWater(db, sequence) {
  if (sequence === void 0) {
    return;
  }
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'audit_events'").run();
  db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES ('audit_events', ?)").run(sequence);
}
function repairAuditEventsSchema(db) {
  if (hasCanonicalAuditEventsSchema(db) || !canRepairLegacyAuditEventsSchema(db)) {
    return false;
  }
  const sequenceHighWater = readAuditEventSequenceHighWater(db);
  db.exec(`
    CREATE TABLE audit_events_migration_new (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      source_id TEXT NOT NULL UNIQUE,
      schema_version INTEGER NOT NULL DEFAULT 1,
      source_sequence INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      error_code TEXT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      session_id TEXT,
      run_id TEXT,
      tool_call_id TEXT,
      tool_name TEXT,
      direction TEXT,
      channel TEXT,
      conversation_kind TEXT,
      message_outcome TEXT,
      reason_code TEXT,
      delivery_kind TEXT,
      failure_stage TEXT,
      duration_ms INTEGER,
      result_count INTEGER,
      account_ref TEXT,
      conversation_ref TEXT,
      message_ref TEXT,
      target_ref TEXT
    );
    INSERT INTO audit_events_migration_new (
      sequence,
      event_id,
      source_id,
      schema_version,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    )
    SELECT
      sequence,
      event_id,
      source_id,
      1,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    FROM audit_events;
    DROP TABLE audit_events;
    ALTER TABLE audit_events_migration_new RENAME TO audit_events;
    CREATE INDEX idx_audit_events_time
      ON audit_events(occurred_at DESC, sequence DESC);
    CREATE INDEX idx_audit_events_agent_sequence
      ON audit_events(agent_id, sequence DESC);
    CREATE INDEX idx_audit_events_session_sequence
      ON audit_events(session_key, sequence DESC);
    CREATE INDEX idx_audit_events_run_sequence
      ON audit_events(run_id, sequence DESC);
    CREATE INDEX idx_audit_events_kind_sequence
      ON audit_events(kind, sequence DESC);
    CREATE INDEX idx_audit_events_status_sequence
      ON audit_events(status, sequence DESC);
    CREATE INDEX idx_audit_events_channel_sequence
      ON audit_events(channel, sequence DESC);
    CREATE INDEX idx_audit_events_direction_sequence
      ON audit_events(direction, sequence DESC);
    CREATE TABLE IF NOT EXISTS audit_identity_keys (
      id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
      key_id TEXT NOT NULL,
      key BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  restoreAuditEventSequenceHighWater(db, sequenceHighWater);
  return true;
}
var OPENCLAW_STATE_SCHEMA_VERSION = 5;
var OPENCLAW_STATE_STRICT_SCHEMA_VERSION = 3;
var OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
var OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
var OPENCLAW_STATE_SCHEMA_SQL = `CREATE TABLE IF NOT EXISTS auth_profile_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS auth_profile_state (
  store_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS mcp_oauth_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  format_version INTEGER NOT NULL CHECK (format_version = 1),
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS diagnostic_events (
  scope TEXT NOT NULL,
  event_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (scope, event_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence
  ON diagnostic_events(scope, sequence, event_key);

CREATE TABLE IF NOT EXISTS skill_usage (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_source TEXT NOT NULL,
  first_used_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  use_count INTEGER NOT NULL,
  last_agent_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_usage_key
  ON skill_usage(skill_key, skill_file);

CREATE TABLE IF NOT EXISTS skill_lifecycle (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('active', 'stale', 'archived')),
  pinned INTEGER NOT NULL DEFAULT 0,
  state_changed_at_ms INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL,
  archived_reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_lifecycle_key
  ON skill_lifecycle(skill_key, skill_file);

CREATE INDEX IF NOT EXISTS idx_skill_lifecycle_state
  ON skill_lifecycle(state, skill_file);

CREATE TABLE IF NOT EXISTS skill_curator_state (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  last_attempt_at_ms INTEGER NOT NULL,
  last_success_at_ms INTEGER,
  last_error TEXT,
  last_result_json TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS audit_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  source_id TEXT NOT NULL UNIQUE,
  schema_version INTEGER NOT NULL DEFAULT 1,
  source_sequence INTEGER NOT NULL,
  occurred_at INTEGER NOT NULL,
  kind TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  error_code TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  session_id TEXT,
  run_id TEXT,
  tool_call_id TEXT,
  tool_name TEXT,
  direction TEXT,
  channel TEXT,
  conversation_kind TEXT,
  message_outcome TEXT,
  reason_code TEXT,
  delivery_kind TEXT,
  failure_stage TEXT,
  duration_ms INTEGER,
  result_count INTEGER,
  account_ref TEXT,
  conversation_ref TEXT,
  message_ref TEXT,
  target_ref TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_audit_events_time
  ON audit_events(occurred_at DESC, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence
  ON audit_events(agent_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence
  ON audit_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence
  ON audit_events(run_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence
  ON audit_events(kind, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence
  ON audit_events(status, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence
  ON audit_events(channel, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence
  ON audit_events(direction, sequence DESC);

CREATE TABLE IF NOT EXISTS audit_identity_keys (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  key_id TEXT NOT NULL,
  key BLOB NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS session_state_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  dedupe_key TEXT UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT,
  agent_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  run_id TEXT,
  occurred_at INTEGER NOT NULL,
  summary TEXT NOT NULL,
  payload_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence
  ON session_state_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_session_state_events_time
  ON session_state_events(occurred_at DESC, sequence DESC);

CREATE TABLE IF NOT EXISTS session_state_heads (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  last_sequence INTEGER NOT NULL,
  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, agent_id)
) STRICT;

-- Notifiable watcher identity is the bare session key, matching the process-local
-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake
-- watches from ambient queue-only group watches. Other bare keys
-- (session.scope="global") are ambiguous across agents and excluded until watcher
-- identity is agent-scoped end-to-end.
CREATE TABLE IF NOT EXISTS session_watch_cursors (
  watcher_session_key TEXT NOT NULL,
  target_session_key TEXT NOT NULL,
  last_seen_sequence INTEGER NOT NULL DEFAULT 0,
  notified_sequence INTEGER NOT NULL DEFAULT 0,
  material_sequence INTEGER NOT NULL DEFAULT 0,
  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (watcher_session_key, target_session_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target
  ON session_watch_cursors(target_session_key);

CREATE TABLE IF NOT EXISTS session_upstream_links (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  catalog_id TEXT NOT NULL,
  host_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  upstream_kind TEXT NOT NULL,
  upstream_ref_json TEXT,
  last_marker_json TEXT,
  last_scanned_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  -- (session_key, agent_id) composite identity: under session.scope="global" agents
  -- share bare keys; a key-only row would let one agent overwrite another's upstream.
  PRIMARY KEY (session_key, agent_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id
  ON session_upstream_links(catalog_id);

CREATE TABLE IF NOT EXISTS diagnostic_stability_bundles (
  bundle_key TEXT NOT NULL PRIMARY KEY,
  reason TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  bundle_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_diagnostic_stability_bundles_created
  ON diagnostic_stability_bundles(created_at DESC, bundle_key);

CREATE TABLE IF NOT EXISTS state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
  ON state_leases(expires_at, scope, lease_key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_state_leases_owner
  ON state_leases(owner, updated_at DESC);

CREATE TABLE IF NOT EXISTS exec_approvals_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  raw_json TEXT NOT NULL,
  socket_path TEXT,
  has_socket_token INTEGER NOT NULL,
  default_security TEXT,
  default_ask TEXT,
  default_ask_fallback TEXT,
  auto_allow_skills INTEGER,
  agent_count INTEGER NOT NULL,
  allowlist_count INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS operator_approvals (
  approval_id TEXT NOT NULL PRIMARY KEY CHECK (
    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')
  ),
  resolution_ref TEXT NOT NULL CHECK (
    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
  ),
  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),
  presentation_json TEXT NOT NULL,
  requested_by_device_id TEXT,
  requested_by_client_id TEXT,
  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,
  reviewer_device_ids_json TEXT NOT NULL,
  source_agent_id TEXT,
  source_session_key TEXT,
  source_session_id TEXT,
  source_run_id TEXT,
  source_tool_call_id TEXT,
  source_tool_name TEXT,
  audience_session_keys_json TEXT NOT NULL,
  runtime_epoch TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),
  terminal_reason TEXT CHECK (
    terminal_reason IN (
      'user',
      'timeout',
      'malformed-verdict',
      'no-route',
      'run-aborted',
      'gateway-restart',
      'storage-corrupt'
    )
  ),
  resolved_at_ms INTEGER,
  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),
  resolver_id TEXT,
  consumed_at_ms INTEGER,
  consumed_by TEXT,
  CHECK (expires_at_ms >= created_at_ms),
  CHECK (updated_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),
  CHECK (requested_by_device_token_auth IN (0, 1)),
  CHECK (
    (
      status = 'pending'
      AND decision IS NULL
      AND terminal_reason IS NULL
      AND resolved_at_ms IS NULL
      AND resolver_kind IS NULL
      AND resolver_id IS NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'allowed'
      AND decision IN ('allow-once', 'allow-always')
      AND terminal_reason = 'user'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
    )
    OR (
      status = 'denied'
      AND decision = 'deny'
      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'expired'
      AND decision = 'deny'
      AND terminal_reason = 'timeout'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'cancelled'
      AND decision = 'deny'
      AND terminal_reason IN ('run-aborted', 'gateway-restart')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
  ),
  CHECK (
    (consumed_at_ms IS NULL AND consumed_by IS NULL)
    OR (
      status = 'allowed'
      AND decision = 'allow-once'
      AND consumed_at_ms IS NOT NULL
      AND consumed_by IS NOT NULL
    )
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry
  ON operator_approvals(status, expires_at_ms, approval_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
  ON operator_approvals(resolution_ref);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created
  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved
  ON operator_approvals(resolved_at_ms, approval_id)
  WHERE resolved_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending
  ON operator_approvals(runtime_epoch, approval_id)
  WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS device_pairing_pending (
  request_id TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  browser_origin TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  remote_ip TEXT,
  silent INTEGER,
  is_repair INTEGER,
  ts INTEGER NOT NULL,
  refreshed_at_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device
  ON device_pairing_pending(device_id, ts DESC);

CREATE TABLE IF NOT EXISTS device_pairing_paired (
  device_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  display_name TEXT,
  operator_label TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  browser_origin TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  approved_scopes_json TEXT,
  remote_ip TEXT,
  tokens_json TEXT,
  approved_via TEXT,
  node_surface_json TEXT,
  pending_node_surface_json TEXT,
  created_at_ms INTEGER NOT NULL,
  approved_at_ms INTEGER NOT NULL,
  last_seen_at_ms INTEGER,
  last_seen_reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved
  ON device_pairing_paired(approved_at_ms DESC, device_id);

CREATE TABLE IF NOT EXISTS device_bootstrap_tokens (
  token_key TEXT NOT NULL PRIMARY KEY,
  token TEXT NOT NULL,
  ts INTEGER NOT NULL,
  device_id TEXT,
  public_key TEXT,
  profile_json TEXT,
  redeemed_profile_json TEXT,
  pending_profile_json TEXT,
  issued_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts
  ON device_bootstrap_tokens(ts);

CREATE TABLE IF NOT EXISTS device_identities (
  identity_key TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  private_key_pem TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_identities_device
  ON device_identities(device_id, updated_at_ms DESC);

CREATE TABLE IF NOT EXISTS device_auth_tokens (
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (device_id, role)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated
  ON device_auth_tokens(updated_at_ms DESC, device_id, role);

CREATE TABLE IF NOT EXISTS android_notification_recent_packages (
  package_name TEXT NOT NULL PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_android_notification_recent_packages_order
  ON android_notification_recent_packages(sort_order, package_name);

CREATE TABLE IF NOT EXISTS macos_port_guardian_records (
  pid INTEGER NOT NULL PRIMARY KEY,
  port INTEGER NOT NULL,
  command TEXT NOT NULL,
  mode TEXT NOT NULL,
  timestamp REAL NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port
  ON macos_port_guardian_records(port, timestamp DESC);

CREATE TABLE IF NOT EXISTS onboarding_recommendations (
  config_key TEXT NOT NULL PRIMARY KEY,
  inventory_hash TEXT NOT NULL,
  matches_json TEXT NOT NULL,
  offered_at_ms INTEGER NOT NULL,
  accepted_at_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS workspace_setup_state (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  workspace_path TEXT NOT NULL,
  version INTEGER NOT NULL,
  bootstrap_seeded_at TEXT,
  setup_completed_at TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path
  ON workspace_setup_state(workspace_path);

CREATE TABLE IF NOT EXISTS workspace_path_aliases (
  alias_key TEXT NOT NULL PRIMARY KEY,
  alias_path TEXT NOT NULL,
  workspace_key TEXT NOT NULL,
  workspace_path TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace
  ON workspace_path_aliases(workspace_key);

CREATE TABLE IF NOT EXISTS workspace_attestations (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  attested_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_attestations_attested
  ON workspace_attestations(attested_at_ms DESC, workspace_key);

CREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (
  workspace_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  PRIMARY KEY (workspace_key, filename),
  FOREIGN KEY (workspace_key) REFERENCES workspace_attestations(workspace_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS native_hook_relay_bridges (
  relay_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  hostname TEXT NOT NULL,
  port INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires
  ON native_hook_relay_bridges(expires_at_ms, relay_id);

CREATE TABLE IF NOT EXISTS model_capability_cache (
  provider_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  name TEXT NOT NULL,
  input_text INTEGER NOT NULL,
  input_image INTEGER NOT NULL,
  reasoning INTEGER NOT NULL,
  supports_tools INTEGER,
  context_window INTEGER NOT NULL,
  max_tokens INTEGER NOT NULL,
  cost_input REAL NOT NULL,
  cost_output REAL NOT NULL,
  cost_cache_read REAL NOT NULL,
  cost_cache_write REAL NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (provider_id, model_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_model_capability_cache_provider_updated
  ON model_capability_cache(provider_id, updated_at_ms DESC, model_id);

CREATE TABLE IF NOT EXISTS agent_model_catalogs (
  catalog_key TEXT NOT NULL PRIMARY KEY,
  agent_dir TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_model_catalogs_agent_dir
  ON agent_model_catalogs(agent_dir, updated_at DESC);

CREATE TABLE IF NOT EXISTS managed_outgoing_image_records (
  attachment_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT,
  message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  retention_class TEXT,
  alt TEXT NOT NULL,
  original_media_root TEXT NOT NULL,
  original_media_id TEXT NOT NULL,
  original_media_subdir TEXT NOT NULL,
  original_content_type TEXT NOT NULL,
  original_width INTEGER,
  original_height INTEGER,
  original_size_bytes INTEGER,
  original_filename TEXT,
  record_json TEXT NOT NULL,
  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))
) STRICT;

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session
  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message
  ON managed_outgoing_image_records(session_key, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session
  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message
  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS channel_pairing_requests (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  meta_json TEXT,
  PRIMARY KEY (channel_key, account_id, request_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code
  ON channel_pairing_requests(channel_key, code);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created
  ON channel_pairing_requests(channel_key, created_at, request_id);

CREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  entry TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (channel_key, account_id, entry)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account
  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);

CREATE TABLE IF NOT EXISTS web_push_subscriptions (
  endpoint_hash TEXT NOT NULL PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated
  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);

CREATE TABLE IF NOT EXISTS web_push_vapid_keys (
  key_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  private_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS apns_registrations (
  node_id TEXT NOT NULL PRIMARY KEY,
  transport TEXT NOT NULL,
  token TEXT,
  relay_handle TEXT,
  send_grant TEXT,
  installation_id TEXT,
  relay_origin TEXT,
  topic TEXT NOT NULL,
  environment TEXT NOT NULL,
  distribution TEXT,
  token_debug_suffix TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_apns_registrations_updated
  ON apns_registrations(updated_at_ms DESC, node_id);

CREATE TABLE IF NOT EXISTS apns_registration_tombstones (
  node_id TEXT NOT NULL PRIMARY KEY,
  deleted_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS node_host_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  node_id TEXT NOT NULL,
  token TEXT,
  display_name TEXT,
  gateway_host TEXT,
  gateway_port INTEGER,
  gateway_tls INTEGER,
  gateway_tls_fingerprint TEXT,
  gateway_context_path TEXT,
  installed_apps_sharing INTEGER NOT NULL DEFAULT 0,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS voicewake_triggers (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_voicewake_triggers_trigger
  ON voicewake_triggers(config_key, trigger);

CREATE TABLE IF NOT EXISTS voicewake_routing_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  default_target_mode TEXT NOT NULL,
  default_target_agent_id TEXT,
  default_target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS voicewake_routing_routes (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  target_mode TEXT NOT NULL,
  target_agent_id TEXT,
  target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position),
  FOREIGN KEY (config_key) REFERENCES voicewake_routing_config(config_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_voicewake_routing_routes_trigger
  ON voicewake_routing_routes(config_key, trigger);

CREATE TABLE IF NOT EXISTS update_check_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  last_checked_at TEXT,
  last_notified_version TEXT,
  last_notified_tag TEXT,
  last_available_version TEXT,
  last_available_tag TEXT,
  auto_install_id TEXT,
  auto_first_seen_version TEXT,
  auto_first_seen_tag TEXT,
  auto_first_seen_at TEXT,
  auto_last_attempt_version TEXT,
  auto_last_attempt_at TEXT,
  auto_last_success_version TEXT,
  auto_last_success_at TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS config_health_entries (
  config_path TEXT NOT NULL PRIMARY KEY,
  last_known_good_json TEXT,
  last_promoted_good_json TEXT,
  last_observed_suspicious_signature TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS clawhub_promotions_feed_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  etag TEXT,
  payload_json TEXT,
  feed_sequence INTEGER,
  last_checked_at_ms INTEGER,
  notified_slugs_json TEXT NOT NULL DEFAULT '[]',
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS clawhub_promotion_claims (
  slug TEXT NOT NULL PRIMARY KEY,
  provider TEXT,
  model_keys_json TEXT NOT NULL,
  ends_at_ms INTEGER NOT NULL,
  claimed_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS installed_plugin_index (
  index_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  host_contract_version TEXT NOT NULL,
  compat_registry_version TEXT NOT NULL,
  migration_version INTEGER NOT NULL,
  policy_hash TEXT NOT NULL,
  generated_at_ms INTEGER NOT NULL,
  refresh_reason TEXT,
  install_records_json TEXT NOT NULL,
  plugins_json TEXT NOT NULL,
  diagnostics_json TEXT NOT NULL,
  warning TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_installed_plugin_index_generated
  ON installed_plugin_index(generated_at_ms DESC, index_key);

CREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (
  feed_url TEXT NOT NULL PRIMARY KEY,
  body TEXT NOT NULL,
  status INTEGER NOT NULL,
  etag TEXT,
  last_modified TEXT,
  checksum TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  trust_mode TEXT,
  trust_key_id TEXT,
  trust_signature_count INTEGER,
  trust_threshold INTEGER,
  trust_verified_at TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated
  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);

CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (
  sentinel_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  ts INTEGER NOT NULL,
  session_key TEXT,
  thread_id TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_account_id TEXT,
  message TEXT,
  continuation_json TEXT,
  doctor_hint TEXT,
  stats_json TEXT,
  payload_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts
  ON gateway_restart_sentinel(ts DESC, sentinel_key);

CREATE TABLE IF NOT EXISTS gateway_restart_intent (
  intent_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  pid INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  reason TEXT,
  force INTEGER,
  wait_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS gateway_restart_handoff (
  handoff_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  version INTEGER NOT NULL,
  intent_id TEXT NOT NULL,
  pid INTEGER NOT NULL,
  process_instance_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  reason TEXT,
  restart_trace_started_at INTEGER,
  restart_trace_last_at INTEGER,
  source TEXT NOT NULL,
  restart_kind TEXT NOT NULL,
  supervisor_mode TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry
  ON gateway_restart_handoff(expires_at, pid);

CREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (
  boot_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  started_at_ms INTEGER NOT NULL,
  completed_at_ms INTEGER,
  outcome TEXT,
  startup_reason TEXT,
  reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started
  ON gateway_boot_lifecycle(started_at_ms);

CREATE TABLE IF NOT EXISTS acp_sessions (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT,
  backend TEXT NOT NULL,
  agent TEXT NOT NULL,
  runtime_session_name TEXT NOT NULL,
  identity_json TEXT,
  mode TEXT NOT NULL,
  runtime_options_json TEXT,
  cwd TEXT,
  state TEXT NOT NULL,
  last_activity_at INTEGER NOT NULL,
  last_error TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity
  ON acp_sessions(state, last_activity_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity
  ON acp_sessions(agent, last_activity_at DESC, session_key);

CREATE TABLE IF NOT EXISTS acp_replay_sessions (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  cwd TEXT NOT NULL,
  complete INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  next_seq INTEGER NOT NULL,
  -- Running estimate of this session's ledger footprint (row overhead plus
  -- all event rows), maintained at insert/trim so budget checks never scan
  -- acp_replay_events (#100622).
  estimated_bytes INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated
  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated
  ON acp_replay_sessions(updated_at DESC, session_id);

CREATE TABLE IF NOT EXISTS acp_replay_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  at INTEGER NOT NULL,
  session_key TEXT NOT NULL,
  run_id TEXT,
  update_json TEXT NOT NULL,
  estimated_bytes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq
  ON acp_replay_events(session_id, seq);

CREATE TABLE IF NOT EXISTS agent_databases (
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  size_bytes INTEGER,
  PRIMARY KEY (agent_id, path)
) STRICT;

CREATE TABLE IF NOT EXISTS agent_deletion_journal (
  agent_id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL DEFAULT '',
  agent_dir TEXT NOT NULL,
  workspace_dir TEXT NOT NULL,
  sessions_dir TEXT NOT NULL,
  database_paths_json TEXT NOT NULL DEFAULT '[]',
  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  cleanup_completed INTEGER NOT NULL DEFAULT 0,
  delete_files INTEGER NOT NULL DEFAULT 1
) STRICT;

CREATE TABLE IF NOT EXISTS agent_database_leases (
  lease_id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  owner_pid INTEGER NOT NULL,
  owner_start_time INTEGER,
  opened_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS plugin_state_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_state_expiry
  ON plugin_state_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_state_listing
  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS channel_ingress_events (
  queue_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  status TEXT NOT NULL,
  lane_key TEXT,
  payload_json TEXT NOT NULL,
  metadata_json TEXT,
  received_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  claim_token TEXT,
  claim_owner TEXT,
  claimed_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  failed_reason TEXT,
  failed_at INTEGER,
  completed_at INTEGER,
  completed_metadata_json TEXT,
  PRIMARY KEY (queue_name, event_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_ingress_pending
  ON channel_ingress_events(queue_name, status, received_at, event_id);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_claims
  ON channel_ingress_events(queue_name, status, claimed_at);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_lane
  ON channel_ingress_events(queue_name, status, lane_key);

CREATE TABLE IF NOT EXISTS plugin_blob_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry
  ON plugin_blob_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_listing
  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS media_blobs (
  subdir TEXT NOT NULL,
  id TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (subdir, id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_media_blobs_created
  ON media_blobs(created_at);

CREATE TABLE IF NOT EXISTS skill_uploads (
  upload_id TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  force INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT,
  actual_sha256 TEXT,
  received_bytes INTEGER NOT NULL,
  archive_blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  committed INTEGER NOT NULL,
  committed_at INTEGER,
  idempotency_key_hash TEXT UNIQUE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry
  ON skill_uploads(expires_at);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency
  ON skill_uploads(idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS skill_upload_chunks (
  upload_id TEXT NOT NULL,
  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  chunk_blob BLOB NOT NULL,
  PRIMARY KEY (upload_id, byte_offset),
  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,
  CHECK (length(chunk_blob) = size_bytes)
) STRICT;

CREATE TABLE IF NOT EXISTS capture_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  mode TEXT NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  proxy_url TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS capture_blobs (
  blob_id TEXT NOT NULL PRIMARY KEY,
  content_type TEXT,
  encoding TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS capture_events (
  id INTEGER NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  protocol TEXT NOT NULL,
  direction TEXT NOT NULL,
  kind TEXT NOT NULL,
  flow_id TEXT NOT NULL,
  method TEXT,
  host TEXT,
  path TEXT,
  status INTEGER,
  close_code INTEGER,
  content_type TEXT,
  headers_json TEXT,
  data_text TEXT,
  data_blob_id TEXT,
  data_sha256 TEXT,
  error_text TEXT,
  meta_json TEXT,
  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL
) STRICT;

CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx
  ON capture_events(session_id, ts);

CREATE INDEX IF NOT EXISTS capture_events_flow_idx
  ON capture_events(flow_id, ts);

CREATE TABLE IF NOT EXISTS sandbox_registry_entries (
  registry_kind TEXT NOT NULL,
  container_name TEXT NOT NULL,
  session_key TEXT,
  backend_id TEXT,
  runtime_label TEXT,
  image TEXT,
  created_at_ms INTEGER,
  last_used_at_ms INTEGER,
  config_label_kind TEXT,
  config_hash TEXT,
  cdp_port INTEGER,
  no_vnc_port INTEGER,
  entry_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (registry_kind, container_name)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated
  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_session
  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used
  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)
  WHERE last_used_at_ms IS NOT NULL;

CREATE TABLE IF NOT EXISTS commitments (
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);

CREATE INDEX IF NOT EXISTS idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);

CREATE INDEX IF NOT EXISTS idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);

CREATE TABLE IF NOT EXISTS cron_jobs (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  declaration_key TEXT,
  display_name TEXT,
  owner_agent_id TEXT,
  owner_session_key TEXT,
  name TEXT NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL,
  delete_after_run INTEGER,
  created_at_ms INTEGER NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  schedule_kind TEXT NOT NULL,
  schedule_expr TEXT,
  schedule_tz TEXT,
  every_ms INTEGER,
  anchor_ms INTEGER,
  at TEXT,
  stagger_ms INTEGER,
  session_target TEXT NOT NULL,
  wake_mode TEXT NOT NULL,
  trigger_script TEXT,
  trigger_once INTEGER,
  payload_kind TEXT NOT NULL,
  payload_message TEXT,
  payload_model TEXT,
  payload_fallbacks_json TEXT,
  payload_thinking TEXT,
  payload_timeout_seconds INTEGER,
  payload_allow_unsafe_external_content INTEGER,
  payload_external_content_source_json TEXT,
  payload_light_context INTEGER,
  payload_tools_allow_json TEXT,
  payload_tools_allow_is_default INTEGER,
  delivery_mode TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_thread_id TEXT,
  delivery_thread_id_type TEXT,
  delivery_account_id TEXT,
  delivery_best_effort INTEGER,
  delivery_completion_mode TEXT,
  delivery_completion_to TEXT,
  failure_delivery_mode TEXT,
  failure_delivery_channel TEXT,
  failure_delivery_to TEXT,
  failure_delivery_account_id TEXT,
  failure_alert_disabled INTEGER,
  failure_alert_after INTEGER,
  failure_alert_channel TEXT,
  failure_alert_to TEXT,
  failure_alert_cooldown_ms INTEGER,
  failure_alert_include_skipped INTEGER,
  failure_alert_mode TEXT,
  failure_alert_account_id TEXT,
  next_run_at_ms INTEGER,
  running_at_ms INTEGER,
  last_run_at_ms INTEGER,
  last_run_status TEXT,
  last_error TEXT,
  last_duration_ms INTEGER,
  consecutive_errors INTEGER,
  consecutive_skipped INTEGER,
  schedule_error_count INTEGER,
  last_delivery_status TEXT,
  last_delivery_error TEXT,
  last_delivered INTEGER,
  last_failure_alert_at_ms INTEGER,
  job_json TEXT NOT NULL,
  state_json TEXT NOT NULL DEFAULT '{}',
  runtime_updated_at_ms INTEGER,
  schedule_identity TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_updated
  ON cron_jobs(store_key, sort_order ASC, updated_at DESC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order
  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled_next_run
  ON cron_jobs(store_key, enabled, next_run_at_ms, job_id)
  WHERE next_run_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_agent_session
  ON cron_jobs(agent_id, session_key, updated_at DESC, job_id)
  WHERE agent_id IS NOT NULL OR session_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS command_log_entries (
  id TEXT NOT NULL PRIMARY KEY,
  timestamp_ms INTEGER NOT NULL,
  action TEXT NOT NULL,
  session_key TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  source TEXT NOT NULL,
  entry_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_command_log_entries_timestamp
  ON command_log_entries(timestamp_ms DESC, id);

CREATE INDEX IF NOT EXISTS idx_command_log_entries_session
  ON command_log_entries(session_key, timestamp_ms DESC, id);

CREATE TABLE IF NOT EXISTS delivery_queue_entries (
  queue_name TEXT NOT NULL,
  id TEXT NOT NULL,
  status TEXT NOT NULL,
  entry_kind TEXT,
  session_key TEXT,
  channel TEXT,
  target TEXT,
  account_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  recovery_state TEXT,
  platform_send_started_at INTEGER,
  entry_json TEXT NOT NULL,
  enqueued_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  failed_at INTEGER,
  PRIMARY KEY (queue_name, id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_pending
  ON delivery_queue_entries(queue_name, status, enqueued_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_failed
  ON delivery_queue_entries(queue_name, status, failed_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_session
  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_target
  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)
  WHERE channel IS NOT NULL AND target IS NOT NULL;

CREATE TABLE IF NOT EXISTS task_runs (
  task_id TEXT NOT NULL PRIMARY KEY,
  runtime TEXT NOT NULL,
  task_kind TEXT,
  source_id TEXT,
  requester_session_key TEXT,
  owner_key TEXT NOT NULL,
  scope_kind TEXT NOT NULL,
  child_session_key TEXT,
  parent_flow_id TEXT,
  parent_task_id TEXT,
  agent_id TEXT,
  requester_agent_id TEXT,
  run_id TEXT,
  label TEXT,
  task TEXT NOT NULL,
  status TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  ended_at INTEGER,
  last_event_at INTEGER,
  cleanup_after INTEGER,
  tool_use_count INTEGER,
  last_tool_name TEXT,
  error TEXT,
  progress_summary TEXT,
  terminal_summary TEXT,
  terminal_outcome TEXT,
  detail_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);
CREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);
CREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);
CREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended
  ON task_runs(runtime, source_id, ended_at, created_at, task_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended
  ON task_runs(runtime, ended_at, created_at, task_id);

CREATE TABLE IF NOT EXISTS subagent_runs (
  run_id TEXT NOT NULL PRIMARY KEY,
  child_session_key TEXT NOT NULL,
  controller_session_key TEXT,
  requester_session_key TEXT NOT NULL,
  requester_display_key TEXT NOT NULL,
  requester_origin_json TEXT,
  task TEXT NOT NULL,
  task_name TEXT,
  cleanup TEXT NOT NULL,
  label TEXT,
  model TEXT,
  agent_dir TEXT,
  workspace_dir TEXT,
  run_timeout_seconds INTEGER,
  spawn_mode TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  session_started_at INTEGER,
  accumulated_runtime_ms INTEGER,
  ended_at INTEGER,
  outcome_json TEXT,
  archive_at_ms INTEGER,
  cleanup_completed_at INTEGER,
  cleanup_handled INTEGER,
  suppress_announce_reason TEXT,
  expects_completion_message INTEGER,
  announce_retry_count INTEGER,
  last_announce_retry_at INTEGER,
  last_announce_delivery_error TEXT,
  ended_reason TEXT,
  pause_reason TEXT,
  wake_on_descendant_settle INTEGER,
  requester_settle_wake_status TEXT,
  requester_settle_wake_attempt_count INTEGER,
  requester_settle_wake_replay_count INTEGER,
  requester_settle_wake_next_attempt_at INTEGER,
  requester_settle_wake_batch_run_ids_json TEXT,
  requester_settle_wake_last_error TEXT,
  requester_settle_wake_retire_after INTEGER,
  frozen_result_text TEXT,
  frozen_result_captured_at INTEGER,
  fallback_frozen_result_text TEXT,
  fallback_frozen_result_captured_at INTEGER,
  ended_hook_emitted_at INTEGER,
  pending_final_delivery INTEGER,
  pending_final_delivery_created_at INTEGER,
  pending_final_delivery_last_attempt_at INTEGER,
  pending_final_delivery_attempt_count INTEGER,
  pending_final_delivery_last_error TEXT,
  pending_final_delivery_payload_json TEXT,
  completion_announced_at INTEGER,
  swarm_group_id TEXT,
  swarm_collector INTEGER,
  swarm_output_schema_json TEXT,
  swarm_completion_status TEXT,
  swarm_structured_json TEXT,
  swarm_schema_error TEXT,
  swarm_usage_json TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}'
) STRICT;

CREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key
  ON subagent_runs(child_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key
  ON subagent_runs(requester_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key
  ON subagent_runs(controller_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_archive_at
  ON subagent_runs(archive_at_ms, cleanup_handled, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_ended_cleanup
  ON subagent_runs(ended_at, cleanup_handled, run_id);

CREATE TABLE IF NOT EXISTS current_conversation_bindings (
  binding_key TEXT NOT NULL PRIMARY KEY,
  binding_id TEXT NOT NULL,
  target_agent_id TEXT NOT NULL,
  target_session_id TEXT,
  target_session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  conversation_kind TEXT NOT NULL,
  parent_conversation_id TEXT,
  conversation_id TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  bound_at INTEGER NOT NULL,
  expires_at INTEGER,
  metadata_json TEXT,
  record_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target
  ON current_conversation_bindings(target_agent_id, target_session_key, updated_at DESC, binding_key);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation
  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires
  ON current_conversation_bindings(expires_at, binding_key);

CREATE TABLE IF NOT EXISTS plugin_binding_approvals (
  plugin_root TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_name TEXT,
  approved_at INTEGER NOT NULL,
  PRIMARY KEY (plugin_root, channel, account_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin
  ON plugin_binding_approvals(plugin_id, approved_at DESC);

CREATE TABLE IF NOT EXISTS tui_last_sessions (
  scope_key TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_tui_last_sessions_session_key
  ON tui_last_sessions(session_key, updated_at DESC, scope_key);

CREATE TABLE IF NOT EXISTS task_delivery_state (
  task_id TEXT NOT NULL PRIMARY KEY,
  requester_origin_json TEXT,
  last_notified_event_at INTEGER,
  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS flow_runs (
  flow_id TEXT NOT NULL PRIMARY KEY,
  shape TEXT,
  sync_mode TEXT NOT NULL DEFAULT 'managed',
  owner_key TEXT NOT NULL,
  requester_origin_json TEXT,
  controller_id TEXT,
  revision INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  goal TEXT NOT NULL,
  current_step TEXT,
  blocked_task_id TEXT,
  blocked_summary TEXT,
  state_json TEXT,
  wait_json TEXT,
  cancel_requested_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ended_at INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);
CREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);

CREATE TABLE IF NOT EXISTS migration_runs (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL,
  report_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_migration_runs_started
  ON migration_runs(started_at DESC, id);

CREATE TABLE IF NOT EXISTS migration_sources (
  source_key TEXT NOT NULL PRIMARY KEY,
  migration_kind TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_table TEXT NOT NULL,
  source_sha256 TEXT,
  source_size_bytes INTEGER,
  source_record_count INTEGER,
  last_run_id TEXT NOT NULL,
  status TEXT NOT NULL,
  imported_at INTEGER NOT NULL,
  removed_source INTEGER NOT NULL DEFAULT 0,
  report_json TEXT NOT NULL,
  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_migration_sources_path
  ON migration_sources(source_path, migration_kind, target_table);

CREATE INDEX IF NOT EXISTS idx_migration_sources_run
  ON migration_sources(last_run_id, source_path);

CREATE TABLE IF NOT EXISTS backup_runs (
  id TEXT NOT NULL PRIMARY KEY,
  created_at INTEGER NOT NULL,
  archive_path TEXT NOT NULL,
  status TEXT NOT NULL,
  manifest_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_backup_runs_created
  ON backup_runs(created_at DESC, id);

CREATE TABLE IF NOT EXISTS worktrees (
  id TEXT NOT NULL PRIMARY KEY,
  repo_fingerprint TEXT NOT NULL,
  repo_root TEXT NOT NULL,
  path TEXT NOT NULL,
  branch TEXT NOT NULL,
  base_ref TEXT NOT NULL,
  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),
  owner_id TEXT,
  snapshot_ref TEXT,
  provisioned_paths_json TEXT,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  removed_at INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint
  ON worktrees(repo_fingerprint);

CREATE INDEX IF NOT EXISTS idx_worktrees_removed_at
  ON worktrees(removed_at);

CREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (
  worktree_id TEXT NOT NULL,
  path TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  data BLOB NOT NULL,
  PRIMARY KEY (worktree_id, path, chunk_index)
) STRICT;

-- Gateway-owned custom session group catalog (names + display order).
-- Membership stays on each session entry's category field; this table only
-- owns which groups exist and how operator UIs order them.
CREATE TABLE IF NOT EXISTS session_groups (
  name TEXT NOT NULL PRIMARY KEY,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution
-- stays in plugins; this table records only core reconciliation facts.
CREATE TABLE IF NOT EXISTS worker_environments (
  environment_id TEXT NOT NULL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  profile_snapshot_json TEXT NOT NULL,
  provision_operation_id TEXT NOT NULL UNIQUE,
  lease_id TEXT,
  ssh_host TEXT,
  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),
  ssh_user TEXT,
  ssh_host_key TEXT,
  ssh_key_ref_json TEXT,
  state TEXT NOT NULL CHECK (
    state IN (
      'requested',
      'provisioning',
      'bootstrapping',
      'ready',
      'attached',
      'idle',
      'draining',
      'destroying',
      'destroyed',
      'failed',
      'orphaned'
    )
  ),
  bootstrap_bundle_hash TEXT,
  bootstrap_openclaw_version TEXT,
  bootstrap_protocol_features_json TEXT,
  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),
  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),
  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  idle_since_at_ms INTEGER,
  destroy_requested_at_ms INTEGER,
  last_error TEXT
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease
  ON worker_environments(provider_id, lease_id)
  WHERE lease_id IS NOT NULL;

-- Session placement lives in the shared state database so local admission,
-- worker admission, and environment attachment use one durable authority.
CREATE TABLE IF NOT EXISTS worker_session_placements (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  state TEXT NOT NULL CHECK (
    state IN (
      'local',
      'requested',
      'provisioning',
      'syncing',
      'starting',
      'active',
      'draining',
      'reconciling',
      'reclaimed',
      'failed'
    )
  ),
  environment_id TEXT,
  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),
  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),
  workspace_base_manifest_ref TEXT,
  remote_workspace_dir TEXT,
  worker_bundle_hash TEXT,
  last_transcript_ack_cursor INTEGER CHECK (
    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0
  ),
  last_live_event_ack_cursor INTEGER CHECK (
    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0
  ),
  recovery_error TEXT,
  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),
  turn_claim_id TEXT,
  turn_claim_run_id TEXT,
  turn_claim_generation INTEGER CHECK (
    turn_claim_generation IS NULL OR turn_claim_generation >= 0
  ),
  turn_claim_owner_epoch INTEGER CHECK (
    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1
  ),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  CHECK (
    (state IN ('local', 'requested')
      AND environment_id IS NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'provisioning'
      AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'syncing'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'starting'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IN ('active', 'draining', 'reconciling')
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)
    OR
    (state IS 'reclaimed'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL
      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (state IS 'failed' AND recovery_error IS NOT NULL)
  ),
  CHECK (
    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NOT NULL)
  ),
  CHECK (
    turn_claim_owner IS NULL
    OR
    (turn_claim_owner IS 'local' AND state IN ('local', 'requested', 'failed'))
    OR
    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')
      AND turn_claim_owner_epoch IS active_owner_epoch)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key
  ON worker_session_placements(agent_id, session_key);

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile
  ON worker_session_placements(updated_at_ms, session_id);

-- A reconciliation journal is written before managed-worktree mutation. The
-- bounded Git base snapshot repairs any subset left by an interrupted apply.
CREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  base_manifest_ref TEXT NOT NULL,
  current_manifest_ref TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),
  created_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- A completed remote turn is fenced from stale-claim teardown until its
-- workspace result is durably reconciled into the managed worktree.
CREATE TABLE IF NOT EXISTS worker_workspace_pending_results (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  claim_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  gateway_instance_id TEXT NOT NULL,
  recovery_requested_at_ms INTEGER,
  workspace_accepted_at_ms INTEGER,
  staged_result_ref TEXT,
  created_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- One active, opaque admission credential per worker environment. Plaintext
-- may be retried until delivery acknowledgement but never enters durable state.
CREATE TABLE IF NOT EXISTS worker_environment_credentials (
  environment_id TEXT NOT NULL PRIMARY KEY,
  credential_hash TEXT NOT NULL UNIQUE,
  bundle_hash TEXT NOT NULL,
  session_id TEXT,
  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),
  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;

-- One durable sequence cursor per attached session owner epoch. The environment
-- binding prevents independent workers with coincident epochs from sharing replay state.
CREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  environment_id TEXT NOT NULL,
  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch)
) STRICT;

-- Pending rows preserve a claimed request across gateway restarts. Terminal rows
-- cache the exact result returned for deterministic at-least-once replay.
CREATE TABLE IF NOT EXISTS worker_transcript_commits (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  seq INTEGER NOT NULL CHECK (seq >= 1),
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  result_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, seq),
  FOREIGN KEY (session_id, run_epoch)
    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)
    ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND result_json IS NULL) OR
    (state = 'terminal' AND result_json IS NOT NULL)
  )
) STRICT;

-- Pending rows preserve a claimed inference turn across gateway restarts.
-- Terminal rows cache the exact outcome returned for deterministic replay.
CREATE TABLE IF NOT EXISTS worker_inference_turns (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  run_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  environment_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  terminal_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND terminal_json IS NULL) OR
    (state = 'terminal' AND terminal_json IS NOT NULL)
  )
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run
  ON worker_inference_turns(session_id, run_epoch, run_id)
  WHERE state = 'pending';

CREATE TABLE IF NOT EXISTS fleet_cells (
  tenant_id TEXT NOT NULL PRIMARY KEY,
  created_at_ms INTEGER NOT NULL,
  image TEXT NOT NULL,
  runtime TEXT NOT NULL,
  host_port INTEGER NOT NULL,
  container_name TEXT NOT NULL,
  data_dir TEXT NOT NULL
) STRICT;
`;
function createOpenClawDatabaseVerificationError(kind, pathname, storedError) {
  const error = new Error(
    `OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`
  );
  error.name = "SqliteIntegrityError";
  return error;
}
function assertSupportedSchemaVersion(db, pathname) {
  const userVersion = readSqliteUserVersion(db);
  if (userVersion > OPENCLAW_STATE_SCHEMA_VERSION) {
    throw createNewerSqliteSchemaVersionError(
      "OpenClaw state database",
      pathname,
      userVersion,
      OPENCLAW_STATE_SCHEMA_VERSION
    );
  }
}
function resolveDatabasePath(options = {}) {
  return path12.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
var COLUMNS = [
  "approval_id",
  "resolution_ref",
  "kind",
  "status",
  "presentation_json",
  "requested_by_device_id",
  "requested_by_client_id",
  "requested_by_device_token_auth",
  "reviewer_device_ids_json",
  "source_agent_id",
  "source_session_key",
  "source_session_id",
  "source_run_id",
  "source_tool_call_id",
  "source_tool_name",
  "audience_session_keys_json",
  "runtime_epoch",
  "created_at_ms",
  "expires_at_ms",
  "updated_at_ms",
  "decision",
  "terminal_reason",
  "resolved_at_ms",
  "resolver_kind",
  "resolver_id",
  "consumed_at_ms",
  "consumed_by"
];
function tableSql2(db) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'").get();
  return typeof row?.sql === "string" ? row.sql : void 0;
}
function hasCanonicalOperatorApprovalKinds(db) {
  if (!tableExists2(db, "operator_approvals")) {
    return true;
  }
  return /kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(
    tableSql2(db)?.toLowerCase() ?? ""
  );
}
function assertCanonicalOperatorApprovalKinds(db, pathname) {
  if (!hasCanonicalOperatorApprovalKinds(db)) {
    throw new Error(
      `OpenClaw state database ${pathname} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`
    );
  }
}
function isCanonicalOperatorApprovalKind(value) {
  return value === "exec" || value === "plugin" || value === "system-agent";
}
function detectOperatorApprovalSchemaMigration(db, path17) {
  return hasCanonicalOperatorApprovalKinds(db) ? [] : [{ kind: "operator-approvals-system-agent", path: path17 }];
}
function normalizeDdl(sql) {
  return sql.replace(/\s+/g, " ").trim().replace(/;$/, "");
}
function canonicalOperatorApprovalCreateSql() {
  const marker = "CREATE TABLE IF NOT EXISTS operator_approvals (";
  const tableTerminator = "\n) STRICT;";
  const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(marker);
  const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf(
    `${tableTerminator}

CREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry`,
    start
  );
  if (start < 0 || end < 0) {
    throw new Error("canonical operator approval schema is unavailable");
  }
  return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + tableTerminator.length);
}
function alterAppendedResolutionRefCreateSql(sql) {
  const resolutionRefStart = sql.indexOf("\n  resolution_ref ");
  const followingColumnStart = sql.indexOf("\n  kind ", resolutionRefStart);
  const tailColumn = "\n  consumed_by TEXT,";
  const tailColumnStart = sql.indexOf(tailColumn, followingColumnStart);
  if (resolutionRefStart < 0 || followingColumnStart < 0 || tailColumnStart < 0) {
    throw new Error("canonical operator approval resolution reference schema is unavailable");
  }
  const withoutResolutionRef = sql.slice(0, resolutionRefStart) + sql.slice(followingColumnStart);
  return withoutResolutionRef.replace(tailColumn, `${tailColumn} resolution_ref TEXT,`);
}
function hasExactLegacyOperatorApprovalSchema(db) {
  const live = tableSql2(db);
  if (!live) {
    return false;
  }
  const exactStrictLegacy = canonicalOperatorApprovalCreateSql().replace("CREATE TABLE IF NOT EXISTS operator_approvals (", "CREATE TABLE operator_approvals (").replace(/'exec',\s*'plugin',\s*'system-agent'/, "'exec', 'plugin'");
  const normalizedLive = normalizeDdl(live);
  const alterAppendedStrictLegacy = alterAppendedResolutionRefCreateSql(exactStrictLegacy);
  return [exactStrictLegacy, alterAppendedStrictLegacy].some(
    (strictLegacy) => [strictLegacy, strictLegacy.replace(/\) STRICT;$/u, ");")].map(normalizeDdl).includes(normalizedLive)
  );
}
function canonicalCreateSql() {
  return canonicalOperatorApprovalCreateSql().replace(
    "CREATE TABLE IF NOT EXISTS operator_approvals (",
    "CREATE TABLE operator_approvals_migration_new ("
  );
}
function operatorApprovalIndexSql() {
  const statements = OPENCLAW_STATE_SCHEMA_SQL.split(";").map((statement) => statement.trim()).filter(
    (statement) => /^CREATE (?:UNIQUE )?INDEX IF NOT EXISTS idx_operator_approvals_/.test(statement)
  );
  if (statements.length === 0) {
    throw new Error("canonical operator approval index schema is unavailable");
  }
  return `${statements.join(";\n")};`;
}
function repairOperatorApprovalKinds(db) {
  if (hasCanonicalOperatorApprovalKinds(db) || tableExists2(db, "operator_approvals_migration_new") || !hasExactLegacyOperatorApprovalSchema(db)) {
    return false;
  }
  const columns = COLUMNS.join(", ");
  runSqliteImmediateTransactionSync(db, () => {
    db.exec(canonicalCreateSql());
    db.exec(`
      INSERT INTO operator_approvals_migration_new (${columns})
      SELECT ${columns} FROM operator_approvals
      WHERE typeof(resolution_ref) = 'text'
        AND length(resolution_ref) = 43
        AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*';
      DROP TABLE operator_approvals;
      ALTER TABLE operator_approvals_migration_new RENAME TO operator_approvals;
    `);
    db.exec(operatorApprovalIndexSql());
  });
  return true;
}
function repairOperatorApprovalSchema(db) {
  return repairOperatorApprovalKinds(db) ? ["Migrated shared state operator approvals \u2192 OpenClaw system changes"] : [];
}
function pruneMapToMaxSize(map, maxSize) {
  if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) {
    return;
  }
  const limit = Math.max(0, Math.floor(maxSize));
  if (limit <= 0) {
    map.clear();
    return;
  }
  while (map.size > limit) {
    const oldest = map.keys().next();
    if (oldest.done) {
      break;
    }
    map.delete(oldest.value);
  }
}
function createDedupeCache(options) {
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const maxSize = resolveNonNegativeIntegerOption(options.maxSize, 0);
  const cache = /* @__PURE__ */ new Map();
  const touch = (key, now) => {
    cache.delete(key);
    cache.set(key, now);
  };
  const prune = (now) => {
    const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
    if (cutoff !== void 0) {
      for (const [entryKey, entryTs] of cache) {
        if (entryTs < cutoff) {
          cache.delete(entryKey);
        }
      }
    }
    if (maxSize <= 0) {
      cache.clear();
      return;
    }
    pruneMapToMaxSize(cache, maxSize);
  };
  const hasUnexpired = (key, now, touchOnRead) => {
    const existing = cache.get(key);
    if (existing === void 0) {
      return false;
    }
    if (ttlMs > 0 && now - existing >= ttlMs) {
      cache.delete(key);
      return false;
    }
    if (touchOnRead) {
      touch(key, now);
    }
    return true;
  };
  return {
    check: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
      if (hasUnexpired(key, now, true)) {
        return true;
      }
      touch(key, now);
      prune(now);
      return false;
    },
    peek: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
      return hasUnexpired(key, now, false);
    },
    delete: (key) => {
      if (!key) {
        return;
      }
      cache.delete(key);
    },
    clear: () => {
      cache.clear();
    },
    size: () => cache.size
  };
}
var SQLITE_DATABASE_FILE_SUFFIXES = ["", "-wal", "-shm", "-journal"];
function resolveSqliteDatabaseFilePaths(pathname) {
  return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
var OPENCLAW_STATE_DIR_MODE = 448;
var OPENCLAW_STATE_FILE_MODE = 384;
var stateDbLog = createSubsystemLogger("state/db");
var chmodWarnedTargets = createDedupeCache({
  ttlMs: 0,
  maxSize: 4096
});
function bestEffortChmodSync(target, mode) {
  const result = applyPrivateModeSync(target, mode);
  if (result.applied || chmodWarnedTargets.check(target)) {
    return;
  }
  stateDbLog.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env) {
  const dir = path13.dirname(pathname);
  const defaultDir = resolveOpenClawStateSqliteDir(env);
  const isDefaultStateDatabase = path13.resolve(pathname) === path13.resolve(resolveOpenClawStateSqlitePath(env));
  if (isDefaultStateDatabase && dir !== defaultDir) {
    throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
  }
  const dirExisted = existsSync2(dir);
  mkdirSync2(dir, { recursive: true, mode: OPENCLAW_STATE_DIR_MODE });
  if (isDefaultStateDatabase || !dirExisted) {
    bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
  }
  for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) {
    if (existsSync2(candidate)) {
      bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
    }
  }
}
function buildApprovalResolutionRef(params) {
  return createHash("sha256").update(params.approvalKind, "utf8").update("\0", "utf8").update(params.approvalId, "utf8").digest("base64url");
}
function ensureOperatorApprovalResolutionRefs(db) {
  if (!tableExists2(db, "operator_approvals")) {
    return;
  }
  runSqliteImmediateTransactionSync(db, () => {
    ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
    const rows = db.prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals").all();
    const update = db.prepare(
      "UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?"
    );
    for (const row of rows) {
      if (typeof row.approval_id !== "string" || !isCanonicalOperatorApprovalKind(row.kind)) {
        throw new Error("operator approval row cannot be assigned a transport reference");
      }
      const resolutionRef = buildApprovalResolutionRef({
        approvalId: row.approval_id,
        approvalKind: row.kind
      });
      if (row.resolution_ref !== resolutionRef) {
        update.run(resolutionRef, row.approval_id);
      }
    }
    const namespaceConflict = db.prepare(
      `SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`
    ).get();
    if (namespaceConflict) {
      throw new Error("operator approval ids conflict with durable transport references");
    }
    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
  });
}
function repairLegacyTaskAgentAttribution(db) {
  if (!tableExists2(db, "task_runs") || !tableHasColumn(db, "task_runs", "requester_agent_id")) {
    return;
  }
  db.exec(`
    UPDATE task_runs
    SET
      requester_agent_id = CASE
        WHEN owner_key GLOB 'agent:*:*' THEN substr(
          owner_key,
          7,
          instr(substr(owner_key, 7), ':') - 1
        )
        WHEN requester_session_key GLOB 'agent:*:*' THEN substr(
          requester_session_key,
          7,
          instr(substr(requester_session_key, 7), ':') - 1
        )
        WHEN agent_id <> substr(
          child_session_key,
          7,
          instr(substr(child_session_key, 7), ':') - 1
        ) THEN agent_id
        ELSE NULL
      END,
      agent_id = substr(
        child_session_key,
        7,
        instr(substr(child_session_key, 7), ':') - 1
      )
    WHERE requester_agent_id IS NULL
      AND runtime IN ('subagent', 'acp')
      AND child_session_key GLOB 'agent:*:*'
      AND instr(substr(child_session_key, 7), ':') > 1
      AND (
        owner_key GLOB 'agent:*:*'
        OR requester_session_key GLOB 'agent:*:*'
        OR (
          agent_id IS NOT NULL
          AND agent_id <> substr(
            child_session_key,
            7,
            instr(substr(child_session_key, 7), ':') - 1
          )
        )
      );
  `);
}
function repairLegacyTaskDeliveryStatuses(db) {
  if (!tableExists2(db, "task_runs") || !tableHasColumn(db, "task_runs", "delivery_status")) {
    return;
  }
  db.exec(`
    UPDATE task_runs
    SET delivery_status = 'not_applicable'
    WHERE delivery_status = 'not-requested';
  `);
}
function backfillAcpReplayEstimatedBytes(db) {
  if (!tableExists2(db, "acp_replay_events") || !tableHasColumn(db, "acp_replay_events", "estimated_bytes")) {
    return;
  }
  const pendingEvent = db.prepare("SELECT 1 FROM acp_replay_events WHERE estimated_bytes = 0 LIMIT 1").get();
  const pendingSession = db.prepare("SELECT 1 FROM acp_replay_sessions WHERE estimated_bytes = 0 LIMIT 1").get();
  if (!pendingEvent && !pendingSession) {
    return;
  }
  db.exec(`
    UPDATE acp_replay_events
       SET estimated_bytes = length(session_id) + length(session_key) + length(update_json)
             + COALESCE(length(run_id), 0) + 32
     WHERE estimated_bytes = 0;
    UPDATE acp_replay_sessions
       SET estimated_bytes = length(session_id) + length(session_key) + length(cwd) + 32
             + COALESCE((SELECT SUM(e.estimated_bytes) FROM acp_replay_events e
                          WHERE e.session_id = acp_replay_sessions.session_id), 0)
     WHERE estimated_bytes = 0;
  `);
}
function backfillCronRunLogEntryJson(db) {
  if (!tableExists2(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) {
    return;
  }
  const rows = db.prepare(
    `SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`
  ).all();
  if (rows.length === 0) {
    return;
  }
  const update = db.prepare(
    `UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`
  );
  for (const row of rows) {
    update.run(
      JSON.stringify({ ts: Number(row.ts), jobId: row.job_id, action: "finished" }),
      row.store_key,
      row.job_id,
      row.seq
    );
  }
}
function parseJsonRecord(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function textField(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : null;
}
function numberField(record, key) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function recordField(record, key) {
  const value = record[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function jsonField(value) {
  return value === void 0 ? null : JSON.stringify(value);
}
function cronSessionTargetField(record) {
  const value = textField(record, "sessionTarget");
  if (!value) {
    return null;
  }
  return value === "main" || value === "isolated" || value === "current" || value.startsWith("session:") ? value : null;
}
function cronWakeModeField(record) {
  const value = textField(record, "wakeMode");
  return value === "now" || value === "next-heartbeat" ? value : null;
}
function booleanField(record, key) {
  const value = record[key];
  return typeof value === "boolean" ? value ? 1 : 0 : null;
}
function failureDestinationField(record, key) {
  if (!record || !Object.hasOwn(record, key)) {
    return null;
  }
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : "";
}
function migrateLegacyCronDeliveryThreadIds(db) {
  const rows = db.prepare(
    `SELECT store_key, job_id, job_json, delivery_thread_id
         FROM cron_jobs
        WHERE delivery_thread_id_type IS NULL`
  ).all();
  const update = db.prepare(
    `UPDATE cron_jobs
        SET delivery_thread_id = ?, delivery_thread_id_type = ?
      WHERE store_key = ? AND job_id = ? AND delivery_thread_id_type IS NULL`
  );
  for (const row of rows) {
    const job = parseJsonRecord(row.job_json);
    const delivery = job ? recordField(job, "delivery") : null;
    const typed = delivery?.threadId;
    if (row.delivery_thread_id === null) {
      if (typeof typed === "number" && Number.isFinite(typed)) {
        update.run(String(typed), "number", row.store_key, row.job_id);
      }
      continue;
    }
    const type = typeof typed === "number" && Number.isFinite(typed) && String(typed) === row.delivery_thread_id ? "number" : "string";
    update.run(row.delivery_thread_id, type, row.store_key, row.job_id);
  }
}
function backfillCronJobsFromJobJson(db) {
  if (!tableExists2(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "schedule_kind") || !tableHasColumn(db, "cron_jobs", "payload_kind")) {
    return;
  }
  const rows = db.prepare(
    `SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE schedule_kind = 'manual'
           OR payload_kind = 'message'
           OR name = ''`
  ).all();
  if (rows.length === 0) {
    return;
  }
  const update = db.prepare(
    `UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            delete_after_run = ?,
            created_at_ms = ?,
            agent_id = ?,
            session_key = ?,
            schedule_kind = ?,
            schedule_expr = ?,
            schedule_tz = ?,
            every_ms = ?,
            anchor_ms = ?,
            at = ?,
            stagger_ms = ?,
            session_target = ?,
            wake_mode = ?,
            payload_kind = ?,
            payload_message = ?,
            payload_model = ?,
            payload_fallbacks_json = ?,
            payload_thinking = ?,
            payload_timeout_seconds = ?,
            payload_allow_unsafe_external_content = ?,
            payload_external_content_source_json = ?,
            payload_light_context = ?,
            payload_tools_allow_json = ?,
            delivery_mode = ?,
            delivery_channel = ?,
            delivery_to = ?,
            delivery_thread_id = ?,
            delivery_account_id = ?,
            delivery_best_effort = ?,
            delivery_completion_mode = ?,
            delivery_completion_to = ?,
            failure_delivery_mode = ?,
            failure_delivery_channel = ?,
            failure_delivery_to = ?,
            failure_delivery_account_id = ?,
            failure_alert_disabled = ?,
            failure_alert_after = ?,
            failure_alert_channel = ?,
            failure_alert_to = ?,
            failure_alert_cooldown_ms = ?,
            failure_alert_include_skipped = ?,
            failure_alert_mode = ?,
            failure_alert_account_id = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`
  );
  for (const row of rows) {
    const job = parseJsonRecord(row.job_json);
    if (!job) {
      continue;
    }
    const schedule = recordField(job, "schedule");
    const payload = recordField(job, "payload");
    const scheduleKind = textField(schedule ?? {}, "kind");
    const payloadKind = textField(payload ?? {}, "kind");
    const isAt = scheduleKind === "at" && textField(schedule ?? {}, "at");
    const isEvery = scheduleKind === "every" && numberField(schedule ?? {}, "everyMs") != null;
    const isCron = scheduleKind === "cron" && textField(schedule ?? {}, "expr");
    const isSystemEvent = payloadKind === "systemEvent" && textField(payload ?? {}, "text");
    const isAgentTurn = payloadKind === "agentTurn" && textField(payload ?? {}, "message");
    if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) {
      continue;
    }
    const fallbackTime = Number(row.updated_at) || 0;
    const delivery = recordField(job, "delivery");
    const completionDestination = delivery ? recordField(delivery, "completionDestination") : null;
    const failureDestination = delivery ? recordField(delivery, "failureDestination") : null;
    const failureAlertValue = job.failureAlert;
    const failureAlert = failureAlertValue && typeof failureAlertValue === "object" && !Array.isArray(failureAlertValue) ? failureAlertValue : null;
    update.run(
      textField(job, "name") ?? row.job_id,
      job.enabled === false ? 0 : 1,
      booleanField(job, "deleteAfterRun"),
      numberField(job, "createdAtMs") ?? fallbackTime,
      textField(job, "agentId"),
      textField(job, "sessionKey"),
      scheduleKind,
      isCron ? textField(schedule, "expr") : null,
      isCron ? textField(schedule, "tz") : null,
      isEvery ? numberField(schedule, "everyMs") : null,
      isEvery ? numberField(schedule, "anchorMs") : null,
      isAt ? textField(schedule, "at") : null,
      isCron ? numberField(schedule, "staggerMs") : null,
      cronSessionTargetField(job) ?? (payloadKind === "agentTurn" ? "isolated" : "main"),
      cronWakeModeField(job) ?? "now",
      payloadKind,
      isSystemEvent ? textField(payload, "text") : textField(payload, "message"),
      isAgentTurn ? textField(payload, "model") : null,
      isAgentTurn ? jsonField(payload.fallbacks) : null,
      isAgentTurn ? textField(payload, "thinking") : null,
      isAgentTurn ? numberField(payload, "timeoutSeconds") : null,
      isAgentTurn && typeof payload.allowUnsafeExternalContent === "boolean" ? payload.allowUnsafeExternalContent ? 1 : 0 : null,
      isAgentTurn ? jsonField(payload.externalContentSource) : null,
      isAgentTurn && typeof payload.lightContext === "boolean" ? payload.lightContext ? 1 : 0 : null,
      isAgentTurn ? jsonField(payload.toolsAllow) : null,
      delivery ? textField(delivery, "mode") : null,
      delivery ? textField(delivery, "channel") : null,
      delivery ? textField(delivery, "to") : null,
      delivery ? textField(delivery, "threadId") : null,
      delivery ? textField(delivery, "accountId") : null,
      delivery && typeof delivery.bestEffort === "boolean" ? delivery.bestEffort ? 1 : 0 : null,
      completionDestination ? textField(completionDestination, "mode") : null,
      completionDestination ? textField(completionDestination, "to") : null,
      failureDestinationField(failureDestination, "mode"),
      failureDestinationField(failureDestination, "channel"),
      failureDestinationField(failureDestination, "to"),
      failureDestinationField(failureDestination, "accountId"),
      failureAlertValue === false ? 1 : failureAlert ? 0 : null,
      failureAlert ? numberField(failureAlert, "after") : null,
      failureAlert ? textField(failureAlert, "channel") : null,
      failureAlert ? textField(failureAlert, "to") : null,
      failureAlert ? numberField(failureAlert, "cooldownMs") : null,
      failureAlert && typeof failureAlert.includeSkipped === "boolean" ? failureAlert.includeSkipped ? 1 : 0 : null,
      failureAlert ? textField(failureAlert, "mode") : null,
      failureAlert ? textField(failureAlert, "accountId") : null,
      numberField(job, "updatedAtMs") ?? fallbackTime,
      row.store_key,
      row.job_id
    );
  }
}
function metadataStringField(record, key) {
  return textField(record, key);
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
  if (!tableExists2(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) {
    return;
  }
  const rows = db.prepare(
    `SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status <> 'completed'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`
  ).all();
  if (rows.length === 0) {
    return;
  }
  const update = db.prepare(
    `UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`
  );
  for (const row of rows) {
    const entry = parseJsonRecord(row.entry_json);
    if (!entry) {
      continue;
    }
    const session = recordField(entry, "session");
    const route = recordField(entry, "route");
    const deliveryContext = recordField(entry, "deliveryContext");
    update.run(
      metadataStringField(entry, "kind"),
      metadataStringField(entry, "sessionKey") ?? (session ? metadataStringField(session, "key") : null),
      metadataStringField(entry, "channel") ?? (route ? metadataStringField(route, "channel") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "channel") : null),
      metadataStringField(entry, "to") ?? (route ? metadataStringField(route, "to") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "to") : null),
      metadataStringField(entry, "accountId") ?? (route ? metadataStringField(route, "accountId") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "accountId") : null),
      numberField(entry, "retryCount") ?? 0,
      numberField(entry, "lastAttemptAt"),
      metadataStringField(entry, "lastError"),
      metadataStringField(entry, "recoveryState"),
      numberField(entry, "platformSendStartedAt"),
      row.queue_name,
      row.id
    );
  }
}
function resolveLegacyManagedImageRoot(recordJson) {
  if (typeof recordJson !== "string") {
    return null;
  }
  let record;
  try {
    record = JSON.parse(recordJson);
  } catch {
    return null;
  }
  if (!isRecord(record) || !isRecord(record.original)) {
    return null;
  }
  const mediaRoot = record.original.mediaRoot;
  if (typeof mediaRoot === "string" && mediaRoot.trim()) {
    return path14.resolve(mediaRoot);
  }
  const originalPath = record.original.path;
  if (typeof originalPath !== "string" || !originalPath.trim()) {
    return null;
  }
  const resolvedOriginalPath = path14.resolve(originalPath);
  return path14.dirname(path14.dirname(path14.dirname(resolvedOriginalPath)));
}
function backfillLegacyManagedImageRoots(db) {
  const rows = db.prepare("SELECT attachment_id, record_json FROM managed_outgoing_image_records").all();
  const updateRoot = db.prepare(
    "UPDATE managed_outgoing_image_records SET original_media_root = ? WHERE attachment_id = ?"
  );
  const deleteRecord = db.prepare(
    "DELETE FROM managed_outgoing_image_records WHERE attachment_id = ?"
  );
  for (const row of rows) {
    const mediaRoot = resolveLegacyManagedImageRoot(row.record_json);
    if (mediaRoot) {
      updateRoot.run(mediaRoot, row.attachment_id);
    } else {
      deleteRecord.run(row.attachment_id);
    }
  }
}
function ensureAdditiveStateColumns(db) {
  const addedDiagnosticEventSequence = ensureColumn(
    db,
    "diagnostic_events",
    "sequence INTEGER NOT NULL DEFAULT 0"
  );
  if (addedDiagnosticEventSequence) {
    db.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `);
  }
  db.exec("DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;");
  ensureColumn(db, "worktrees", "provisioned_paths_json TEXT");
  ensureColumn(db, "node_host_config", "gateway_context_path TEXT");
  ensureColumn(db, "node_host_config", "installed_apps_sharing INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "apns_registrations", "relay_origin TEXT");
  ensureColumn(db, "device_pairing_pending", "refreshed_at_ms INTEGER");
  ensureColumn(db, "device_pairing_pending", "browser_origin TEXT");
  ensureColumn(db, "device_pairing_paired", "approved_via TEXT");
  ensureColumn(db, "device_pairing_paired", "browser_origin TEXT");
  ensureColumn(db, "device_pairing_paired", "operator_label TEXT");
  ensureColumn(db, "device_pairing_paired", "node_surface_json TEXT");
  ensureColumn(db, "device_pairing_paired", "pending_node_surface_json TEXT");
  ensureColumn(db, "cron_run_logs", "status TEXT");
  ensureColumn(db, "cron_run_logs", "error TEXT");
  ensureColumn(db, "cron_run_logs", "summary TEXT");
  ensureColumn(db, "cron_run_logs", "diagnostics_summary TEXT");
  ensureColumn(db, "cron_run_logs", "delivery_status TEXT");
  ensureColumn(db, "cron_run_logs", "delivery_error TEXT");
  ensureColumn(db, "cron_run_logs", "delivered INTEGER");
  ensureColumn(db, "cron_run_logs", "session_id TEXT");
  ensureColumn(db, "cron_run_logs", "session_key TEXT");
  ensureColumn(db, "cron_run_logs", "run_id TEXT");
  ensureColumn(db, "cron_run_logs", "run_at_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "duration_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "next_run_at_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "model TEXT");
  ensureColumn(db, "cron_run_logs", "provider TEXT");
  ensureColumn(db, "cron_run_logs", "total_tokens INTEGER");
  ensureColumn(db, "cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0");
  backfillCronRunLogEntryJson(db);
  ensureColumn(db, "acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
  backfillAcpReplayEstimatedBytes(db);
  ensureColumn(db, "cron_jobs", "description TEXT");
  ensureColumn(db, "cron_jobs", "declaration_key TEXT");
  ensureColumn(db, "cron_jobs", "display_name TEXT");
  ensureColumn(db, "cron_jobs", "owner_agent_id TEXT");
  ensureColumn(db, "cron_jobs", "owner_session_key TEXT");
  ensureColumn(db, "cron_jobs", "name TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1");
  ensureColumn(db, "cron_jobs", "delete_after_run INTEGER");
  ensureColumn(db, "cron_jobs", "created_at_ms INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "cron_jobs", "agent_id TEXT");
  ensureColumn(db, "cron_jobs", "session_key TEXT");
  ensureColumn(db, "cron_jobs", "schedule_kind TEXT NOT NULL DEFAULT 'manual'");
  ensureColumn(db, "cron_jobs", "schedule_expr TEXT");
  ensureColumn(db, "cron_jobs", "schedule_tz TEXT");
  ensureColumn(db, "cron_jobs", "every_ms INTEGER");
  ensureColumn(db, "cron_jobs", "anchor_ms INTEGER");
  ensureColumn(db, "cron_jobs", "at TEXT");
  ensureColumn(db, "cron_jobs", "stagger_ms INTEGER");
  ensureColumn(db, "cron_jobs", "session_target TEXT NOT NULL DEFAULT 'main'");
  ensureColumn(db, "cron_jobs", "wake_mode TEXT NOT NULL DEFAULT 'auto'");
  ensureColumn(db, "cron_jobs", "trigger_script TEXT");
  ensureColumn(db, "cron_jobs", "trigger_once INTEGER");
  ensureColumn(db, "cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'");
  ensureColumn(db, "cron_jobs", "payload_message TEXT");
  ensureColumn(db, "cron_jobs", "payload_model TEXT");
  ensureColumn(db, "cron_jobs", "payload_fallbacks_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_thinking TEXT");
  ensureColumn(db, "cron_jobs", "payload_timeout_seconds INTEGER");
  ensureColumn(db, "cron_jobs", "payload_allow_unsafe_external_content INTEGER");
  ensureColumn(db, "cron_jobs", "payload_external_content_source_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_light_context INTEGER");
  ensureColumn(db, "cron_jobs", "payload_tools_allow_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_tools_allow_is_default INTEGER");
  ensureColumn(db, "cron_jobs", "delivery_mode TEXT");
  ensureColumn(db, "cron_jobs", "delivery_channel TEXT");
  ensureColumn(db, "cron_jobs", "delivery_to TEXT");
  ensureColumn(db, "cron_jobs", "delivery_thread_id TEXT");
  ensureColumn(db, "cron_jobs", "delivery_account_id TEXT");
  ensureColumn(db, "cron_jobs", "delivery_best_effort INTEGER");
  ensureColumn(db, "cron_jobs", "delivery_completion_mode TEXT");
  ensureColumn(db, "cron_jobs", "delivery_completion_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_mode TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_channel TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_account_id TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_disabled INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_after INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_channel TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_cooldown_ms INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_include_skipped INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_mode TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_account_id TEXT");
  ensureColumn(db, "cron_jobs", "next_run_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "running_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "last_run_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "last_run_status TEXT");
  ensureColumn(db, "cron_jobs", "last_error TEXT");
  ensureColumn(db, "cron_jobs", "last_duration_ms INTEGER");
  ensureColumn(db, "cron_jobs", "consecutive_errors INTEGER");
  ensureColumn(db, "cron_jobs", "consecutive_skipped INTEGER");
  ensureColumn(db, "cron_jobs", "schedule_error_count INTEGER");
  ensureColumn(db, "cron_jobs", "last_delivery_status TEXT");
  ensureColumn(db, "cron_jobs", "last_delivery_error TEXT");
  ensureColumn(db, "cron_jobs", "last_delivered INTEGER");
  ensureColumn(db, "cron_jobs", "last_failure_alert_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "cron_jobs", "runtime_updated_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "schedule_identity TEXT");
  ensureColumn(db, "cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0");
  backfillCronJobsFromJobJson(db);
  const addedDeliveryThreadIdType = ensureColumn(db, "cron_jobs", "delivery_thread_id_type TEXT");
  if (addedDeliveryThreadIdType) {
    migrateLegacyCronDeliveryThreadIds(db);
  }
  ensureColumn(db, "sandbox_registry_entries", "session_key TEXT");
  ensureColumn(db, "sandbox_registry_entries", "backend_id TEXT");
  ensureColumn(db, "sandbox_registry_entries", "runtime_label TEXT");
  ensureColumn(db, "sandbox_registry_entries", "image TEXT");
  ensureColumn(db, "sandbox_registry_entries", "created_at_ms INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "last_used_at_ms INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "config_label_kind TEXT");
  ensureColumn(db, "sandbox_registry_entries", "config_hash TEXT");
  ensureColumn(db, "sandbox_registry_entries", "cdp_port INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "no_vnc_port INTEGER");
  ensureColumn(db, "delivery_queue_entries", "entry_kind TEXT");
  ensureColumn(db, "delivery_queue_entries", "session_key TEXT");
  ensureColumn(db, "delivery_queue_entries", "channel TEXT");
  ensureColumn(db, "delivery_queue_entries", "target TEXT");
  ensureColumn(db, "delivery_queue_entries", "account_id TEXT");
  ensureColumn(db, "delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "delivery_queue_entries", "last_attempt_at INTEGER");
  ensureColumn(db, "delivery_queue_entries", "last_error TEXT");
  ensureColumn(db, "delivery_queue_entries", "recovery_state TEXT");
  ensureColumn(db, "delivery_queue_entries", "platform_send_started_at INTEGER");
  backfillDeliveryQueueEntriesFromEntryJson(db);
  ensureColumn(db, "commitments", "account_id TEXT");
  ensureColumn(db, "commitments", "recipient_id TEXT");
  ensureColumn(db, "commitments", "thread_id TEXT");
  ensureColumn(db, "commitments", "sender_id TEXT");
  ensureColumn(db, "commitments", "kind TEXT NOT NULL DEFAULT 'followup'");
  ensureColumn(db, "commitments", "sensitivity TEXT NOT NULL DEFAULT 'normal'");
  ensureColumn(db, "commitments", "source TEXT NOT NULL DEFAULT 'unknown'");
  ensureColumn(db, "commitments", "reason TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "suggested_text TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "dedupe_key TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "confidence REAL NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "due_timezone TEXT NOT NULL DEFAULT 'UTC'");
  ensureColumn(db, "commitments", "source_message_id TEXT");
  ensureColumn(db, "commitments", "source_run_id TEXT");
  ensureColumn(db, "commitments", "created_at_ms INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "attempts INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "last_attempt_at_ms INTEGER");
  ensureColumn(db, "commitments", "sent_at_ms INTEGER");
  ensureColumn(db, "commitments", "dismissed_at_ms INTEGER");
  ensureColumn(db, "commitments", "snoozed_until_ms INTEGER");
  ensureColumn(db, "commitments", "expired_at_ms INTEGER");
  const addedOriginalMediaRoot = ensureColumn(
    db,
    "managed_outgoing_image_records",
    "original_media_root TEXT NOT NULL DEFAULT ''"
  );
  if (addedOriginalMediaRoot) {
    backfillLegacyManagedImageRoots(db);
  }
  ensureColumn(db, "managed_outgoing_image_records", "agent_id TEXT");
  ensureColumn(
    db,
    "managed_outgoing_image_records",
    "cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))"
  );
  ensureColumn(db, "current_conversation_bindings", "target_agent_id TEXT NOT NULL DEFAULT 'main'");
  ensureColumn(db, "current_conversation_bindings", "target_session_id TEXT");
  ensureColumn(
    db,
    "current_conversation_bindings",
    "conversation_kind TEXT NOT NULL DEFAULT 'channel'"
  );
  ensureColumn(db, "device_bootstrap_tokens", "pending_profile_json TEXT");
  ensureColumn(db, "gateway_restart_handoff", "restart_trace_started_at INTEGER");
  ensureColumn(db, "gateway_restart_handoff", "restart_trace_last_at INTEGER");
  ensureColumn(db, "gateway_restart_intent", "reason TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
  ensureColumn(db, "gateway_boot_lifecycle", "startup_reason TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_mode TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_key_id TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_threshold INTEGER");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_verified_at TEXT");
  const addedTaskRequesterAgentId = ensureColumn(db, "task_runs", "requester_agent_id TEXT");
  if (addedTaskRequesterAgentId) {
    repairLegacyTaskAgentAttribution(db);
  }
  repairLegacyTaskDeliveryStatuses(db);
  ensureColumn(db, "task_runs", "tool_use_count INTEGER");
  ensureColumn(db, "task_runs", "last_tool_name TEXT");
  ensureColumn(db, "task_runs", "detail_json TEXT");
  ensureColumn(db, "subagent_runs", "task_name TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_status TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_attempt_count INTEGER");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_replay_count INTEGER");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_next_attempt_at INTEGER");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_batch_run_ids_json TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_last_error TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_retire_after INTEGER");
  ensureColumn(db, "subagent_runs", "swarm_group_id TEXT");
  ensureColumn(db, "subagent_runs", "swarm_collector INTEGER");
  ensureColumn(db, "subagent_runs", "swarm_output_schema_json TEXT");
  ensureColumn(db, "subagent_runs", "swarm_completion_status TEXT");
  ensureColumn(db, "subagent_runs", "swarm_structured_json TEXT");
  ensureColumn(db, "subagent_runs", "swarm_schema_error TEXT");
  ensureColumn(db, "subagent_runs", "swarm_usage_json TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_bundle_hash TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_openclaw_version TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_protocol_features_json TEXT");
  ensureColumn(
    db,
    "worker_environments",
    "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)"
  );
  ensureColumn(db, "worker_environments", "ssh_host_key TEXT");
  ensureColumn(db, "worker_workspace_pending_results", "staged_result_ref TEXT");
  ensureColumn(
    db,
    "worker_environments",
    "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))"
  );
  ensureOperatorApprovalResolutionRefs(db);
}
var SESSION_WATCH_PROVENANCE_EXPLICIT = "explicit";
var SESSION_WATCH_PROVENANCE_AMBIENT_GROUP = "ambient-group";
var SESSION_WATCH_PROVENANCE_SCHEMA_VERSION = 4;
var LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX = "ambient-group-watch:";
var SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
function getSessionWatchCursorKysely(db) {
  return getNodeSqliteKysely(db);
}
function hasLegacyAmbientWatchSentinels(db) {
  if (!tableExists2(db, "session_watch_cursors")) {
    return false;
  }
  return executeSqliteQueryTakeFirstSync(
    db,
    getSessionWatchCursorKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`).limit(1)
  ) !== void 0;
}
function needsSessionWatchCursorProvenanceMigration(db, userVersion) {
  if (!tableExists2(db, "session_watch_cursors")) {
    return false;
  }
  return userVersion < SESSION_WATCH_PROVENANCE_SCHEMA_VERSION || !tableHasColumn(db, "session_watch_cursors", "provenance") || hasLegacyAmbientWatchSentinels(db);
}
function decodeLegacyAmbientWatchMarkerKey(markerKey) {
  const encoded = markerKey.slice(LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX.length);
  if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) {
    return void 0;
  }
  return Buffer.from(encoded, "hex").toString("utf8");
}
function migrateSessionWatchCursorProvenance(db) {
  if (!tableExists2(db, "session_watch_cursors")) {
    return { addedColumn: false, migratedAmbientWatches: 0, removedLegacySentinels: 0 };
  }
  const addedColumn = ensureColumn(
    db,
    "session_watch_cursors",
    SESSION_WATCH_PROVENANCE_COLUMN_SQL
  );
  const kysely = getSessionWatchCursorKysely(db);
  const legacyMarkers = executeSqliteQuerySync(
    db,
    kysely.selectFrom("session_watch_cursors").select(["watcher_session_key", "target_session_key", "updated_at"]).where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`)
  ).rows;
  let migratedAmbientWatches = 0;
  for (const marker of legacyMarkers) {
    const watcherSessionKey = decodeLegacyAmbientWatchMarkerKey(marker.watcher_session_key);
    if (watcherSessionKey) {
      const watch = executeSqliteQueryTakeFirstSync(
        db,
        kysely.selectFrom("session_watch_cursors").select("updated_at").where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key)
      );
      if (watch) {
        const promoted = executeSqliteQuerySync(
          db,
          kysely.updateTable("session_watch_cursors").set({
            provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP,
            updated_at: Math.max(watch.updated_at, marker.updated_at)
          }).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key)
        );
        migratedAmbientWatches += Number(promoted.numAffectedRows ?? 0n);
      }
    }
    executeSqliteQuerySync(
      db,
      kysely.deleteFrom("session_watch_cursors").where("watcher_session_key", "=", marker.watcher_session_key).where("target_session_key", "=", marker.target_session_key)
    );
  }
  return {
    addedColumn,
    migratedAmbientWatches,
    removedLegacySentinels: legacyMarkers.length
  };
}
function dropLegacyStateTables(db) {
  const transientHistoryTable = ["database", "verifications"].join("_");
  db.exec(`DROP TABLE IF EXISTS ${transientHistoryTable};`);
  db.exec("DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;");
}
function hasCanonicalAgentDatabasesPrimaryKey(db) {
  if (!tableExists2(db, "agent_databases")) {
    return true;
  }
  const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
  return primaryKey.length === 2 && primaryKey[0] === "agent_id" && primaryKey[1] === "path";
}
function canRepairAgentDatabasesPrimaryKey(db) {
  if (!tableExists2(db, "agent_databases")) {
    return false;
  }
  const requiredColumns = ["agent_id", "path", "schema_version", "last_seen_at", "size_bytes"];
  return requiredColumns.every((column) => tableHasColumn(db, "agent_databases", column));
}
function repairAgentDatabasesCompositePrimaryKey(db) {
  if (hasCanonicalAgentDatabasesPrimaryKey(db) || !canRepairAgentDatabasesPrimaryKey(db)) {
    return false;
  }
  db.exec(`
    DROP TABLE IF EXISTS agent_databases_migration_new;
    CREATE TABLE agent_databases_migration_new (
      agent_id TEXT NOT NULL,
      path TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      size_bytes INTEGER,
      PRIMARY KEY (agent_id, path)
    );
    INSERT OR REPLACE INTO agent_databases_migration_new (
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    )
    SELECT
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    FROM agent_databases
    WHERE agent_id IS NOT NULL AND path IS NOT NULL;
    DROP TABLE agent_databases;
    ALTER TABLE agent_databases_migration_new RENAME TO agent_databases;
  `);
  return true;
}
function repairLegacyGatewayRestartHandoffsForStrictMigration(db) {
  if (!tableExists2(db, "gateway_restart_handoff")) {
    return;
  }
  db.prepare("DELETE FROM gateway_restart_handoff WHERE expires_at <= ?").run(Date.now());
  db.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `);
}
function markCurrentStateSchemaVersion(db) {
  if (!tableExists2(db, "audit_events")) {
    return;
  }
  db.exec(`PRAGMA user_version = ${OPENCLAW_STATE_SCHEMA_VERSION};`);
  if (tableExists2(db, "schema_meta") && ["meta_key", "schema_version", "updated_at"].every(
    (column) => tableHasColumn(db, "schema_meta", column)
  )) {
    db.prepare(
      "UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary'"
    ).run(OPENCLAW_STATE_SCHEMA_VERSION, Date.now());
  }
}
function assertCanonicalStateSchemaShape(db, pathname) {
  assertCanonicalOperatorApprovalKinds(db, pathname);
  if (!hasCanonicalAgentDatabasesPrimaryKey(db)) {
    throw new Error(
      `OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`
    );
  }
  if (!hasCanonicalAuditEventsSchema(db)) {
    if (canRepairLegacyAuditEventsSchema(db)) {
      throw new Error(
        `OpenClaw state database ${pathname} has a legacy audit event schema; run openclaw doctor --fix to migrate it.`
      );
    }
    throw new Error(
      `OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`
    );
  }
}
function detectOpenClawStateDatabaseSchemaMigrations(options = {}) {
  const pathname = resolveDatabasePath(options);
  if (!existsSync3(pathname)) {
    return [];
  }
  const sqlite = requireNodeSqlite();
  const db = new sqlite.DatabaseSync(pathname, { readOnly: true });
  try {
    const migrations = [];
    const userVersion = readSqliteUserVersion(db);
    if (!hasCanonicalAgentDatabasesPrimaryKey(db)) {
      migrations.push({ kind: "agent-databases-composite-primary-key", path: pathname });
    }
    if (!hasCanonicalAuditEventsSchema(db)) {
      migrations.push({ kind: "audit-events-v2", path: pathname });
    }
    if (tableExists2(db, "audit_events") && userVersion < OPENCLAW_STATE_STRICT_SCHEMA_VERSION) {
      migrations.push({ kind: "strict-tables-v3", path: pathname });
    }
    if (needsSessionWatchCursorProvenanceMigration(db, userVersion)) {
      migrations.push({ kind: "session-watch-cursor-provenance-v4", path: pathname });
    }
    migrations.push(
      ...detectOperatorApprovalSchemaMigration(db, pathname)
    );
    return migrations;
  } finally {
    db.close();
  }
}
var OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES = [
  {
    name: "idx_operator_approvals_resolution_ref",
    definition: "ON operator_approvals(resolution_ref)"
  },
  {
    name: "idx_worker_environments_provider_lease",
    definition: `
      ON worker_environments(provider_id, lease_id)
      WHERE lease_id IS NOT NULL
    `
  }
];
var cachedDatabases = /* @__PURE__ */ new Map();
var terminalOpenLatch = createSqliteTerminalOpenLatch({
  closeByPath: (pathname) => {
    const cached = cachedDatabases.get(pathname);
    if (!cached) {
      return;
    }
    cached.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(cached.db);
    if (cached.db.isOpen) {
      cached.db.close();
    }
    cachedDatabases.delete(pathname);
  }
});
function recordOpenClawStateDatabaseOpenFailure(pathname, error) {
  terminalOpenLatch.record(pathname, error);
}
function clearOpenClawStateDatabaseOpenFailure(pathname) {
  terminalOpenLatch.clear(pathname);
}
var stateDbLog2 = createSubsystemLogger("state/db");
function repairOpenClawStateDatabaseSchema(options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveDatabasePath(options);
  if (!existsSync4(pathname)) {
    return { changes: [], warnings: [] };
  }
  ensureOpenClawStatePermissions(pathname, env);
  const sqlite = requireNodeSqlite();
  const db = new sqlite.DatabaseSync(pathname);
  try {
    assertSqliteIntegrity(db, pathname);
    assertSupportedSchemaVersion(db, pathname);
    db.exec("PRAGMA foreign_keys = OFF;");
    const changes = runSqliteImmediateTransactionSync(
      db,
      () => {
        const applied = [];
        const previousVersion = readSqliteUserVersion(db);
        dropLegacyStateTables(db);
        if (repairAgentDatabasesCompositePrimaryKey(db)) {
          applied.push(`Migrated shared state agent database registry primary key \u2192 agent_id,path`);
        }
        if (repairAuditEventsSchema(db)) {
          applied.push(
            `Migrated shared state audit event ledger \u2192 versioned message lifecycle schema`
          );
        }
        applied.push(...repairOperatorApprovalSchema(db));
        const needsSessionWatchMigration = needsSessionWatchCursorProvenanceMigration(db, previousVersion);
        const sessionWatchResult = migrateSessionWatchCursorProvenance(db);
        if (needsSessionWatchMigration) {
          applied.push(
            `Migrated shared state session watch cursors \u2192 provenance column (${sessionWatchResult.migratedAmbientWatches} ambient, ${sessionWatchResult.removedLegacySentinels} sentinels removed)`
          );
        }
        assertCanonicalStateSchemaShape(db, pathname);
        if (tableExists2(db, "audit_events")) {
          ensureAdditiveStateColumns(db);
          db.exec(OPENCLAW_STATE_SCHEMA_SQL);
          if (previousVersion < OPENCLAW_STATE_STRICT_SCHEMA_VERSION) {
            repairLegacyGatewayRestartHandoffsForStrictMigration(db);
          }
          const strictMigration = migrateSqliteSchemaToStrictInTransaction(
            db,
            OPENCLAW_STATE_SCHEMA_SQL,
            { databaseLabel: pathname }
          );
          if (strictMigration.migratedTables.length > 0) {
            applied.push(
              `Migrated shared state tables to SQLite STRICT typing (${strictMigration.migratedTables.length})`
            );
          }
        }
        markCurrentStateSchemaVersion(db);
        return applied;
      },
      {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: pathname,
        operationLabel: "state.schema.repair"
      }
    );
    const quarantineCleared = clearOpenClawDatabaseQuarantine(pathname, { env });
    clearOpenClawStateDatabaseOpenFailure(pathname);
    return {
      changes,
      warnings: quarantineCleared ? [] : [
        `Persisted quarantine record for ${pathname} could not be cleared; rerun openclaw doctor --fix so the repaired database is not refused again.`
      ]
    };
  } catch (err) {
    const reason = String(err).replace(
      /has a legacy ([a-z ]+) schema; run openclaw doctor --fix to migrate it\./u,
      "has a legacy $1 schema; automatic repair refused the unrecognized schema shape."
    );
    return {
      changes: [],
      warnings: [`Failed migrating shared state database schema at ${pathname}: ${reason}`]
    };
  } finally {
    if (db.isOpen) {
      db.exec("PRAGMA foreign_keys = ON;");
    }
    db.close();
    ensureOpenClawStatePermissions(pathname, env);
  }
}
function ensureSchema(db, pathname) {
  const now = Date.now();
  const kysely = getNodeSqliteKysely(db);
  db.exec("PRAGMA foreign_keys = OFF;");
  try {
    runSqliteImmediateTransactionSync(
      db,
      () => {
        assertSupportedSchemaVersion(db, pathname);
        const previousVersion = readSqliteUserVersion(db);
        dropLegacyStateTables(db);
        ensureAdditiveStateColumns(db);
        migrateSessionWatchCursorProvenance(db);
        assertCanonicalStateSchemaShape(db, pathname);
        db.exec(OPENCLAW_STATE_SCHEMA_SQL);
        migrateLegacyCronRunLogsToTaskRuns(db);
        if (previousVersion < OPENCLAW_STATE_STRICT_SCHEMA_VERSION) {
          repairLegacyGatewayRestartHandoffsForStrictMigration(db);
          migrateSqliteSchemaToStrictInTransaction(db, OPENCLAW_STATE_SCHEMA_SQL, {
            databaseLabel: pathname
          });
        }
        repairCanonicalSqliteUniqueIndexes(db, pathname, OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES);
        db.exec(`PRAGMA user_version = ${OPENCLAW_STATE_SCHEMA_VERSION};`);
        executeSqliteQuerySync(
          db,
          kysely.insertInto("schema_meta").values({
            meta_key: "primary",
            role: "global",
            schema_version: OPENCLAW_STATE_SCHEMA_VERSION,
            agent_id: null,
            app_version: VERSION,
            created_at: now,
            updated_at: now
          }).onConflict(
            (conflict) => conflict.column("meta_key").doUpdateSet({
              role: "global",
              schema_version: OPENCLAW_STATE_SCHEMA_VERSION,
              agent_id: null,
              app_version: VERSION,
              updated_at: now
            })
          )
        );
      },
      {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: pathname,
        operationLabel: "state.schema.ensure"
      }
    );
  } finally {
    db.exec("PRAGMA foreign_keys = ON;");
  }
}
function assertStateDatabaseIntegrityBeforeMutation(database, pathname) {
  database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
  const userVersion = readSqliteUserVersion(database);
  const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
  if (userVersion === 0 && hasApplicationSchema || userVersion > 0 && userVersion < OPENCLAW_STATE_SCHEMA_VERSION) {
    stateDbLog2.info("state database schema migration pending; verifying integrity first", {
      fromVersion: userVersion,
      path: pathname,
      toVersion: OPENCLAW_STATE_SCHEMA_VERSION
    });
    assertSqliteIntegrity(database, pathname);
    return;
  }
  if (tableExists2(database, "schema_meta")) {
    assertSqliteTableIntegrity(database, pathname, "schema_meta");
  }
}
function openOpenClawStateDatabase(options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveDatabasePath(options);
  const terminalFailure = terminalOpenLatch.get(pathname);
  if (terminalFailure) {
    throw terminalFailure;
  }
  const cached = cachedDatabases.get(pathname);
  if (cached?.db.isOpen) {
    return cached;
  }
  if (cached) {
    cached.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(cached.db);
    cachedDatabases.delete(pathname);
  }
  let quarantineFailure;
  try {
    const quarantine = readOpenClawDatabaseQuarantine(pathname, { env });
    if (quarantine) {
      quarantineFailure = createOpenClawDatabaseVerificationError(
        "state",
        pathname,
        quarantine.reason
      );
    }
  } catch {
  }
  if (quarantineFailure) {
    throw quarantineFailure;
  }
  ensureOpenClawStatePermissions(pathname, env);
  const sqlite = requireNodeSqlite();
  const db = new sqlite.DatabaseSync(pathname);
  const walMaintenance = (() => {
    let maintenance;
    try {
      db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
      assertSupportedSchemaVersion(db, pathname);
      assertStateDatabaseIntegrityBeforeMutation(db, pathname);
      configureSqlitePreSchemaPragmas(db, {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
      });
      maintenance = configureSqliteConnectionPragmas(db, {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: "openclaw-state",
        databasePath: pathname,
        foreignKeys: true,
        synchronous: "NORMAL"
      });
      ensureSchema(db, pathname);
      return maintenance;
    } catch (err) {
      maintenance?.close();
      db.close();
      if (err instanceof Error && (err.name === "SqliteSchemaVersionError" || isTerminalSqliteIntegrityError(err))) {
        recordOpenClawStateDatabaseOpenFailure(pathname, err);
      }
      throw err;
    }
  })();
  ensureOpenClawStatePermissions(pathname, env);
  const database = { db, path: pathname, walMaintenance };
  cachedDatabases.set(pathname, database);
  terminalOpenLatch.clear(pathname);
  return database;
}
function runOpenClawStateWriteTransaction(operation, options = {}, transactionOptions = {}) {
  const database = openOpenClawStateDatabase(options);
  const result = runSqliteImmediateTransactionSync(database.db, () => operation(database), {
    busyTimeoutMs: transactionOptions.busyTimeoutMs ?? OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
    databaseLabel: database.path,
    ...transactionOptions,
    operationLabel: transactionOptions.operationLabel ?? "state.write"
  });
  try {
    ensureOpenClawStatePermissions(database.path, options.env ?? process.env);
  } catch {
  }
  return result;
}
function closeOpenClawStateDatabase() {
  for (const database of cachedDatabases.values()) {
    database.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(database.db);
    if (database.db.isOpen) {
      database.db.close();
    }
  }
  cachedDatabases.clear();
}
function isOpenClawStateDatabaseOpen() {
  return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
var PluginStateStoreError = class extends Error {
  constructor(message, options) {
    super(message, { cause: options.cause });
    this.name = "PluginStateStoreError";
    this.code = options.code;
    this.operation = options.operation;
    if (options.path) {
      this.path = options.path;
    }
  }
};
var MAX_PLUGIN_STATE_VALUE_BYTES = 65536;
var MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN = 5e4;
var maxPluginStateEntriesPerPluginForTests;
var cachedDatabase = null;
function createPluginStateError(params) {
  return new PluginStateStoreError(params.message, {
    code: params.code,
    operation: params.operation,
    ...params.path ? { path: params.path } : {},
    cause: params.cause
  });
}
function resolvePluginStateExpiresAtMs(params) {
  if (params.ttlMs == null) {
    return null;
  }
  const expiresAt = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: params.now });
  if (expiresAt === void 0) {
    throw createPluginStateError({
      code: "PLUGIN_STATE_INVALID_INPUT",
      operation: params.operation,
      message: "Plugin state ttlMs cannot produce a valid expiry timestamp.",
      ...params.path ? { path: params.path } : {}
    });
  }
  return expiresAt;
}
function wrapPluginStateError(error, operation, fallbackCode, message, pathname = resolveOpenClawStateSqlitePath(process.env)) {
  if (error instanceof PluginStateStoreError) {
    return error;
  }
  return createPluginStateError({
    code: fallbackCode,
    operation,
    message,
    path: pathname,
    cause: error
  });
}
function parseStoredJson(raw, operation) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw createPluginStateError({
      code: "PLUGIN_STATE_CORRUPT",
      operation,
      message: "Plugin state entry contains corrupt JSON.",
      path: resolveOpenClawStateSqlitePath(process.env),
      cause: error
    });
  }
}
function rowToEntry(row, operation) {
  const expiresAt = normalizeSqliteNumber(row.expires_at);
  return {
    key: row.entry_key,
    value: parseStoredJson(row.value_json, operation),
    createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
    ...expiresAt != null ? { expiresAt } : {}
  };
}
function getPluginStateKysely(db) {
  return getNodeSqliteKysely(db);
}
function bindPluginStateEntry(params) {
  return {
    plugin_id: params.pluginId,
    namespace: params.namespace,
    entry_key: params.key,
    value_json: params.valueJson,
    created_at: params.createdAt,
    expires_at: params.expiresAt
  };
}
function upsertPluginStateEntry(db, row) {
  executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).insertInto("plugin_state_entries").values(row).onConflict(
      (conflict) => conflict.columns(["plugin_id", "namespace", "entry_key"]).doUpdateSet({
        value_json: (eb) => eb.ref("excluded.value_json"),
        created_at: (eb) => eb.ref("excluded.created_at"),
        expires_at: (eb) => eb.ref("excluded.expires_at")
      })
    )
  );
}
function insertPluginStateEntryIfAbsent(db, row) {
  const result = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).insertInto("plugin_state_entries").orIgnore().values(row)
  );
  return Number(result.numAffectedRows ?? 0) > 0;
}
function selectPluginStateEntry(db, params) {
  return executeSqliteQueryTakeFirstSync(
    db,
    getPluginStateKysely(db).selectFrom("plugin_state_entries").select(["plugin_id", "namespace", "entry_key", "value_json", "created_at", "expires_at"]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]))
  );
}
function selectPluginStateEntries(db, params) {
  return executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).selectFrom("plugin_state_entries").select(["plugin_id", "namespace", "entry_key", "value_json", "created_at", "expires_at"]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc")
  ).rows;
}
function deletePluginStateEntry(db, params) {
  const result = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key)
  );
  return Number(result.numAffectedRows ?? 0);
}
function deleteExpiredPluginStateNamespaceEntries(db, params) {
  executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", params.now)
  );
}
function countLivePluginStateNamespaceEntries(db, params) {
  const row = executeSqliteQueryTakeFirstSync(
    db,
    getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]))
  );
  return countRow(row);
}
function countLivePluginStateEntries(db, params) {
  const row = executeSqliteQueryTakeFirstSync(
    db,
    getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", params.pluginId).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]))
  );
  return countRow(row);
}
function deleteOldestPluginStateNamespaceEntries(db, params) {
  const keys = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).selectFrom("plugin_state_entries").select(["entry_key"]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "!=", params.protectedKey).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc").limit(params.limit)
  ).rows;
  for (const row of keys) {
    deletePluginStateEntry(db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      key: row.entry_key
    });
  }
}
function openPluginStateDatabase(operation = "open", options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveOpenClawStateSqlitePath(env);
  if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen) {
    return cachedDatabase;
  }
  if (cachedDatabase && !cachedDatabase.db.isOpen) {
    cachedDatabase = null;
  }
  try {
    const database = openOpenClawStateDatabase(options);
    cachedDatabase = {
      db: database.db,
      path: database.path
    };
    return cachedDatabase;
  } catch (error) {
    throw wrapPluginStateError(
      error,
      operation,
      "PLUGIN_STATE_OPEN_FAILED",
      "Failed to open the plugin state database.",
      pathname
    );
  }
}
function countRow(row) {
  const raw = row?.count ?? 0;
  return typeof raw === "bigint" ? Number(raw) : raw;
}
function envOptions(env) {
  return env ? { env } : {};
}
function runWriteTransaction(operation, write, options = {}) {
  const store = openPluginStateDatabase(operation, options);
  return runOpenClawStateWriteTransaction(() => {
    const result = write(store);
    return result;
  }, options);
}
function enforcePostRegisterLimits(params) {
  if (params.overflowPolicy === "reject-new") {
    return;
  }
  const namespaceCount = countLivePluginStateNamespaceEntries(params.store.db, {
    pluginId: params.pluginId,
    namespace: params.namespace,
    now: params.now
  });
  if (namespaceCount > params.maxEntries) {
    deleteOldestPluginStateNamespaceEntries(params.store.db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      protectedKey: params.protectedKey,
      now: params.now,
      limit: namespaceCount - params.maxEntries
    });
  }
  if (params.enforcePluginLimit === false) {
    return;
  }
  const pluginCount = countLivePluginStateEntries(params.store.db, {
    pluginId: params.pluginId,
    now: params.now
  });
  const maxPluginEntries = resolveMaxPluginStateEntriesPerPlugin();
  if (pluginCount <= maxPluginEntries) {
    return;
  }
  deleteOldestPluginStateNamespaceEntries(params.store.db, {
    pluginId: params.pluginId,
    namespace: params.namespace,
    protectedKey: params.protectedKey,
    now: params.now,
    limit: pluginCount - maxPluginEntries
  });
  const remainingPluginCount = countLivePluginStateEntries(params.store.db, {
    pluginId: params.pluginId,
    now: params.now
  });
  if (remainingPluginCount > maxPluginEntries) {
    throw createPluginStateError({
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
      message: `Plugin state for ${params.pluginId} exceeds the ${maxPluginEntries} live row limit.`,
      path: params.store.path
    });
  }
}
function assertCanInsertPluginStateEntry(params) {
  if (params.overflowPolicy !== "reject-new") {
    return;
  }
  const namespaceCount = countLivePluginStateNamespaceEntries(params.store.db, {
    pluginId: params.pluginId,
    namespace: params.namespace,
    now: params.now
  });
  if (namespaceCount >= params.maxEntries) {
    throw createPluginStateError({
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
      message: `Plugin state namespace ${params.namespace} for ${params.pluginId} reached its ${params.maxEntries}-row limit.`,
      path: params.store.path
    });
  }
  const maxPluginEntries = resolveMaxPluginStateEntriesPerPlugin();
  const pluginCount = countLivePluginStateEntries(params.store.db, {
    pluginId: params.pluginId,
    now: params.now
  });
  if (pluginCount >= maxPluginEntries) {
    throw createPluginStateError({
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
      message: `Plugin state for ${params.pluginId} reached the ${maxPluginEntries} live row limit.`,
      path: params.store.path
    });
  }
}
function resolveMaxPluginStateEntriesPerPlugin() {
  return maxPluginStateEntriesPerPluginForTests ?? MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN;
}
function pluginStateRegister(params) {
  try {
    runWriteTransaction(
      "register",
      (store) => {
        const now = Date.now();
        const expiresAt = resolvePluginStateExpiresAtMs({
          ttlMs: params.ttlMs,
          now,
          operation: "register",
          path: store.path
        });
        deleteExpiredPluginStateNamespaceEntries(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          now
        });
        const existing = selectPluginStateEntry(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now
        });
        if (!existing) {
          assertCanInsertPluginStateEntry({
            store,
            pluginId: params.pluginId,
            namespace: params.namespace,
            maxEntries: params.maxEntries,
            overflowPolicy: params.overflowPolicy,
            now
          });
        }
        upsertPluginStateEntry(
          store.db,
          bindPluginStateEntry({
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            valueJson: params.valueJson,
            createdAt: params.createdAtMs ?? now,
            expiresAt
          })
        );
        enforcePostRegisterLimits({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
          protectedKey: params.key
        });
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "register",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to register plugin state entry."
    );
  }
}
function pluginStateRegisterIfAbsent(params) {
  try {
    return runWriteTransaction(
      "register",
      (store) => {
        const now = Date.now();
        const expiresAt = resolvePluginStateExpiresAtMs({
          ttlMs: params.ttlMs,
          now,
          operation: "register",
          path: store.path
        });
        deleteExpiredPluginStateNamespaceEntries(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          now
        });
        const existing = selectPluginStateEntry(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now
        });
        if (existing) {
          return false;
        }
        assertCanInsertPluginStateEntry({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now
        });
        const inserted = insertPluginStateEntryIfAbsent(
          store.db,
          bindPluginStateEntry({
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            valueJson: params.valueJson,
            createdAt: now,
            expiresAt
          })
        );
        if (!inserted) {
          return false;
        }
        enforcePostRegisterLimits({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
          protectedKey: params.key
        });
        return true;
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "register",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to register plugin state entry."
    );
  }
}
function pluginStateUpdate(params) {
  try {
    return runWriteTransaction(
      "register",
      (store) => {
        const now = Date.now();
        deleteExpiredPluginStateNamespaceEntries(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          now
        });
        const existing = selectPluginStateEntry(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now
        });
        const next = params.updateValueJson(
          existing ? parseStoredJson(existing.value_json, "lookup") : void 0
        );
        if (!next) {
          return false;
        }
        if (!existing) {
          assertCanInsertPluginStateEntry({
            store,
            pluginId: params.pluginId,
            namespace: params.namespace,
            maxEntries: params.maxEntries,
            overflowPolicy: params.overflowPolicy,
            now
          });
        }
        const expiresAt = resolvePluginStateExpiresAtMs({
          ttlMs: next.ttlMs,
          now,
          operation: "register",
          path: store.path
        });
        upsertPluginStateEntry(
          store.db,
          bindPluginStateEntry({
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            valueJson: next.valueJson,
            createdAt: now,
            expiresAt
          })
        );
        enforcePostRegisterLimits({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
          protectedKey: params.key
        });
        return true;
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "register",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to update plugin state entry."
    );
  }
}
function pluginStateLookup(params) {
  try {
    const { db } = openPluginStateDatabase("lookup", envOptions(params.env));
    const row = selectPluginStateEntry(db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      key: params.key,
      now: Date.now()
    });
    return row ? parseStoredJson(row.value_json, "lookup") : void 0;
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "lookup",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to read plugin state entry."
    );
  }
}
function pluginStateConsume(params) {
  try {
    return runWriteTransaction(
      "consume",
      (store) => {
        const row = selectPluginStateEntry(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now: Date.now()
        });
        if (!row) {
          return void 0;
        }
        deletePluginStateEntry(store.db, params);
        return parseStoredJson(row.value_json, "consume");
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "consume",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to consume plugin state entry."
    );
  }
}
function pluginStateDelete(params) {
  try {
    return runWriteTransaction(
      "delete",
      ({ db }) => {
        return deletePluginStateEntry(db, params) > 0;
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "delete",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to delete plugin state entry."
    );
  }
}
function pluginStateDeleteIf(params) {
  try {
    return runWriteTransaction(
      "delete",
      ({ db }) => {
        const row = selectPluginStateEntry(db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now: Date.now()
        });
        if (!row || !params.predicate(parseStoredJson(row.value_json, "delete"))) {
          return false;
        }
        return deletePluginStateEntry(db, params) > 0;
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "delete",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to conditionally delete plugin state entry."
    );
  }
}
function pluginStateEntries(params) {
  try {
    const { db } = openPluginStateDatabase("entries", envOptions(params.env));
    const rows = selectPluginStateEntries(db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      now: Date.now()
    });
    return rows.map((row) => rowToEntry(row, "entries"));
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "entries",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to list plugin state entries."
    );
  }
}
function pluginStateClear(params) {
  try {
    runWriteTransaction(
      "clear",
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace)
        );
      },
      envOptions(params.env)
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "clear",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to clear plugin state namespace."
    );
  }
}
function clearPluginStateDatabaseForTests() {
  const store = openPluginStateDatabase("clear");
  executeSqliteQuerySync(
    store.db,
    getPluginStateKysely(store.db).deleteFrom("plugin_state_entries")
  );
}
function setMaxPluginStateEntriesPerPluginForTests(value) {
  maxPluginStateEntriesPerPluginForTests = value;
}
function seedPluginStateDatabaseEntriesForTests(entries) {
  if (entries.length === 0) {
    return;
  }
  const now = Date.now();
  runWriteTransaction("register", (store) => {
    for (const [index, entry] of entries.entries()) {
      upsertPluginStateEntry(
        store.db,
        bindPluginStateEntry({
          pluginId: entry.pluginId,
          namespace: entry.namespace,
          key: entry.key,
          valueJson: entry.valueJson,
          createdAt: entry.createdAt ?? now + index,
          expiresAt: entry.expiresAt ?? null
        })
      );
    }
  });
}
function probePluginStateStore() {
  const databasePath = resolveOpenClawStateSqlitePath(process.env);
  const steps = [];
  const wasOpen = cachedDatabase !== null;
  const stateWasOpen = isOpenClawStateDatabaseOpen();
  const pushOk = (name) => steps.push({ name, ok: true });
  const pushFailure = (name, error) => {
    const wrapped = error instanceof PluginStateStoreError ? error : createPluginStateError({
      code: "PLUGIN_STATE_OPEN_FAILED",
      operation: "probe",
      message: error instanceof Error ? error.message : String(error),
      path: databasePath,
      cause: error
    });
    steps.push({ name, ok: false, code: wrapped.code, message: wrapped.message });
  };
  try {
    requireNodeSqlite();
    pushOk("load-sqlite");
  } catch (error) {
    pushFailure(
      "load-sqlite",
      createPluginStateError({
        code: "PLUGIN_STATE_SQLITE_UNAVAILABLE",
        operation: "load-sqlite",
        message: "SQLite support is unavailable for plugin state storage.",
        path: databasePath,
        cause: error
      })
    );
    return { ok: false, databasePath, steps };
  }
  try {
    openPluginStateDatabase("probe");
    pushOk("open");
    pushOk("schema");
    runWriteTransaction("probe", ({ db }) => {
      const now = Date.now();
      const expiresAt = resolvePluginStateExpiresAtMs({
        ttlMs: 6e4,
        now,
        operation: "probe",
        path: databasePath
      });
      upsertPluginStateEntry(
        db,
        bindPluginStateEntry({
          pluginId: "core:plugin-state-probe",
          namespace: "diagnostics",
          key: "probe",
          valueJson: JSON.stringify({ ok: true }),
          createdAt: now,
          expiresAt
        })
      );
      selectPluginStateEntry(db, {
        pluginId: "core:plugin-state-probe",
        namespace: "diagnostics",
        key: "probe",
        now
      });
      deletePluginStateEntry(db, {
        pluginId: "core:plugin-state-probe",
        namespace: "diagnostics",
        key: "probe"
      });
    });
    pushOk("write-read-delete");
    openOpenClawStateDatabase().walMaintenance.checkpoint();
    pushOk("checkpoint");
  } catch (error) {
    pushFailure("probe", error);
  } finally {
    if (!wasOpen && !stateWasOpen) {
      closePluginStateDatabase();
    }
  }
  return { ok: steps.every((step) => step.ok), databasePath, steps };
}
function closePluginStateDatabase() {
  cachedDatabase = null;
  closeOpenClawStateDatabase();
}
if (process.env.VITEST || process.env.NODE_ENV === "test") {
  globalThis[/* @__PURE__ */ Symbol.for("openclaw.pluginStateSqliteTestApi")] = {
    probePluginStateStore,
    seedPluginStateDatabaseEntriesForTests,
    setMaxPluginStateEntriesPerPluginForTests
  };
}
var MAX_PLUGIN_STORE_NAMESPACE_BYTES = 128;
var MAX_PLUGIN_STORE_KEY_BYTES = 512;
var MAX_PLUGIN_STORE_JSON_BYTES = 65536;
var MAX_PLUGIN_STORE_JSON_DEPTH = 64;
var NAMESPACE_PATTERN = /^[a-z0-9][a-z0-9._-]*$/iu;
var textEncoder = new TextEncoder();
function assertMaxUtf8Bytes(params) {
  if (textEncoder.encode(params.value).byteLength > params.maxBytes) {
    throw params.errors.invalid(`${params.label} must be <= ${params.maxBytes} bytes`);
  }
}
function validatePluginStoreNamespace(params) {
  const trimmed = params.value.trim();
  if (!NAMESPACE_PATTERN.test(trimmed)) {
    throw params.errors.invalid(
      `${params.label} namespace must be a safe path segment: ${params.value}`
    );
  }
  assertMaxUtf8Bytes({
    label: `${params.label} namespace`,
    value: trimmed,
    maxBytes: MAX_PLUGIN_STORE_NAMESPACE_BYTES,
    errors: params.errors
  });
  return trimmed;
}
function validatePluginStoreKey(params) {
  const trimmed = params.value.trim();
  if (!trimmed) {
    throw params.errors.invalid(`${params.label} entry key must not be empty`);
  }
  assertMaxUtf8Bytes({
    label: `${params.label} entry key`,
    value: trimmed,
    maxBytes: MAX_PLUGIN_STORE_KEY_BYTES,
    errors: params.errors
  });
  return trimmed;
}
function validatePluginStorePositiveInteger(params) {
  if (!Number.isSafeInteger(params.value) || params.value < 1) {
    throw params.errors.invalid(`${params.label} must be a positive safe integer`);
  }
  return params.value;
}
function validateOptionalPluginStoreTtlMs(params) {
  const value = params.value;
  if (value == null) {
    return void 0;
  }
  return validatePluginStorePositiveInteger({ ...params, value });
}
function assertPlainJsonValue(value, params) {
  if (params.depth > MAX_PLUGIN_STORE_JSON_DEPTH) {
    throw params.errors.limit(
      `${params.label} nesting exceeds maximum depth of ${MAX_PLUGIN_STORE_JSON_DEPTH}`
    );
  }
  if (value === null) {
    return;
  }
  const valueType = typeof value;
  if (valueType === "string" || valueType === "boolean") {
    return;
  }
  if (valueType === "number") {
    if (!Number.isFinite(value)) {
      throw params.errors.invalid(`${params.label} at ${params.path} must be a finite number`);
    }
    return;
  }
  if (valueType !== "object") {
    throw params.errors.invalid(`${params.label} at ${params.path} must be JSON-serializable`);
  }
  const objectValue = value;
  if (params.seen.has(objectValue)) {
    throw params.errors.invalid(
      `${params.label} at ${params.path} must not contain circular references`
    );
  }
  params.seen.add(objectValue);
  try {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        if (!(index in value)) {
          throw params.errors.invalid(`${params.label} array at ${params.path} must not be sparse`);
        }
        assertPlainJsonValue(value[index], {
          ...params,
          path: `${params.path}[${index}]`,
          depth: params.depth + 1
        });
      }
      return;
    }
    if (Object.getPrototypeOf(objectValue) !== Object.prototype) {
      throw params.errors.invalid(
        `${params.label} object at ${params.path} must be a plain object`
      );
    }
    const descriptorEntries = Object.entries(Object.getOwnPropertyDescriptors(objectValue));
    if (Object.getOwnPropertySymbols(objectValue).length > 0) {
      throw params.errors.invalid(
        `${params.label} object at ${params.path} must not use symbol keys`
      );
    }
    if (descriptorEntries.length !== Object.keys(objectValue).length) {
      throw params.errors.invalid(
        `${params.label} object at ${params.path} must not use non-enumerable properties`
      );
    }
    for (const [key, descriptor] of descriptorEntries) {
      if (descriptor.get || descriptor.set || !("value" in descriptor)) {
        throw params.errors.invalid(
          `${params.label} object at ${params.path}.${key} must use data properties`
        );
      }
      assertPlainJsonValue(descriptor.value, {
        ...params,
        path: `${params.path}.${key}`,
        depth: params.depth + 1
      });
    }
  } finally {
    params.seen.delete(objectValue);
  }
}
function serializePluginStoreJson(params) {
  assertPlainJsonValue(params.value, {
    label: params.label,
    errors: params.errors,
    seen: /* @__PURE__ */ new WeakSet(),
    path: "value",
    depth: 0
  });
  const json = JSON.stringify(params.value);
  if (json === void 0) {
    throw params.errors.invalid(`${params.label} must be JSON-serializable`);
  }
  const maxBytes = params.maxBytes ?? MAX_PLUGIN_STORE_JSON_BYTES;
  if (textEncoder.encode(json).byteLength > maxBytes) {
    throw params.errors.limit(`${params.label} exceeds ${maxBytes} byte limit`);
  }
  return json;
}
var namespaceOptionSignatures = /* @__PURE__ */ new Map();
function invalidInput(message, operation = "register") {
  return new PluginStateStoreError(message, {
    code: "PLUGIN_STATE_INVALID_INPUT",
    operation
  });
}
function validateNamespace(value, operation = "open") {
  return validatePluginStoreNamespace({
    value,
    label: "plugin state",
    errors: {
      invalid: (message) => invalidInput(message, operation),
      limit: (message) => invalidInput(message, operation)
    }
  });
}
function validateKey(value, operation = "register") {
  return validatePluginStoreKey({
    value,
    label: "plugin state",
    errors: {
      invalid: (message) => invalidInput(message, operation),
      limit: (message) => invalidInput(message, operation)
    }
  });
}
function validateMaxEntries(value) {
  if (!Number.isInteger(value) || value < 1) {
    throw invalidInput("plugin state maxEntries must be an integer >= 1", "open");
  }
  return value;
}
function validateOverflowPolicy(value) {
  if (value === void 0 || value === "evict-oldest") {
    return "evict-oldest";
  }
  if (value === "reject-new") {
    return value;
  }
  throw invalidInput("plugin state overflowPolicy must be evict-oldest or reject-new", "open");
}
function validateOptionalTtlMs(value, operation = "register") {
  return validateOptionalPluginStoreTtlMs({
    value,
    label: "plugin state ttlMs",
    errors: {
      invalid: (message) => invalidInput(message, operation),
      limit: (message) => invalidInput(message, operation)
    }
  });
}
function prepareRegisterParams(key, value, defaultTtlMs, opts) {
  const normalizedKey = validateKey(key, "register");
  const json = serializePluginStoreJson({
    value,
    label: "plugin state value",
    maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
    errors: {
      invalid: (message) => invalidInput(message, "register"),
      limit: (message) => new PluginStateStoreError(message, {
        code: "PLUGIN_STATE_LIMIT_EXCEEDED",
        operation: "register"
      })
    }
  });
  const ttlMs = validateOptionalTtlMs(opts?.ttlMs, "register") ?? defaultTtlMs;
  return {
    key: normalizedKey,
    valueJson: json,
    ...ttlMs != null ? { ttlMs } : {}
  };
}
function assertConsistentOptions(pluginId, namespace, signature) {
  const key = `${pluginId}\0${namespace}`;
  const existing = namespaceOptionSignatures.get(key);
  if (!existing) {
    namespaceOptionSignatures.set(key, signature);
    return;
  }
  if (existing.maxEntries !== signature.maxEntries || existing.overflowPolicy !== signature.overflowPolicy || existing.defaultTtlMs !== signature.defaultTtlMs) {
    throw invalidInput(
      `plugin state namespace ${namespace} for ${pluginId} was reopened with incompatible options`,
      "open"
    );
  }
}
function createSyncKeyedStoreForPluginId(pluginId, options) {
  const namespace = validateNamespace(options.namespace);
  const maxEntries = validateMaxEntries(options.maxEntries);
  const overflowPolicy = validateOverflowPolicy(options.overflowPolicy);
  const defaultTtlMs = validateOptionalTtlMs(options.defaultTtlMs);
  const env = options.env;
  assertConsistentOptions(pluginId, namespace, { maxEntries, overflowPolicy, defaultTtlMs });
  return {
    register(key, value, opts) {
      const params = prepareRegisterParams(key, value, defaultTtlMs, opts);
      pluginStateRegister({
        pluginId,
        namespace,
        key: params.key,
        valueJson: params.valueJson,
        maxEntries,
        overflowPolicy,
        ...env ? { env } : {},
        ...params.ttlMs != null ? { ttlMs: params.ttlMs } : {}
      });
    },
    registerIfAbsent(key, value, opts) {
      const params = prepareRegisterParams(key, value, defaultTtlMs, opts);
      return pluginStateRegisterIfAbsent({
        pluginId,
        namespace,
        key: params.key,
        valueJson: params.valueJson,
        maxEntries,
        overflowPolicy,
        ...env ? { env } : {},
        ...params.ttlMs != null ? { ttlMs: params.ttlMs } : {}
      });
    },
    update(key, updateValue, opts) {
      const normalizedKey = validateKey(key, "register");
      return pluginStateUpdate({
        pluginId,
        namespace,
        key: normalizedKey,
        maxEntries,
        overflowPolicy,
        updateValueJson: (current) => {
          const next = updateValue(current);
          if (next === void 0) {
            return void 0;
          }
          const params = prepareRegisterParams(normalizedKey, next, defaultTtlMs, opts);
          return {
            valueJson: params.valueJson,
            ...params.ttlMs != null ? { ttlMs: params.ttlMs } : {}
          };
        },
        ...env ? { env } : {}
      });
    },
    deleteIf(key, predicate) {
      const normalizedKey = validateKey(key, "delete");
      return pluginStateDeleteIf({
        pluginId,
        namespace,
        key: normalizedKey,
        predicate: (current) => predicate(current),
        ...env ? { env } : {}
      });
    },
    lookup(key) {
      const normalizedKey = validateKey(key, "lookup");
      return pluginStateLookup({
        pluginId,
        namespace,
        key: normalizedKey,
        ...env ? { env } : {}
      });
    },
    consume(key) {
      const normalizedKey = validateKey(key, "consume");
      return pluginStateConsume({
        pluginId,
        namespace,
        key: normalizedKey,
        ...env ? { env } : {}
      });
    },
    delete(key) {
      const normalizedKey = validateKey(key, "delete");
      return pluginStateDelete({
        pluginId,
        namespace,
        key: normalizedKey,
        ...env ? { env } : {}
      });
    },
    entries() {
      return pluginStateEntries({
        pluginId,
        namespace,
        ...env ? { env } : {}
      });
    },
    clear() {
      pluginStateClear({ pluginId, namespace, ...env ? { env } : {} });
    }
  };
}
function createPluginStateSyncKeyedStore(pluginId, options) {
  if (pluginId.startsWith("core:")) {
    throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
  }
  return createSyncKeyedStoreForPluginId(pluginId, options);
}
function clearPluginStateStoreForTests() {
  clearPluginStateDatabaseForTests();
  namespaceOptionSignatures.clear();
}
if (process.env.VITEST || process.env.NODE_ENV === "test") {
  globalThis[/* @__PURE__ */ Symbol.for("openclaw.pluginStateStoreTestApi")] = {
    clearPluginStateStoreForTests
  };
}
var LOBSTER_PALETTE = {
  accent: "#FF5A2D",
  accentBright: "#FF7A3D",
  accentDim: "#D14A22",
  info: "#FF8A5B",
  success: "#2FBF71",
  warn: "#FFB020",
  error: "#E23D2D",
  muted: "#8B7F77"
};
var hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
var baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk2({ level: 0 }) : chalk;
var hex = (value) => baseChalk.hex(value);
var theme = {
  accent: hex(LOBSTER_PALETTE.accent),
  accentBright: hex(LOBSTER_PALETTE.accentBright),
  accentDim: hex(LOBSTER_PALETTE.accentDim),
  info: hex(LOBSTER_PALETTE.info),
  success: hex(LOBSTER_PALETTE.success),
  warn: hex(LOBSTER_PALETTE.warn),
  error: hex(LOBSTER_PALETTE.error),
  muted: hex(LOBSTER_PALETTE.muted),
  heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
  command: hex(LOBSTER_PALETTE.accentBright),
  option: hex(LOBSTER_PALETTE.warn)
};
var success = theme.success;
var warn = theme.warn;
var info = theme.info;
var danger = theme.error;
var WINDOWS_OEM_CODEPAGE_ENCODING_MAP = {
  65001: "utf-8",
  // These locales use the same ANSI/OEM identifier; labels match the ANSI map.
  874: "windows-874",
  932: "shift_jis",
  936: "gbk",
  949: "euc-kr",
  950: "big5",
  1258: "windows-1258",
  // OEM-only single-byte pages used by windows-125x ANSI hosts, iconv-lite
  // `cp###` labels. 864 is omitted: real CP864 repurposes ASCII 0x25 "%",
  // which generated cmd scripts contain. Unsupported OEM pages fail closed.
  437: "cp437",
  720: "cp720",
  737: "cp737",
  775: "cp775",
  850: "cp850",
  852: "cp852",
  855: "cp855",
  857: "cp857",
  858: "cp858",
  860: "cp860",
  861: "cp861",
  862: "cp862",
  863: "cp863",
  865: "cp865",
  866: "cp866",
  869: "cp869"
};
var WINDOWS_OEM_ENCODING_CODEPAGE_MAP = new Map(
  Object.entries(WINDOWS_OEM_CODEPAGE_ENCODING_MAP).map(([codePage, encoding]) => [
    encoding,
    Number.parseInt(codePage, 10)
  ])
);
var info2 = theme.info;
var warn2 = theme.warn;
var success2 = theme.success;
var danger2 = theme.error;
var DEFAULT_COMMAND_OUTPUT_MAX_BYTES = 16 * 1024 * 1024;
var MAX_PRESERVED_PENDING_LINE_BYTES = 8 * 1024;
var DEFAULT_EXEC_MAX_BUFFER_BYTES = 1024 * 1024;
var NPM_CONFIG_PATH_PROBE_PARENT_ENV_KEYS = ["PATH", "Path", "PATHEXT", "SystemRoot", "ComSpec"];
var NPM_GLOBAL_CONFIG_PATH_CACHE_ENV_KEYS = [
  ...NPM_CONFIG_PATH_PROBE_PARENT_ENV_KEYS,
  "NPM_CONFIG_GLOBALCONFIG",
  "npm_config_globalconfig",
  "NPM_CONFIG_PREFIX",
  "npm_config_prefix",
  "NPM_CONFIG_USERCONFIG",
  "npm_config_userconfig",
  "HOME",
  "PREFIX",
  "USERPROFILE"
];
function resolveConfigDir(env = process.env, homedir = os5.homedir) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, homedir);
  }
  const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
  if (configPath) {
    return path15.dirname(resolveUserPath(configPath, env, homedir));
  }
  const newDir = path15.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
  try {
    const hasNew = fs7.existsSync(newDir);
    if (hasNew) {
      return newDir;
    }
  } catch {
  }
  return newDir;
}
var CONFIG_DIR = resolveConfigDir();
var DEFAULT_SLOT_BY_KEY = {
  memory: "memory-core",
  contextEngine: "legacy"
};
var PLUGIN_SLOT_KEYS = Object.keys(DEFAULT_SLOT_BY_KEY);
function defaultSlotIdForKey(slotKey) {
  return DEFAULT_SLOT_BY_KEY[slotKey];
}
function resetPluginSlotsToDefaults(slots, pluginId) {
  if (!slots) {
    return slots;
  }
  const next = { ...slots };
  let changed = false;
  for (const slotKey of PLUGIN_SLOT_KEYS) {
    if (slots[slotKey] !== pluginId) {
      continue;
    }
    next[slotKey] = defaultSlotIdForKey(slotKey);
    changed = true;
  }
  return changed ? next : slots;
}
function createEmptyUninstallActions(overrides = {}) {
  return {
    entry: false,
    install: false,
    allowlist: false,
    denylist: false,
    loadPath: false,
    memorySlot: false,
    contextEngineSlot: false,
    channelConfig: false,
    directory: false,
    ...overrides
  };
}
function createEmptyConfigUninstallActions() {
  const { directory: _directory, ...actions } = createEmptyUninstallActions();
  return actions;
}
var SHARED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
function resolveUninstallChannelConfigKeys(pluginId, opts) {
  const rawKeys = opts?.channelIds ?? [pluginId];
  const seen = /* @__PURE__ */ new Set();
  const keys = [];
  for (const key of rawKeys) {
    if (SHARED_CHANNEL_CONFIG_KEYS.has(key) || seen.has(key)) {
      continue;
    }
    seen.add(key);
    keys.push(key);
  }
  return keys;
}
function loadPathMatchesInstallSourcePath(loadPath, sourcePath) {
  if (loadPath === sourcePath) {
    return true;
  }
  return resolveComparablePath(loadPath) === resolveComparablePath(sourcePath);
}
function resolveComparablePath(value) {
  const resolved = path16.resolve(value);
  try {
    return realpathSync(resolved);
  } catch {
    return resolved;
  }
}
function removePluginFromConfig(cfg, pluginId, opts) {
  const actions = createEmptyConfigUninstallActions();
  const pluginsConfig = cfg.plugins ?? {};
  let entries = pluginsConfig.entries;
  if (entries && Object.hasOwn(entries, pluginId)) {
    const { [pluginId]: _, ...rest } = entries;
    entries = Object.keys(rest).length > 0 ? rest : void 0;
    actions.entry = true;
  }
  let installs = pluginsConfig.installs;
  const hasInstallRecord = Object.hasOwn(installs ?? {}, pluginId);
  const installRecord = hasInstallRecord ? installs?.[pluginId] : void 0;
  if (installs && hasInstallRecord) {
    const { [pluginId]: _, ...rest } = installs;
    installs = Object.keys(rest).length > 0 ? rest : void 0;
    actions.install = true;
  }
  let allow = pluginsConfig.allow;
  if (Array.isArray(allow) && allow.includes(pluginId)) {
    allow = allow.filter((id) => id !== pluginId);
    if (allow.length === 0) {
      allow = void 0;
    }
    actions.allowlist = true;
  }
  let deny = pluginsConfig.deny;
  if (Array.isArray(deny) && deny.includes(pluginId)) {
    deny = deny.filter((id) => id !== pluginId);
    if (deny.length === 0) {
      deny = void 0;
    }
    actions.denylist = true;
  }
  let load = pluginsConfig.load;
  if (installRecord?.source === "path" && installRecord.sourcePath) {
    const sourcePath = installRecord.sourcePath;
    const loadPaths = load?.paths;
    if (Array.isArray(loadPaths) && loadPaths.some((p) => loadPathMatchesInstallSourcePath(p, sourcePath))) {
      const nextLoadPaths = loadPaths.filter(
        (p) => !loadPathMatchesInstallSourcePath(p, sourcePath)
      );
      load = nextLoadPaths.length > 0 ? { ...load, paths: nextLoadPaths } : void 0;
      actions.loadPath = true;
    }
  }
  let slots = pluginsConfig.slots;
  if (slots?.memory === pluginId) {
    actions.memorySlot = true;
  }
  if (slots?.contextEngine === pluginId) {
    actions.contextEngineSlot = true;
  }
  slots = resetPluginSlotsToDefaults(slots, pluginId);
  if (slots && Object.keys(slots).length === 0) {
    slots = void 0;
  }
  const newPlugins = {
    ...pluginsConfig,
    entries,
    installs,
    allow,
    deny,
    load,
    slots
  };
  const cleanedPlugins = { ...newPlugins };
  if (cleanedPlugins.entries === void 0) {
    delete cleanedPlugins.entries;
  }
  if (cleanedPlugins.installs === void 0) {
    delete cleanedPlugins.installs;
  }
  if (cleanedPlugins.allow === void 0) {
    delete cleanedPlugins.allow;
  }
  if (cleanedPlugins.deny === void 0) {
    delete cleanedPlugins.deny;
  }
  if (cleanedPlugins.load === void 0) {
    delete cleanedPlugins.load;
  }
  if (cleanedPlugins.slots === void 0) {
    delete cleanedPlugins.slots;
  }
  let channels = cfg.channels;
  if (hasInstallRecord && channels) {
    for (const key of resolveUninstallChannelConfigKeys(pluginId, opts)) {
      if (!Object.hasOwn(channels, key)) {
        continue;
      }
      const { [key]: _removed, ...rest } = channels;
      channels = Object.keys(rest).length > 0 ? rest : void 0;
      actions.channelConfig = true;
      if (!channels) {
        break;
      }
    }
  }
  const config = {
    ...cfg,
    plugins: Object.keys(cleanedPlugins).length > 0 ? cleanedPlugins : void 0,
    channels
  };
  return { config, actions };
}
async function legacyStateFileExists(filePath) {
  try {
    const stat = await fs8.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}
async function archiveLegacyStateSource(params) {
  const archivedPath = `${params.filePath}.migrated`;
  try {
    if (await legacyStateFileExists(archivedPath)) {
      const [sourceBytes, archiveBytes] = await Promise.all([
        fs8.readFile(params.filePath),
        fs8.readFile(archivedPath)
      ]);
      if (sourceBytes.equals(archiveBytes)) {
        await fs8.rm(params.filePath, { force: true });
        params.changes.push(
          `Removed already-archived ${params.label} legacy source ${params.filePath}`
        );
        return;
      }
      const nextArchivePath = await firstFreeArchivePath(params.filePath);
      await fs8.rename(params.filePath, nextArchivePath);
      params.changes.push(`Archived ${params.label} legacy source -> ${nextArchivePath}`);
      return;
    }
    await fs8.rename(params.filePath, archivedPath);
    params.changes.push(`Archived ${params.label} legacy source -> ${archivedPath}`);
  } catch (err) {
    params.warnings.push(`Failed archiving ${params.label} legacy source: ${String(err)}`);
  }
}
async function firstFreeArchivePath(sourcePath) {
  for (let index = 2; ; index++) {
    const candidate = `${sourcePath}.migrated.${index}`;
    if (!await legacyStateFileExists(candidate)) {
      return candidate;
    }
  }
}
export {
  archiveLegacyStateSource,
  asObjectRecord3 as asObjectRecord,
  collectProviderDangerousNameMatchingScopes,
  createPluginStateSyncKeyedStore,
  defineChannelAliasMigration,
  detectOpenClawStateDatabaseSchemaMigrations,
  detectPluginInstallPathIssue,
  formatPluginInstallPathIssue,
  hasLegacyAccountStreamingAliases,
  hasLegacyStreamingAliases,
  legacyStateFileExists,
  normalizeLegacyChannelAliases,
  normalizeLegacyDmAliases,
  normalizeLegacyStreamingAliases,
  removePluginFromConfig,
  repairOpenClawStateDatabaseSchema,
  resolveLegacyAliasStreamingMode
};
