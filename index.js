import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const KEY = process.env.GEMINI_API_KEY;

if (!KEY) {
  console.error("FALTA GEMINI_API_KEY EN VERCEL");
}

const genAI = new GoogleGenerativeAI(KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest"
});

app.get("/", (req, res) => {
  res.send("Jarvis operativo 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ respuesta: "No recibí texto" });
    }

    const result = await model.generateContent(
      `Responde como Jarvis, breve y técnico en español: ${prompt}`
    );

    const text = result.response.text();

    res.json({ respuesta: text });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      respuesta: "Error en núcleo: " + error.message
    });
  }
});

export default app;
