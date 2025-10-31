import type { LoaderFunctionArgs } from "react-router";
import Redis from "ioredis";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = process.env.REDIS_URL!;
  if (!url) return new Response("ERR REDIS_URL missing", { status: 500 });

  const host = new URL(url).hostname;

  const r = new Redis(url, {
    tls: { servername: host },   // SNI für Redis Cloud
    family: 4,                   // IPv4 erzwingen
    connectTimeout: 10_000,      // 10s
    maxRetriesPerRequest: 1,     // nicht 20x hängen
    retryStrategy: () => null,   // keine Auto-Retries
    lazyConnect: true,
  });

  try {
    await r.connect();           // erzwingt sofortigen Connect
    const pong = await r.ping();
    return new Response(`OK ${pong}`, { status: 200 });
  } catch (e: any) {
    // mehr Infos zurückgeben
    const msg = [
      `ERR ${e?.message || e}`,
      `host=${host}`,
      `url=${url.replace(/\/\/.*@/, "//***:***@")}`, // maskiertes PW
    ].join(" | ");
    return new Response(msg, { status: 500 });
  } finally {
    r.disconnect();
  }
};
