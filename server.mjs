// server.mjs
import express from "express";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
const app = express();
app.use(express.static("public"));

app.get("/tts-token", async (req, res) => {
  // A fresh, short-lived token per request. It can't mint other tokens.
  const token = await client.tts.createTemporaryToken({ expires_in_seconds: 60 });
  res.json({ token });
});

app.listen(3000, () => console.log("http://localhost:3000"));
