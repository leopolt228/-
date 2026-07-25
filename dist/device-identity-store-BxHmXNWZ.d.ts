//#region src/infra/device-identity-store.d.ts
type DeviceIdentity = {
  deviceId: string;
  publicKeyPem: string;
  privateKeyPem: string;
};
//#endregion
export { DeviceIdentity as t };