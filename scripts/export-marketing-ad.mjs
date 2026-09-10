#!/usr/bin/env node
/**
 * Record the /demo/ad studio at 1080x1920 and mux a 28s marketing cut.
 * Does not touch the full-demo walkthrough export.
 */
import { spawn } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION_MS = 28_000;
const BASE = process.env.AD_BASE_URL || "http://127.0.0.1:3000";
const OUT_DIR = process.env.AD_OUT_DIR || "/tmp/expal-ad";
const ARTIFACTS = process.env.AD_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

const BEATS = [
  { id: "hook-a", startMs: 0, caption: "Moving to Ireland?" },
  { id: "hook-b", startMs: 1_400, caption: "You're about to open 20 tabs" },
  { id: "reveal", startMs: 3_000, caption: "EXPal puts it all in one place" },
  { id: "housing", startMs: 6_500, caption: "Southside rooms under €1,000" },
  { id: "community", startMs: 11_500, caption: "PPS wait times — real workarounds" },
  { id: "knowhow", startMs: 16_500, caption: "Leap card on day one" },
  { id: "cta", startMs: 22_000, caption: "Download EXPal free" },
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
    await waitForServer(`${BASE}/demo/ad`, 2_000);
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
  await waitForServer(`${BASE}/demo/ad`);
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
    await page.goto(`${BASE}/demo/ad?preview=${beat.id}`, { waitUntil: "networkidle" });
    await page.waitForSelector(`[data-beat="${beat.id}"]`);
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await new Promise((r) => setTimeout(r, 900));
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
  await page.goto(`${BASE}/demo/ad`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-ad-playing="true"]');
  await new Promise((r) => setTimeout(r, DURATION_MS + 400));
  const video = page.video();
  await page.close();
  await context.close();
  const videoPath = video ? await video.path() : null;
  if (!videoPath) throw new Error("Playwright did not write a video file");
  return videoPath;
}

function srtTimestamp(ms) {
  const clamped = Math.max(0, ms);
  const hours = Math.floor(clamped / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  const millis = clamped % 1000;
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`;
}

async function writeSrt() {
  const lines = BEATS.map((beat, index) => {
    const end = BEATS[index + 1]?.startMs ?? DURATION_MS;
    return `${index + 1}\n${srtTimestamp(beat.startMs + 80)} --> ${srtTimestamp(end)}\n${beat.caption}\n`;
  });
  const file = path.join(OUT_DIR, "captions.srt");
  await writeFile(file, `${lines.join("\n")}\n`);
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
    const out = path.join(voiceDir, `${String(i).padStart(2, "0")}-${beat.id}.mp3`);
    try {
      await run(
        "python3",
        [
          "-m",
          "edge_tts",
          "--voice",
          "en-IE-EmilyNeural",
          "--rate",
          "+6%",
          "--text",
          beat.caption,
          "--write-media",
          out,
        ],
        { stdio: "ignore" },
      );
      clips.push({ file: out, delayMs: beat.startMs + 120 });
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
bed = bed + 4
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

async function transcode(rawVideo, narration) {
  const silent = path.join(OUT_DIR, "expal_marketing_9x16_silent.mp4");
  await run("ffmpeg", [
    "-y",
    "-i",
    rawVideo,
    "-t",
    "28.00",
    "-vf",
    "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p",
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

  const finalPath = path.join(OUT_DIR, "expal_marketing_9x16.mp4");
  if (narration) {
    await run("ffmpeg", [
      "-y",
      "-i",
      silent,
      "-i",
      narration,
      "-filter_complex",
      "[1:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.08,afade=t=out:st=27.4:d=0.5[a]",
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
  const dest = path.join(ARTIFACTS, "expal_marketing_play_tiktok_9x16.mp4");
  const destSilent = path.join(ARTIFACTS, "expal_marketing_play_tiktok_9x16_silent.mp4");
  await copyFile(finalPath, dest);
  await copyFile(silent, destSilent);
  const frameDest = path.join(ARTIFACTS, "marketing-ad-frames");
  await mkdir(frameDest, { recursive: true });
  for (const beat of BEATS) {
    await copyFile(
      path.join(OUT_DIR, "frames", `${beat.id}.png`),
      path.join(frameDest, `${beat.id}.png`),
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
    await writeSrt();
    await withBrowser(async (browser) => {
      await screenshots(browser);
      const raw = await recordVideo(browser);
      const narration = await tryNarration();
      const { silent, finalPath } = await transcode(raw, narration);
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
