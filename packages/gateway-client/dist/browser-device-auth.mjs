// packages/gateway-client/src/connect-auth.ts
function normalized(value) {
  return typeof value === "string" ? value.trim() || void 0 : void 0;
}
function selectGatewayConnectAuth(params) {
  const authToken = normalized(params.token);
  const bootstrapToken = normalized(params.bootstrapToken);
  const explicitDeviceToken = normalized(params.deviceToken);
  const authPassword = normalized(params.password);
  const storedToken = normalized(params.storedToken);
  const stored = { storedToken, storedScopes: params.storedScopes };
  if (params.preferBootstrapToken && bootstrapToken) {
    return { authBootstrapToken: bootstrapToken, authPassword, ...stored };
  }
  const useRetryToken = params.pendingDeviceTokenRetry === true && !explicitDeviceToken && Boolean(authToken && storedToken && params.trustedDeviceTokenRetry);
  const resolvedDeviceToken = explicitDeviceToken ?? (useRetryToken || !(authToken || authPassword) && (!bootstrapToken || storedToken) ? storedToken : void 0);
  const usingStoredDeviceToken = Boolean(resolvedDeviceToken && !explicitDeviceToken && storedToken) && resolvedDeviceToken === storedToken;
  const selectedToken = authToken ?? resolvedDeviceToken;
  const authBootstrapToken = !authToken && !resolvedDeviceToken && !authPassword ? bootstrapToken : void 0;
  return {
    authToken: selectedToken,
    authBootstrapToken,
    authDeviceToken: useRetryToken ? storedToken : void 0,
    authPassword,
    authApprovalRuntimeToken: normalized(params.approvalRuntimeToken),
    authAgentRuntimeIdentityToken: normalized(params.agentRuntimeIdentityToken),
    signatureToken: selectedToken ?? authBootstrapToken,
    resolvedDeviceToken,
    usingStoredDeviceToken,
    ...stored
  };
}
function buildGatewayConnectAuth(selected) {
  const auth = {
    token: selected.authToken,
    bootstrapToken: selected.authBootstrapToken,
    deviceToken: selected.authDeviceToken ?? selected.resolvedDeviceToken,
    password: selected.authPassword,
    approvalRuntimeToken: selected.authApprovalRuntimeToken,
    agentRuntimeIdentityToken: selected.authAgentRuntimeIdentityToken
  };
  return Object.values(auth).some(Boolean) ? auth : void 0;
}
function resolveGatewayConnectScopes(params) {
  return params.requestedScopes ?? (params.usingStoredDeviceToken && params.storedScopes?.length ? params.storedScopes : [...params.defaultScopes]);
}

// packages/gateway-client/src/device-auth.ts
function normalizeDeviceMetadataForAuth(value) {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/[A-Z]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 32));
}
function buildDeviceAuthPayloadV3(params) {
  const scopes = params.scopes.join(",");
  const token = params.token ?? "";
  const platform = normalizeDeviceMetadataForAuth(params.platform);
  const deviceFamily = normalizeDeviceMetadataForAuth(params.deviceFamily);
  return [
    "v3",
    params.deviceId,
    params.clientId,
    params.clientMode,
    params.role,
    scopes,
    String(params.signedAtMs),
    token,
    params.nonce,
    platform,
    deviceFamily
  ].join("|");
}

// packages/gateway-client/src/browser-device-auth.ts
var GatewayBrowserDeviceAuthLifecycle = class {
  constructor(deps) {
    this.deps = deps;
  }
  async buildPlan(params) {
    const identity = await this.deps.loadIdentity();
    const stored = identity ? await this.deps.tokenStore.load({
      clientId: params.client.id,
      deviceId: identity.deviceId,
      role: params.role
    }) : null;
    const storedValue = stored?.token;
    const selectedAuth = selectGatewayConnectAuth({
      token: params.token,
      bootstrapToken: params.bootstrapToken,
      password: params.password,
      storedToken: storedValue,
      storedScopes: stored?.scopes,
      pendingDeviceTokenRetry: params.pendingDeviceTokenRetry,
      trustedDeviceTokenRetry: params.trustedDeviceTokenRetry,
      preferBootstrapToken: params.preferBootstrapToken
    });
    const { usingStoredDeviceToken } = selectedAuth;
    const scopes = resolveGatewayConnectScopes({
      requestedScopes: selectedAuth.authBootstrapToken ? params.bootstrapScopes ? [...params.bootstrapScopes] : void 0 : void 0,
      usingStoredDeviceToken,
      storedScopes: selectedAuth.storedScopes,
      defaultScopes: params.defaultScopes
    });
    if (!identity) {
      return {
        clientId: params.client.id,
        role: params.role,
        identity,
        selectedAuth,
        scopes,
        auth: buildGatewayConnectAuth(selectedAuth)
      };
    }
    const signedAtMs = this.deps.nowMs?.() ?? Date.now();
    const nonce = params.nonce ?? "";
    const { authBootstrapToken: primary, signatureToken: signed } = selectedAuth;
    let token = null;
    if (primary) {
      token = primary;
    } else if (signed) {
      token = signed;
    }
    const payload = buildDeviceAuthPayloadV3({
      deviceId: identity.deviceId,
      clientId: params.client.id,
      clientMode: params.client.mode,
      role: params.role,
      scopes,
      signedAtMs,
      token,
      nonce,
      platform: params.client.platform,
      deviceFamily: params.client.deviceFamily
    });
    return {
      clientId: params.client.id,
      role: params.role,
      identity,
      selectedAuth,
      scopes,
      auth: buildGatewayConnectAuth(selectedAuth),
      device: {
        id: identity.deviceId,
        publicKey: identity.publicKey,
        signature: await identity.sign(payload),
        signedAt: signedAtMs,
        nonce
      }
    };
  }
  async acceptHello(hello, plan) {
    const token = hello.auth?.deviceToken?.trim();
    if (!token || !plan.identity) {
      return;
    }
    await this.deps.tokenStore.store({
      clientId: plan.clientId,
      deviceId: plan.identity.deviceId,
      role: hello.auth?.role ?? plan.role,
      token,
      scopes: hello.auth?.scopes ?? []
    });
  }
  async clearStoredToken(plan) {
    if (!plan.identity) {
      return;
    }
    await this.deps.tokenStore.clear({
      clientId: plan.clientId,
      deviceId: plan.identity.deviceId,
      role: plan.role
    });
  }
};
export {
  GatewayBrowserDeviceAuthLifecycle
};
