import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DrOMjuGn.js";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-DqOAriJT.js";
import "./extension-shared-C29nk9eH.js";
import "./provider-http-D2uO-AEP.js";
import "./state-paths-C3W_AJaz.js";
import { y as utf8ToBytes } from "./hkdf-BqBZYZig.js";
import { pt as signDeviceRequest, r as resolveLegacyReefStateDir, ut as fingerprint, yt as sha256Hex } from "./doctor-state-paths-CtfjWtNM.js";
import { r as normalizeReefTarget } from "./config-schema-BRIUFz6J.js";
import fs from "node:fs/promises";
import os from "node:os";
import WebSocket$1 from "ws";
//#region extensions/reef/src/transport.ts
const REEF_RELAY_JSON_MAX_BYTES = 16 * 1024 * 1024;
const REEF_RELAY_ERROR_JSON_MAX_BYTES = 64 * 1024;
const REEF_RELAY_WEBSOCKET_MAX_PAYLOAD_BYTES = 64 * 1024;
const REEF_INBOX_LIVE_BUFFER_MAX_ENTRIES = 256;
const REEF_WS_HANDSHAKE_MS = 3e4;
const REEF_RELAY_REQUEST_TIMEOUT_MS = 15e3;
var ReefRelayError = class extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = "ReefRelayError";
	}
};
var ReefRelayUnavailableError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.name = "ReefRelayUnavailableError";
	}
};
function isDefinitiveReefRegistrationFailure(error) {
	return error instanceof ReefRelayError && error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429;
}
function isRetryableReefRelayFailure(error) {
	if (error instanceof ReefRelayError) return error.status === 408 || error.status === 429 || error.status >= 500;
	return error instanceof ReefRelayUnavailableError || error instanceof Error && error.name === "TimeoutError";
}
function isReefOwnershipRejection(error) {
	return error instanceof ReefRelayError && error.message === "unknown_handle";
}
async function readReefRelaySuccessJson(response, signal) {
	try {
		return await readProviderJsonResponse(response, "reef.relay", { maxBytes: REEF_RELAY_JSON_MAX_BYTES });
	} catch (error) {
		if (signal?.aborted) throw signal.reason;
		if (error instanceof TypeError) throw new ReefRelayUnavailableError(error);
		throw error;
	}
}
var ReefTransportClient = class {
	constructor(relayUrl, handle, keys, fetcher = fetch, clock = () => Math.floor(Date.now() / 1e3), requestTimeoutMs = REEF_RELAY_REQUEST_TIMEOUT_MS) {
		this.relayUrl = relayUrl;
		this.handle = handle;
		this.keys = keys;
		this.fetcher = fetcher;
		this.clock = clock;
		this.requestTimeoutMs = requestTimeoutMs;
		this.lastTs = 0;
	}
	async authStart(email) {
		return await this.unsigned("POST", "/v1/auth/start", { email });
	}
	async authComplete(token) {
		return await this.unsigned("POST", "/v1/auth/complete", { token });
	}
	async createHandle(session, requestPolicy) {
		return await this.unsigned("POST", "/v1/handles", {
			handle: this.handle,
			ed25519_pub: this.keys.signing.publicKey,
			x25519_pub: this.keys.encryption.publicKey,
			request_policy: requestPolicy
		}, { authorization: `Bearer ${session}` });
	}
	listOwnHandles(session) {
		return this.unsigned("GET", "/v1/handles", void 0, { authorization: `Bearer ${session}` });
	}
	mintFriendCode() {
		return this.signed("POST", "/v1/friend-codes");
	}
	requestFriend(to, code) {
		return this.signed("POST", "/v1/friends/request", code ? {
			to,
			code
		} : { to });
	}
	respondFriend(friend, accept) {
		return this.signed("POST", "/v1/friends/respond", {
			peer: friend.peer,
			accept,
			expected_key_epoch: friend.key_epoch,
			expected_ed25519_pub: friend.ed25519_pub,
			expected_x25519_pub: friend.x25519_pub
		});
	}
	listFriends() {
		return this.signed("GET", "/v1/friends");
	}
	removeFriend(peer) {
		return this.signed("DELETE", `/v1/friends/${encodeURIComponent(peer)}`);
	}
	sendEnvelope(peer, envelope) {
		return this.signed("POST", `/v1/mail/${encodeURIComponent(peer)}`, envelope);
	}
	acknowledge(peer, id, receipt) {
		return this.signed("POST", `/v1/mail/${encodeURIComponent(peer)}/ack`, {
			id,
			receipt
		});
	}
	pull(after, signal) {
		return this.signed("GET", `/v1/mail?after=${after}`, void 0, signal);
	}
	websocketUrl() {
		const path = "/v1/mail/ws";
		const auth = this.auth(path, /* @__PURE__ */ new Uint8Array(), "GET");
		const url = new URL(path, this.relayUrl);
		url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
		url.searchParams.set("handle", this.handle);
		url.searchParams.set("ts", String(auth.ts));
		url.searchParams.set("sig", auth.signature);
		return url.toString();
	}
	async signed(method, path, body, signal) {
		const bytes = body === void 0 ? /* @__PURE__ */ new Uint8Array() : utf8ToBytes(JSON.stringify(body));
		const auth = this.auth(path, bytes, method);
		return await this.request(method, path, bytes, {
			"x-reef-handle": this.handle,
			"x-reef-ts": String(auth.ts),
			"x-reef-sig": auth.signature
		}, signal);
	}
	auth(path, bytes, method) {
		const ts = Math.max(this.clock(), this.lastTs + 1);
		this.lastTs = ts;
		return {
			ts,
			signature: signDeviceRequest({
				method: method.toUpperCase(),
				path,
				ts,
				bodySha256: sha256Hex(bytes)
			}, this.keys.signing.secretKey)
		};
	}
	async unsigned(method, path, body, headers = {}) {
		const bytes = body === void 0 ? /* @__PURE__ */ new Uint8Array() : utf8ToBytes(JSON.stringify(body));
		return await this.request(method, path, bytes, headers);
	}
	async request(method, path, bytes, headers, signal) {
		const url = new URL(path, this.relayUrl).toString();
		const timeout = buildTimeoutAbortSignal({
			timeoutMs: this.requestTimeoutMs,
			signal,
			operation: "reef.relay",
			url
		});
		try {
			let response;
			try {
				response = await this.fetcher(url, {
					method,
					headers: {
						...headers,
						...bytes.length ? { "content-type": "application/json" } : {}
					},
					...bytes.length ? { body: bytes } : {},
					signal: timeout.signal
				});
			} catch (error) {
				if (timeout.signal?.aborted) throw timeout.signal.reason;
				throw new ReefRelayUnavailableError(error);
			}
			if (!response.ok) {
				let message = `relay HTTP ${response.status}`;
				try {
					const parsed = await readProviderJsonResponse(response, "reef.relay.error", { maxBytes: REEF_RELAY_ERROR_JSON_MAX_BYTES });
					if (typeof parsed.error === "string" && parsed.error) message = parsed.error;
				} catch {
					if (timeout.signal?.aborted) throw timeout.signal.reason;
				}
				throw new ReefRelayError(response.status, message);
			}
			if (response.status === 204) return;
			return await readReefRelaySuccessJson(response, timeout.signal);
		} finally {
			timeout.cleanup();
		}
	}
};
function createReefWebSocket(url, options = {}) {
	return new WebSocket$1(url, {
		maxPayload: REEF_RELAY_WEBSOCKET_MAX_PAYLOAD_BYTES,
		handshakeTimeout: options.handshakeTimeoutMs ?? REEF_WS_HANDSHAKE_MS
	});
}
function abortableSleep(ms, signal) {
	return new Promise((resolve) => {
		if (signal?.aborted) {
			resolve();
			return;
		}
		const timer = setTimeout(done, ms);
		function done() {
			clearTimeout(timer);
			signal?.removeEventListener("abort", done);
			resolve();
		}
		signal?.addEventListener("abort", done, { once: true });
	});
}
var ReefInboxConnection = class {
	constructor(client, onEntries, webSocketFactory, options = {}) {
		this.client = client;
		this.onEntries = onEntries;
		this.webSocketFactory = webSocketFactory;
		this.options = options;
		this.processing = Promise.resolve();
		this.stopped = false;
		const initialCursor = options.initialCursor ?? 0;
		if (!Number.isSafeInteger(initialCursor) || initialCursor < 0) throw new Error("invalid Reef inbox cursor");
		this.cursor = initialCursor;
	}
	async start(signal) {
		let delay = 250;
		for (;;) {
			if (this.stopped || signal?.aborted) {
				await this.processing;
				return;
			}
			try {
				await this.live(signal, () => {
					delay = 250;
				});
			} catch (error) {
				this.options.onError?.(asError(error));
				await abortableSleep(delay, signal);
				delay = Math.min(delay * 2, 3e4);
			}
		}
	}
	stop() {
		this.stopped = true;
	}
	async drain(signal) {
		while (true) {
			signal?.throwIfAborted();
			const page = await this.client.pull(this.cursor, signal);
			signal?.throwIfAborted();
			if (!Number.isSafeInteger(page.cursor) || page.cursor < this.cursor) throw new Error("invalid Reef relay inbox cursor");
			const previous = this.cursor;
			await this.processEntries(page.entries, page.cursor, signal);
			if (!page.entries.length || this.cursor === previous) return;
		}
	}
	async processEntries(entries, cursor, signal) {
		let highestSequence = 0;
		for (const entry of entries) {
			if (!Number.isSafeInteger(entry.seq) || entry.seq < 1) throw new Error("invalid Reef relay inbox sequence");
			highestSequence = Math.max(highestSequence, entry.seq);
		}
		if (cursor !== void 0 && entries.length > 0 && cursor !== highestSequence) throw new Error("Reef relay inbox cursor does not match its entries");
		const fresh = entries.toSorted((left, right) => left.seq - right.seq);
		if (fresh.length === 0) {
			if (cursor !== void 0) this.advanceCursor(cursor);
			return;
		}
		for (const entry of fresh) {
			if (entry.seq <= this.cursor) continue;
			signal?.throwIfAborted();
			await this.onEntries([entry]);
			this.advanceCursor(entry.seq);
		}
	}
	advanceCursor(cursor) {
		if (cursor <= this.cursor) return;
		this.options.persistCursor?.(cursor);
		this.cursor = cursor;
	}
	serialize(task) {
		const scheduled = this.processing.then(task);
		this.processing = scheduled.catch(() => {});
		return scheduled;
	}
	live(signal, onReady) {
		return new Promise((resolve, reject) => {
			const socket = this.webSocketFactory(this.client.websocketUrl());
			const workAbort = new AbortController();
			let finished = false;
			let disconnected = false;
			let aborting = false;
			let opened = false;
			let catchUpPending = false;
			let pumpScheduled = false;
			const bufferedEntries = [];
			const abortListener = () => {
				if (finished) return;
				aborting = true;
				markDisconnected();
				socket.close();
				this.processing.then(() => finish(), () => finish());
			};
			const finish = (error) => {
				if (finished) return;
				finished = true;
				signal?.removeEventListener("abort", abortListener);
				if (error) reject(error);
				else resolve();
			};
			const markDisconnected = () => {
				if (disconnected) return;
				disconnected = true;
				bufferedEntries.length = 0;
				workAbort.abort();
				this.options.onState?.("disconnected");
			};
			const disconnect = (error) => {
				if (finished) return;
				markDisconnected();
				if (aborting) return;
				finish(error);
				if (error) socket.close();
			};
			const pump = () => {
				if (disconnected || !opened || pumpScheduled || !catchUpPending && bufferedEntries.length === 0) return;
				pumpScheduled = true;
				this.serialize(async () => {
					if (disconnected) return;
					if (catchUpPending) {
						catchUpPending = false;
						await this.drain(workAbort.signal);
						onReady?.();
					}
					while (bufferedEntries.length > 0) {
						if (disconnected) return;
						const entry = bufferedEntries.shift();
						if (!entry) return;
						await this.processEntries([entry], void 0, workAbort.signal);
					}
				}).then(() => {
					pumpScheduled = false;
					pump();
				}, (error) => {
					pumpScheduled = false;
					if (!disconnected) disconnect(asError(error));
				});
			};
			signal?.addEventListener("abort", abortListener, { once: true });
			socket.addEventListener("open", () => {
				if (disconnected) return;
				opened = true;
				catchUpPending = true;
				this.options.onState?.("connected");
				pump();
			});
			socket.addEventListener("message", (event) => {
				try {
					const frame = JSON.parse(String(event.data));
					if (frame.type !== "entry" || !frame.entry) return;
					if (bufferedEntries.length >= REEF_INBOX_LIVE_BUFFER_MAX_ENTRIES) {
						disconnect(/* @__PURE__ */ new Error("Reef inbox live buffer overflow; reconnecting for REST recovery"));
						return;
					}
					bufferedEntries.push(frame.entry);
					pump();
				} catch (error) {
					disconnect(asError(error));
				}
			});
			socket.addEventListener("close", (event) => {
				if (aborting || finished) return;
				disconnect(reefInboxCloseError(event));
			});
			socket.addEventListener("error", (event) => disconnect(new Error(event.message?.trim() || "reef inbox socket error")));
			if (signal?.aborted) abortListener();
		});
	}
};
function asError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function reefInboxCloseError(event) {
	const code = Number.isInteger(event.code) ? ` code=${event.code}` : "";
	const reason = event.reason?.trim() ? ` reason=${event.reason.trim()}` : "";
	return /* @__PURE__ */ new Error(`reef inbox socket closed unexpectedly${code}${reason}`);
}
//#endregion
//#region extensions/reef/src/friends.ts
function keysChanged(local, remote) {
	return local.keyEpoch !== remote.key_epoch || local.ed25519PublicKey !== remote.ed25519_pub || local.x25519PublicKey !== remote.x25519_pub;
}
var ReefFriendManager = class {
	#mutations = Promise.resolve();
	constructor(transport, trust, pairing) {
		this.transport = transport;
		this.trust = trust;
		this.pairing = pairing;
	}
	mintCode() {
		return this.transport.mintFriendCode();
	}
	request(peer, code) {
		return this.#serialize(async () => {
			const normalized = normalizeReefTarget(peer);
			if (!normalized) throw new Error(`Invalid Reef peer handle: ${peer}`);
			const requestId = this.trust.recordOutboundRequest(normalized);
			let result;
			try {
				result = await this.transport.requestFriend(normalized, code);
			} catch (error) {
				if (error instanceof ReefRelayError && error.status >= 400 && error.status < 500 && error.status !== 409) this.trust.removeOutboundRequest(normalized, requestId);
				else if (this.trust.outboundRequestStatus(normalized, requestId) === "revoked") try {
					await this.transport.removeFriend(normalized);
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], `Reef friend request to @${normalized} failed after concurrent revocation`, { cause: cleanupError });
				}
				throw error;
			}
			if (this.trust.outboundRequestStatus(normalized, requestId) === "revoked") {
				await this.transport.removeFriend(normalized);
				throw new Error(`Reef friend request to @${normalized} was concurrently revoked`);
			}
			return result;
		});
	}
	remove(peer) {
		return this.#serialize(async () => {
			const normalized = normalizeReefTarget(peer);
			if (!normalized) throw new Error(`Invalid Reef peer handle: ${peer}`);
			this.trust.remove(normalized);
			const failures = (await Promise.allSettled([this.#removePairingApprovalsForPeer(normalized), this.#removeRelayAndRefence(normalized)])).flatMap((result) => result.status === "rejected" ? [result.reason instanceof Error ? result.reason : new Error("Reef friendship removal failed", { cause: result.reason })] : []);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Reef friendship removal failed");
		});
	}
	setAutonomy(peer, autonomy) {
		return this.#serialize(() => {
			this.trust.setAutonomy(peer, autonomy);
		});
	}
	async list() {
		const local = new Map(this.trust.list().map((entry) => [entry.peer, entry.trust]));
		const { friendships } = await this.transport.listFriends();
		const listed = [];
		for (const friend of friendships) {
			const autonomy = local.get(friend.peer)?.autonomy;
			listed.push({
				...friend,
				fingerprint: fingerprint(friend.ed25519_pub, friend.x25519_pub),
				...autonomy ? { autonomy } : {}
			});
		}
		return listed;
	}
	surfacePairingCandidates(issue) {
		return this.#serialize(async () => {
			const { friendships } = await this.transport.listFriends();
			const approvals = await this.#loadPairingApprovals(friendships);
			for (const friend of friendships) {
				if (friend.status === "blocked") continue;
				const snapshot = this.trust.snapshot(friend.peer);
				const approval = approvals.get(friend.peer);
				if (approval?.trustRevision === snapshot.revision) continue;
				if (approval) await this.pairing.remove(approval.entry);
				const local = snapshot.trust;
				const changed = local ? keysChanged(local, friend) : false;
				const inboundPending = friend.status === "pending" && friend.initiated_by !== this.transport.handle;
				const missingLocalApproval = (friend.status === "active" || friend.status === "reapprove_required") && !local && Object.keys(snapshot.outboundRequests ?? {}).length === 0;
				const needsReapproval = friend.status === "reapprove_required" || friend.status === "active" && Boolean(local && (changed || local.safetyNumberChanged));
				if (!inboundPending && !missingLocalApproval && !needsReapproval) continue;
				await issue({
					peer: friend.peer,
					fingerprint: fingerprint(friend.ed25519_pub, friend.x25519_pub),
					code: friend.peer,
					approvalToken: this.trust.createPairingApproval(friend, snapshot.revision)
				});
			}
		});
	}
	reconcile() {
		return this.#serialize(async () => {
			const { friendships } = await this.transport.listFriends();
			const approvals = await this.#loadPairingApprovals(friendships);
			const changed = /* @__PURE__ */ new Set();
			for (const friend of friendships) {
				if (friend.status === "blocked") continue;
				const snapshot = this.trust.snapshot(friend.peer);
				const local = snapshot.trust;
				const loadedApproval = approvals.get(friend.peer);
				const approval = loadedApproval?.trustRevision === snapshot.revision ? loadedApproval : void 0;
				if (loadedApproval && !approval) await this.pairing.remove(loadedApproval.entry);
				const approvalEntry = approval?.entry;
				const approved = approval !== void 0;
				const outboundRequestId = Object.keys(snapshot.outboundRequests ?? {}).toSorted()[0];
				const changedKeys = local ? keysChanged(local, friend) : false;
				if (changedKeys && local && !approved) {
					if (!local.safetyNumberChanged && this.trust.markSafetyNumberChanged(friend.peer, snapshot.revision)) changed.add(friend.peer);
					continue;
				}
				const selfInitiated = friend.status === "active" && !local && outboundRequestId !== void 0;
				if (!(selfInitiated || approved && (!local || changedKeys || local.safetyNumberChanged || friend.status === "pending" || friend.status === "reapprove_required"))) {
					if (friend.status === "active" && local && outboundRequestId !== void 0) this.trust.removeOutboundRequest(friend.peer);
					if (approvalEntry !== void 0 && local && !changedKeys && !local.safetyNumberChanged) await this.pairing.remove(approvalEntry);
					continue;
				}
				if (friend.status === "pending" || friend.status === "reapprove_required") {
					if (!approved) continue;
				} else if (friend.status !== "active") continue;
				if (approvalEntry && !await this.pairing.remove(approvalEntry)) continue;
				if (friend.status === "pending" || friend.status === "reapprove_required") await this.transport.respondFriend(friend, true);
				if (this.trust.commitPeerTrust(friend, {
					expectedRevision: snapshot.revision,
					...selfInitiated && outboundRequestId !== void 0 ? { expectedOutboundRequestId: outboundRequestId } : {}
				})) {
					changed.add(friend.peer);
					continue;
				}
				const current = this.trust.snapshot(friend.peer);
				if (current.revision > snapshot.revision && !current.trust && Object.keys(current.outboundRequests ?? {}).length === 0) await this.transport.removeFriend(friend.peer);
			}
			return [...changed].toSorted();
		});
	}
	async #loadPairingApprovals(friendships) {
		const relayPeers = new Map(friendships.map((friend) => [friend.peer, friend]));
		const approvals = /* @__PURE__ */ new Map();
		for (const entry of await this.pairing.list()) {
			const parsed = this.trust.parsePairingApproval(entry);
			if (!parsed) {
				await this.pairing.remove(entry);
				continue;
			}
			const remote = relayPeers.get(parsed.peer);
			if (!remote || remote.status === "blocked" || !this.trust.matchesPairingApproval(entry, remote)) {
				await this.pairing.remove(entry);
				continue;
			}
			approvals.set(parsed.peer, {
				entry,
				trustRevision: parsed.trustRevision
			});
		}
		return approvals;
	}
	async #removePairingApprovalsForPeer(peer) {
		for (const entry of await this.pairing.list()) if (this.trust.parsePairingApproval(entry)?.peer === peer || normalizeReefTarget(entry) === peer) await this.pairing.remove(entry);
	}
	async #removeRelayAndRefence(peer) {
		await this.transport.removeFriend(peer);
		this.trust.remove(peer);
	}
	#serialize(operation) {
		const result = this.#mutations.then(operation);
		this.#mutations = result.then(() => void 0, () => void 0);
		return result;
	}
};
//#endregion
//#region extensions/reef/src/legacy-key-guard.ts
const REEF_LEGACY_KEYS_PENDING_CODE = "REEF_LEGACY_KEYS_PENDING";
async function assertLegacyReefKeysMigrated(configuredStateDir, env = process.env, homeDir = os.homedir()) {
	const filePath = `${resolveLegacyReefStateDir({
		config: configuredStateDir ? { channels: { reef: { stateDir: configuredStateDir } } } : {},
		env,
		stateDir: resolveStateDir(env, () => homeDir),
		homeDir
	})}/keys.json`;
	try {
		await fs.stat(filePath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw Object.assign(/* @__PURE__ */ new Error("Legacy Reef identity keys must be imported before registration. Run `openclaw doctor --fix`, then retry."), { code: REEF_LEGACY_KEYS_PENDING_CODE });
}
//#endregion
export { ReefTransportClient as a, isDefinitiveReefRegistrationFailure as c, ReefInboxConnection as i, isReefOwnershipRejection as l, assertLegacyReefKeysMigrated as n, abortableSleep as o, ReefFriendManager as r, createReefWebSocket as s, REEF_LEGACY_KEYS_PENDING_CODE as t, isRetryableReefRelayFailure as u };
