import { getDeployStore, getStore } from "@netlify/blobs";

const options = {
  name: "cookie-consents",
  region: "eu-central-1",
  consistency: "strong",
} as const;

export function cookieConsentStore(production: boolean) {
  return production ? getStore(options) : getDeployStore(options);
}
