import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

import Redis from "ioredis";
import { RedisSessionStorage } from "@shopify/shopify-app-session-storage-redis";

// Wichtig: REDIS_URL = redis://default:<PASS>@redis-11894...:11894  (ohne "s")
const redisUrl = process.env.REDIS_URL!;

// ⚙️ Redis ohne TLS (da dein Server kein TLS erwartet)
const redis = new Redis(redisUrl, {
  family: 4,                // IPv4 erzwingen
  lazyConnect: true,        // verbindet erst bei Bedarf
  enableAutoPipelining: true,
  // kein tls:{}, kein servername
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
