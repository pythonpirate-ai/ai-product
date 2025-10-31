import type { LoaderFunctionArgs } from "react-router";
import Redis from "ioredis";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = process.env.REDIS_URL!;
  const host = new URL(url).hostname;

  const r = new Redis(url, { tls: { servername: host }, family: 4 });
  try {
    const pong = await r.ping();
    return new Response(`OK ${pong}`, { status: 200 });
  } catch (e: any) {
    return new Response(`ERR ${e?.message}`, { status: 500 });
  } finally {
    r.disconnect();
  }
};

export default function Noop() {
  return null; // Keine UI-Komponente nötig
}
