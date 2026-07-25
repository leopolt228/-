//#region extensions/google/oauth.credentials.d.ts
declare function resolveOAuthClientConfig(): {
  clientId: string;
  clientSecret?: string;
};
//#endregion
export { resolveOAuthClientConfig };