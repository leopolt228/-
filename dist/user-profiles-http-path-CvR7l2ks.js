//#region src/gateway/user-profiles-http-path.ts
const USER_PROFILE_AVATAR_PATH = /^\/api\/users\/([^/]+)\/avatar$/u;
function formatUserProfileAvatarPath(profileId) {
	return `/api/users/${encodeURIComponent(profileId)}/avatar`;
}
function matchUserProfileAvatarPath(pathname) {
	const profileId = USER_PROFILE_AVATAR_PATH.exec(pathname)?.[1];
	if (!profileId) return;
	try {
		return decodeURIComponent(profileId);
	} catch {
		return;
	}
}
//#endregion
export { matchUserProfileAvatarPath as n, formatUserProfileAvatarPath as t };
