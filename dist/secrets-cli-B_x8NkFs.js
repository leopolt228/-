import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { a as hasErrnoCode, r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { r as defaultRuntime } from "./runtime-ZHfN2VLf.js";
import { t as danger } from "./globals-DBBT7Ru5.js";
import { t as formatGatewayCommandFailure } from "./error-format-CG7mpTEd.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-BeSn3X6s.js";
//#region src/cli/secrets-cli.ts
const fsModuleLoader = createLazyImportLoader(() => import("node:fs"));
const clackPromptsLoader = createLazyImportLoader(() => import("@clack/prompts"));
const secretsApplyLoader = createLazyImportLoader(() => import("./apply-DMeoKFxE.js"));
var SecretsPlanFileNotFoundError = class extends Error {};
const SECRETS_PLAN_MAX_BYTES = 16 * 1024 * 1024;
function serializePlanFile(plan, pathname) {
	const raw = `${JSON.stringify(plan, null, 2)}\n`;
	if (Buffer.byteLength(raw, "utf8") > SECRETS_PLAN_MAX_BYTES) throw new RangeError(`Secrets plan exceeds ${SECRETS_PLAN_MAX_BYTES} bytes and cannot be written: ${pathname}`);
	return raw;
}
async function readPlanFile(pathname) {
	const [fsModule, { readFileDescriptorBounded }, { isSecretsApplyPlan }] = await Promise.all([
		fsModuleLoader.load(),
		import("./infra/boundary-file-read.js"),
		import("./plan-BsqZgv-i.js")
	]);
	const fsConstants = fsModule.constants;
	const openFlags = fsConstants.O_RDONLY | (fsConstants.O_NONBLOCK ?? 0);
	const file = await fsModule.promises.open(pathname, openFlags).catch((err) => {
		if (hasErrnoCode(err, "ENOENT")) throw new SecretsPlanFileNotFoundError(`Secrets plan file not found: ${pathname}`, { cause: err });
		throw err;
	});
	let raw;
	try {
		const stat = await file.stat();
		if (!stat.isFile()) throw new Error(`Secrets plan path is not a regular file: ${pathname}`);
		if (stat.size > SECRETS_PLAN_MAX_BYTES) throw new RangeError(`Secrets plan file exceeds ${SECRETS_PLAN_MAX_BYTES} bytes: ${pathname}`);
		raw = (await readFileDescriptorBounded(file.fd, SECRETS_PLAN_MAX_BYTES)).toString("utf8");
	} finally {
		await file.close();
	}
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error(`Malformed JSON in secrets plan file: ${pathname}`, { cause: err });
	}
	if (!isSecretsApplyPlan(parsed)) throw new Error(`Invalid secrets plan file: ${pathname}. Generate a fresh plan with ${formatCliCommand("openclaw secrets configure --plan-out <path>")}.`);
	return parsed;
}
function registerSecretsCli(program) {
	const secrets = program.command("secrets").description("Secrets runtime controls").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/gateway/security", "docs.openclaw.ai/gateway/security")}\n`);
	addGatewayClientOptions(secrets.command("reload").description("Re-resolve secret references and atomically swap runtime snapshot").option("--json", "Output JSON", false)).action(async (opts) => {
		try {
			const result = await callGatewayFromCli("secrets.reload", opts, void 0, { expectFinal: false });
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			const warningCount = Number(result?.warningCount ?? 0);
			if (Number.isFinite(warningCount) && warningCount > 0) {
				defaultRuntime.log(`Secrets reloaded with ${warningCount} warning(s).`);
				return;
			}
			defaultRuntime.log("Secrets reloaded.");
		} catch (err) {
			defaultRuntime.error(danger(formatGatewayCommandFailure({
				action: "reload secrets",
				error: err,
				inspectCommand: "openclaw gateway status --deep"
			})));
			defaultRuntime.exit(1);
		}
	});
	secrets.command("audit").description("Audit plaintext secrets, unresolved refs, and precedence drift").option("--check", "Exit non-zero when findings are present", false).option("--allow-exec", "Allow exec SecretRef resolution during audit (may execute provider commands)", false).option("--json", "Output JSON", false).action(async (opts) => {
		try {
			const { resolveSecretsAuditExitCode, runSecretsAudit } = await import("./audit-Cf9pcqB7.js");
			const report = await runSecretsAudit({ allowExec: Boolean(opts.allowExec) });
			if (opts.json) defaultRuntime.writeJson(report);
			else {
				defaultRuntime.log(`Secrets audit: ${report.status}. plaintext=${report.summary.plaintextCount}, unresolved=${report.summary.unresolvedRefCount}, shadowed=${report.summary.shadowedRefCount}, legacy=${report.summary.legacyResidueCount}.`);
				if (report.findings.length > 0) {
					for (const finding of report.findings.slice(0, 20)) defaultRuntime.log(`- [${finding.code}] ${finding.file}:${finding.jsonPath} ${finding.message}`);
					if (report.findings.length > 20) defaultRuntime.log(`... ${report.findings.length - 20} more finding(s).`);
				}
				if (report.resolution.skippedExecRefs > 0) defaultRuntime.log(`Audit note: skipped ${report.resolution.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during audit.`);
			}
			const exitCode = resolveSecretsAuditExitCode(report, Boolean(opts.check));
			if (exitCode !== 0) defaultRuntime.exit(exitCode);
		} catch (err) {
			defaultRuntime.error(danger(`Secrets audit failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw doctor")} to inspect config and credential state.`));
			defaultRuntime.exit(2);
		}
	});
	secrets.command("configure").description("Interactive secrets helper (provider setup + SecretRef mapping + preflight)").option("--apply", "Apply changes immediately after preflight", false).option("--yes", "Skip apply confirmation prompt", false).option("--providers-only", "Configure secrets.providers only, skip credential mapping", false).option("--skip-provider-setup", "Skip provider setup and only map credential fields to existing providers", false).option("--agent <id>", "Agent id for auth-profiles targets (default: configured default agent)").option("--allow-exec", "Allow exec SecretRef preflight checks (may execute provider commands)", false).option("--plan-out <path>", "Write generated plan JSON to a file (max 16 MiB)").option("--json", "Output JSON", false).action(async (opts) => {
		try {
			const { runSecretsConfigureInteractive } = await import("./configure-DLXYpXvA.js");
			const configured = await runSecretsConfigureInteractive({
				providersOnly: Boolean(opts.providersOnly),
				skipProviderSetup: Boolean(opts.skipProviderSetup),
				agentId: typeof opts.agent === "string" ? opts.agent : void 0,
				allowExecInPreflight: Boolean(opts.allowExec)
			});
			if (opts.planOut) {
				const { writeFileSync } = await fsModuleLoader.load();
				writeFileSync(opts.planOut, serializePlanFile(configured.plan, opts.planOut), "utf8");
			}
			let shouldApply = Boolean(opts.apply || opts.yes);
			if (opts.json) {
				if (!shouldApply) defaultRuntime.writeJson({
					plan: configured.plan,
					preflight: configured.preflight
				});
			} else {
				defaultRuntime.log(`Preflight: changed=${configured.preflight.changed}, files=${configured.preflight.changedFiles.length}, warnings=${configured.preflight.warningCount}.`);
				if (configured.preflight.warningCount > 0) for (const warning of configured.preflight.warnings) defaultRuntime.log(`- warning: ${warning}`);
				if (!configured.preflight.checks.resolvabilityComplete && configured.preflight.skippedExecRefs > 0) defaultRuntime.log(`Preflight note: skipped ${configured.preflight.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during preflight.`);
				const providerUpserts = Object.keys(configured.plan.providerUpserts ?? {}).length;
				const providerDeletes = configured.plan.providerDeletes?.length ?? 0;
				defaultRuntime.log(`Plan: targets=${configured.plan.targets.length}, providerUpserts=${providerUpserts}, providerDeletes=${providerDeletes}.`);
				if (opts.planOut) defaultRuntime.log(`Plan written to ${opts.planOut}`);
			}
			if (!shouldApply && !opts.json) {
				const { confirm } = await clackPromptsLoader.load();
				const approved = await confirm({
					message: "Apply this plan now?",
					initialValue: true
				});
				if (typeof approved === "boolean") shouldApply = approved;
			}
			if (shouldApply) {
				if (shouldApply && !opts.yes && !opts.json) {
					const { confirm } = await clackPromptsLoader.load();
					if (await confirm({
						message: "This migration is one-way for migrated plaintext values. Continue with apply?",
						initialValue: true
					}) !== true) {
						defaultRuntime.log("Apply cancelled.");
						return;
					}
				}
				const { runSecretsApply } = await secretsApplyLoader.load();
				const result = await runSecretsApply({
					plan: configured.plan,
					write: true,
					allowExec: Boolean(opts.allowExec)
				});
				if (opts.json) {
					defaultRuntime.writeJson(result);
					return;
				}
				defaultRuntime.log(result.changed ? `Secrets applied. Updated ${result.changedFiles.length} file(s).` : "Secrets apply: no changes.");
			}
		} catch (err) {
			defaultRuntime.error(danger(`Secrets configure failed: ${formatErrorMessage(err)}. Re-run ${formatCliCommand("openclaw secrets audit")} before applying changes.`));
			defaultRuntime.exit(1);
		}
	});
	secrets.command("apply").description("Apply a previously generated secrets plan").requiredOption("--from <path>", "Path to plan JSON (max 16 MiB)").option("--dry-run", "Validate/preflight only", false).option("--allow-exec", "Allow exec SecretRef checks (may execute provider commands)", false).option("--json", "Output JSON", false).action(async (opts) => {
		try {
			const [{ runSecretsApply }, plan] = await Promise.all([secretsApplyLoader.load(), readPlanFile(opts.from)]);
			const result = await runSecretsApply({
				plan,
				write: !opts.dryRun,
				allowExec: Boolean(opts.allowExec)
			});
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			if (opts.dryRun) {
				defaultRuntime.log(result.changed ? `Secrets apply dry run: ${result.changedFiles.length} file(s) would change.` : "Secrets apply dry run: no changes.");
				if (!result.checks.resolvabilityComplete && result.skippedExecRefs > 0) defaultRuntime.log(`Secrets apply dry-run note: skipped ${result.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during dry-run.`);
				return;
			}
			defaultRuntime.log(result.changed ? `Secrets applied. Updated ${result.changedFiles.length} file(s).` : "Secrets apply: no changes.");
		} catch (err) {
			const message = err instanceof SecretsPlanFileNotFoundError ? err.message : formatErrorMessage(err);
			defaultRuntime.error(danger(`Secrets apply failed: ${message}. Re-run ${formatCliCommand("openclaw secrets apply --from <path> --dry-run")} to inspect the plan without writing.`));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerSecretsCli };
