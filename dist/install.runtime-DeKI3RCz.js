import { i as isPathInside } from "./path-DILYn_gk.js";
import { g as pathExists } from "./fs-safe-Dy0g6QwA.js";
import { a as root } from "./secure-temp-dir-D6Ou0J-U.js";
import { s as resolveArchiveKind } from "./archive-OpHK2JK5.js";
import { o as resolveCompatibilityHostVersion, s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import { c as validateRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import { n as readJson } from "./json--wG6OtAJ.js";
import "./json-files-2JJFkKam.js";
import { a as loadPluginManifest, c as resolvePackageExtensionEntries, r as getPackageManifestMetadata } from "./manifest-FKjShfr0.js";
import { a as loadBundleManifest, i as detectBundleManifestFormat } from "./bundle-manifest-BaKN9mzB.js";
import "./path-safety-DYp8wadK.js";
import { t as checkMinHostVersion } from "./min-host-version-CTihEoIZ.js";
import "./archive-B0eXpnA9.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-D71Lc61M.js";
import { i as withExtractedArchiveRoot, r as resolveExistingInstallPath, t as installPackageDir } from "./install-package-dir-BiykTlIJ.js";
import { a as scanFileInstallSource, i as scanBundleInstallSource, o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-D_fqlETr.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-CgLFN9KJ.js";
//#region src/plugins/install.runtime.ts
/** Lazy runtime barrel for plugin installation helpers used by install flows. */
//#endregion
export { checkMinHostVersion, detectBundleManifestFormat, ensureInstallTargetAvailable, pathExists as fileExists, finalizeNpmSpecArchiveInstall, getPackageManifestMetadata, installFromNpmSpecArchiveWithInstaller, installPackageDir, isPathInside, loadBundleManifest, loadPluginManifest, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveCompatibilityHostVersion, resolveExistingInstallPath, resolveInstallModeOptions, resolvePackageExtensionEntries, resolveRuntimeServiceVersion, resolveTimedInstallModeOptions, root, scanBundleInstallSource, scanFileInstallSource, scanInstalledPackageDependencyTree, scanPackageInstallSource, validateRegistryNpmSpec, withExtractedArchiveRoot };
