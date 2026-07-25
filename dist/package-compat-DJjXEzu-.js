import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/plugins/package-compat.ts
/** Resolves the plugin API compatibility range declared by package metadata. */
function resolvePackagePluginApiRange(packageMetadata) {
	if (packageMetadata === void 0 || packageMetadata === null) return { ok: true };
	if (!isRecord(packageMetadata)) return { ok: true };
	if (!("compat" in packageMetadata)) return { ok: true };
	const compat = packageMetadata.compat;
	if (compat === void 0 || compat === null) return { ok: true };
	if (!isRecord(compat)) return {
		ok: false,
		error: "package.json openclaw.compat must be an object"
	};
	if (!("pluginApi" in compat)) return { ok: true };
	const pluginApi = compat.pluginApi;
	if (typeof pluginApi !== "string") return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must be a string"
	};
	const range = pluginApi.trim();
	if (!range) return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must not be empty"
	};
	return {
		ok: true,
		range
	};
}
//#endregion
export { resolvePackagePluginApiRange as t };
