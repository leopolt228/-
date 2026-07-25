import { n as FsSafeErrorCode } from "./errors-n3AviYl-.js";

//#region node_modules/@openclaw/fs-safe/dist/secret-file.d.ts
declare const DEFAULT_SECRET_FILE_MAX_BYTES: number;
declare const PRIVATE_SECRET_DIR_MODE = 448;
declare const PRIVATE_SECRET_FILE_MODE = 384;
type SecretFileReadOptions = {
  maxBytes?: number;
  rejectSymlink?: boolean;
  rejectHardlinks?: boolean;
};
declare function readSecretFileSync(filePath: string, label: string, options?: SecretFileReadOptions): string;
declare function writeSecretFileAtomic(params: {
  rootDir: string;
  filePath: string;
  content: string | Uint8Array;
  mode?: number;
  dirMode?: number;
}): Promise<void>;
//#endregion
//#region src/infra/secret-file.d.ts
type SecretFileReadResult = {
  ok: true;
  secret: string;
  resolvedPath: string;
} | {
  ok: false;
  message: string;
  resolvedPath?: string;
  error?: unknown;
};
type CredentialUnavailableDiagnostic = {
  code: "CREDENTIAL_FILE_UNAVAILABLE";
  path: string;
  reason: FsSafeErrorCode;
};
/** Closed credential state used by channel account resolvers. */
type CredentialResult<T> = {
  status: "available";
  value: T;
} | {
  status: "configured_unavailable";
  diagnostic: CredentialUnavailableDiagnostic;
} | {
  status: "missing";
};
type ConfiguredCredentialResult<T> = Exclude<CredentialResult<T>, {
  status: "missing";
}>;
type CredentialFileReadOptions = SecretFileReadOptions & {
  credentialDiagnostic: {
    configPath: string;
    report: (diagnostic: CredentialUnavailableDiagnostic) => void;
  };
};
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: CredentialFileReadOptions): string | undefined;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options?: SecretFileReadOptions): string | undefined;
/** Reads an explicitly configured credential file without exposing its filesystem path. */
declare function tryReadSecretFileSync(filePath: string, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): ConfiguredCredentialResult<string>;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): CredentialResult<string>;
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
declare function loadSecretFileSync(filePath: string, label: string, options?: Parameters<typeof readSecretFileSync>[2]): SecretFileReadResult;
//#endregion
export { PRIVATE_SECRET_DIR_MODE as a, readSecretFileSync as c, DEFAULT_SECRET_FILE_MAX_BYTES as i, writeSecretFileAtomic as l, loadSecretFileSync as n, PRIVATE_SECRET_FILE_MODE as o, tryReadSecretFileSync as r, SecretFileReadOptions as s, SecretFileReadResult as t };