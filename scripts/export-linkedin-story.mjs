#!/usr/bin/env node
/**
 * Record /demo/story at 1080x1350 (4:5) for Bahar's LinkedIn personal story.
 * Does not overwrite the full demo, the 9:16 social cut, or any other LinkedIn cut.
 */
import { spawn } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1080;
const HEIGHT = 1350;
const DURATION_MS = 58_000;
const BASE = process.env.AD_BASE_URL || "http://127.0.0.1:3000";
const OUT_DIR = process.env.STORY_OUT_DIR || "/tmp/expal-story";
const ARTIFACTS = process.env.AD_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

const BEATS = [
  {
    id: "hook",
    startMs: 0,
    kind: "card",
    voice: "I moved to Dublin for work and spent my first month with 20 browser tabs open just trying to figure out my PPS number.",
  },
  {
    id: "turn-a",
    startMs: 5_000,
    kind: "card",
    voice: "I come from a marketing and AdTech background — not engineering.",
  },
  {
    id: "turn-b",
    startMs: 10_000,
    kind: "card",
    voice: "I kept thinking: this should exist. So I built it myself, using Claude and Cursor.",
  },
  {
    id: "housing",
    startMs: 15_000,
    kind: "phone",
    caption: "Southside rooms under €1,000",
    captionLine2: "Lived listings, not Facebook spam.",
    voice: "Southside rooms under a thousand euro — lived listings, not Facebook spam.",
  },
  {
    id: "community",
    startMs: 22_500,
    kind: "phone",
    caption: "PPS wait times right now",
    captionLine2: "Real people, real workarounds.",
    voice: "PPS number wait times right now — real people, real workarounds.",
  },
  {
    id: "knowhow",
    startMs: 30_000,
    kind: "phone",
    caption: "Get a Leap card on day one",
    captionLine2: "Before you even unpack.",
    voice: "Get a Leap card on day one — before you even unpack.",
  },
  {
    id: "profile",
    startMs: 37_500,
    kind: "phone",
    caption: "Your Dublin identity",
    captionLine2: "City and permit — not just an email.",
    voice: "Your Dublin identity — city and permit, not just an email.",
  },
  {
    id: "close-copy",
    startMs: 45_000,
    kind: "card",
    voice: "EXPal is live on Google Play. If you're building something with AI tools, or moving to Ireland yourself — I'd love to connect.",
  },
  {
    id: "close-logo",
    startMs: 52_000,
    kind: "close",
    voice: "Bahar Uludag.",
  },
];

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: opts.stdio ?? "inherit", ...opts });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

function runCapture(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${cmd} failed (${code}): ${stderr || stdout}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.ok || res.status === 307 || res.status === 308) return;
    } catch {
      // still booting
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function ensureServer() {
  try {
    await waitForServer(`${BASE}/demo/story`, 2_000);
    return () => {};
  } catch {
    // start local next
  }
  const log = createWriteStream(path.join(OUT_DIR, "next-dev.log"));
  const child = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", "3000"], {
    cwd: ROOT,
    env: { ...process.env, BROWSER: "none" },
    stdio: ["ignore", log, log],
  });
  await waitForServer(`${BASE}/demo/story`);
  return () => {
    child.kill("SIGTERM");
  };
}

async function withBrowser(fn) {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--font-render-hinting=none",
      "--disable-lcd-text",
      "--hide-scrollbars",
      `--window-size=${WIDTH},${HEIGHT}`,
    ],
  });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

async function screenshots(browser) {
  const shotDir = path.join(OUT_DIR, "frames");
  await mkdir(shotDir, { recursive: true });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  for (const beat of BEATS) {
    await page.goto(`${BASE}/demo/story?preview=${beat.id}`, { waitUntil: "networkidle" });
    await page.waitForSelector(`[data-beat="${beat.id}"]`);
    await page.addStyleTag({
      content: "nextjs-portal,[data-next-badge-root]{display:none!important}",
    });
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({
      path: path.join(shotDir, `${beat.id}.png`),
      type: "png",
    });
  }
  await page.close();
}

async function recordVideo(browser) {
  const videoDir = path.join(OUT_DIR, "playwright-video");
  await rm(videoDir, { recursive: true, force: true });
  await mkdir(videoDir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: WIDTH, height: HEIGHT } },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "nextjs-portal,[data-next-badge-root]{display:none!important}";
    document.documentElement.appendChild(style);
  });
  await page.goto(`${BASE}/demo/story?record=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof window.__EXPAL_START_STORY === "function");
  await page.evaluate(() => window.__EXPAL_START_STORY?.());
  await page.waitForSelector('[data-story-playing="true"]');
  await new Promise((r) => setTimeout(r, DURATION_MS + 500));
  const video = page.video();
  await page.close();
  await context.close();
  const videoPath = video ? await video.path() : null;
  if (!videoPath) throw new Error("Playwright did not write a video file");
  return videoPath;
}

function assTimestamp(ms) {
  const clamped = Math.max(0, ms);
  const hours = Math.floor(clamped / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  const cs = Math.floor((clamped % 1000) / 10);
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(cs)}`;
}

