import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Serves the React demo from ./react and forwards /tts-token to server.mjs,
// so the page and the token route share one origin.
export default defineConfig({
  root: "react",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/tts-token": "http://localhost:3000" },
  },
});
