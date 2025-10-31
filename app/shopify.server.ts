import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

import Redis from "ioredis";
import { RedisSessionStorage } from "@shopify/shopify-app-session-storage-redis";

// ✅ Redis Cloud braucht TLS
const redis = new Redis(process.env.REDIS_URL!, {
  tls: {}, // << fix SSL error
});

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: ApiVersion.October25,

  scopes: (process.env.SHOPIFY_SCOPES ?? process.env.SCOPES ?? "")
    .split(",")
    .filter(Boolean),

  appUrl: process.env.SHOPIFY_APP_URL!,
  authPathPrefix: "/auth",

  sessionStorage: new RedisSessionStorage(redis),

  distribution: AppDistribution.AppStore,
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
