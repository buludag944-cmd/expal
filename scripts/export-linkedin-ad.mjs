#!/usr/bin/env node
/**
 * Record /demo/linkedin at 1080x1350 (4:5) for a LinkedIn product ad.
 * Does not overwrite the full demo, the 9:16 social cut, or the personal story.
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
const DURATION_MS = 56_000;
const BASE = process.env.AD_BASE_URL || "http://127.0.0.1:3000";
const OUT_DIR = process.env.LM_OUT_DIR || "/tmp/expal-linkedin-ad";
const ARTIFACTS = process.env.AD_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

const BEATS = [
  {
    id: "hook",
    startMs: 0,
    kind: "hook",
    voice:
      "Moving to a new country shouldn’t mean twenty-five open tabs and endless unanswered questions.",
  },
  {
    id: "meet",
    startMs: 7_200,
    kind: "hook",
    voice: "Meet EXPal — built to make moving to and settling in Ireland simpler.",
  },
  {
    id: "home",
    startMs: 13_200,
    kind: "phone",
    caption: "Find practical guidance on PPS, IRP,\\Nhousing, banking and employment rights.",
    voice: "Find practical guidance on PPS, IRP, housing, banking and employment rights.",
  },
  {
    id: "explore",
    startMs: 21_800,
    kind: "phone",
    caption:
      "Connect directly with other expats, ask questions,\\Nbuild your network, and even request career referrals from people willing to help.",
    voice:
      "Connect directly with other expats, ask questions, build your network, and even request career referrals from people willing to help.",
  },
  {
    id: "journey",
    startMs: 32_400,
    kind: "phone",
    caption: "Soon, you’ll also be able to track\\Nimportant document and IRP renewal dates.",
    voice: "Soon, you’ll also be able to track important document and IRP renewal dates.",
  },
  {
    id: "profile",
    startMs: 39_600,
    kind: "phone",
    caption: "No ads. No noise.\\NJust guidance, connection and community.",
    voice: "No ads. No noise. Just guidance, connection and community.",
  },
  {
    id: "cta",
    startMs: 48_400,
    kind: "cta",
    voice: "EXPal. Move. Settle. Connect.",
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
    await waitForServer(`${BASE}/demo/linkedin`, 2_000);
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
  await waitForServer(`${BASE}/demo/linkedin`);
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
    await page.goto(`${BASE}/demo/linkedin?preview=${beat.id}`, { waitUntil: "networkidle" });
    await page.waitForSelector(`[data-beat="${beat.id}"]`);
    await page.addStyleTag({
      content: "nextjs-portal,[data-next-badge-root]{display:none!important}",
    });
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
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
  await page.goto(`${BASE}/demo/linkedin?record=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof window.__EXPAL_START_LM === "function");
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  await page.evaluate(() => window.__EXPAL_START_LM?.());
  await page.waitForSelector('[data-lm-playing="true"]');
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
      const end = list[index + 1]?.startMs ?? 48_400;
      return `Dialogue: 0,${assTimestamp(beat.startMs + 80)},${assTimestamp(end)},Default,,0,0,0,,${beat.caption}`;
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
Style: Default,Liberation Sans,34,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,4,2,2,48,48,48,1

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
  const silent = path.join(OUT_DIR, "expal_linkedin_marketing_4x5_silent.mp4");
  const assPath = assFile.replace(/\\/g, "/").replace(/:/g, "\\:");
  await run("ffmpeg", [
    "-y",
    "-i",
    rawVideo,
    "-t",
    "56.00",
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

  const finalPath = path.join(OUT_DIR, "expal_linkedin_marketing_4x5.mp4");
  if (narration) {
    await run("ffmpeg", [
      "-y",
      "-i",
      silent,
      "-i",
      narration,
      "-filter_complex",
      "[1:a]aresample=44100,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.1,afade=t=out:st=55.2:d=0.6[a]",
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
  const dest = path.join(ARTIFACTS, "expal_linkedin_marketing_4x5_transcript.mp4");
  const destSilent = path.join(ARTIFACTS, "expal_linkedin_marketing_4x5_transcript_silent.mp4");
  await copyFile(finalPath, dest);
  await copyFile(silent, destSilent);
  for (const beat of BEATS) {
    await copyFile(
      path.join(OUT_DIR, "frames", `${beat.id}.png`),
      path.join(ARTIFACTS, `linkedin_ad_vo_${beat.id}.png`),
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
