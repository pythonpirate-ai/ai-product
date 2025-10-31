// KEIN default-Export!
export const loader = async () =>
  new Response("HELLO OK", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });

