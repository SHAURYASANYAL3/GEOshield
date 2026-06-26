"use client";
// ============================================================================
// GEOShield — April 2017 Storm Case Study (Recharts)
// Real actual-flux vs 12h-ahead forecast, model trained on data <=2016
// (April 2017 was completely unseen). Log-scale Y axis.
// ============================================================================
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts";

const ISRO_ORANGE = "#FF6500";
const ISRO_CYAN = "#00B1FF";
const ACTUAL = "#00B1FF";   // cyan = observed reality
const FORECAST = "#35E0A1"; // green = forecast
const DANGER = "#FF6500";   // orange = P99 danger threshold
const GRID = "#1F2A44";
const TEXT_MUTED = "#A7B6DA";
const CARD_BG = "#111726";

const P99 = 59153; // train-only P99 threshold (verified)

// Real April 2017 storm, 6-hourly. actual = GOES-15 observed, forecast = Delta X100 12h-ahead.
const STORM_DATA = [
  { t: "04-20", actual: 51,     forecast: 53 },
  { t: "04-20", actual: 334,    forecast: 265 },
  { t: "04-20", actual: 1845,   forecast: 475 },
  { t: "04-21", actual: 1569,   forecast: 1937 },
  { t: "04-21", actual: 762,    forecast: 3730 },
  { t: "04-21", actual: 1593,   forecast: 1184 },
  { t: "04-21", actual: 1966,   forecast: 690 },
  { t: "04-22", actual: 170,    forecast: 2739 },
  { t: "04-22", actual: 297,    forecast: 4301 },
  { t: "04-22", actual: 2774,   forecast: 4418 },
  { t: "04-22", actual: 16386,  forecast: 4703 },
  { t: "04-23", actual: 2457,   forecast: 14683 },
  { t: "04-23", actual: 1431,   forecast: 50722 },
  { t: "04-23", actual: 14444,  forecast: 25038 },
  { t: "04-23", actual: 75587,  forecast: 14935 },
  { t: "04-24", actual: 35425,  forecast: 53098 },
  { t: "04-24", actual: 24587,  forecast: 101649 },
  { t: "04-24", actual: 65245,  forecast: 65235 },
  { t: "04-24", actual: 195570, forecast: 34521 },
  { t: "04-25", actual: 45069,  forecast: 80282 },
  { t: "04-25", actual: 14249,  forecast: 98645 },
  { t: "04-25", actual: 74965,  forecast: 43139 },
  { t: "04-25", actual: 200565, forecast: 22255 },
  { t: "04-26", actual: 64052,  forecast: 64287 },
  { t: "04-26", actual: 35002,  forecast: 92064 },
  { t: "04-26", actual: 124676, forecast: 57787 },
  { t: "04-26", actual: 262996, forecast: 55987 },
  { t: "04-27", actual: 109623, forecast: 148753 },
  { t: "04-27", actual: 94944,  forecast: 123656 },
  { t: "04-27", actual: 116228, forecast: 92669 },
  { t: "04-27", actual: 210489, forecast: 88562 },
  { t: "04-28", actual: 96709,  forecast: 116421 },
  { t: "04-28", actual: 41896,  forecast: 83746 },
  { t: "04-28", actual: 88626,  forecast: 45755 },
  { t: "04-28", actual: 127645, forecast: 30419 },
  { t: "04-29", actual: 33630,  forecast: 20324 },
  { t: "04-29", actual: 9893,   forecast: 10092 },
  { t: "04-29", actual: 22383,  forecast: 7718 },
  { t: "04-29", actual: 55358,  forecast: 3594 },
  { t: "04-30", actual: 25632,  forecast: 4618 },
];

// Show each day label only once on the axis
const seen = new Set();
const tickFmt = (v) => {
  if (seen.has(v)) return "";
  seen.add(v);
  return v;
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#0A0E1A", border: `1px solid ${GRID}`, borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>{label} (2017)</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {Math.round(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default function April2017Chart() {
  seen.clear();
  return (
    <div style={{ background: CARD_BG, borderRadius: 12, border: `1px solid ${GRID}`, padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h3 style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 18, margin: 0 }}>
          April 2017 Storm — Forecast vs Reality
        </h3>
        <span style={{ color: ISRO_ORANGE, fontWeight: 600, fontSize: 13 }}>12.0h advance warning</span>
      </div>
      <p style={{ color: TEXT_MUTED, fontSize: 12, margin: "0 0 16px" }}>
        Largest storm in the test period. Model trained ≤2016 — this event was completely unseen. Peak 330,105 = 5.6× P99.
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={STORM_DATA} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis dataKey="t" stroke={TEXT_MUTED} fontSize={11} tickFormatter={tickFmt} interval={0} minTickGap={0} />
          <YAxis
            scale="log" domain={[10, 400000]} stroke={TEXT_MUTED} fontSize={11}
            tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v}
            label={{ value: "Electron flux (log)", angle: -90, position: "insideLeft", fill: TEXT_MUTED, fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: TEXT_MUTED }} />
          <ReferenceLine y={P99} stroke={DANGER} strokeDasharray="6 4" strokeWidth={1.5}
            label={{ value: "P99 danger", fill: DANGER, fontSize: 10, position: "insideTopRight" }} />
          <Line type="monotone" dataKey="actual" name="Actual flux" stroke={ACTUAL} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="forecast" name="Forecast (12h ahead)" stroke={FORECAST} strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
