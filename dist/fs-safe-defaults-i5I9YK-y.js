import { n as configureFsSafePython } from "./pinned-python-config-D-nZR8l7.js";
//#region src/infra/fs-safe-defaults.ts
if (!(process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null)) configureFsSafePython({ mode: "off" });
//#endregion
export {};
