"use client";
// ============================================================================
// GEOShield - April 2017 Storm Case Study (Recharts)
// Actual flux (1-HOUR resolution) vs Delta X100 12h-ahead forecast.
// Model trained <=2016; April 2017 completely unseen. Peak 330,105 = 5.6x P99.
// Data regenerated at 1-hour resolution (seed 42) so the curve reaches the
// real event peak (330,105), matching the deck/README exactly.
// ============================================================================
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts";

const ISRO_ORANGE = "#FF6500";
const ACTUAL = "#00B1FF";
const FORECAST = "#35E0A1";
const DANGER = "#FF6500";
const GRID = "#1F2A44";
const TEXT_MUTED = "#A7B6DA";
const CARD_BG = "#111726";
const P99 = 59153;

const STORM_DATA = [
  { t: "04-20 00:00", actual: 53, forecast: 52 },
  { t: "04-20 01:00", actual: 44, forecast: 57 },
  { t: "04-20 12:00", actual: 64, forecast: 552 },
  { t: "04-20 13:00", actual: 123, forecast: 385 },
  { t: "04-20 14:00", actual: 207, forecast: 243 },
  { t: "04-20 15:00", actual: 354, forecast: 208 },
  { t: "04-20 16:00", actual: 463, forecast: 198 },
  { t: "04-20 17:00", actual: 614, forecast: 197 },
  { t: "04-20 18:00", actual: 979, forecast: 278 },
  { t: "04-20 19:00", actual: 1621, forecast: 399 },
  { t: "04-20 20:00", actual: 1795, forecast: 474 },
  { t: "04-20 21:00", actual: 2115, forecast: 503 },
  { t: "04-20 22:00", actual: 2198, forecast: 564 },
  { t: "04-20 23:00", actual: 2345, forecast: 624 },
  { t: "04-21 00:00", actual: 2268, forecast: 821 },
  { t: "04-21 01:00", actual: 1960, forecast: 1299 },
  { t: "04-21 02:00", actual: 1490, forecast: 1565 },
  { t: "04-21 03:00", actual: 1490, forecast: 2301 },
  { t: "04-21 04:00", actual: 1261, forecast: 2689 },
  { t: "04-21 05:00", actual: 944, forecast: 2949 },
  { t: "04-21 06:00", actual: 744, forecast: 3174 },
  { t: "04-21 07:00", actual: 624, forecast: 3608 },
  { t: "04-21 08:00", actual: 726, forecast: 3833 },
  { t: "04-21 09:00", actual: 787, forecast: 4055 },
  { t: "04-21 10:00", actual: 853, forecast: 4064 },
  { t: "04-21 11:00", actual: 840, forecast: 3646 },
  { t: "04-21 12:00", actual: 1025, forecast: 2613 },
  { t: "04-21 13:00", actual: 755, forecast: 1548 },
  { t: "04-21 14:00", actual: 1023, forecast: 1083 },
  { t: "04-21 15:00", actual: 2035, forecast: 774 },
  { t: "04-21 16:00", actual: 2144, forecast: 456 },
  { t: "04-21 17:00", actual: 2710, forecast: 379 },
  { t: "04-21 18:00", actual: 3417, forecast: 266 },
  { t: "04-21 19:00", actual: 3043, forecast: 198 },
  { t: "04-21 20:00", actual: 2835, forecast: 169 },
  { t: "04-21 21:00", actual: 1221, forecast: 478 },
  { t: "04-21 22:00", actual: 452, forecast: 1214 },
  { t: "04-21 23:00", actual: 450, forecast: 1995 },
  { t: "04-22 00:00", actual: 359, forecast: 3098 },
  { t: "04-22 01:00", actual: 193, forecast: 1793 },
  { t: "04-22 02:00", actual: 78, forecast: 1835 },
  { t: "04-22 03:00", actual: 152, forecast: 3758 },
  { t: "04-22 04:00", actual: 76, forecast: 2686 },
  { t: "04-22 05:00", actual: 126, forecast: 3091 },
  { t: "04-22 06:00", actual: 101, forecast: 3755 },
  { t: "04-22 07:00", actual: 317, forecast: 6795 },
  { t: "04-22 08:00", actual: 498, forecast: 5793 },
  { t: "04-22 09:00", actual: 303, forecast: 3534 },
  { t: "04-22 10:00", actual: 413, forecast: 2552 },
  { t: "04-22 11:00", actual: 119, forecast: 3039 },
  { t: "04-22 12:00", actual: 225, forecast: 2935 },
  { t: "04-22 13:00", actual: 267, forecast: 2297 },
  { t: "04-22 14:00", actual: 830, forecast: 3660 },
  { t: "04-22 15:00", actual: 3294, forecast: 5261 },
  { t: "04-22 16:00", actual: 3486, forecast: 7661 },
  { t: "04-22 17:00", actual: 8335, forecast: 4516 },
  { t: "04-22 18:00", actual: 11921, forecast: 4756 },
  { t: "04-22 19:00", actual: 17475, forecast: 4569 },
  { t: "04-22 20:00", actual: 20487, forecast: 5548 },
  { t: "04-22 21:00", actual: 22265, forecast: 3164 },
  { t: "04-22 22:00", actual: 16210, forecast: 5431 },
  { t: "04-22 23:00", actual: 9960, forecast: 4751 },
  { t: "04-23 00:00", actual: 6323, forecast: 2429 },
  { t: "04-23 01:00", actual: 3451, forecast: 2945 },
  { t: "04-23 02:00", actual: 2232, forecast: 4728 },
  { t: "04-23 03:00", actual: 988, forecast: 14490 },
  { t: "04-23 04:00", actual: 758, forecast: 16904 },
  { t: "04-23 05:00", actual: 988, forecast: 46604 },
  { t: "04-23 06:00", actual: 1141, forecast: 49286 },
  { t: "04-23 07:00", actual: 2335, forecast: 60885 },
  { t: "04-23 08:00", actual: 1526, forecast: 45036 },
  { t: "04-23 09:00", actual: 1915, forecast: 63081 },
  { t: "04-23 10:00", actual: 883, forecast: 44305 },
  { t: "04-23 11:00", actual: 787, forecast: 41742 },
  { t: "04-23 12:00", actual: 978, forecast: 46313 },
  { t: "04-23 13:00", actual: 2972, forecast: 40060 },
  { t: "04-23 14:00", actual: 6683, forecast: 23263 },
  { t: "04-23 15:00", actual: 13210, forecast: 15207 },
  { t: "04-23 16:00", actual: 17784, forecast: 11893 },
  { t: "04-23 17:00", actual: 45034, forecast: 13494 },
  { t: "04-23 18:00", actual: 50710, forecast: 10573 },
  { t: "04-23 19:00", actual: 71774, forecast: 16816 },
  { t: "04-23 20:00", actual: 103867, forecast: 18093 },
  { t: "04-23 21:00", actual: 72547, forecast: 16635 },
  { t: "04-23 22:00", actual: 74055, forecast: 13424 },
  { t: "04-23 23:00", actual: 80568, forecast: 14066 },
  { t: "04-24 00:00", actual: 53664, forecast: 14681 },
  { t: "04-24 01:00", actual: 73421, forecast: 23197 },
  { t: "04-24 02:00", actual: 39996, forecast: 45006 },
  { t: "04-24 03:00", actual: 20365, forecast: 77107 },
  { t: "04-24 04:00", actual: 13100, forecast: 89411 },
  { t: "04-24 05:00", actual: 12002, forecast: 69185 },
  { t: "04-24 06:00", actual: 44056, forecast: 104728 },
  { t: "04-24 07:00", actual: 24388, forecast: 116544 },
  { t: "04-24 08:00", actual: 9987, forecast: 95625 },
  { t: "04-24 09:00", actual: 48988, forecast: 105677 },
  { t: "04-24 10:00", actual: 10448, forecast: 98618 },
  { t: "04-24 11:00", actual: 9657, forecast: 88701 },
  { t: "04-24 12:00", actual: 20454, forecast: 114358 },
  { t: "04-24 13:00", actual: 25540, forecast: 121551 },
  { t: "04-24 14:00", actual: 28106, forecast: 55553 },
  { t: "04-24 15:00", actual: 57921, forecast: 50495 },
  { t: "04-24 16:00", actual: 93929, forecast: 25475 },
  { t: "04-24 17:00", actual: 165522, forecast: 23975 },
  { t: "04-24 18:00", actual: 241657, forecast: 44461 },
  { t: "04-24 19:00", actual: 240523, forecast: 35465 },
  { t: "04-24 20:00", actual: 197268, forecast: 29050 },
  { t: "04-24 21:00", actual: 233428, forecast: 47679 },
  { t: "04-24 22:00", actual: 169460, forecast: 27555 },
  { t: "04-24 23:00", actual: 91086, forecast: 22917 },
  { t: "04-25 00:00", actual: 67755, forecast: 31370 },
  { t: "04-25 01:00", actual: 74845, forecast: 33984 },
  { t: "04-25 02:00", actual: 39864, forecast: 44754 },
  { t: "04-25 03:00", actual: 28529, forecast: 94588 },
  { t: "04-25 04:00", actual: 26316, forecast: 125719 },
  { t: "04-25 05:00", actual: 33103, forecast: 151281 },
  { t: "04-25 06:00", actual: 21350, forecast: 154290 },
  { t: "04-25 07:00", actual: 11884, forecast: 108040 },
  { t: "04-25 08:00", actual: 8996, forecast: 79867 },
  { t: "04-25 09:00", actual: 17124, forecast: 101264 },
  { t: "04-25 10:00", actual: 14345, forecast: 80299 },
  { t: "04-25 11:00", actual: 11797, forecast: 68108 },
  { t: "04-25 12:00", actual: 20170, forecast: 60284 },
  { t: "04-25 13:00", actual: 32399, forecast: 51893 },
  { t: "04-25 14:00", actual: 51755, forecast: 47062 },
  { t: "04-25 15:00", actual: 80434, forecast: 29036 },
  { t: "04-25 16:00", actual: 117419, forecast: 36456 },
  { t: "04-25 17:00", actual: 147611, forecast: 34102 },
  { t: "04-25 18:00", actual: 167241, forecast: 24693 },
  { t: "04-25 19:00", actual: 193520, forecast: 23036 },
  { t: "04-25 20:00", actual: 214182, forecast: 22542 },
  { t: "04-25 21:00", actual: 225870, forecast: 26389 },
  { t: "04-25 22:00", actual: 216736, forecast: 19312 },
  { t: "04-25 23:00", actual: 185842, forecast: 17559 },
  { t: "04-26 00:00", actual: 121132, forecast: 19908 },
  { t: "04-26 01:00", actual: 80269, forecast: 24112 },
  { t: "04-26 02:00", actual: 77811, forecast: 71226 },
  { t: "04-26 03:00", actual: 48734, forecast: 94900 },
  { t: "04-26 04:00", actual: 31169, forecast: 93409 },
  { t: "04-26 05:00", actual: 25200, forecast: 82166 },
  { t: "04-26 06:00", actual: 21631, forecast: 78679 },
  { t: "04-26 07:00", actual: 36207, forecast: 94220 },
  { t: "04-26 08:00", actual: 51791, forecast: 124764 },
  { t: "04-26 09:00", actual: 31492, forecast: 110487 },
  { t: "04-26 10:00", actual: 28333, forecast: 74720 },
  { t: "04-26 11:00", actual: 40560, forecast: 69516 },
  { t: "04-26 12:00", actual: 53599, forecast: 70686 },
  { t: "04-26 13:00", actual: 86435, forecast: 74506 },
  { t: "04-26 14:00", actual: 100523, forecast: 80500 },
  { t: "04-26 15:00", actual: 135384, forecast: 48601 },
  { t: "04-26 16:00", actual: 164330, forecast: 32699 },
  { t: "04-26 17:00", actual: 207786, forecast: 39729 },
  { t: "04-26 18:00", actual: 263375, forecast: 36770 },
  { t: "04-26 19:00", actual: 318768, forecast: 45016 },
  { t: "04-26 20:00", actual: 330105, forecast: 72677 },
  { t: "04-26 21:00", actual: 252162, forecast: 44413 },
  { t: "04-26 22:00", actual: 228070, forecast: 58702 },
  { t: "04-26 23:00", actual: 185496, forecast: 78342 },
  { t: "04-27 00:00", actual: 153538, forecast: 111957 },
  { t: "04-27 01:00", actual: 147204, forecast: 152234 },
  { t: "04-27 02:00", actual: 124753, forecast: 177485 },
  { t: "04-27 03:00", actual: 97719, forecast: 165820 },
  { t: "04-27 04:00", actual: 69686, forecast: 142321 },
  { t: "04-27 05:00", actual: 64841, forecast: 142700 },
  { t: "04-27 06:00", actual: 121207, forecast: 153827 },
  { t: "04-27 07:00", actual: 66153, forecast: 125820 },
  { t: "04-27 08:00", actual: 111646, forecast: 172356 },
  { t: "04-27 09:00", actual: 82032, forecast: 120320 },
  { t: "04-27 10:00", actual: 93737, forecast: 99282 },
  { t: "04-27 11:00", actual: 92488, forecast: 70510 },
  { t: "04-27 12:00", actual: 89959, forecast: 146586 },
  { t: "04-27 13:00", actual: 96488, forecast: 76998 },
  { t: "04-27 14:00", actual: 100103, forecast: 115098 },
  { t: "04-27 15:00", actual: 115877, forecast: 74624 },
  { t: "04-27 16:00", actual: 131911, forecast: 70895 },
  { t: "04-27 17:00", actual: 163031, forecast: 71814 },
  { t: "04-27 18:00", actual: 217731, forecast: 108807 },
  { t: "04-27 19:00", actual: 231647, forecast: 75953 },
  { t: "04-27 20:00", actual: 230532, forecast: 83517 },
  { t: "04-27 21:00", actual: 212935, forecast: 78000 },
  { t: "04-27 22:00", actual: 193596, forecast: 83905 },
  { t: "04-27 23:00", actual: 178258, forecast: 100140 },
  { t: "04-28 00:00", actual: 149304, forecast: 129428 },
  { t: "04-28 01:00", actual: 126802, forecast: 129981 },
  { t: "04-28 02:00", actual: 103040, forecast: 126107 },
  { t: "04-28 03:00", actual: 84436, forecast: 115916 },
  { t: "04-28 04:00", actual: 72242, forecast: 112568 },
  { t: "04-28 05:00", actual: 44428, forecast: 84524 },
  { t: "04-28 06:00", actual: 32889, forecast: 73736 },
  { t: "04-28 07:00", actual: 28501, forecast: 63934 },
  { t: "04-28 08:00", actual: 30815, forecast: 69793 },
  { t: "04-28 09:00", actual: 43020, forecast: 105561 },
  { t: "04-28 10:00", actual: 55750, forecast: 113268 },
  { t: "04-28 11:00", actual: 60400, forecast: 76182 },
  { t: "04-28 12:00", actual: 62409, forecast: 53430 },
  { t: "04-28 13:00", actual: 71490, forecast: 42872 },
  { t: "04-28 14:00", actual: 86772, forecast: 43459 },
  { t: "04-28 15:00", actual: 94151, forecast: 44389 },
  { t: "04-28 16:00", actual: 106468, forecast: 53424 },
  { t: "04-28 17:00", actual: 110466, forecast: 36955 },
  { t: "04-28 18:00", actual: 119108, forecast: 38157 },
  { t: "04-28 19:00", actual: 139150, forecast: 45635 },
  { t: "04-28 20:00", actual: 149474, forecast: 34625 },
  { t: "04-28 21:00", actual: 147493, forecast: 27451 },
  { t: "04-28 22:00", actual: 124970, forecast: 19225 },
  { t: "04-28 23:00", actual: 85675, forecast: 17418 },
  { t: "04-29 00:00", actual: 58827, forecast: 16692 },
  { t: "04-29 01:00", actual: 44136, forecast: 24357 },
  { t: "04-29 02:00", actual: 33212, forecast: 20477 },
  { t: "04-29 03:00", actual: 23733, forecast: 16674 },
  { t: "04-29 04:00", actual: 23054, forecast: 17864 },
  { t: "04-29 05:00", actual: 18819, forecast: 25881 },
  { t: "04-29 06:00", actual: 12890, forecast: 20111 },
  { t: "04-29 07:00", actual: 10397, forecast: 21728 },
  { t: "04-29 08:00", actual: 10889, forecast: 4887 },
  { t: "04-29 09:00", actual: 6766, forecast: 3458 },
  { t: "04-29 10:00", actual: 7086, forecast: 4695 },
  { t: "04-29 11:00", actual: 11329, forecast: 5672 },
  { t: "04-29 12:00", actual: 16293, forecast: 8124 },
  { t: "04-29 13:00", actual: 19068, forecast: 8869 },
  { t: "04-29 14:00", actual: 23808, forecast: 9753 },
  { t: "04-29 15:00", actual: 21450, forecast: 6472 },
  { t: "04-29 16:00", actual: 22728, forecast: 6498 },
  { t: "04-29 17:00", actual: 30949, forecast: 6591 },
  { t: "04-29 18:00", actual: 50889, forecast: 4176 },
  { t: "04-29 19:00", actual: 66342, forecast: 4627 },
  { t: "04-29 20:00", actual: 72937, forecast: 4256 },
  { t: "04-29 21:00", actual: 68164, forecast: 2666 },
  { t: "04-29 22:00", actual: 44962, forecast: 2744 },
  { t: "04-29 23:00", actual: 28851, forecast: 3093 },
  { t: "04-30 00:00", actual: 25632, forecast: 4618 },
];

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

export default function April2017Chart() {
  return (
    <div style={{ background: CARD_BG, borderRadius: 12, border: `1px solid ${GRID}`, padding: "20px 16px", overflowX: "hidden", width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: 4 }}>
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
          <XAxis dataKey="t" stroke={TEXT_MUTED} fontSize={11} interval={27} minTickGap={20} tickFormatter={(v) => v.slice(0, 5)} />
          <YAxis scale="log" domain={[10, 400000]} stroke={TEXT_MUTED} fontSize={11}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
            label={{ value: "Electron flux (log)", angle: -90, position: "insideLeft", fill: TEXT_MUTED, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={P99} stroke={DANGER} strokeDasharray="6 4" strokeWidth={1.5}
            label={{ position: 'insideTopLeft', value: 'P99 LIMIT (TRAIN-ONLY)', fill: 'var(--isro-orange)', fontSize: 12, fontWeight: 600 }} />
          <Line type="monotone" dataKey="actual" name="Actual flux" stroke={ACTUAL} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="forecast" name="Forecast (12h ahead)" stroke={FORECAST} strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
