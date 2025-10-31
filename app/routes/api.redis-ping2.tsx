import type { LoaderFunctionArgs } from "react-router";
import Redis from "ioredis";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = process.env.REDIS_URL ?? process.env.SHOPIFY_REDIS_URL;
  if (!url) {
    return new Response("ERR no REDIS_URL/SHOPIFY_REDIS_URL", {
      status: 500, headers: { "content-type": "text/plain" },
    });
  }

  const host = new URL(url).hostname;

  const r = new Redis(url, {
    tls: { servername: host },   // SNI für Redis Cloud
    family: 4,
    connectTimeout: 10_000,
    maxRetriesPerRequest: 1,     // keine 20 Retries mehr
    retryStrategy: () => null,
    lazyConnect: true,
  });

  try {
    await r.connect();
    const pong = await r.ping();
    return new Response(
      `OK ${pong} | CFG_OK | host=${host} | url=${url.replace(/\/\/.*@/, "//***:***@")}`,
      { status: 200, headers: { "content-type": "text/plain" } }
    );
  } catch (e: any) {
    return new Response(
      `ERR ${e?.message || e} | CFG_OK | host=${host} | url=${url.replace(/\/\/.*@/, "//***:***@")}`,
      { status: 500, headers: { "content-type": "text/plain" } }
    );
  } finally {
    r.disconnect();
  }
};
