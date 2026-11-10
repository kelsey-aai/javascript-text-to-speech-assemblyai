// synthesize.mjs
import { writeFileSync } from "node:fs";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

const response = await client.tts.synthesize({
  text: "Your order number is 4 8 1 5 2. It ships Thursday.",
  voice_id: "aai-kyla", // Kyla
  container: "wav",
});

writeFileSync("speech.wav", response.audio);
console.log(
  `${response.audioDurationMs} ms of audio, ${response.billedCharacters} characters billed`
);
