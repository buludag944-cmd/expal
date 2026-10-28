#!/usr/bin/env node
/**
 * Render FounderNotes: LinkedIn 4:5, cut to the recorded voiceover.
 * Audio is public/journey/voice.m4a (already inside the composition).
 * Does not overwrite the short, the ads, or the personal story.
 */
import { spawn } from "node:child_process";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;
const DURATION_SEC = 140.8;
const WIDTH = 1080;
const HEIGHT = 1350;

const STILLS = [
  ["welcome", 2],
  ["ireland", 10],
  ["map", 32],
  ["journal", 37],
  ["visa", 43],
  ["community", 48],
  ["layout", 66],
  ["phone", 73],
  ["backend", 95],
  ["close", 137],
];

const OUT_DIR = process.env.JOURNEY_OUT_DIR || "/tmp/expal-journey";
const ARTIFACTS = process.env.AD_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";
const ENTRY = path.join(ROOT, "src/video/index.ts");
const SCRIPT = path.join(ROOT, "src/video/founder-journey-voiceover.txt");

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

async function renderSilent() {
  const silent = path.join(OUT_DIR, "expal_founder_journey_01_picture.mp4");
  await run("npx", [
    "remotion",
    "render",
    ENTRY,
    "FounderNotes",
    silent,
    "--browser-executable",
    CHROME,
    "--gl",
    "angle",
    "--image-format",
    "png",
    "--timeout",
    "180000",
    "--crf",
    "16",
    "--concurrency",
    "2",
  ]);
  return silent;
}

async function stills(video) {
  const shotDir = path.join(OUT_DIR, "frames");
  await mkdir(shotDir, { recursive: true });
  for (const [id, seconds] of STILLS) {
    await run("ffmpeg", [
      "-y",
      "-ss",
      String(seconds),
      "-i",
      video,
      "-frames:v",
      "1",
      path.join(shotDir, `${id}.png`),
    ]);
  }
}

async function encodeDelivery(video) {
  const finalPath = path.join(OUT_DIR, "expal_founder_journey_01_linkedin_4x5.mp4");
  await run("ffmpeg", [
    "-y",
    "-i",
    video,
    "-vf",
    `scale=${WIDTH}:${HEIGHT}:flags=lanczos,fps=30,format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "17",
    "-maxrate",
    "8M",
    "-bufsize",
    "16M",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "high",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-ar",
    "48000",
    "-ac",
    "2",
    "-movflags",
    "+faststart",
    finalPath,
  ]);
  return finalPath;
}

async function copyArtifacts(finalPath) {
  await mkdir(ARTIFACTS, { recursive: true });
  const dest = path.join(ARTIFACTS, "expal_founder_journey_01_linkedin_4x5.mp4");
  await copyFile(finalPath, dest);
  await copyFile(SCRIPT, path.join(ARTIFACTS, "expal_founder_journey_01_voiceover.txt"));
  for (const [id] of STILLS) {
    await copyFile(path.join(OUT_DIR, "frames", `${id}.png`), path.join(ARTIFACTS, `journey_${id}.png`));
  }
  return dest;
}

async function probe(file) {
  const { stdout } = await runCapture("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "stream=codec_type,width,height,codec_name,avg_frame_rate,pix_fmt,duration",
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
  const picture = await renderSilent();
  const finalPath = await encodeDelivery(picture);
  await stills(finalPath);
  const artifact = await copyArtifacts(finalPath);
  const info = await probe(finalPath);
  await writeFile(path.join(OUT_DIR, "probe.json"), JSON.stringify(info, null, 2));
  const video = info.streams?.find((stream) => stream.codec_type === "video");
  const audio = info.streams?.find((stream) => stream.codec_type === "audio");
  if (!video || video.width !== WIDTH || video.height !== HEIGHT) {
    throw new Error(`Unexpected frame size: ${video?.width}x${video?.height}`);
  }
  const duration = Number(video.duration);
  if (duration < DURATION_SEC - 0.2 || duration > DURATION_SEC + 0.2) {
    throw new Error(`Expected ${DURATION_SEC}s, got ${video.duration}`);
  }
  if (!audio) throw new Error("Delivery file is missing the recorded voiceover.");
  console.log(JSON.stringify({ artifact, finalPath, fps: FPS, durationSec: DURATION_SEC, info }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
