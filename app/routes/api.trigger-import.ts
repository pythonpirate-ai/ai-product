import { authenticate } from "../shopify.server";

export async function action({ request }: any) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    const res = await fetch(process.env.MAKE_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": process.env.MAKE_API_KEY!,
      },
      body: JSON.stringify({
        shop,
        triggered_at: new Date().toISOString(),
        note: "Start via Shopify Admin",
      }),
    });

    const body = JSON.stringify({ ok: res.ok, status: res.status });
    return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    const body = JSON.stringify({ ok: false, error: String(err) });
    return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
