import { Ln as strictObject } from "../../schemas-CBJjibl3.js";
import { n as buildPluginConfigSchema } from "../../config-schema-BXo5neWF.js";
import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import { t as createLinuxCanvasCommands } from "../../api-dkf2Apiz.js";
var linux_canvas_default = definePluginEntry({
	id: "linux-canvas",
	name: "Linux Canvas",
	description: "Canvas rendering bridge for the OpenClaw Linux desktop app.",
	configSchema: buildPluginConfigSchema(strictObject({})),
	register(api) {
		for (const command of createLinuxCanvasCommands()) api.registerNodeHostCommand(command);
	}
});
//#endregion
export { linux_canvas_default as default };
