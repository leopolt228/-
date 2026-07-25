import { t as ChannelPairingAdapter } from "./pairing.types-BvMidsxc.js";
import { t as PairingChannel } from "./pairing-store.types-Dnl8wXcu.js";

//#region src/pairing/pairing-store.d.ts
/** @deprecated Compatibility helper for doctor/plugin migrations of the retired JSON store. */
declare function resolveChannelAllowFromPath(channel: PairingChannel, env?: NodeJS.ProcessEnv, accountId?: string): string;
declare function readChannelAllowFromStore(channel: PairingChannel, env?: NodeJS.ProcessEnv, accountId?: string): Promise<string[]>;
declare function readChannelAllowFromStoreSync(channel: PairingChannel, env?: NodeJS.ProcessEnv, accountId?: string): string[];
declare function upsertChannelPairingRequest(params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv; /** Extension channels can pass their adapter directly to bypass registry lookup. */
  pairingAdapter?: ChannelPairingAdapter;
}): Promise<{
  code: string;
  created: boolean;
}>;
//#endregion
export { upsertChannelPairingRequest as i, readChannelAllowFromStoreSync as n, resolveChannelAllowFromPath as r, readChannelAllowFromStore as t };