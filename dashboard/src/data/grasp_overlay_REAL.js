// ============================================================================
// REAL GRASP overlay data — replaces the `actual * 0.933` hack.
// Genuine GRASP (Indian-longitude, 48°E) vs GOES-15 measurements, March 2018
// storm window, 12-hourly. Both are REAL satellite data from the parquet files.
//
// WHY THIS MATTERS: the real grasp/goes ratio ranges 0.02 to 3.81 — it is NOT a
// constant multiplier. GRASP at the Indian longitude reads very differently from
// GOES (different orbital slot, magnetic local time, instrument). Plotting the
// real values shows two genuine instruments tracking the same storm with
// different local levels — which is exactly your scientific story (model learns
// TIMING globally, GRASP validates the LEVEL locally). The 0.933 multiplier
// destroyed that story and would be caught instantly by an ISRO engineer.
// ============================================================================

export const GRASP_OVERLAY = [
  { t: "03/17 00h", goes: 1163,  grasp: 522 },
  { t: "03/17 12h", goes: 4478,  grasp: 134 },
  { t: "03/18 00h", goes: 2144,  grasp: 654 },
  { t: "03/18 12h", goes: 1916,  grasp: 165 },
  { t: "03/19 00h", goes: 1123,  grasp: 692 },
  { t: "03/19 12h", goes: 13887, grasp: 370 },
  { t: "03/20 00h", goes: 5713,  grasp: 1030 },
  { t: "03/20 12h", goes: 15723, grasp: 456 },
  { t: "03/21 00h", goes: 6424,  grasp: 859 },
  { t: "03/21 12h", goes: 13903, grasp: 414 },
  { t: "03/22 00h", goes: 3522,  grasp: 541 },
  { t: "03/22 12h", goes: 6460,  grasp: 532 },
  { t: "03/23 00h", goes: 48,    grasp: 43 },
  { t: "03/23 12h", goes: 287,   grasp: 33 },
  { t: "03/24 00h", goes: 219,   grasp: 300 },
  { t: "03/24 12h", goes: 770,   grasp: 63 },
  { t: "03/25 00h", goes: 113,   grasp: 429 },
  { t: "03/25 12h", goes: 2176,  grasp: 97 },
  { t: "03/26 00h", goes: 957,   grasp: 611 },
  { t: "03/26 12h", goes: 7033,  grasp: 274 },
  { t: "03/27 00h", goes: 3543,  grasp: 1091 },
  { t: "03/27 12h", goes: 35898, grasp: 826 },
  { t: "03/28 00h", goes: 24645, grasp: 1205 },
  { t: "03/28 12h", goes: 40161, grasp: 859 },
  { t: "03/29 00h", goes: 18939, grasp: 1362 },
  { t: "03/29 12h", goes: 14702, grasp: 410 },
  { t: "03/30 00h", goes: 4050,  grasp: 665 },
  { t: "03/30 12h", goes: 6319,  grasp: 101 },
];
