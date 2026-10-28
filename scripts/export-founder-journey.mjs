#!/usr/bin/env node
/**
 * Render FounderNotes: LinkedIn 4:5, 86s.
 * Episode 01 of the founder's and builder's journey.
 * TTS: ~1s lead-in before each beat, 0.55s between sentences.
 * Does not overwrite the short, the ads, or the personal story.
 */
import { spawn } from "node:child_process";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;
const DURATION_MS = 97_000;
const WIDTH = 1080;
const HEIGHT = 1350;
const TTS_LEAD_IN_MS = 1_000;
const TTS_BETWEEN_SENTENCES_MS = 550;

const BEATS = [
  {
    id: "hook",
    startMs: 0,
    voice: "Three bugs I hit while building EXPal. And the map I wrote first.",
  },
  {
    id: "map",
    startMs: 9_000,
    voice:
      "Map the front door before the features. A public page, no login, and a journal I can post. Then the same Google sign-in as the app. Housing, PPS, IRP, community, and referrals.",
  },
  {
    id: "login",
    startMs: 32_000,
    voice:
      "Don't hide that page behind a login wall. Strangers can't land, and search can't see it. Keep the journal public, and open an account only when someone asks.",
  },
  {
    id: "profile",
    startMs: 49_000,
    voice:
      "Don't put a Gmail address on the public profile. Dublin and a work permit are the identity. And don't add a sentence the real screen never had.",
  },
  {
    id: "layout",
    startMs: 65_000,
    voice:
      "Don't crop a wide recording into a phone. The navigation fell off, and a stray word stayed in frame. Design the frame, burn the captions, because LinkedIn starts muted.",
  },
  {
    id: "close",
    startMs: 83_000,
    voice:
      "Map it. Then fix what the screen shows. Relocate smarter, settle faster, and thrive longer.",
  },
];

const OUT_DIR = process.env.JOURNEY_OUT_DIR || "/tmp/expal-journey";
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
          ["-m", "edge_tts", "--voice", "en-IE-EmilyNeural", "--rate=-4%", "--text", sentence, "--write-media", out],
          { stdio: "ignore" },
        );
        files.push(out);
      } catch {
        return null;
      }
    }
    groups.push({ id: beat.id, startMs: beat.startMs, files });
  }

  const narration = path.join(voiceDir, "narration.mp3");
  const timing = path.join(voiceDir, "timing.json");
  const mixPy = path.join(voiceDir, "mix.py");
  await writeFile(
    mixPy,
    `
import json
from pydub import AudioSegment
groups = ${JSON.stringify(groups)}
lead_in = ${TTS_LEAD_IN_MS}
between = ${TTS_BETWEEN_SENTENCES_MS}
duration = ${DURATION_MS}
bed = AudioSegment.silent(duration=duration)
report = []
for index, group in enumerate(groups):
    t = group["startMs"] + lead_in
    last_end = t
    for i, path in enumerate(group["files"]):
        audio = AudioSegment.from_file(path)
        if i > 0:
            t = last_end + between
        bed = bed.overlay(audio, position=t)
        last_end = t + len(audio)
    next_start = groups[index + 1]["startMs"] if index + 1 < len(groups) else duration
    report.append({"id": group["id"], "endMs": last_end, "nextStartMs": next_start, "overlap": last_end > next_start - 200})
bed = bed + 3
bed.export(${JSON.stringify(narration)}, format="mp3", bitrate="192k")
with open(${JSON.stringify(timing)}, "w") as handle:
    json.dump(report, handle, indent=2)
if any(item["overlap"] for item in report):
    raise SystemExit("narration overlaps the next beat: " + json.dumps(report))
`,
  );
  await run("python3", [mixPy]);
  return narration;
}

async function renderSilent() {
  const silent = path.join(OUT_DIR, "expal_founder_journey_01_silent.mp4");
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

async function stills() {
  const shotDir = path.join(OUT_DIR, "frames");
  await mkdir(shotDir, { recursive: true });
  const frames = [
    ["hook", 120],
    ["map", 560],
    ["login", 1_160],
    ["profile", 1_680],
    ["layout", 2_160],
    ["close", 2_680],
  ];
  for (const [id, frame] of frames) {
    await run("npx", [
      "remotion",
      "still",
      ENTRY,
      "FounderNotes",
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
  const finalPath = path.join(OUT_DIR, "expal_founder_journey_01_linkedin_4x5.mp4");
  const fadeOut = ((DURATION_MS - 800) / 1000).toFixed(1);
  const args = ["-y", "-i", video];
  if (narration) {
    args.push(
      "-i",
      narration,
      "-filter_complex",
      `[0:v]scale=${WIDTH}:${HEIGHT}:flags=lanczos,fps=30,format=yuv420p[v];[1:a]aresample=44100,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.1,afade=t=out:st=${fadeOut}:d=0.6[a]`,
      "-map",
      "[v]",
      "-map",
      "[a]",
    );
  } else {
    args.push("-vf", `scale=${WIDTH}:${HEIGHT}:flags=lanczos,fps=30,format=yuv420p`, "-an");
  }
  args.push(
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
  );
  if (narration) {
    args.push("-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2");
  }
  args.push("-movflags", "+faststart", finalPath);
  await run("ffmpeg", args);
  return finalPath;
}

async function copyArtifacts(finalPath, silent, narration) {
  await mkdir(ARTIFACTS, { recursive: true });
  const dest = path.join(ARTIFACTS, "expal_founder_journey_01_linkedin_4x5.mp4");
  await copyFile(finalPath, dest);
  if (narration) {
    await copyFile(narration, path.join(ARTIFACTS, "expal_founder_journey_01_narration.mp3"));
  }
  for (const beat of BEATS) {
    await copyFile(
      path.join(OUT_DIR, "frames", `${beat.id}.png`),
      path.join(ARTIFACTS, `journey_${beat.id}.png`),
    );
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
    "format=duration,bit_rate,size",
    "-of",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const narration = await tryNarration();
  if (!narration) {
    throw new Error("Voiceover failed. Refusing a silent tutorial.");
  }
  const silent = await renderSilent();
  await stills();
  const finalPath = await encodeDelivery(silent, narration);
  const artifact = await copyArtifacts(finalPath, silent, narration);
  const info = await probe(finalPath);
  await writeFile(path.join(OUT_DIR, "probe.json"), JSON.stringify(info, null, 2));
  const video = info.streams?.find((stream) => stream.codec_type === "video");
  const audio = info.streams?.find((stream) => stream.codec_type === "audio");
  if (!video || video.width !== WIDTH || video.height !== HEIGHT) {
    throw new Error(`Unexpected frame size: ${video?.width}x${video?.height}`);
  }
  if (!audio) throw new Error("Delivery file has no audio.");
  console.log(JSON.stringify({ artifact, finalPath, fps: FPS, info }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
