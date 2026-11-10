// useSpeech.js
import { useCallback, useEffect, useRef, useState } from "react";

const KYLA = "aai-kyla";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    setSpeaking(false);
  }, []);

  // Free, in-browser voice from the operating system
  const speakBrowser = useCallback((text, { voice = null, rate = 1, pitch = 1 } = {}) => {
    if (!("speechSynthesis" in window)) return;
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  // AssemblyAI-TTS-1, using a temporary token from your server
  const speakAssemblyAI = useCallback(async (text, voiceId = KYLA) => {
    stop();
    const { token } = await (await fetch("/tts-token")).json();
    const res = await fetch("https://tts.us.assemblyai.com/v1/speech", {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_id: voiceId, container: "wav", stream: false }),
    });
    if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

    const url = URL.createObjectURL(await res.blob());
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay = () => setSpeaking(true);
    audio.onended = () => {
      setSpeaking(false);
      URL.revokeObjectURL(url);
    };
    await audio.play();
  }, [stop]);

  useEffect(() => stop, [stop]); // stop speaking on unmount

  return { speaking, speakBrowser, speakAssemblyAI, stop };
}
