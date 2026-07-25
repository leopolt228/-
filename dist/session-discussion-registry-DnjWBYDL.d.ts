//#region src/plugins/session-discussion-registry.d.ts
type SessionDiscussionState = "none" | "available" | "open";
type SessionDiscussionInfo = {
  state: SessionDiscussionState;
  embedUrl?: string;
  openUrl?: string;
};
type SessionDiscussionProvider = {
  id: string;
  info(params: {
    sessionKey: string;
  }): Promise<SessionDiscussionInfo>;
  open(params: {
    sessionKey: string;
  }): Promise<SessionDiscussionInfo>;
};
declare function registerSessionDiscussionProvider(provider: SessionDiscussionProvider): void;
//#endregion
export { registerSessionDiscussionProvider as i, SessionDiscussionProvider as n, SessionDiscussionState as r, SessionDiscussionInfo as t };