import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { $ as executeSqliteQueryTakeFirstSync, Q as executeSqliteQuerySync, a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction, et as getNodeSqliteKysely } from "./openclaw-state-db-DkOMT2fb.js";
import { n as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DCHi8Wi-.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { createHash } from "node:crypto";
import { sql } from "kysely";
//#region src/state/user-profiles-schema.ts
const USER_PROFILES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  avatar BLOB,
  avatar_mime TEXT,
  avatar_sha256 TEXT,
  merged_into TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_emails (
  email TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_emails_profile_id
  ON user_profile_emails(profile_id);
`;
//#endregion
//#region src/state/user-profiles.ts
const MAX_USER_PROFILE_AVATAR_BYTES = 512 * 1024;
const USER_PROFILE_AVATAR_MIME_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp"
];
function formatUserProfileAvatarEtag(sha256, mime) {
	return `"${sha256}-${mime.slice(6)}"`;
}
var UserProfileNotFoundError = class extends Error {
	constructor(profileId) {
		super(`user profile not found: ${profileId}`);
		this.name = "UserProfileNotFoundError";
	}
};
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const MAX_USER_PROFILE_DISPLAY_NAME_LENGTH = 256;
function profileDb(db) {
	return getNodeSqliteKysely(db);
}
function ensureUserProfilesSchema(options) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(USER_PROFILES_SCHEMA_SQL);
	}, options, { operationLabel: "user-profiles.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function normalizeEmail(email) {
	const normalized = email.trim().toLowerCase();
	if (!normalized) throw new TypeError("email must not be empty");
	return normalized;
}
function toAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.includes(value) ? value : null;
}
function toUserProfile(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: toAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function toUserProfileListItem(row, emails) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: toAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		emails,
		hasAvatar: row.has_avatar === 1
	};
}
function hasAvatarColumn() {
	return sql`CASE WHEN avatar IS NULL THEN 0 ELSE 1 END`.as("has_avatar");
}
function selectUserProfileListItemById(db, profileId) {
	const kysely = profileDb(db);
	const profile = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").select([
		"id",
		"display_name",
		"avatar_mime",
		"merged_into",
		"created_at",
		"updated_at",
		hasAvatarColumn()
	]).where("id", "=", profileId));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profileId).orderBy("email", "asc")).rows;
	return toUserProfileListItem(profile, emails.map((alias) => alias.email));
}
function selectProfileById(db, profileId) {
	return executeSqliteQueryTakeFirstSync(db, profileDb(db).selectFrom("user_profiles").selectAll().where("id", "=", profileId));
}
function selectResolvedProfileById(db, profileId) {
	const profile = selectProfileById(db, profileId);
	if (!profile?.merged_into) return profile;
	return selectProfileById(db, profile.merged_into) ?? profile;
}
function requireResolvedProfileById(db, profileId) {
	const profile = selectResolvedProfileById(db, profileId);
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
/** Resolves a durable profile reference to its current one-hop merge head. */
function resolveUserProfileId(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectResolvedProfileById(db, profileId)?.id;
}
/** Reads a profile's protocol-facing representation through its merge head. */
function getUserProfileListItem(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectUserProfileListItemById(db, requireResolvedProfileById(db, profileId).id);
}
/** Resolves an email alias or atomically creates its first durable profile. */
function ensureProfileForEmail(email, options = {}) {
	const normalizedEmail = normalizeEmail(email);
	const profileId = generateSecureUuid();
	const now = Date.now();
	const displayName = (normalizedEmail.split("@", 1)[0] || normalizedEmail).slice(0, MAX_USER_PROFILE_DISPLAY_NAME_LENGTH);
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = profileDb(db);
		const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		if (existingAlias) return toUserProfile(requireResolvedProfileById(db, existingAlias.profile_id));
		const row = {
			id: profileId,
			display_name: displayName,
			avatar: null,
			avatar_mime: null,
			avatar_sha256: null,
			merged_into: null,
			created_at: now,
			updated_at: now
		};
		executeSqliteQuerySync(db, kysely.insertInto("user_profiles").values(row));
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_emails").values({
			email: normalizedEmail,
			profile_id: profileId,
			created_at: now
		}));
		return toUserProfile(row);
	}, options, { operationLabel: "user-profiles.ensure" });
}
/** Links an email to a profile and retains an aliasless prior profile as a merge tombstone. */
function linkEmail(email, targetProfileId, options = {}) {
	const normalizedEmail = normalizeEmail(email);
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = profileDb(db);
		const target = requireResolvedProfileById(db, targetProfileId);
		const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		if (!existingAlias) {
			executeSqliteQuerySync(db, kysely.insertInto("user_profile_emails").values({
				email: normalizedEmail,
				profile_id: target.id,
				created_at: now
			}));
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
			return selectUserProfileListItemById(db, target.id);
		}
		if (existingAlias.profile_id === target.id) return selectUserProfileListItemById(db, target.id);
		executeSqliteQuerySync(db, kysely.updateTable("user_profile_emails").set({ profile_id: target.id }).where("email", "=", normalizedEmail));
		const remainingAliases = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", existingAlias.profile_id)).rows;
		executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
		if (remainingAliases.length === 0) {
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
				merged_into: target.id,
				updated_at: now
			}).where("id", "=", existingAlias.profile_id));
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
				merged_into: target.id,
				updated_at: now
			}).where("merged_into", "=", existingAlias.profile_id));
		} else executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", existingAlias.profile_id));
		return selectUserProfileListItemById(db, target.id);
	}, options, { operationLabel: "user-profiles.link-email" });
}
function setDisplayName(profileId, name, options = {}) {
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedProfileById(db, profileId);
		executeSqliteQuerySync(db, profileDb(db).updateTable("user_profiles").set({
			display_name: name,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-display-name" });
}
/** Stores a bounded, allowlisted avatar without ever leaving the write transaction async. */
function setAvatar(profileId, bytes, mime, options = {}) {
	if (bytes.byteLength > MAX_USER_PROFILE_AVATAR_BYTES) return err({
		code: "avatar_too_large",
		maxBytes: MAX_USER_PROFILE_AVATAR_BYTES
	});
	if (!USER_PROFILE_AVATAR_MIME_TYPES.includes(mime)) return err({
		code: "unsupported_avatar_mime",
		mime
	});
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return ok(runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedProfileById(db, profileId);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		executeSqliteQuerySync(db, profileDb(db).updateTable("user_profiles").set({
			avatar: bytes,
			avatar_mime: mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-avatar" }));
}
function getProfileAvatar(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	const profile = selectResolvedProfileById(db, profileId);
	if (!profile?.avatar || !profile.avatar_mime || !profile.avatar_sha256) return;
	const mime = toAvatarMime(profile.avatar_mime);
	return mime ? {
		bytes: profile.avatar,
		mime,
		sha256: profile.avatar_sha256,
		updatedAt: profile.updated_at
	} : void 0;
}
function listProfiles(options = {}) {
	ensureUserProfilesSchema(options);
	const database = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const kysely = profileDb(database.db);
		const profiles = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profiles").select([
			"id",
			"display_name",
			"avatar_mime",
			"merged_into",
			"created_at",
			"updated_at",
			hasAvatarColumn()
		]).orderBy("created_at", "asc").orderBy("id", "asc")).rows;
		const emails = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profile_emails").select(["profile_id", "email"]).orderBy("email", "asc")).rows;
		const emailsByProfile = /* @__PURE__ */ new Map();
		for (const email of emails) {
			const list = emailsByProfile.get(email.profile_id) ?? [];
			list.push(email.email);
			emailsByProfile.set(email.profile_id, list);
		}
		return profiles.map((profile) => toUserProfileListItem(profile, emailsByProfile.get(profile.id) ?? []));
	}, {
		databaseLabel: database.path,
		operationLabel: "user-profiles.list"
	});
}
//#endregion
export { getUserProfileListItem as a, resolveUserProfileId as c, getProfileAvatar as i, setAvatar as l, ensureProfileForEmail as n, linkEmail as o, formatUserProfileAvatarEtag as r, listProfiles as s, UserProfileNotFoundError as t, setDisplayName as u };
