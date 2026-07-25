//#region src/plugin-state/plugin-state-lease.types.ts
var PluginStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateLeaseError";
		this.code = options.code;
	}
};
//#endregion
export { PluginStateLeaseError as t };
