import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { Vt as ProviderPrepareDynamicModelContext } from "../../plugin-entry-Bj-pdgAt.js";
//#region extensions/github-copilot/auth.d.ts
declare function resolveFirstGithubToken(params: {
  agentDir?: string;
  config?: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  profileId?: string;
  authProfileMode?: ProviderPrepareDynamicModelContext["authProfileMode"];
}): Promise<{
  githubToken: string;
  hasProfile: boolean;
}>;
//#endregion
export { resolveFirstGithubToken };