import { useState, useEffect } from "react";
import { instruments, categoryColors } from "./instruments.js";

const categories = ["All", ...Object.keys(categoryColors)];

function InstrumentCard({ instrument }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const color = categoryColors[instrument.category] || "#555";

  useEffect(() => {
    let cancelled = false;
    async function fetchImage() {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(instrument.wikiArticle)}`
        );
        const data = await res.json();
        if (!cancelled && data.thumbnail?.source) {
          setImageUrl(data.thumbnail.source);
        }
      } catch (_) {
        // network error — fall through to Chinese character fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchImage();
    return () => { cancelled = true; };
  }, [instrument.wikiArticle]);

  return (
    <div
      style={{
        background: "#fffef9",
        border: "1px solid #e8e0d0",
        borderTop: `4px solid ${color}`,
        borderRadius: "2px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image area */}
      <div style={{
        height: 180,
        background: "#f5f0e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 32, height: 32,
              border: `3px solid ${color}`, borderTopColor: "transparent",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
              margin: "0 auto 8px",
            }} />
            <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>Loading…</div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={instrument.name}
            onError={() => setImageUrl(null)}
            style={{
              maxHeight: 160, maxWidth: "90%", objectFit: "contain",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
            }}
          />
        ) : (
          <div style={{ fontSize: 56, color, opacity: 0.35, fontFamily: "serif" }}>
            {instrument.chinese}
          </div>
        )}

        <div style={{
          position: "absolute", top: 8, right: 8,
          background: color, color: "white",
          fontSize: 10, fontWeight: 700, padding: "2px 7px",
          borderRadius: 2, letterSpacing: "0.05em", textTransform: "uppercase",
          fontFamily: "monospace",
        }}>
          {instrument.category}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontFamily: "Georgia, serif", color: "#2c2018", fontWeight: 700 }}>
            {instrument.name}
          </h3>
          <span style={{ fontSize: 18, color, fontFamily: "serif" }}>{instrument.chinese}</span>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.65, color: "#6b5e4e", fontFamily: "Georgia, serif", flex: 1 }}>
          {instrument.description}
        </p>
        <a
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(instrument.wikiArticle)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color, fontFamily: "monospace", textDecoration: "none", opacity: 0.7 }}
        >
          Wikipedia ↗
        </a>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All"
    ? instruments
    : instruments.filter(i => i.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#faf6ef", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div style={{ background: "#2c2018", padding: "40px 32px 36px", textAlign: "center", borderBottom: "4px solid #c0392b" }}>
        <div style={{ fontSize: 13, color: "#b89060", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
          GBCCA Chinese Music Ensemble
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: "clamp(26px,5vw,42px)", color: "#fffef9", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Instrument Visual Guide
        </h1>
        <div style={{ fontSize: 22, color: "#b89060", letterSpacing: "0.1em" }}>中國音樂樂器圖解</div>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "20px 32px", background: "#f0e8d8", borderBottom: "1px solid #ddd0bb", justifyContent: "center" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 14px", borderRadius: 2, border: "1.5px solid",
              borderColor: activeCategory === cat ? (categoryColors[cat] || "#2c2018") : "#c8b898",
              background: activeCategory === cat ? (categoryColors[cat] || "#2c2018") : "transparent",
              color: activeCategory === cat ? "white" : "#6b5040",
              cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "monospace",
              letterSpacing: "0.05em", textTransform: "uppercase", transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Instrument grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, padding: "28px 32px 48px", maxWidth: 1200, margin: "0 auto" }}>
        {filtered.map(i => <InstrumentCard key={i.name} instrument={i} />)}
      </div>

      {/* Footer legend */}
      <div style={{ borderTop: "1px solid #ddd0bb", background: "#f0e8d8", padding: "20px 32px", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center" }}>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, background: color, borderRadius: 2 }} />
            <span style={{ fontSize: 11, color: "#6b5040", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</span>
          </div>
        ))}
        <span style={{ fontSize: 10, color: "#9b8878", fontFamily: "monospace", marginLeft: 12 }}>
          Images © Wikipedia contributors, CC BY-SA
        </span>
        <a
          href="https://github.com/coldnebo/gbcca-instruments"
          target="_blank"
          rel="noopener noreferrer"
          title="View source on GitHub"
          style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b5040", textDecoration: "none", marginLeft: 12, opacity: 0.7 }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span style={{ fontSize: 11, fontFamily: "monospace" }}>GitHub</span>
        </a>
      </div>
    </div>
  );
}