async function writeAss() {
  const phones = BEATS.filter((beat) => beat.kind === "phone");
  const events = phones
    .map((beat, index, list) => {
      const end = list[index + 1]?.startMs ?? 45_000;
      const text = beat.captionLine2 ? `${beat.caption}\\N${beat.captionLine2}` : beat.caption;
      return `Dialogue: 0,${assTimestamp(beat.startMs + 80)},${assTimestamp(end)},Default,,0,0,0,,${text}`;
    })
    .join("\n");
  const file = path.join(OUT_DIR, "captions.ass");
  await writeFile(
    file,
    `\uFEFF[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1350
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Liberation Sans,40,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,4,2,2,40,40,54,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events}
`,
  );
  return file;
}

async function tryNarration() {
  const voiceDir = path.join(OUT_DIR, "voice");
  await mkdir(voiceDir, { recursive: true });
  try {
    await run("python3", ["-m", "pip", "install", "--user", "-q", "edge-tts", "pydub"], {
      stdio: "ignore",
    });
  } catch {
    return null;
  }
  const clips = [];
  for (const [i, beat] of BEATS.entries()) {
    if (!beat.voice) continue;
    const out = path.join(voiceDir, `${String(i).padStart(2, "0")}-${beat.id}.mp3`);
    try {
      await run(
        "python3",
        [
          "-m",
          "edge_tts",
          "--voice",
          "en-IE-EmilyNeural",
          "--rate=-4%",
          "--text",
          beat.voice,
          "--write-media",
          out,
        ],
        { stdio: "ignore" },
      );
      clips.push({ file: out, delayMs: beat.startMs + 180 });
    } catch {
      return null;
    }
  }

  const mixPy = path.join(voiceDir, "mix.py");
  await writeFile(
    mixPy,
    `
from pydub import AudioSegment
clips = ${JSON.stringify(clips)}
bed = AudioSegment.silent(duration=${DURATION_MS})
for clip in clips:
    audio = AudioSegment.from_file(clip["file"])
    bed = bed.overlay(audio, position=clip["delayMs"])
bed = bed + 3
bed.export("${path.join(voiceDir, "narration.mp3")}", format="mp3", bitrate="192k")
`,
  );
  try {
    await run("python3", [mixPy], { stdio: "ignore" });
    return path.join(voiceDir, "narration.mp3");
  } catch {
    return null;
  }
}

async function transcode(rawVideo, narration, assFile) {
  const silent = path.join(OUT_DIR, "expal_linkedin_personal_story_4x5_silent.mp4");
  const assPath = assFile.replace(/\\/g, "/").replace(/:/g, "\\:");
  await run("ffmpeg", [
    "-y",
    "-i",
    rawVideo,
    "-t",
    "58.00",
    "-vf",
    `scale=1080:1350:force_original_aspect_ratio=decrease,pad=1080:1350:(ow-iw)/2:(oh-ih)/2,fps=30,subtitles=${assPath},format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-profile:v",
    "high",
    "-level",
    "4.1",
    "-tag:v",
    "avc1",
    "-an",
    "-movflags",
    "+faststart",
    silent,
  ]);

  const finalPath = path.join(OUT_DIR, "expal_linkedin_personal_story_4x5.mp4");
  if (narration) {
    await run("ffmpeg", [
      "-y",
      "-i",
      silent,
      "-i",
      narration,
      "-filter_complex",
      "[1:a]aresample=44100,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.1,afade=t=out:st=57.2:d=0.6[a]",
      "-map",
      "0:v",
      "-map",
      "[a]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      "44100",
      "-ac",
      "2",
      "-shortest",
      "-movflags",
      "+faststart",
      finalPath,
    ]);
  } else {
    await copyFile(silent, finalPath);
  }
  return { silent, finalPath };
}

async function copyArtifacts(finalPath, silent) {
  await mkdir(ARTIFACTS, { recursive: true });
  const dest = path.join(ARTIFACTS, "expal_linkedin_personal_story_4x5.mp4");
  const destSilent = path.join(ARTIFACTS, "expal_linkedin_personal_story_4x5_silent.mp4");
  await copyFile(finalPath, dest);
  await copyFile(silent, destSilent);
  for (const beat of BEATS) {
    await copyFile(
      path.join(OUT_DIR, "frames", `${beat.id}.png`),
      path.join(ARTIFACTS, `linkedin_story_${beat.id}.png`),
    );
  }
  return dest;
}

async function probe(file) {
  const { stdout } = await runCapture("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,codec_name,duration",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const stop = await ensureServer();
  try {
    await writeAss();
    await withBrowser(async (browser) => {
      await screenshots(browser);
      const raw = await recordVideo(browser);
      const narration = await tryNarration();
      const { silent, finalPath } = await transcode(raw, narration, path.join(OUT_DIR, "captions.ass"));
      const artifact = await copyArtifacts(finalPath, silent);
      const info = await probe(finalPath);
      await writeFile(path.join(OUT_DIR, "probe.json"), JSON.stringify(info, null, 2));
      console.log(JSON.stringify({ artifact, finalPath, silent, info }, null, 2));
    });
  } finally {
    stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
