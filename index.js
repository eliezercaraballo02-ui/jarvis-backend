import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Jarvis operativo 🚀");
});

// CHAT
app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body?.prompt;
    const API_KEY = process.env.GEMINI_API_KEY;

    // Validar API KEY
    if (!API_KEY) {
      return res.status(500).json({
        respuesta: "❌ Falta GEMINI_API_KEY en Vercel"
      });
    }

    // Validar prompt
    if (!prompt) {
      return res.status(400).json({
        respuesta: "❌ No recibí texto"
      });
    }

    // IA CONFIGURACIÓN (MODELO COMPATIBLE)
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    const instruccion = `
Eres Jarvis, asistente estilo Iron Man.
Responde breve, técnico y en español:

${prompt}
`;

    const result = await model.generateContent(instruccion);
    const response = await result.response;
    const text = response.text();

    return res.json({
      respuesta: text
    });

  } catch (error) {
    console.error("ERROR COMPLETO:", error);

    return res.status(500).json({
      respuesta: "Error en núcleo: " + (error.message || "desconocido")
    });
  }
});

// EXPORT PARA VERCEL
export default app;
