import { useState, useEffect } from "react";

const instruments = [
  { name: "Gaohu", chinese: "高胡", category: "Strings (Bowed)", description: "A high-pitched bowed fiddle, the soprano of the huqin family. Bright and penetrating, it's often used to lead the string section." },
  { name: "Erhu", chinese: "二胡", category: "Strings (Bowed)", description: "The iconic two-stringed Chinese fiddle with a haunting, vocal-like tone. One of the most expressive instruments in Chinese music." },
  { name: "Zhonghu", chinese: "中胡", category: "Strings (Bowed)", description: "The alto version of the erhu, tuned a fifth lower. It provides a rich, warm middle voice — the viola of the Chinese orchestra." },
  { name: "Pipa", chinese: "琵琶", category: "Strings (Plucked)", description: "A pear-shaped lute with 2,000+ years of history. Capable of thunderous battle sequences and delicate, intimate melodies." },
  { name: "Liuqin", chinese: "柳琴", category: "Strings (Plucked)", description: "A small, high-pitched lute nicknamed the 'Chinese mandolin.' Its bright, piercing tone often carries the melody." },
  { name: "Ruan", chinese: "阮", category: "Strings (Plucked)", description: "A round-bodied lute with a full, mellow tone. The zhongruan and daruan provide harmonic depth in the orchestra." },
  { name: "Yangqin", chinese: "揚琴", category: "Strings (Struck)", description: "A hammered dulcimer played with bamboo mallets. Its crystalline cascading tones create rapid arpeggios and sustained melodies." },
  { name: "Guzheng", chinese: "古箏", category: "Strings (Plucked)", description: "A grand 21-string zither. Its sweeping glissandos and expressive bends evoke mountains, rivers, and ancient poetry." },
  { name: "Sheng", chinese: "笙", category: "Wind", description: "An ancient free-reed mouth organ made of bamboo pipes. Uniquely, it can play chords — one of the oldest instruments in the world." },
  { name: "Dizi", chinese: "笛子", category: "Wind", description: "A transverse bamboo flute with a buzzy resonance from its 'dimo' membrane. A beloved voice of Chinese folk and classical music." },
  { name: "Suona", chinese: "嗩吶", category: "Wind", description: "A double-reed woodwind with a flared metal bell. Boisterously expressive, featured in festivals, folk music, and theater." },
  { name: "Cello", chinese: "大提琴", category: "Western Strings", description: "The Western cello bridges Eastern and Western traditions, adding deep bass warmth to the string section." },
  { name: "Double Bass", chinese: "低音大提", category: "Western Strings", description: "The lowest-pitched string instrument, providing the foundational bass resonance for the entire ensemble." },
  { name: "Percussion", chinese: "打擊", category: "Percussion", description: "Chinese orchestral percussion includes drums, cymbals, gongs, and woodblocks — the rhythmic engine of the ensemble." },
];

const categoryColors = {
  "Strings (Bowed)": "#c0392b",
  "Strings (Plucked)": "#e67e22",
  "Strings (Struck)": "#d4a017",
  "Wind": "#27ae60",
  "Western Strings": "#8e44ad",
  "Percussion": "#2980b9",
};

const categories = ["All", ...Object.keys(categoryColors)];

function InstrumentCard({ instrument }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const color = categoryColors[instrument.category] || "#555";

  useEffect(() => {
    let cancelled = false;
    async function fetchImage() {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 200,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            system: "You are a helpful assistant. When given an instrument name, search for an image of it and return ONLY a single direct image URL (ending in .jpg, .jpeg, .png, or .webp) with no other text. The image should show the physical instrument clearly.",
            messages: [{ role: "user", content: `Find a clear photo of the ${instrument.name} (${instrument.chinese}) Chinese musical instrument. Return only the direct image URL.` }]
          })
        });
        const data = await response.json();
        if (cancelled) return;
        // Extract URL from response
        const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("");
        const urlMatch = text?.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/i);
        if (urlMatch) {
          setImageUrl(urlMatch[0]);
        }
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchImage();
    return () => { cancelled = true; };
  }, [instrument.name]);

  return (
    <div style={{
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
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
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
              width: 32, height: 32, border: `3px solid ${color}`, borderTopColor: "transparent",
              borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px"
            }} />
            <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>Loading…</div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={instrument.name}
            onError={() => setImageUrl(null)}
            style={{ maxHeight: 160, maxWidth: "90%", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
          />
        ) : (
          <div style={{ fontSize: 56, color: color, opacity: 0.35, fontFamily: "serif" }}>
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
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontFamily: "Georgia, serif", color: "#2c2018", fontWeight: 700 }}>
            {instrument.name}
          </h3>
          <span style={{ fontSize: 18, color, fontFamily: "serif" }}>{instrument.chinese}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#6b5e4e", fontFamily: "Georgia, serif" }}>
          {instrument.description}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? instruments : instruments.filter(i => i.category === activeCategory);

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

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "20px 32px", background: "#f0e8d8", borderBottom: "1px solid #ddd0bb", justifyContent: "center" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "6px 14px", borderRadius: 2, border: "1.5px solid",
            borderColor: activeCategory === cat ? (categoryColors[cat] || "#2c2018") : "#c8b898",
            background: activeCategory === cat ? (categoryColors[cat] || "#2c2018") : "transparent",
            color: activeCategory === cat ? "white" : "#6b5040",
            cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "monospace",
            letterSpacing: "0.05em", textTransform: "uppercase", transition: "all 0.15s",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, padding: "28px 32px 48px", maxWidth: 1200, margin: "0 auto" }}>
        {filtered.map(i => <InstrumentCard key={i.name} instrument={i} />)}
      </div>

      {/* Legend */}
      <div style={{ borderTop: "1px solid #ddd0bb", background: "#f0e8d8", padding: "20px 32px", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, background: color, borderRadius: 2 }} />
            <span style={{ fontSize: 11, color: "#6b5040", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
