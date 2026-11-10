const synth = window.speechSynthesis;
const textEl = document.querySelector("#text");
const voiceEl = document.querySelector("#voice");

if (!("speechSynthesis" in window)) {
  alert("This browser doesn't support speechSynthesis.");
}

// 1. Voices load asynchronously. getVoices() is often empty on first call,
//    so fill the list again when the browser fires voiceschanged.
function loadVoices() {
  const voices = synth.getVoices();
  voiceEl.innerHTML = voices
    .map((v, i) => `<option value="${i}">${v.name} (${v.lang})</option>`)
    .join("");
}
loadVoices();
synth.addEventListener("voiceschanged", loadVoices);

document.querySelector("#speak").addEventListener("click", () => {
  // 2. speak() queues. Cancel first so a second click doesn't stack utterances.
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(textEl.value);
  utterance.voice = synth.getVoices()[voiceEl.value] ?? null;
  utterance.rate = Number(document.querySelector("#rate").value);
  utterance.pitch = Number(document.querySelector("#pitch").value);
  utterance.onend = () => console.log("Finished speaking");

  synth.speak(utterance);
});

document.querySelector("#stop").addEventListener("click", () => synth.cancel());
