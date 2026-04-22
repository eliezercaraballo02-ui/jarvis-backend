import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Jarvis en línea 🚀"));

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ respuesta: "Falta API_KEY" });

    // FORZAMOS LA VERSIÓN 1 (v1) para evitar el error 404 de la v1beta
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" }, 
      { apiVersion: 'v1' }
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return res.json({ respuesta: response.text() });

  } catch (error) {
    console.error("ERROR DETECTADO:", error.message);
    return res.status(500).json({ respuesta: "Error de conexión: " + error.message });
  }
});

export default app;
