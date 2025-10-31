import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

// ⬇️ NEU: Redis statt Prisma
import Redis from "ioredis";
import { RedisSessionStorage } from "@shopify/shopify-app-session-storage-redis";

// ⬇️ Redis-Verbindung (URL kommt aus Vercel: REDIS_URL = rediss://default:<PASS>@host:port)
const redis = new Redis(process.env.REDIS_URL!);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: ApiVersion.October25,

  // Nutze SHOPIFY_SCOPES (oder fallback auf SCOPES, falls du das bisher genutzt hast)
  scopes: (process.env.SHOPIFY_SCOPES ?? process.env.SCOPES ?? "")
    .split(",")
    .filter(Boolean),

  appUrl: process.env.SHOPIFY_APP_URL!,
  authPathPrefix: "/auth",

  // ⬇️ WICHTIG: Redis-Session-Storage
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
