import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as BaseTokenResolution } from "./types.core-Di2R8WTy.js";
import { r as tryReadSecretFileSync } from "./secret-file-Dzca8kyz.js";
//#region extensions/telegram/src/token.d.ts
type CredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
type TelegramTokenResolution = BaseTokenResolution & {
  source: TelegramTokenSource;
  credentialDiagnostics?: CredentialUnavailableDiagnostic[];
};
declare function resolveTelegramBotUserIdFromToken(token?: string): number | undefined;
type ResolveTelegramTokenOpts = {
  envToken?: string | null;
  accountId?: string | null;
  logMissingFile?: (message: string) => void;
};
declare function resolveTelegramToken(cfg?: OpenClawConfig, opts?: ResolveTelegramTokenOpts): TelegramTokenResolution;
//#endregion
export { resolveTelegramBotUserIdFromToken as n, resolveTelegramToken as r, TelegramTokenResolution as t };