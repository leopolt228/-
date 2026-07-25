import { r as collectSecretInputAssignment } from "../../runtime-shared-BL5llIf5.js";
import { a as getChannelRecord, i as createChannelSecretTargetRegistryEntries } from "../../channel-secret-basic-runtime-CSR-dj-5.js";
import "../../channel-secret-basic-runtime-BpNC3FYU.js";
//#region extensions/msteams/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "msteams",
	channel: ["appPassword"]
});
function collectRuntimeConfigAssignments(params) {
	const msteams = getChannelRecord(params.config, "msteams");
	if (!msteams) return;
	collectSecretInputAssignment({
		value: msteams.appPassword,
		path: "channels.msteams.appPassword",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: msteams.enabled !== false,
		inactiveReason: "Microsoft Teams channel is disabled.",
		owner: {
			ownerKind: "account",
			ownerId: "msteams:default",
			requiredForGateway: false,
			disposition: "isolate",
			contract: msteams
		},
		apply: (value) => {
			msteams.appPassword = value;
		}
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { channelSecrets, collectRuntimeConfigAssignments, secretTargetRegistryEntries };
