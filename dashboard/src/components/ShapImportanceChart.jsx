"use client";
// ============================================================================
// GEOShield — SHAP Feature Importance (Recharts)
// Drop-in React component. Real verified values from the Colab SHAP cell.
// Solar wind = ~40% of importance (the physics-proof chart).
// ============================================================================
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from "recharts";

// ISRO BAH 2026 palette
const ISRO_ORANGE = "#FF6500";
const ISRO_CYAN = "#00B1FF";
const GRID = "#1F2A44";
const TEXT_MUTED = "#A7B6DA";
const CARD_BG = "#111726";

// Top-15 features by mean |SHAP value|, exactly as the notebook outputs them.
// Flux-history features are cyan, solar-wind features are orange (the 40% story).
const DATA = [
  { feature: "Electron_Flux_lag_12h", shap: 0.231, kind: "flux" },
  { feature: "Electron_Flux",         shap: 0.225, kind: "flux" },
  { feature: "flux_log_change_6h",    shap: 0.148, kind: "flux" },
  { feature: "Speed_km_s_max_24h",    shap: 0.097, kind: "wind" },
  { feature: "Speed_km_s_mean_24h",   shap: 0.074, kind: "wind" },
  { feature: "Electron_Flux_mean_3h", shap: 0.073, kind: "flux" },
  { feature: "Speed_km_s_mean_3h",    shap: 0.070, kind: "wind" },
  { feature: "Electron_Flux_lag_24h", shap: 0.063, kind: "flux" },
  { feature: "Proton_Density_n_cc",   shap: 0.054, kind: "wind" },
  { feature: "Electron_Flux_std_24h", shap: 0.049, kind: "flux" },
  { feature: "SYM_H_nT_mean_24h",     shap: 0.048, kind: "wind" },
  { feature: "Field_magnitude_avg_nT",shap: 0.037, kind: "wind" },
  { feature: "Electron_Flux_lag_45m", shap: 0.036, kind: "flux" },
  { feature: "SYM_H_nT_lag_6h",       shap: 0.034, kind: "wind" },
  { feature: "Electron_Flux_max_24h", shap: 0.033, kind: "flux" },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "#0A0E1A", border: `1px solid ${GRID}`,
      borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13
    }}>
      <div style={{ fontWeight: 600 }}>{d.feature}</div>
      <div style={{ color: d.kind === "wind" ? ISRO_ORANGE : ISRO_CYAN }}>
        mean |SHAP| = {d.shap.toFixed(3)}
      </div>
      <div style={{ color: TEXT_MUTED, fontSize: 11 }}>
        {d.kind === "wind" ? "Solar-wind driver" : "Flux-history driver"}
      </div>
    </div>
  );
}

export default function ShapImportanceChart() {
  return (
    <div style={{
      background: CARD_BG, borderRadius: 12, border: `1px solid ${GRID}`,
      padding: "20px 16px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h3 style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 18, margin: 0 }}>
          Feature Importance (SHAP)
        </h3>
        <span style={{ color: ISRO_ORANGE, fontWeight: 600, fontSize: 13 }}>
          Solar wind ≈ 40%
        </span>
      </div>
      <p style={{ color: TEXT_MUTED, fontSize: 12, margin: "0 0 16px" }}>
        The model learned real physics — solar-wind speed sits in the top features, not just flux autocorrelation.
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={DATA} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
          <XAxis
            type="number" stroke={TEXT_MUTED} fontSize={11}
            tickFormatter={(v) => v.toFixed(2)}
            label={{ value: "mean |SHAP value|", position: "insideBottom", offset: -2, fill: TEXT_MUTED, fontSize: 11 }}
          />
          <YAxis
            type="category" dataKey="feature" stroke={TEXT_MUTED}
            fontSize={10} width={150} tick={{ fill: TEXT_MUTED }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="shap" radius={[0, 4, 4, 0]} barSize={16}>
            {DATA.map((d, i) => (
              <Cell key={i} fill={d.kind === "wind" ? ISRO_ORANGE : ISRO_CYAN} />
            ))}
            <LabelList dataKey="shap" position="right" formatter={(v) => v.toFixed(3)}
              style={{ fill: TEXT_MUTED, fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12 }}>
        <span style={{ color: ISRO_CYAN }}>■ Flux history (~60%)</span>
        <span style={{ color: ISRO_ORANGE }}>■ Solar wind (~40%)</span>
      </div>
    </div>
  );
}
