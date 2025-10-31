import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop } = await authenticate.webhook(request);

  console.log(`🧹 Received ${topic} webhook for ${shop}`);

  // Wenn du beim Uninstall etwas aufräumen möchtest, kannst du hier später Redis verwenden,
  // z. B. über shopify.sessionStorage.deleteSessions(shop).
  // Aber aktuell reicht es, Shopify mit "ok" zu antworten.

  return new Response("ok", { status: 200 });
};

