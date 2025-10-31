import type { LoaderFunctionArgs } from "react-router";
import Redis from "ioredis";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = process.env.REDIS_URL ?? process.env.SHOPIFY_REDIS_URL;
  if (!url) return new Response("ERR no REDIS_URL/SHOPIFY_REDIS_URL", { status: 500 });

  const host = new URL(url).hostname;
  const events: string[] = [];

  const r = new Redis(url, {
    tls: { servername: host, minVersion: "TLSv1.2" }, // SNI + TLS >=1.2
    family: 4,                       // IPv4
    connectTimeout: 10000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
    lazyConnect: true,
    enableOfflineQueue: false,       // sofort Fehler statt queuen
    enableAutoPipelining: false,
    showFriendlyErrorStack: true,
  });

  r.on("connect",      () => events.push("event:connect"));
  r.on("ready",        () => events.push("event:ready"));
  r.on("close",        () => events.push("event:close"));
  r.on("end",          () => events.push("event:end"));
  r.on("reconnecting", () => events.push("event:reconnecting"));
  r.on("error",        (e) => events.push("event:error:" + (e?.message || e)));

  try {
    await r.connect();
    const pong = await r.ping();
    return new Response(
      `OK ${pong} | host=${host} | url=${url.replace(/\/\/.*@/, "//***:***@")} | ${events.join(" > ")}`,
      { status: 200, headers: { "content-type": "text/plain" } }
    );
  } catch (e: any) {
    return new Response(
      `ERR ${e?.message || e} | host=${host} | url=${url.replace(/\/\/.*@/, "//***:***@")} | ${events.join(" > ")}`,
      { status: 500, headers: { "content-type": "text/plain" } }
    );
  } finally {
    r.disconnect();
  }
};
