//#region src/agents/date-time.d.ts
type TimeFormatPreference = "auto" | "12" | "24";
/** Add normalized timestamp fields without overwriting valid existing values. */
declare function withNormalizedTimestamp<T extends Record<string, unknown>>(value: T, rawTimestamp: unknown): T & {
  timestampMs?: number;
  timestampUtc?: string;
};
//#endregion
export { withNormalizedTimestamp as n, TimeFormatPreference as t };