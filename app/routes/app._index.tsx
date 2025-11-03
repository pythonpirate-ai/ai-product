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
    <div style={{ padding: 20, fontFamily: "sans-serif", lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Kleidung per AI importieren</h1>
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
        {loading ? "Startet…" : "Prozess starten"}
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

      <div style={{ marginTop: 24 }}>
        <p>
          1. <strong>Fotografiere mit der Dropbox App</strong> direkt und stelle alle
          Bilder in den Ordner <strong>"Uploads"</strong>.
        </p>
        <p>
          <strong>Wichtig:</strong> Bitte denke daran, immer ein{" "}
          <strong>Grössen-Schild</strong> mit auf dem Bild zu fotografieren.
        </p>
        <p>
          2. Wenn du fertig bist, klicke auf den grünen Button{" "}
          <strong>"Prozess starten"</strong>.
        </p>
        <p>
          Anschliessend nimmt das Programm Bild für Bild aus der Dropbox, lässt es
          über ChatGPT identifizieren, vergibt Tags und lädt es als neues Produkt in
          Shopify. Pro Bild dauert dies ca. <strong>30 Sekunden</strong>.
        </p>
        <p>
          <strong>Wichtig:</strong> Manchmal funktioniert der Bild-Upload noch nicht
          richtig 😅 – dann erscheint zwar das Kleidungsstück als{" "}
          <strong>Produkt, aber ohne Bild</strong> (ich arbeite daran). Dann muss das
          Bild manuell nachgeladen werden.
        </p>
        <p>
          Nach dem Upload findest du alle Bilder im Ordner{" "}
          <strong>"Archive"</strong> auf der Dropbox.
        </p>
      </div>
    </div>
  );
}
