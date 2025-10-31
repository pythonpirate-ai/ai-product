// TEMP: zum Eingrenzen
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

export const sessionStorage = new MemorySessionStorage();


import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

import Redis from "ioredis";
import { RedisSessionStorage } from "@shopify/shopify-app-session-storage-redis";

// ✅ Redis Cloud braucht TLS + SNI
const redisUrl = process.env.REDIS_URL!;
const host = new URL(redisUrl).hostname;

const redis = new Redis(redisUrl, {
  tls: { servername: host }, // 👈 wichtig: SNI aktivieren
  family: 4,                 // IPv4 erzwingen (hilft gegen DNSv6 Fehler)
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableAutoPipelining: true,
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
