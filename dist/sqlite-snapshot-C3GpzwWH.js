import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import { X as readSqliteUserVersion } from "./openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite } from "./sqlite-transaction-DCHi8Wi-.js";
import { s as assertSqliteIntegrity } from "./sqlite-wal-jkTlXxi6.js";
import "./fs-safe-advanced-B0eXpnA9.js";
import { n as runExec } from "./exec-Cb0CNQNz.js";
import { t as resolveSystemBin } from "./resolve-system-bin-SYIpvbl7.js";
import { i as loadSqliteVecExtension } from "./engine-storage-BXrWdYvs.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/infra/sqlite-snapshot.ts
const SQLITE_DIRECTORY_MODE = 448;
const WINDOWS_DIRECTORY_EXISTS_MARKER = "OPENCLAW_SQLITE_DIRECTORY_EXISTS";
const WINDOWS_PRIVATE_DIRECTORY_NATIVE_SOURCE = `
using System;
using System.Runtime.InteropServices;

public static class OpenClawPrivateDirectory
{
    [StructLayout(LayoutKind.Sequential)]
    private struct SecurityAttributes
    {
        public int Length;
        public IntPtr SecurityDescriptor;
        public int InheritHandle;
    }

    [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool ConvertStringSecurityDescriptorToSecurityDescriptorW(
        string securityDescriptor,
        uint revision,
        out IntPtr convertedSecurityDescriptor,
        out uint convertedSecurityDescriptorSize);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CreateDirectoryW(
        string path,
        ref SecurityAttributes securityAttributes);

    [DllImport("kernel32.dll")]
    private static extern IntPtr LocalFree(IntPtr memory);

    public static int Create(string path, string securityDescriptor)
    {
        IntPtr descriptor;
        uint descriptorSize;
        if (!ConvertStringSecurityDescriptorToSecurityDescriptorW(
                securityDescriptor,
                1,
                out descriptor,
                out descriptorSize))
        {
            return Marshal.GetLastWin32Error();
        }

        try
        {
            var attributes = new SecurityAttributes
            {
                Length = Marshal.SizeOf(typeof(SecurityAttributes)),
                SecurityDescriptor = descriptor,
                InheritHandle = 0,
            };
            return CreateDirectoryW(path, ref attributes) ? 0 : Marshal.GetLastWin32Error();
        }
        finally
        {
            LocalFree(descriptor);
        }
    }
}
`;
async function createPrivateSqliteDirectory(directoryPath) {
	if (process.platform !== "win32") {
		await fs$1.mkdir(directoryPath, { mode: SQLITE_DIRECTORY_MODE });
		return;
	}
	const encodedPath = Buffer.from(directoryPath, "utf8").toString("base64");
	const encodedNativeSource = Buffer.from(WINDOWS_PRIVATE_DIRECTORY_NATIVE_SOURCE, "utf8").toString("base64");
	const command = [
		"$ErrorActionPreference = 'Stop'",
		`$path = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedPath}'))`,
		`$nativeSource = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedNativeSource}'))`,
		"Add-Type -TypeDefinition $nativeSource -Language CSharp",
		"$current = [System.Security.Principal.WindowsIdentity]::GetCurrent().User",
		"$security = New-Object System.Security.AccessControl.DirectorySecurity",
		"$security.SetAccessRuleProtection($true, $false)",
		"$security.SetOwner($current)",
		"$inheritance = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit",
		"$propagation = [System.Security.AccessControl.PropagationFlags]::None",
		"foreach ($sidValue in @($current.Value, 'S-1-5-18', 'S-1-5-32-544')) { $sid = New-Object System.Security.Principal.SecurityIdentifier($sidValue); $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, $inheritance, $propagation, [System.Security.AccessControl.AccessControlType]::Allow); [void]$security.AddAccessRule($rule) }",
		"$sections = [System.Security.AccessControl.AccessControlSections]::Owner -bor [System.Security.AccessControl.AccessControlSections]::Access",
		"$sddl = $security.GetSecurityDescriptorSddlForm($sections)",
		"$errorCode = [OpenClawPrivateDirectory]::Create($path, $sddl)",
		`if ($errorCode -eq 80 -or $errorCode -eq 183) { throw '${WINDOWS_DIRECTORY_EXISTS_MARKER}' }`,
		"if ($errorCode -ne 0) { $exception = New-Object System.ComponentModel.Win32Exception($errorCode); throw $exception }"
	].join("; ");
	const powershell = resolveSystemBin("powershell");
	if (!powershell) throw new Error("Unable to resolve PowerShell for private Windows SQLite staging.");
	const encodedCommand = Buffer.from(command, "utf16le").toString("base64");
	try {
		await runExec(powershell, [
			"-NoLogo",
			"-NoProfile",
			"-NonInteractive",
			"-EncodedCommand",
			encodedCommand
		], {
			timeoutMs: 1e4,
			maxBuffer: 64 * 1024
		});
	} catch (error) {
		if (String(error).includes(WINDOWS_DIRECTORY_EXISTS_MARKER)) {
			const existsError = /* @__PURE__ */ new Error(`Private SQLite directory already exists: ${directoryPath}`);
			existsError.code = "EEXIST";
			throw existsError;
		}
		throw new Error(`Unable to create private Windows SQLite directory: ${directoryPath}`, { cause: error });
	}
}
async function createPrivateSqliteTempDirectory(rootPath, prefix) {
	if (process.platform !== "win32") return await fs$1.mkdtemp(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	await createPrivateSqliteDirectory(directoryPath);
	return directoryPath;
}
async function assertRegularSourceFile(sourcePath) {
	if (!(await fs$1.lstat(sourcePath)).isFile()) throw new Error(`SQLite snapshot source must be a regular file: ${sourcePath}`);
}
async function assertTargetAbsent(targetPath) {
	try {
		await fs$1.lstat(targetPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw new Error(`SQLite snapshot target already exists: ${targetPath}`);
}
async function copyFileExclusive(source, targetPath) {
	const sourceFingerprint = await readMutationFingerprint(source);
	let target;
	let targetIdentity;
	try {
		target = await fs$1.open(targetPath, "wx+", 384);
		targetIdentity = await target.stat();
		const buffer = Buffer.allocUnsafe(1024 * 1024);
		const hash = createHash("sha256");
		let offset = 0;
		while (true) {
			const { bytesRead } = await source.read(buffer, 0, buffer.length, offset);
			if (bytesRead === 0) break;
			hash.update(buffer.subarray(0, bytesRead));
			let bytesWritten = 0;
			while (bytesWritten < bytesRead) {
				const result = await target.write(buffer, bytesWritten, bytesRead - bytesWritten, offset + bytesWritten);
				if (result.bytesWritten === 0) throw new Error(`SQLite snapshot copy made no progress: ${targetPath}`);
				bytesWritten += result.bytesWritten;
			}
			offset += bytesRead;
		}
		await assertMutationFingerprintUnchanged(source, sourceFingerprint, targetPath);
		await target.sync();
		const currentIdentity = await fs$1.lstat(targetPath);
		if (!sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`SQLite snapshot target changed during publication: ${targetPath}`);
		return {
			content: {
				sha256: hash.digest("hex"),
				sizeBytes: offset
			},
			identity: currentIdentity
		};
	} catch (error) {
		if (targetIdentity) {
			await target?.close().catch(() => void 0);
			target = void 0;
			removePublishedTargetIfOwned(targetPath, targetIdentity);
		}
		throw error;
	} finally {
		await target?.close().catch(() => void 0);
	}
}
async function readMutationFingerprint(handle) {
	const stat = await handle.stat({ bigint: true });
	return {
		birthtimeNs: stat.birthtimeNs,
		ctimeNs: stat.ctimeNs,
		dev: stat.dev,
		ino: stat.ino,
		mtimeNs: stat.mtimeNs,
		size: stat.size
	};
}
async function assertMutationFingerprintUnchanged(handle, expected, filePath) {
	const current = await readMutationFingerprint(handle);
	if (current.birthtimeNs !== expected.birthtimeNs || current.ctimeNs !== expected.ctimeNs || current.dev !== expected.dev || current.ino !== expected.ino || current.mtimeNs !== expected.mtimeNs || current.size !== expected.size) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
}
function sameMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
async function syncFile(filePath) {
	const handle = await fs$1.open(filePath, "r+");
	try {
		await handle.sync();
	} finally {
		await handle.close();
	}
}
async function assertOpenFileIdentity(handle, filePath, expectedIdentity) {
	const openedIdentity = await handle.stat();
	const currentIdentity = await fs$1.lstat(filePath);
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
async function hashPublishedFile(filePath, expectedIdentity) {
	const handle = await fs$1.open(filePath, "r");
	try {
		return await hashOpenPublishedFile(handle, filePath, expectedIdentity);
	} finally {
		await handle.close();
	}
}
async function hashOpenPublishedFile(handle, filePath, expectedIdentity) {
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	const fingerprint = await readMutationFingerprint(handle);
	const buffer = Buffer.allocUnsafe(1024 * 1024);
	const hash = createHash("sha256");
	let offset = 0;
	while (true) {
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, offset);
		if (bytesRead === 0) break;
		hash.update(buffer.subarray(0, bytesRead));
		offset += bytesRead;
	}
	await assertMutationFingerprintUnchanged(handle, fingerprint, filePath);
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	return {
		sha256: hash.digest("hex"),
		sizeBytes: offset
	};
}
function assertPublishedFileIdentitySync(filePath, expectedIdentity) {
	const currentIdentity = fs.lstatSync(filePath);
	if (!currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, currentIdentity) || expectedIdentity.size !== currentIdentity.size || expectedIdentity.mtimeMs !== currentIdentity.mtimeMs || expectedIdentity.ctimeMs !== currentIdentity.ctimeMs || expectedIdentity.birthtimeMs !== currentIdentity.birthtimeMs) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
	const openedIdentity = fs.fstatSync(fileDescriptor);
	const currentIdentity = fs.lstatSync(filePath);
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
	const fileDescriptor = fs.openSync(filePath, "r");
	try {
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const initialFingerprint = {
			birthtimeNs: initialStat.birthtimeNs,
			ctimeNs: initialStat.ctimeNs,
			dev: initialStat.dev,
			ino: initialStat.ino,
			mtimeNs: initialStat.mtimeNs,
			size: initialStat.size
		};
		const hash = createHash("sha256");
		const buffer = Buffer.allocUnsafe(1024 * 1024);
		let offset = 0;
		while (true) {
			const bytesRead = fs.readSync(fileDescriptor, buffer, 0, buffer.length, offset);
			if (bytesRead === 0) break;
			hash.update(buffer.subarray(0, bytesRead));
			offset += bytesRead;
		}
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		if (!sameMutationFingerprint(initialFingerprint, {
			birthtimeNs: finalStat.birthtimeNs,
			ctimeNs: finalStat.ctimeNs,
			dev: finalStat.dev,
			ino: finalStat.ino,
			mtimeNs: finalStat.mtimeNs,
			size: finalStat.size
		})) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return {
			sha256: hash.digest("hex"),
			sizeBytes: offset
		};
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function removePublishedTargetIfOwned(filePath, expectedIdentity, requireFingerprint = false) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(filePath);
	} catch {
		return false;
	}
	const fingerprintMatches = !requireFingerprint || expectedIdentity.size === currentIdentity.size && expectedIdentity.mtimeMs === currentIdentity.mtimeMs && expectedIdentity.ctimeMs === currentIdentity.ctimeMs && expectedIdentity.birthtimeMs === currentIdentity.birthtimeMs;
	if (!sameFileIdentity(expectedIdentity, currentIdentity) || !fingerprintMatches) return false;
	try {
		fs.unlinkSync(filePath);
		return true;
	} catch {
		return false;
	}
}
function assertSynchronousCallbackResult(result, label) {
	if (result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function") {
		Promise.resolve(result).catch(() => void 0);
		throw new Error(`${label} must be synchronous.`);
	}
}
function isUnsupportedDirectorySyncError(error) {
	const code = error.code;
	return code === "EINVAL" || code === "ENOTSUP" || code === "ENOSYS" || process.platform === "win32" && (code === "EISDIR" || code === "EPERM" || code === "EACCES");
}
async function syncDirectoryBestEffort(directoryPath) {
	const handle = await fs$1.open(directoryPath, "r").catch((error) => {
		if (isUnsupportedDirectorySyncError(error)) return;
		throw error;
	});
	if (!handle) return;
	try {
		await handle.sync();
	} catch (error) {
		if (!isUnsupportedDirectorySyncError(error)) throw error;
	} finally {
		await handle.close();
	}
}
function isLinkFallbackError(error) {
	const code = error.code;
	return code === "EPERM" || code === "EXDEV" || code === "ENOTSUP" || code === "EOPNOTSUPP" || code === "ENOSYS";
}
/**
* Publish the exact bytes of one already-verified SQLite file without reopening
* its pathname during the copy. The target is always created exclusively.
*/
async function publishVerifiedSqliteFile(options) {
	await assertTargetAbsent(options.targetPath);
	const targetDirectory = path.dirname(options.targetPath);
	const stagingDir = await createPrivateSqliteTempDirectory(targetDirectory, `.sqlite-publish-${randomUUID()}-`);
	const stagedPath = path.join(stagingDir, "database.sqlite");
	let stagingIdentity;
	let source;
	let target;
	let targetPinFileDescriptor;
	let verifiedStagedIdentity;
	let linkedCandidateIdentity;
	let publishedIdentity;
	let ownershipPinned = false;
	let hardLinkCreated = false;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir);
		await fs$1.chmod(stagingDir, 448);
		source = await fs$1.open(options.sourcePath, "r");
		await assertOpenFileIdentity(source, options.sourcePath, options.sourceIdentity);
		const staged = await copyFileExclusive(source, stagedPath);
		verifiedStagedIdentity = staged.identity;
		const expectedContent = options.expectedContent;
		assertExpectedContent(staged.content, expectedContent, options.targetPath);
		await source.close();
		source = void 0;
		await options.validatePublished?.(stagedPath);
		assertExpectedContent(await hashPublishedFile(stagedPath, staged.identity), expectedContent, options.targetPath);
		await options.beforePublish?.();
		await assertTargetAbsent(options.targetPath);
		let usedHardLink = false;
		try {
			await fs$1.link(stagedPath, options.targetPath);
			usedHardLink = true;
			hardLinkCreated = true;
		} catch (error) {
			if (!isLinkFallbackError(error)) throw error;
			if (options.requireAtomicPublication) throw new Error(`Atomic SQLite publication requires hard-link support in ${targetDirectory}.`, { cause: error });
			const stagedSource = await fs$1.open(stagedPath, "r");
			try {
				const copied = await copyFileExclusive(stagedSource, options.targetPath);
				publishedIdentity = copied.identity;
				assertExpectedContent(copied.content, expectedContent, options.targetPath);
			} finally {
				await stagedSource.close();
			}
		}
		if (usedHardLink) {
			target = await fs$1.open(options.targetPath, "r");
			const linkedIdentity = await target.stat();
			linkedCandidateIdentity = linkedIdentity;
			const currentTargetIdentity = await fs$1.lstat(options.targetPath);
			const currentStagedIdentity = await fs$1.lstat(stagedPath);
			if (!sameFileIdentity(linkedIdentity, currentTargetIdentity)) throw new Error(`SQLite snapshot target changed during publication: ${options.targetPath}`);
			const matchesVerifiedStaging = sameFileIdentity(staged.identity, linkedIdentity);
			const matchesCurrentStaging = sameFileIdentity(currentStagedIdentity, linkedIdentity);
			if (matchesVerifiedStaging || matchesCurrentStaging) {
				publishedIdentity = linkedIdentity;
				ownershipPinned = true;
			}
			if (!matchesCurrentStaging) throw new Error(`SQLite snapshot staging path changed after publication: ${stagedPath}`);
			if (!matchesVerifiedStaging) throw new Error(`SQLite snapshot staging file changed during publication: ${options.targetPath}`);
		}
		if (!publishedIdentity) throw new Error(`SQLite snapshot target was not published: ${options.targetPath}`);
		const initialPublishedIdentity = publishedIdentity;
		target ??= await fs$1.open(options.targetPath, "r");
		await assertOpenFileIdentity(target, options.targetPath, initialPublishedIdentity);
		ownershipPinned = true;
		await syncDirectoryBestEffort(targetDirectory);
		await fs$1.unlink(stagedPath);
		const expectedIdentity = await target.stat();
		publishedIdentity = expectedIdentity;
		await fs$1.rmdir(stagingDir);
		await syncDirectoryBestEffort(targetDirectory);
		assertExpectedContent(await hashOpenPublishedFile(target, options.targetPath, expectedIdentity), expectedContent, options.targetPath);
		await target.close();
		target = void 0;
		ownershipPinned = false;
		targetPinFileDescriptor = fs.openSync(options.targetPath, "r");
		assertOpenFileIdentitySync(targetPinFileDescriptor, options.targetPath, expectedIdentity);
		ownershipPinned = true;
		const guard = {
			assertTargetMatchesExpectedContent: (finalCheck) => {
				assertExpectedContent(hashPublishedFileSync(options.targetPath, expectedIdentity), expectedContent, options.targetPath);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
			},
			assertTargetUnchanged: (finalCheck) => {
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
			}
		};
		if (options.afterPublish) assertSynchronousCallbackResult(options.afterPublish(guard), "SQLite after-publication guard");
		else guard.assertTargetUnchanged();
		fs.closeSync(targetPinFileDescriptor);
		targetPinFileDescriptor = void 0;
		ownershipPinned = false;
	} catch (error) {
		if (!publishedIdentity && hardLinkCreated && verifiedStagedIdentity) {
			const currentTargetIdentity = await fs$1.lstat(options.targetPath).catch(() => void 0);
			const currentStagedIdentity = await fs$1.lstat(stagedPath).catch(() => void 0);
			const targetMatchesStaging = currentTargetIdentity && currentStagedIdentity && sameFileIdentity(currentTargetIdentity, currentStagedIdentity);
			const targetMatchesVerified = currentTargetIdentity && sameFileIdentity(currentTargetIdentity, verifiedStagedIdentity);
			if (targetMatchesStaging || targetMatchesVerified) {
				publishedIdentity = currentTargetIdentity;
				ownershipPinned = Boolean(targetMatchesStaging);
			}
		}
		if (!publishedIdentity && target && linkedCandidateIdentity && verifiedStagedIdentity) {
			const currentTargetIdentity = await fs$1.lstat(options.targetPath).catch(() => void 0);
			const currentStagedIdentity = await fs$1.lstat(stagedPath).catch(() => void 0);
			const targetStillMatches = currentTargetIdentity && sameFileIdentity(currentTargetIdentity, linkedCandidateIdentity);
			const targetCameFromStaging = currentStagedIdentity && sameFileIdentity(currentStagedIdentity, linkedCandidateIdentity) || sameFileIdentity(verifiedStagedIdentity, linkedCandidateIdentity);
			if (targetStillMatches && targetCameFromStaging) {
				publishedIdentity = linkedCandidateIdentity;
				ownershipPinned = true;
			}
		}
		if (target && publishedIdentity) {
			const openedIdentity = await target.stat().catch(() => void 0);
			if (openedIdentity && sameFileIdentity(openedIdentity, publishedIdentity)) {
				publishedIdentity = openedIdentity;
				ownershipPinned = true;
			}
		}
		if (publishedIdentity) {
			if (removePublishedTargetIfOwned(options.targetPath, publishedIdentity, !ownershipPinned)) await syncDirectoryBestEffort(targetDirectory).catch(() => void 0);
		}
		if (stagingIdentity) await removePublicationStagingDirectory(stagingDir, stagingIdentity).catch(() => void 0);
		else await fs$1.rmdir(stagingDir).catch(() => void 0);
		throw error;
	} finally {
		if (targetPinFileDescriptor !== void 0) fs.closeSync(targetPinFileDescriptor);
		if (target) await target.close().catch(() => void 0);
		if (source) await source.close().catch(() => void 0);
	}
}
async function removePublicationStagingDirectory(stagingDir, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(stagingDir).catch(() => void 0);
	if (!currentIdentity) return;
	if (!currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite publication staging directory changed: ${stagingDir}`);
	const entries = await fs$1.readdir(stagingDir, { withFileTypes: true });
	if (entries.length > 1 || entries.some((entry) => entry.name !== "database.sqlite" || !entry.isFile())) throw new Error(`SQLite publication staging directory has unexpected contents: ${stagingDir}`);
	const stagedEntry = entries[0];
	if (stagedEntry) await fs$1.unlink(path.join(stagingDir, stagedEntry.name));
	await fs$1.rmdir(stagingDir);
}
/**
* Compact one SQLite database into a fresh private file and verify the result.
*
* The source and output both receive full structural, index, and foreign-key
* checks. Only a fully verified, synced snapshot is published to the target.
*/
async function createVerifiedSqliteSnapshot(options) {
	await assertRegularSourceFile(options.sourcePath);
	await assertTargetAbsent(options.targetPath);
	const stagingDir = await createPrivateSqliteTempDirectory(path.dirname(options.targetPath), ".sqlite-snapshot-");
	await fs$1.chmod(stagingDir, 448);
	const stagedPath = path.join(stagingDir, "database.sqlite");
	const sqlite = requireNodeSqlite();
	let stagedIdentity;
	try {
		const source = new sqlite.DatabaseSync(options.sourcePath, {
			allowExtension: true,
			readOnly: true
		});
		try {
			source.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
			await loadSqliteVecExtension({ db: source });
			assertSqliteIntegrity(source, options.sourcePath);
			options.validate?.(source, options.sourcePath);
			source.prepare("VACUUM INTO ?").run(stagedPath);
		} finally {
			source.close();
		}
		await fs$1.chmod(stagedPath, 384);
		const snapshot = new sqlite.DatabaseSync(stagedPath, { allowExtension: true });
		try {
			snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
			await loadSqliteVecExtension({ db: snapshot });
			if (options.transform) {
				await options.transform(snapshot);
				snapshot.exec("VACUUM;");
			}
			assertSqliteIntegrity(snapshot, options.targetPath);
			options.validate?.(snapshot, options.targetPath);
			const userVersion = readSqliteUserVersion(snapshot);
			snapshot.close();
			await syncFile(stagedPath);
			stagedIdentity = await fs$1.lstat(stagedPath);
			const expectedContent = await hashPublishedFile(stagedPath, stagedIdentity);
			await publishVerifiedSqliteFile({
				sourceIdentity: stagedIdentity,
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedContent,
				beforePublish: options.beforePublish,
				afterPublish: options.afterPublish,
				validatePublished: async (publishedPath) => {
					const published = new sqlite.DatabaseSync(publishedPath, {
						allowExtension: true,
						readOnly: true
					});
					try {
						published.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
						await loadSqliteVecExtension({ db: published });
						assertSqliteIntegrity(published, options.targetPath);
						options.validate?.(published, options.targetPath);
						const publishedUserVersion = readSqliteUserVersion(published);
						if (publishedUserVersion !== userVersion) throw new Error(`SQLite snapshot user_version changed during publication: expected ${userVersion}, got ${publishedUserVersion}`);
					} finally {
						published.close();
					}
				}
			});
			return {
				path: options.targetPath,
				userVersion
			};
		} finally {
			if (snapshot.isOpen) snapshot.close();
		}
	} catch (error) {
		throw new Error(`SQLite database cannot be snapshotted safely: ${options.sourcePath}. ${formatErrorMessage(error)}`, { cause: error });
	} finally {
		await fs$1.rm(stagingDir, {
			force: true,
			recursive: true
		}).catch(() => void 0);
	}
}
//#endregion
export { syncDirectoryBestEffort as a, publishVerifiedSqliteFile as i, createPrivateSqliteTempDirectory as n, createVerifiedSqliteSnapshot as r, createPrivateSqliteDirectory as t };
