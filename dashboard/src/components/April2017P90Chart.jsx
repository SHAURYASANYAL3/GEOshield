"use client";
// ============================================================================
// GEOShield — April 2017 P90 Band (Recharts)
// Median forecast understates the peak; the P90 upper band captures it.
// Real verified data: median ~61% of peak, P90 ~93-96% of peak.
// ============================================================================
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts";

const ISRO_ORANGE = "#FF6500";
const ISRO_CYAN = "#00B1FF";
const ACTUAL = "#00B1FF";   // cyan = observed
const MEDIAN = "#35E0A1";   // green = median forecast (conservative)
const P90 = "#FFB13D";      // amber = P90 worst-case band (captures peak)
const DANGER = "#FF6500";   // orange = P99 line
const GRID = "#1F2A44";
const TEXT_MUTED = "#A7B6DA";
const CARD_BG = "#111726";

const P99_THRESHOLD = 59153;

// Real April 2017: actual flux, median forecast, P90 upper band (6-hourly).
const P90_DATA = [
  { t: "04-20", actual: 51,     median: 50,     p90: 291 },
  { t: "04-20", actual: 334,    median: 281,    p90: 5159 },
  { t: "04-20", actual: 1845,   median: 471,    p90: 7854 },
  { t: "04-21", actual: 1569,   median: 1941,   p90: 8302 },
  { t: "04-21", actual: 762,    median: 3736,   p90: 4923 },
  { t: "04-21", actual: 1593,   median: 1346,   p90: 5097 },
  { t: "04-21", actual: 1966,   median: 967,    p90: 7912 },
  { t: "04-22", actual: 170,    median: 3417,   p90: 9790 },
  { t: "04-22", actual: 297,    median: 5347,   p90: 18872 },
  { t: "04-22", actual: 2774,   median: 5177,   p90: 39197 },
  { t: "04-22", actual: 16386,  median: 5510,   p90: 85333 },
  { t: "04-23", actual: 2457,   median: 15265,  p90: 67595 },
  { t: "04-23", actual: 1431,   median: 49279,  p90: 83040 },
  { t: "04-23", actual: 14444,  median: 23843,  p90: 96984 },
  { t: "04-23", actual: 75587,  median: 16513,  p90: 134545 },
  { t: "04-24", actual: 35425,  median: 52497,  p90: 150719 },
  { t: "04-24", actual: 24587,  median: 103567, p90: 158997 },
  { t: "04-24", actual: 65245,  median: 68218,  p90: 146582 },
  { t: "04-24", actual: 195570, median: 39147,  p90: 205938 },
  { t: "04-25", actual: 45069,  median: 82000,  p90: 147104 },
  { t: "04-25", actual: 14249,  median: 101642, p90: 128052 },
  { t: "04-25", actual: 74965,  median: 44668,  p90: 111533 },
  { t: "04-25", actual: 200565, median: 22272,  p90: 180632 },
  { t: "04-26", actual: 64052,  median: 67976,  p90: 142311 },
  { t: "04-26", actual: 35002,  median: 91431,  p90: 140182 },
  { t: "04-26", actual: 124676, median: 54147,  p90: 133661 },
  { t: "04-26", actual: 262996, median: 58304,  p90: 252105 },
  { t: "04-27", actual: 109623, median: 160214, p90: 154586 },
  { t: "04-27", actual: 94944,  median: 128199, p90: 238494 },
  { t: "04-27", actual: 116228, median: 94010,  p90: 141624 },
  { t: "04-27", actual: 210489, median: 77585,  p90: 212099 },
  { t: "04-28", actual: 96709,  median: 123133, p90: 128301 },
  { t: "04-28", actual: 41896,  median: 88073,  p90: 140367 },
  { t: "04-28", actual: 88626,  median: 44481,  p90: 104075 },
  { t: "04-28", actual: 127645, median: 29719,  p90: 129275 },
  { t: "04-29", actual: 33630,  median: 21228,  p90: 103525 },
  { t: "04-29", actual: 9893,   median: 8082,   p90: 55758 },
  { t: "04-29", actual: 22383,  median: 7814,   p90: 50841 },
  { t: "04-29", actual: 55358,  median: 4440,   p90: 83333 },
  { t: "04-30", actual: 25632,  median: 5548,   p90: 90368 },
];

const seen = new Set();
const tickFmt = (v) => { if (seen.has(v)) return ""; seen.add(v); return v; };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#0A0E1A", border: `1px solid ${GRID}`, borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>{label} (2017)</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {Math.round(p.value).toLocaleString()}</div>
      ))}
    </div>
  );
}

export default function April2017P90Chart() {
  seen.clear();
  return (
    <div style={{ background: CARD_BG, borderRadius: 12, border: `1px solid ${GRID}`, padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h3 style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 18, margin: 0 }}>
          Capturing the Peak — P90 Upper Band
        </h3>
        <span style={{ color: P90, fontWeight: 600, fontSize: 13 }}>P90 captures 93% of peak</span>
      </div>
      <p style={{ color: TEXT_MUTED, fontSize: 12, margin: "0 0 16px" }}>
        The median forecast is conservative on extreme peaks (~61%). The P90 worst-case band recovers the magnitude (~93%) — operators plan against the band.
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={P90_DATA} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis dataKey="t" stroke={TEXT_MUTED} fontSize={11} tickFormatter={tickFmt} interval={0} minTickGap={0} />
          <YAxis scale="log" domain={[10, 400000]} stroke={TEXT_MUTED} fontSize={11}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
            label={{ value: "Electron flux (log)", angle: -90, position: "insideLeft", fill: TEXT_MUTED, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={P99_THRESHOLD} stroke={DANGER} strokeDasharray="6 4" strokeWidth={1.5}
            label={{ value: "P99 danger", fill: DANGER, fontSize: 10, position: "insideTopRight" }} />
          <Line type="monotone" dataKey="actual" name="Actual flux" stroke={ACTUAL} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="p90" name="P90 upper band (worst-case)" stroke={P90} strokeWidth={2} strokeDasharray="2 3" dot={false} />
          <Line type="monotone" dataKey="median" name="Median forecast" stroke={MEDIAN} strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
