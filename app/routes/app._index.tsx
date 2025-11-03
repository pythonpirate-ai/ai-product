import { useState } from "react";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function startMake() {
    try {
      setLoading(true);
      setMsg(null);
      const res = await fetch("/api/trigger-import", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) setMsg("✅ Prozess gestartet");
      else setMsg(`❌ Fehler (${data?.status ?? res.status})`);
    } catch {
      setMsg("❌ Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Kleidung per AI importieren </h1>
      <p>Starte den Prozess (Dropbox → Shopify) per Klick.</p>
      <button
        onClick={startMake}
        disabled={loading}
        style={{
          background: "#008060",
          color: "white",
          padding: "10px 16px",
          borderRadius: 6,
          border: 0,
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "Startet…" : "Make-Prozess starten"}
      </button>
      {msg && (
        <div
          style={{
            marginTop: 12,
            fontWeight: 600,
            color: msg.startsWith("✅") ? "#047857" : "#b91c1c",
          }}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
