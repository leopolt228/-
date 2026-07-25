import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-K2PjeLaV.js";
//#region src/config/model-policy-allowlist-migration.ts
const MODEL_POLICY_ALLOWLIST_MIGRATION_MARKER = "modelPolicyAllowlist";
function hasModelPolicyAllowlistMigrationMarker(value) {
	if (!isRecord(value) || !isRecord(value.meta) || !isRecord(value.meta.migrations)) return false;
	return value.meta.migrations[MODEL_POLICY_ALLOWLIST_MIGRATION_MARKER] === true;
}
/** Any policy object opts into the explicit model-policy semantics. */
function isExplicitModelPolicy(value) {
	return isRecord(value);
}
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isExplicitModelPolicy(value) && Object.hasOwn(value, "allow");
}
function computeModelPolicyAllowlist(params) {
	if (hasModelPolicyAllowlistMigrationMarker(params.root)) return null;
	return collectLegacyDefaultModelAllowRefs(params.defaults);
}
function collectLegacyDefaultModelAllowRefs(defaults) {
	if (!isRecord(defaults)) return null;
	if (isExplicitModelPolicy(defaults.modelPolicy)) return null;
	if (!isRecord(defaults.models)) return null;
	const refs = Object.keys(defaults.models).filter((key) => key.trim().length > 0);
	return refs.length > 0 ? refs : null;
}
//#endregion
export { isExplicitModelPolicy as a, hasModelPolicyAllowlistMigrationMarker as i, computeModelPolicyAllowlist as n, hasExplicitModelPolicyAllow as r, MODEL_POLICY_ALLOWLIST_MIGRATION_MARKER as t };
