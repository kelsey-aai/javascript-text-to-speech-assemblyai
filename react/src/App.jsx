// App.jsx
import { useState } from "react";
import { useSpeech } from "./useSpeech";

export default function App() {
  const [text, setText] = useState("Hello from React text to speech.");
  const { speaking, speakBrowser, speakAssemblyAI, stop } = useSpeech();

  return (
    <div>
      <h1>React Text to Speech</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      <button onClick={() => speakBrowser(text)}>Speak (browser voice)</button>
      <button onClick={() => speakAssemblyAI(text)}>Speak (AssemblyAI)</button>
      <button onClick={stop} disabled={!speaking}>Stop</button>
    </div>
  );
}
