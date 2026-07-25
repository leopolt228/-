import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { a as stripAnsiSequences } from "./ansi-BEaQ2G9r.js";
import "./errors-DdbcjW1Y.js";
//#region src/gateway/terminal/buffer-text.ts
const C0_EXCEPT_TAB_CR_LF = `${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}`;
const C1 = `${String.fromCharCode(128)}-${String.fromCharCode(159)}`;
const CONTROL_BYTES_REGEX = new RegExp(`[${C0_EXCEPT_TAB_CR_LF}${C1}]`, "g");
/**
* Approximates what a terminal would show without running a VT emulator:
* strips ANSI sequences, collapses carriage-return overwrites (progress bars
* emit "10%\r20%\r30%" — keep the last write per line), and drops remaining
* C0/C1 control bytes. Cursor-movement layouts (vim, htop) will not reconstruct
* faithfully; a true screen snapshot is a tracked follow-up.
*/
function renderTerminalBufferText(raw) {
	return stripAnsiSequences(raw).split("\n").map((line) => {
		const segments = line.split("\r");
		const last = segments[segments.length - 1];
		return ((last === "" && segments.length > 1 ? segments[segments.length - 2] : last) ?? "").replace(CONTROL_BYTES_REGEX, "");
	}).join("\n");
}
//#endregion
//#region src/gateway/terminal/open-deadline.ts
const TERMINAL_OPEN_DEADLINE_MS = 3e4;
var TerminalOpenDeadlineError = class extends Error {
	constructor() {
		super("terminal open timed out");
		this.name = "TerminalOpenDeadlineError";
	}
};
function createTerminalOpenDeadline() {
	return {
		expiresAtMs: Date.now() + TERMINAL_OPEN_DEADLINE_MS,
		controller: new AbortController()
	};
}
function expireTerminalOpenDeadline(deadline) {
	if (!deadline.controller.signal.aborted) deadline.controller.abort(new TerminalOpenDeadlineError());
	return toErrorObject(deadline.controller.signal.reason, "Terminal open timed out");
}
async function waitForTerminalOpenDeadline(run, deadline) {
	if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) throw expireTerminalOpenDeadline(deadline);
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			reject(expireTerminalOpenDeadline(deadline));
		};
		const timer = setTimeout(() => expireTerminalOpenDeadline(deadline), Math.max(0, deadline.expiresAtMs - Date.now()));
		deadline.controller.signal.addEventListener("abort", onAbort, { once: true });
		let promise;
		try {
			promise = run();
		} catch (error) {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
			return;
		}
		promise.then((value) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
		});
	});
}
//#endregion
export { renderTerminalBufferText as a, waitForTerminalOpenDeadline as i, TerminalOpenDeadlineError as n, createTerminalOpenDeadline as r, TERMINAL_OPEN_DEADLINE_MS as t };
