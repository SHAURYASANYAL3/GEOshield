"use client";
// ============================================================================
// GEOShield — Multi-Horizon Recall (Recharts grouped bars)
// Verified Delta X100 numbers across 45min / 6h / 12h at P95, P99, P99.5.
// ============================================================================
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LabelList
} from "recharts";

const ISRO_ORANGE = "#FF6500";
const ISRO_CYAN = "#00B1FF";
const GREEN = "#35E0A1";
const GRID = "#1F2A44";
const TEXT_MUTED = "#A7B6DA";
const CARD_BG = "#111726";

// Verified from the multi-horizon table (seed 42 run, matches the deck).
const DATA = [
  { horizon: "30 min", R95: 0.948, R99: 0.939, R995: 0.869 },
  { horizon: "6 hours", R95: 0.774, R99: 0.528, R995: 0.262 },
  { horizon: "12 hours", R95: 0.718, R99: 0.442, R995: 0.270 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#0A0E1A", border: `1px solid ${GRID}`, borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>{label} ahead</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {(p.value * 100).toFixed(1)}% recall</div>
      ))}
    </div>
  );
}

export default function MultiHorizonChart() {
  return (
    <div style={{ background: CARD_BG, borderRadius: 12, border: `1px solid ${GRID}`, padding: "20px 16px", overflowX: "hidden", width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: 4 }}>
        <h3 style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 18, margin: 0 }}>
          Multi-Horizon Storm Recall
        </h3>
        <span style={{ color: ISRO_ORANGE, fontWeight: 600, fontSize: 13 }}>R99 @ 12h = 0.44 ± 0.01</span>
      </div>
      <p style={{ color: TEXT_MUTED, fontSize: 12, margin: "0 0 16px" }}>
        Fraction of threshold-crossing events caught, at three forecast horizons. Train ≤2016, test ≥2017.
      </p>
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", paddingBottom: "8px" }} className="scrollbar-thin"><div style={{ minWidth: "600px", height: "340px" }}><ResponsiveContainer width="100%" height="100%">
        <BarChart data={DATA} margin={{ top: 8, right: 16, left: 8, bottom: 4 }} barGap={4} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="horizon" stroke={TEXT_MUTED} fontSize={12} />
          <YAxis stroke={TEXT_MUTED} fontSize={11} domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            label={{ value: "Recall", angle: -90, position: "insideLeft", fill: TEXT_MUTED, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="R95" name="P95 (storm)" fill={ISRO_CYAN} radius={[4, 4, 0, 0]}>
            <LabelList dataKey="R95" position="top" formatter={(v) => v.toFixed(2)} style={{ fill: TEXT_MUTED, fontSize: 10 }} />
          </Bar>
          <Bar dataKey="R99" name="P99 (severe)" fill={ISRO_ORANGE} radius={[4, 4, 0, 0]}>
            <LabelList dataKey="R99" position="top" formatter={(v) => v.toFixed(2)} style={{ fill: TEXT_MUTED, fontSize: 10 }} />
          </Bar>
          <Bar dataKey="R995" name="P99.5 (extreme)" fill={GREEN} radius={[4, 4, 0, 0]}>
            <LabelList dataKey="R995" position="top" formatter={(v) => v.toFixed(2)} style={{ fill: TEXT_MUTED, fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer></div></div>
    </div>
  );
}
