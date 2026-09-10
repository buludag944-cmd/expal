#!/usr/bin/env node
/**
 * Render the Remotion ExpalShort composition (1080x1920, 53s).
 * TTS: ~1s lead-in before each beat, 0.55s between sentences.
 * Delivery encode: H.264 10 Mbps, 30 fps, yuv420p, AAC 192 kbps, +faststart.
 * Does not overwrite the 28s Play/TikTok cut, LinkedIn ads, or the personal story.
 */
import { spawn } from "node:child_process";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DURATION_MS = 53_000;
const FPS = 30;
const TTS_LEAD_IN_MS = 1_000;
const TTS_BETWEEN_SENTENCES_MS = 550;

const BEATS = [
  {
    id: "hook",
    startMs: 0,
    voice:
      "Moving to a new country shouldn’t mean twenty-five open tabs and endless unanswered questions.",
  },
  {
    id: "meet",
    startMs: 8_000,
    voice: "Meet EXPal — built to make moving to and settling in Ireland simpler.",
  },
  {
    id: "home",
    startMs: 15_000,
    voice: "Find practical guidance on PPS, IRP, housing, banking and employment rights.",
  },
  {
    id: "explore",
    startMs: 24_000,
    voice: "Connect with other expats, ask questions, and request career referrals.",
  },
  {
    id: "profile",
    startMs: 32_000,
    voice: "No ads. No noise. Just guidance, connection and community.",
  },
  {
    id: "cta",
    startMs: 43_000,
    voice: "EXPal. Relocate smarter, settle faster and thrive longer.",
  },
];
const OUT_DIR = process.env.SHORT_OUT_DIR || "/tmp/expal-short";
const ARTIFACTS = process.env.AD_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";
const ENTRY = path.join(ROOT, "src/video/index.ts");

function splitSentences(text) {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

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
  const groups = [];
  for (const beat of BEATS) {
    const sentences = splitSentences(beat.voice);
    const files = [];
    for (const [j, sentence] of sentences.entries()) {
      const out = path.join(voiceDir, `${beat.id}-${j}.mp3`);
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
            sentence,
            "--write-media",
            out,
          ],
          { stdio: "ignore" },
        );
        files.push(out);
      } catch {
        return null;
      }
    }
    groups.push({ startMs: beat.startMs, files });
  }

  const mixPy = path.join(voiceDir, "mix.py");
  await writeFile(
    mixPy,
    `
from pydub import AudioSegment
groups = ${JSON.stringify(groups)}
lead_in = ${TTS_LEAD_IN_MS}
between = ${TTS_BETWEEN_SENTENCES_MS}
bed = AudioSegment.silent(duration=${DURATION_MS})
last_end = 0
for group in groups:
    t = group["startMs"] + lead_in
    for i, path in enumerate(group["files"]):
        audio = AudioSegment.from_file(path)
        if i > 0:
            t = last_end + between
        bed = bed.overlay(audio, position=t)
        last_end = t + len(audio)
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

async function renderSilent() {
  const silent = path.join(OUT_DIR, "expal_youtube_short_9x16_silent.mp4");
  await run("npx", [
    "remotion",
    "render",
    ENTRY,
    "ExpalShort",
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
    "8",
    "--concurrency",
    "2",
  ]);
  return silent;
}

async function stills() {
  const shotDir = path.join(OUT_DIR, "frames");
  await mkdir(shotDir, { recursive: true });
  const frames = [
    ["hook", 30],
    ["meet", 270],
    ["home", 480],
    ["explore", 750],
    ["profile", 990],
    ["cta", 1320],
  ];
  for (const [id, frame] of frames) {
    await run("npx", [
      "remotion",
      "still",
      ENTRY,
      "ExpalShort",
      path.join(shotDir, `${id}.png`),
      "--frame",
      String(frame),
      "--browser-executable",
      CHROME,
      "--gl",
      "angle",
    ]);
  }
}

async function encodeDelivery(video, narration) {
  const finalPath = path.join(OUT_DIR, "expal_youtube_short_9x16_paced_10mbps.mp4");
  const args = [
    "-y",
    "-i",
    video,
  ];
  if (narration) {
    args.push(
      "-i",
      narration,
      "-filter_complex",
      `[0:v]scale=1080:1920:flags=lanczos,fps=30,format=yuv420p[v];[1:a]aresample=44100,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.1,afade=t=out:st=${((DURATION_MS - 800) / 1000).toFixed(1)}:d=0.6[a]`,
      "-map",
      "[v]",
      "-map",
      "[a]",
    );
  } else {
    args.push("-vf", "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p", "-an");
  }
  args.push(
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-b:v",
    "10M",
    "-minrate",
    "10M",
    "-maxrate",
    "10M",
    "-bufsize",
    "20M",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "high",
    "-x264-params",
    "nal-hrd=cbr:filler=1",
  );
  if (narration) {
    args.push("-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2", "-shortest");
  }
  args.push("-movflags", "+faststart", finalPath);
  await run("ffmpeg", args);
  return finalPath;
}

async function copyArtifacts(finalPath, silent) {
  await mkdir(ARTIFACTS, { recursive: true });
  const dest = path.join(ARTIFACTS, "expal_youtube_short_9x16_paced_10mbps.mp4");
  const destSilent = path.join(ARTIFACTS, "expal_youtube_short_9x16_paced_silent.mp4");
  await copyFile(finalPath, dest);
  await copyFile(silent, destSilent);
  for (const beat of BEATS) {
    await copyFile(
      path.join(OUT_DIR, "frames", `${beat.id}.png`),
      path.join(ARTIFACTS, `short_paced_${beat.id}.png`),
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
    "stream=width,height,codec_name,bit_rate,avg_frame_rate,pix_fmt,duration",
    "-show_entries",
    "format=duration,bit_rate",
    "-of",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const narration = await tryNarration();
  const silent = await renderSilent();
  await stills();
  const finalPath = await encodeDelivery(silent, narration);
  const artifact = await copyArtifacts(finalPath, silent);
  const info = await probe(finalPath);
  await writeFile(path.join(OUT_DIR, "probe.json"), JSON.stringify(info, null, 2));
  console.log(JSON.stringify({ artifact, finalPath, silent, fps: FPS, info }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
