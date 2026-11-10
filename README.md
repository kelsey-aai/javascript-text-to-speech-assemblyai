# JavaScript text to speech with speechSynthesis and AssemblyAI

Runnable code for JavaScript text to speech, two ways:

1. **The browser's `speechSynthesis` API** (Web Speech API): free, no key, uses the operating system's voices.
2. **The [AssemblyAI Text-to-Speech API](https://www.assemblyai.com/products/text-to-speech)** (AssemblyAI-TTS-1): one consistent, natural voice in Node, in the browser (with a temporary token, so the API key never reaches the page) and in React.

This is the companion repo for the tutorial: [JavaScript text to speech: speechSynthesis and the AssemblyAI TTS API (with React)](https://www.assemblyai.com/blog/javascript-text-to-speech-easy-way).

## What's in the repo

| File | What it does |
|------|--------------|
| `synthesize.mjs` | Node script: `client.tts.synthesize()` writes `speech.wav` |
| `server.mjs` | Express server: serves `public/` and mints a temporary TTS token at `GET /tts-token` |
| `public/index.html` + `public/script.js` | Browser `speechSynthesis` demo: voice picker, rate, pitch, stop |
| `public/assemblyai.html` + `public/tts.js` | Browser demo that fetches a token and plays AssemblyAI TTS as a WAV |
| `react/src/useSpeech.js` | React hook wrapping both engines: `speakBrowser`, `speakAssemblyAI`, `stop`, `speaking` |
| `react/src/App.jsx` | React component using the hook |
| `vite.config.mjs` | Runs the React demo and proxies `/tts-token` to `server.mjs` |

All AssemblyAI examples use the voice `aai-kyla` (Kyla), the voice the AssemblyAI TTS docs use. Swap in any voice ID or library slug from the voice catalog.

## Quick start

Requires Node.js 20.6 or later (for `--env-file`).

```bash
git clone https://github.com/kelsey-aai/javascript-text-to-speech-assemblyai
cd javascript-text-to-speech-assemblyai

npm install
cp .env.example .env
# Edit .env and set ASSEMBLYAI_API_KEY (get one at https://www.assemblyai.com/dashboard/signup)
```

### 1. Synthesize a WAV file in Node

```bash
npm run synthesize
# writes speech.wav and prints the audio duration and billed characters
```

### 2. Browser demos (speechSynthesis and AssemblyAI)

```bash
npm run server
```

- http://localhost:3000 is the `speechSynthesis` demo. It needs no API key.
- http://localhost:3000/assemblyai.html is the AssemblyAI demo. The page fetches a 60-second token from `/tts-token` and calls `POST https://tts.us.assemblyai.com/v1/speech` with it directly.

### 3. React useSpeech hook

Keep `npm run server` running (it serves `/tts-token`), then in a second terminal:

```bash
npm run react
# open http://localhost:5173
```

Vite proxies `/tts-token` to `http://localhost:3000`, so the hook's `fetch("/tts-token")` works from the same origin.

### Syntax check

```bash
npm run check
```

## How the browser stays keyless

`server.mjs` holds the API key and mints a short-lived token per request with `client.tts.createTemporaryToken({ expires_in_seconds: 60 })`. The page sends that token in the `Authorization` header in place of the key. The TTS HTTP API answers cross-origin requests, so no proxy is needed for the audio itself. See the [temporary token docs](https://www.assemblyai.com/docs/tts/authenticate-with-a-temporary-token).

## Notes

- Browsers only play audio after a user gesture, so every demo speaks from a click handler.
- `container: "wav"` returns a playable file. Without it you get raw 24 kHz, 16-bit PCM.
- Never commit `.env`. It is in `.gitignore`.

## Resources

- [Tutorial: JavaScript text to speech](https://www.assemblyai.com/blog/javascript-text-to-speech-easy-way)
- [AssemblyAI TTS quickstart](https://www.assemblyai.com/docs/tts/getting-started/quickstart)
- [AssemblyAI voices](https://www.assemblyai.com/docs/tts/voices)
- [Word boundaries](https://www.assemblyai.com/docs/tts/word-boundaries)
- [AssemblyAI JavaScript SDK](https://github.com/AssemblyAI/assemblyai-node-sdk)
- [MDN: SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

## License

MIT
