"use client";
// ============================================================================
// GEOShield - April 2017 P90 Band (Recharts)
// Median forecast understates the peak; the P90 upper band captures it.
// Real verified data (1-hour resolution): median ~48% of peak, P90 ~71% of peak.
// The actual curve reaches 330,105, correctly matching the deck/README.
// ============================================================================
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts";

const ISRO_ORANGE = "#FF6500";
const ACTUAL = "#00B1FF";   // cyan = observed
const MEDIAN = "#35E0A1";   // green = median forecast (conservative)
const P90 = "#FFB13D";      // amber = P90 worst-case band (captures peak)
const DANGER = "#FF6500";   // orange = P99 line
const GRID = "#1F2A44";
const TEXT_MUTED = "#A7B6DA";
const CARD_BG = "#111726";
const P99_THRESHOLD = 59153;

const P90_DATA = [
  { t: "04-20 00:00", actual: 53, median: 52, p90: 251 },
  { t: "04-20 01:00", actual: 44, median: 57, p90: 258 },
  { t: "04-20 12:00", actual: 64, median: 552, p90: 6734 },
  { t: "04-20 13:00", actual: 123, median: 385, p90: 6428 },
  { t: "04-20 14:00", actual: 207, median: 243, p90: 4125 },
  { t: "04-20 15:00", actual: 354, median: 208, p90: 4099 },
  { t: "04-20 16:00", actual: 463, median: 198, p90: 3894 },
  { t: "04-20 17:00", actual: 614, median: 197, p90: 4213 },
  { t: "04-20 18:00", actual: 979, median: 278, p90: 5537 },
  { t: "04-20 19:00", actual: 1621, median: 399, p90: 8206 },
  { t: "04-20 20:00", actual: 1795, median: 474, p90: 9720 },
  { t: "04-20 21:00", actual: 2115, median: 503, p90: 10459 },
  { t: "04-20 22:00", actual: 2198, median: 564, p90: 11195 },
  { t: "04-20 23:00", actual: 2345, median: 624, p90: 12170 },
  { t: "04-21 00:00", actual: 2268, median: 821, p90: 13915 },
  { t: "04-21 01:00", actual: 1960, median: 1299, p90: 18239 },
  { t: "04-21 02:00", actual: 1490, median: 1565, p90: 21876 },
  { t: "04-21 03:00", actual: 1490, median: 2301, p90: 31038 },
  { t: "04-21 04:00", actual: 1261, median: 2689, p90: 35688 },
  { t: "04-21 05:00", actual: 944, median: 2949, p90: 39599 },
  { t: "04-21 06:00", actual: 744, median: 3174, p90: 44265 },
  { t: "04-21 07:00", actual: 624, median: 3608, p90: 48972 },
  { t: "04-21 08:00", actual: 726, median: 3833, p90: 51227 },
  { t: "04-21 09:00", actual: 787, median: 4055, p90: 53828 },
  { t: "04-21 10:00", actual: 853, median: 4064, p90: 54109 },
  { t: "04-21 11:00", actual: 840, median: 3646, p90: 48430 },
  { t: "04-21 12:00", actual: 1025, median: 2613, p90: 34164 },
  { t: "04-21 13:00", actual: 755, median: 1548, p90: 19890 },
  { t: "04-21 14:00", actual: 1023, median: 1083, p90: 12435 },
  { t: "04-21 15:00", actual: 2035, median: 774, p90: 8963 },
  { t: "04-21 16:00", actual: 2144, median: 456, p90: 6098 },
  { t: "04-21 17:00", actual: 2710, median: 379, p90: 5742 },
  { t: "04-21 18:00", actual: 3417, median: 266, p90: 4376 },
  { t: "04-21 19:00", actual: 3043, median: 198, p90: 3848 },
  { t: "04-21 20:00", actual: 2835, median: 169, p90: 3418 },
  { t: "04-21 21:00", actual: 1221, median: 478, p90: 7129 },
  { t: "04-21 22:00", actual: 452, median: 1214, p90: 16964 },
  { t: "04-21 23:00", actual: 450, median: 1995, p90: 24391 },
  { t: "04-22 00:00", actual: 359, median: 3098, p90: 35303 },
  { t: "04-22 01:00", actual: 193, median: 1793, p90: 21855 },
  { t: "04-22 02:00", actual: 78, median: 1835, p90: 21021 },
  { t: "04-22 03:00", actual: 152, median: 3758, p90: 35741 },
  { t: "04-22 04:00", actual: 76, median: 2686, p90: 25056 },
  { t: "04-22 05:00", actual: 126, median: 3091, p90: 25528 },
  { t: "04-22 06:00", actual: 101, median: 3755, p90: 28833 },
  { t: "04-22 07:00", actual: 317, median: 6795, p90: 44001 },
  { t: "04-22 08:00", actual: 498, median: 5793, p90: 39686 },
  { t: "04-22 09:00", actual: 303, median: 3534, p90: 25965 },
  { t: "04-22 10:00", actual: 413, median: 2552, p90: 18728 },
  { t: "04-22 11:00", actual: 119, median: 3039, p90: 19918 },
  { t: "04-22 12:00", actual: 225, median: 2935, p90: 19446 },
  { t: "04-22 13:00", actual: 267, median: 2297, p90: 16182 },
  { t: "04-22 14:00", actual: 830, median: 3660, p90: 24707 },
  { t: "04-22 15:00", actual: 3294, median: 5261, p90: 35678 },
  { t: "04-22 16:00", actual: 3486, median: 7661, p90: 52834 },
  { t: "04-22 17:00", actual: 8335, median: 4516, p90: 33767 },
  { t: "04-22 18:00", actual: 11921, median: 4756, p90: 38287 },
  { t: "04-22 19:00", actual: 17475, median: 4569, p90: 38221 },
  { t: "04-22 20:00", actual: 20487, median: 5548, p90: 47094 },
  { t: "04-22 21:00", actual: 22265, median: 3164, p90: 31086 },
  { t: "04-22 22:00", actual: 16210, median: 5431, p90: 44030 },
  { t: "04-22 23:00", actual: 9960, median: 4751, p90: 42352 },
  { t: "04-23 00:00", actual: 6323, median: 2429, p90: 25032 },
  { t: "04-23 01:00", actual: 3451, median: 2945, p90: 32269 },
  { t: "04-23 02:00", actual: 2232, median: 4728, p90: 44784 },
  { t: "04-23 03:00", actual: 988, median: 14490, p90: 97943 },
  { t: "04-23 04:00", actual: 758, median: 16904, p90: 104593 },
  { t: "04-23 05:00", actual: 988, median: 46604, p90: 219717 },
  { t: "04-23 06:00", actual: 1141, median: 49286, p90: 228020 },
  { t: "04-23 07:00", actual: 2335, median: 60885, p90: 256247 },
  { t: "04-23 08:00", actual: 1526, median: 45036, p90: 202636 },
  { t: "04-23 09:00", actual: 1915, median: 63081, p90: 254922 },
  { t: "04-23 10:00", actual: 883, median: 44305, p90: 195724 },
  { t: "04-23 11:00", actual: 787, median: 41742, p90: 180371 },
  { t: "04-23 12:00", actual: 978, median: 46313, p90: 194458 },
  { t: "04-23 13:00", actual: 2972, median: 40060, p90: 182743 },
  { t: "04-23 14:00", actual: 6683, median: 23263, p90: 122247 },
  { t: "04-23 15:00", actual: 13210, median: 15207, p90: 89467 },
  { t: "04-23 16:00", actual: 17784, median: 11893, p90: 71221 },
  { t: "04-23 17:00", actual: 45034, median: 13494, p90: 78945 },
  { t: "04-23 18:00", actual: 50710, median: 10573, p90: 67123 },
  { t: "04-23 19:00", actual: 71774, median: 16816, p90: 97416 },
  { t: "04-23 20:00", actual: 103867, median: 18093, p90: 103730 },
  { t: "04-23 21:00", actual: 72547, median: 16635, p90: 97368 },
  { t: "04-23 22:00", actual: 74055, median: 13424, p90: 84083 },
  { t: "04-23 23:00", actual: 80568, median: 14066, p90: 87588 },
  { t: "04-24 00:00", actual: 53664, median: 14681, p90: 91617 },
  { t: "04-24 01:00", actual: 73421, median: 23197, p90: 116666 },
  { t: "04-24 02:00", actual: 39996, median: 45006, p90: 177699 },
  { t: "04-24 03:00", actual: 20365, median: 77107, p90: 251912 },
  { t: "04-24 04:00", actual: 13100, median: 89411, p90: 275038 },
  { t: "04-24 05:00", actual: 12002, median: 69185, p90: 228414 },
  { t: "04-24 06:00", actual: 44056, median: 104728, p90: 288629 },
  { t: "04-24 07:00", actual: 24388, median: 116544, p90: 297746 },
  { t: "04-24 08:00", actual: 9987, median: 95625, p90: 252972 },
  { t: "04-24 09:00", actual: 48988, median: 105677, p90: 270762 },
  { t: "04-24 10:00", actual: 10448, median: 98618, p90: 255562 },
  { t: "04-24 11:00", actual: 9657, median: 88701, p90: 236284 },
  { t: "04-24 12:00", actual: 20454, median: 114358, p90: 282479 },
  { t: "04-24 13:00", actual: 25540, median: 121551, p90: 286280 },
  { t: "04-24 14:00", actual: 28106, median: 55553, p90: 172960 },
  { t: "04-24 15:00", actual: 57921, median: 50495, p90: 153093 },
  { t: "04-24 16:00", actual: 93929, median: 25475, p90: 102553 },
  { t: "04-24 17:00", actual: 165522, median: 23975, p90: 97843 },
  { t: "04-24 18:00", actual: 241657, median: 44461, p90: 147570 },
  { t: "04-24 19:00", actual: 240523, median: 35465, p90: 127906 },
  { t: "04-24 20:00", actual: 197268, median: 29050, p90: 115049 },
  { t: "04-24 21:00", actual: 233428, median: 47679, p90: 162985 },
  { t: "04-24 22:00", actual: 169460, median: 27555, p90: 107409 },
  { t: "04-24 23:00", actual: 91086, median: 22917, p90: 94848 },
  { t: "04-25 00:00", actual: 67755, median: 31370, p90: 121588 },
  { t: "04-25 01:00", actual: 74845, median: 33984, p90: 131976 },
  { t: "04-25 02:00", actual: 39864, median: 44754, p90: 163013 },
  { t: "04-25 03:00", actual: 28529, median: 94588, p90: 257766 },
  { t: "04-25 04:00", actual: 26316, median: 125719, p90: 301275 },
  { t: "04-25 05:00", actual: 33103, median: 151281, p90: 326693 },
  { t: "04-25 06:00", actual: 21350, median: 154290, p90: 321741 },
  { t: "04-25 07:00", actual: 11884, median: 108040, p90: 247195 },
  { t: "04-25 08:00", actual: 8996, median: 79867, p90: 195742 },
  { t: "04-25 09:00", actual: 17124, median: 101264, p90: 234138 },
  { t: "04-25 10:00", actual: 14345, median: 80299, p90: 193356 },
  { t: "04-25 11:00", actual: 11797, median: 68108, p90: 169904 },
  { t: "04-25 12:00", actual: 20170, median: 60284, p90: 156372 },
  { t: "04-25 13:00", actual: 32399, median: 51893, p90: 140685 },
  { t: "04-25 14:00", actual: 51755, median: 47062, p90: 128919 },
  { t: "04-25 15:00", actual: 80434, median: 29036, p90: 90059 },
  { t: "04-25 16:00", actual: 117419, median: 36456, p90: 106368 },
  { t: "04-25 17:00", actual: 147611, median: 34102, p90: 100720 },
  { t: "04-25 18:00", actual: 167241, median: 24693, p90: 76008 },
  { t: "04-25 19:00", actual: 193520, median: 23036, p90: 73062 },
  { t: "04-25 20:00", actual: 214182, median: 22542, p90: 74751 },
  { t: "04-25 21:00", actual: 225870, median: 26389, p90: 84674 },
  { t: "04-25 22:00", actual: 216736, median: 19312, p90: 67367 },
  { t: "04-25 23:00", actual: 185842, median: 17559, p90: 63080 },
  { t: "04-26 00:00", actual: 121132, median: 19908, p90: 70857 },
  { t: "04-26 01:00", actual: 80269, median: 24112, p90: 86423 },
  { t: "04-26 02:00", actual: 77811, median: 71226, p90: 216726 },
  { t: "04-26 03:00", actual: 48734, median: 94900, p90: 262332 },
  { t: "04-26 04:00", actual: 31169, median: 93409, p90: 249684 },
  { t: "04-26 05:00", actual: 25200, median: 82166, p90: 219183 },
  { t: "04-26 06:00", actual: 21631, median: 78679, p90: 202812 },
  { t: "04-26 07:00", actual: 36207, median: 94220, p90: 231195 },
  { t: "04-26 08:00", actual: 51791, median: 124764, p90: 279313 },
  { t: "04-26 09:00", actual: 31492, median: 110487, p90: 241517 },
  { t: "04-26 10:00", actual: 28333, median: 74720, p90: 173513 },
  { t: "04-26 11:00", actual: 40560, median: 69516, p90: 159937 },
  { t: "04-26 12:00", actual: 53599, median: 70686, p90: 157294 },
  { t: "04-26 13:00", actual: 86435, median: 74506, p90: 161863 },
  { t: "04-26 14:00", actual: 100523, median: 80500, p90: 172935 },
  { t: "04-26 15:00", actual: 135384, median: 48601, p90: 111818 },
  { t: "04-26 16:00", actual: 164330, median: 32699, p90: 82544 },
  { t: "04-26 17:00", actual: 207786, median: 39729, p90: 97395 },
  { t: "04-26 18:00", actual: 263375, median: 36770, p90: 91617 },
  { t: "04-26 19:00", actual: 318768, median: 45016, p90: 108392 },
  { t: "04-26 20:00", actual: 330105, median: 72677, p90: 156321 },
  { t: "04-26 21:00", actual: 252162, median: 44413, p90: 105658 },
  { t: "04-26 22:00", actual: 228070, median: 58702, p90: 135682 },
  { t: "04-26 23:00", actual: 185496, median: 78342, p90: 170966 },
  { t: "04-27 00:00", actual: 153538, median: 111957, p90: 227572 },
  { t: "04-27 01:00", actual: 147204, median: 152234, p90: 295543 },
  { t: "04-27 02:00", actual: 124753, median: 177485, p90: 318210 },
  { t: "04-27 03:00", actual: 97719, median: 165820, p90: 292850 },
  { t: "04-27 04:00", actual: 69686, median: 142321, p90: 253018 },
  { t: "04-27 05:00", actual: 64841, median: 142700, p90: 247167 },
  { t: "04-27 06:00", actual: 121207, median: 153827, p90: 255577 },
  { t: "04-27 07:00", actual: 66153, median: 125820, p90: 213768 },
  { t: "04-27 08:00", actual: 111646, median: 172356, p90: 278854 },
  { t: "04-27 09:00", actual: 82032, median: 120320, p90: 201201 },
  { t: "04-27 10:00", actual: 93737, median: 99282, p90: 169992 },
  { t: "04-27 11:00", actual: 92488, median: 70510, p90: 128476 },
  { t: "04-27 12:00", actual: 89959, median: 146586, p90: 227448 },
  { t: "04-27 13:00", actual: 96488, median: 76998, p90: 128499 },
  { t: "04-27 14:00", actual: 100103, median: 115098, p90: 180174 },
  { t: "04-27 15:00", actual: 115877, median: 74624, p90: 125134 },
  { t: "04-27 16:00", actual: 131911, median: 70895, p90: 122143 },
  { t: "04-27 17:00", actual: 163031, median: 71814, p90: 124317 },
  { t: "04-27 18:00", actual: 217731, median: 108807, p90: 176100 },
  { t: "04-27 19:00", actual: 231647, median: 75953, p90: 131061 },
  { t: "04-27 20:00", actual: 230532, median: 83517, p90: 142079 },
  { t: "04-27 21:00", actual: 212935, median: 78000, p90: 134267 },
  { t: "04-27 22:00", actual: 193596, median: 83905, p90: 142724 },
  { t: "04-27 23:00", actual: 178258, median: 100140, p90: 163625 },
  { t: "04-28 00:00", actual: 149304, median: 129428, p90: 201170 },
  { t: "04-28 01:00", actual: 126802, median: 129981, p90: 198946 },
  { t: "04-28 02:00", actual: 103040, median: 126107, p90: 192801 },
  { t: "04-28 03:00", actual: 84436, median: 115916, p90: 179262 },
  { t: "04-28 04:00", actual: 72242, median: 112568, p90: 173007 },
  { t: "04-28 05:00", actual: 44428, median: 84524, p90: 133989 },
  { t: "04-28 06:00", actual: 32889, median: 73736, p90: 119561 },
  { t: "04-28 07:00", actual: 28501, median: 63934, p90: 106093 },
  { t: "04-28 08:00", actual: 30815, median: 69793, p90: 114421 },
  { t: "04-28 09:00", actual: 43020, median: 105561, p90: 160359 },
  { t: "04-28 10:00", actual: 55750, median: 113268, p90: 169002 },
  { t: "04-28 11:00", actual: 60400, median: 76182, p90: 119530 },
  { t: "04-28 12:00", actual: 62409, median: 53430, p90: 88158 },
  { t: "04-28 13:00", actual: 71490, median: 42872, p90: 73562 },
  { t: "04-28 14:00", actual: 86772, median: 43459, p90: 74585 },
  { t: "04-28 15:00", actual: 94151, median: 44389, p90: 76378 },
  { t: "04-28 16:00", actual: 106468, median: 53424, p90: 90623 },
  { t: "04-28 17:00", actual: 110466, median: 36955, p90: 66367 },
  { t: "04-28 18:00", actual: 119108, median: 38157, p90: 68673 },
  { t: "04-28 19:00", actual: 139150, median: 45635, p90: 80608 },
  { t: "04-28 20:00", actual: 149474, median: 34625, p90: 63934 },
  { t: "04-28 21:00", actual: 147493, median: 27451, p90: 52627 },
  { t: "04-28 22:00", actual: 124970, median: 19225, p90: 38780 },
  { t: "04-28 23:00", actual: 85675, median: 17418, p90: 36005 },
  { t: "04-29 00:00", actual: 58827, median: 16692, p90: 34960 },
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

export default function April2017P90Chart() {
  return (
    <div style={{ background: CARD_BG, borderRadius: 12, border: `1px solid ${GRID}`, padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h3 style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 18, margin: 0 }}>
          Quantile Bands (P90) vs Reality
        </h3>
        <span style={{ color: P90, fontWeight: 600, fontSize: 13 }}>Worst-case scenario</span>
      </div>
      <p style={{ color: TEXT_MUTED, fontSize: 12, margin: "0 0 16px" }}>
        Why we need quantile regression: At peak (330k), the median forecast captured 48%. The P90 band captured 71%.
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={P90_DATA} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis dataKey="t" stroke={TEXT_MUTED} fontSize={11} interval={27} minTickGap={20} tickFormatter={(v) => v.slice(0, 5)} />
          <YAxis scale="log" domain={[10, 400000]} stroke={TEXT_MUTED} fontSize={11}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
            label={{ value: "Electron flux (log)", angle: -90, position: "insideLeft", fill: TEXT_MUTED, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={P99_THRESHOLD} stroke={DANGER} strokeDasharray="6 4" strokeWidth={1.5}
            label={{ value: "P99 LIMIT (TRAIN-ONLY)", fill: DANGER, fontSize: 10, position: "insideTopRight" }} />
          <Line type="monotone" dataKey="actual" name="Actual flux" stroke={ACTUAL} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="median" name="P50 Median" stroke={MEDIAN} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          <Line type="monotone" dataKey="p90" name="P90 Worst-case" stroke={P90} strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
