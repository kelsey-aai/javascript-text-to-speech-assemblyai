// public/tts.js
const KYLA = "aai-kyla";

async function speakWithAssemblyAI(text, voiceId = KYLA) {
  const { token } = await (await fetch("/tts-token")).json();

  const res = await fetch("https://tts.us.assemblyai.com/v1/speech", {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice_id: voiceId, container: "wav", stream: false }),
  });
  if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

  const url = URL.createObjectURL(await res.blob());
  const audio = new Audio(url);
  audio.onended = () => URL.revokeObjectURL(url);
  await audio.play();
}

document.querySelector("#speak").addEventListener("click", () => {
  speakWithAssemblyAI(document.querySelector("#text").value);
});
