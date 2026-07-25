//#region src/cli/parse-duration.d.ts
/** Options for choosing the unit used by bare numeric duration values. */
type DurationMsParseOptions = {
  defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};
/** Parse a non-negative duration into milliseconds, supporting single and composite units. */
declare function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number;
//#endregion
export { parseDurationMs as t };