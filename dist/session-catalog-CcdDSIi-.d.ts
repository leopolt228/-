import { d as SessionCatalogSession, j as SessionsCatalogReadResult } from "./sessions-catalog-tmOWqwzI.js";
//#region extensions/opencode/session-catalog.d.ts
type OpenCodeSessionPage = {
  sessions: SessionCatalogSession[];
  nextCursor?: string;
};
declare function isExactOpenCodeSessionCursor(value: unknown): value is string;
declare function listLocalOpenCodeSessionPage(value?: unknown): Promise<OpenCodeSessionPage>;
declare function readLocalOpenCodeTranscriptPage(value: unknown): Promise<SessionsCatalogReadResult>;
//#endregion
export { readLocalOpenCodeTranscriptPage as i, isExactOpenCodeSessionCursor as n, listLocalOpenCodeSessionPage as r, OpenCodeSessionPage as t };