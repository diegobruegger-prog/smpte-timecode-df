/*! timecode.js: SMPTE timecode math with correct drop frame, in plain JavaScript.
 * MIT License. From Shortform Kit, https://shortformkit.com/timecode-calculator/ */

/** Frame rates: [label, real fps, nominal fps, dropFrame] */
export const RATES = {
  "23.976": [24000 / 1001, 24, false], "24": [24, 24, false], "25": [25, 25, false],
  "29.97DF": [30000 / 1001, 30, true], "29.97": [30000 / 1001, 30, false], "30": [30, 30, false],
  "48": [48, 48, false], "50": [50, 50, false], "59.94DF": [60000 / 1001, 60, true], "59.94": [60000 / 1001, 60, false], "60": [60, 60, false],
};
const rate = (r) => { const v = RATES[r]; if (!v) throw new Error(`unknown rate ${r}, use one of ${Object.keys(RATES).join(", ")}`); return v; };

/** "01:00:00;00" -> frame count */
export function toFrames(tc, r) {
  const [, nom, df] = rate(r);
  const p = String(tc).trim().split(/[:;.]/).map((x) => parseInt(x, 10));
  if (!p.length || p.some(isNaN)) throw new Error(`bad timecode ${tc}`);
  while (p.length < 4) p.unshift(0);
  const [hh, mm, ss, ff] = p;
  let f = ((hh * 60 + mm) * 60 + ss) * nom + ff;
  if (df) { const d = nom === 60 ? 4 : 2, tm = hh * 60 + mm; f -= d * (tm - Math.floor(tm / 10)); }
  return f;
}

/** frame count -> "HH:MM:SS:FF" (";" before frames for drop frame) */
export function toTimecode(frames, r) {
  const [, nom, df] = rate(r);
  const neg = frames < 0; let f = Math.abs(Math.round(frames));
  if (df) {
    const d = nom === 60 ? 4 : 2, per10 = nom * 600 - d * 9, per1 = nom * 60 - d;
    const t = Math.floor(f / per10), m = f % per10;
    f += d * 9 * t + (m > d ? d * Math.floor((m - d) / per1) : 0);
  }
  const ff = f % nom, ss = Math.floor(f / nom) % 60, mm = Math.floor(f / (nom * 60)) % 60, hh = Math.floor(f / (nom * 3600));
  const p = (n) => String(n).padStart(2, "0");
  return `${neg ? "-" : ""}${p(hh)}:${p(mm)}:${p(ss)}${df ? ";" : ":"}${p(ff)}`;
}

/** real seconds of a frame count */
export const toSeconds = (frames, r) => frames / rate(r)[0];
/** frame count from real seconds (rounded to the nearest frame) */
export const fromSeconds = (sec, r) => Math.round(sec * rate(r)[0]);
/** add or subtract timecodes: add("00:59:59;29", "00:00:00;01", "29.97DF") */
export const add = (a, b, r) => toTimecode(toFrames(a, r) + toFrames(b, r), r);
export const subtract = (a, b, r) => toTimecode(toFrames(a, r) - toFrames(b, r), r);
/** convert a timecode between rates, keeping the real time position */
export const convert = (tc, from, to) => toTimecode(fromSeconds(toSeconds(toFrames(tc, from), from), to), to);
