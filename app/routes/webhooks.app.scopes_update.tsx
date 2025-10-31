import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop } = await authenticate.webhook(request);

  console.log(`✅ Received ${topic} webhook for ${shop}`);

  // Falls du später etwas mit Redis speichern willst, kannst du hier auf shopify.sessionStorage zugreifen.
  // z. B. await shopify.sessionStorage.storeSession(...)

  return new Response("ok", { status: 200 });
};
