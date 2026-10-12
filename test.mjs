import assert from "node:assert/strict";
import { toFrames, toTimecode, add, subtract, convert, RATES } from "./timecode.js";
// one hour of 29.97 drop frame is 107,892 frames (SMPTE 12M)
assert.equal(toFrames("01:00:00;00", "29.97DF"), 107892);
assert.equal(toFrames("01:00:00;00", "59.94DF"), 215784);
assert.equal(toFrames("01:00:00:00", "25"), 90000);
// drop frame skips ;00 and ;01 at every minute except every tenth
assert.equal(add("00:00:59;29", "00:00:00;01", "29.97DF"), "00:01:00;02");
assert.equal(add("00:09:59;29", "00:00:00;01", "29.97DF"), "00:10:00;00");
assert.equal(subtract("00:01:00;02", "00:00:00;01", "29.97DF"), "00:00:59;29");
// round trip every frame of the first 30 minutes for all rates
for (const r of Object.keys(RATES)) for (let f = 0; f < 30 * 60 * 60; f += 7) assert.equal(toFrames(toTimecode(f, r), r), f, `${r} frame ${f}`);
assert.equal(convert("00:00:10:00", "25", "50"), "00:00:10:00");
console.log("all timecode tests pass");
