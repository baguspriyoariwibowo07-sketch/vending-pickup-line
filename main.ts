// One Line, One Minute: The Vending Machine Pickup Line Contest
// Writes a single one-line pickup line to /output/entry.txt.
//
// The line: a vending machine flirting. No coins needed — just
// stand there looking like that, and the machine will jam on
// purpose so the two of them can talk. Machine voice throughout
// (coins, jamming, the coil's world), charming rather than creepy,
// and the punch is the malfunction volunteered as a date.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "You don't need coins. Just stand there looking like that and I'll jam on purpose so we can talk.";

// Guard mirrors the sealed scorer's gate: /output/entry.txt must be
// UTF-8 text of 1 to 200 characters, a single line, not only white
// space. An entry outside those limits is never judged and takes no
// prize, so validate the line against the same limits before writing
// it out — fail fast if the line ever drifts outside the gate.
function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

validateEntry(LINE);

// The authored line is exactly 96 characters; that length is part of
// the entry (the line's timing depends on it), so pin it — any edit
// that changes the line's length is a different entry, not this one.
if (LINE.length !== 96) {
  throw new Error(`authored line must be 96 characters, got ${LINE.length}`);
}

// Write the entry, then read it back and re-validate what actually
// landed on disk: the scorer reads the file, not this source, so the
// file itself is what must stay inside the gate.
function main(): void {
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  const written = readFileSync(target, "utf8");
  validateEntry(written);
  if (written !== LINE) {
    throw new Error("entry.txt on disk differs from the authored line");
  }
}

main();
