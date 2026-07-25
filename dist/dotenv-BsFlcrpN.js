import { u as tryProcessCwd } from "./home-dir-DxrrpDft.js";
import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-D5JdeSG4.js";
import { n as loadWorkspaceDotEnvFile } from "./dotenv-C6vlu5_1.js";
import path from "node:path";
//#region src/cli/dotenv.ts
/** Load `.env` files for normal CLI commands without overriding existing process env. */
function loadCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd) loadWorkspaceDotEnvFile(path.join(cwd, ".env"), { quiet });
	if (opts?.loadGlobalEnv === false) return;
	loadGlobalRuntimeDotEnvFiles({
		quiet,
		stateEnvPath: path.join(resolveStateDir(process.env), ".env")
	});
}
//#endregion
export { loadCliDotEnv };
