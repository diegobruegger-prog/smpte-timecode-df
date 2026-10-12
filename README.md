# smpte-timecode-df

SMPTE timecode math with **correct drop frame**, in one small dependency-free JavaScript file.

- Timecode to frames and back for 23.976, 24, 25, 29.97 DF/NDF, 30, 48, 50, 59.94 DF/NDF and 60 fps
- Add and subtract timecodes, convert between frame rates
- Drop frame done right: frames ;00 and ;01 are skipped every minute except every tenth (;00 to ;03 at 59.94). One hour of 29.97 DF is exactly 107,892 frames.
- Tested: round trip of every 7th frame over 30 minutes at every rate (`npm test`)

**Need it without code?** [Free online timecode calculator](https://shortformkit.com/timecode-calculator/) with drop frame, frames to timecode and duration math.

## Usage

```js
import { toFrames, toTimecode, add, subtract, convert } from "./timecode.js";

toFrames("01:00:00;00", "29.97DF");            // 107892
toTimecode(107892, "29.97DF");                 // "01:00:00;00"
add("00:00:59;29", "00:00:00;01", "29.97DF");  // "00:01:00;02"  (;00 and ;01 are dropped)
subtract("00:10:00:00", "00:00:30:00", "25");  // "00:09:30:00"
convert("00:00:10:00", "25", "50");            // "00:00:10:00"
```

Rate keys: `23.976`, `24`, `25`, `29.97DF`, `29.97`, `30`, `48`, `50`, `59.94DF`, `59.94`, `60`.

## Why drop frame?

29.97 fps is 0.1 % slower than 30 fps. Counting 30 frame numbers per second would drift 3.6 seconds per hour behind the clock. Drop frame skips frame numbers (never actual frames) so that the timecode stays in sync with real time.

## License

MIT. Made by [Diego Brügger](https://shortformkit.com/about/), video editor in Zürich, for [Shortform Kit](https://shortformkit.com): free tools for creators.
