import type { LoaderFunctionArgs } from "react-router";
import Redis from "ioredis";
import dns from "node:dns/promises";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = process.env.REDIS_URL ?? process.env.SHOPIFY_REDIS_URL;
  if (!url) return new Response("ERR no REDIS_URL/SHOPIFY_REDIS_URL", { status: 500 });

  const parsed = new URL(url);
  const host = parsed.hostname;
  let resolved = "n/a";
  try {
    const a = await dns.lookup(host, { family: 4 });
    resolved = `${a.address}`;
  } catch {}

  const r = new Redis(url, {
    tls: { servername: host },
    family: 4,
    connectTimeout: 10_000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
    lazyConnect: true,
    // showFriendlyErrorStack: true, // optional
  });

  try {
    await r.connect(); // sofortiger Verbindungsversuch
    const pong = await r.ping();
    return new Response(
      `OK ${pong} | host=${host} | ip=${resolved} | url=${url.replace(/\/\/.*@/, "//***:***@")}`,
      { status: 200 }
    );
  } catch (e: any) {
    return new Response(
      `ERR ${e?.message || e} | host=${host} | ip=${resolved} | url=${url.replace(/\/\/.*@/, "//***:***@")}`,
      { status: 500 }
    );
  } finally {
    r.disconnect();
  }
};

export default function Noop() { return null; }
