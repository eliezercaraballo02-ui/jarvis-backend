import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Jarvis Online en Kappa 🚀"));

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ respuesta: "Error: No hay API_KEY" });

    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // CAMBIO VITAL: Usamos gemini-1.5-flash pero con la versión 'v1' explícita
    // Si este falla, el nombre que Google nunca rechaza es "gemini-pro"
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" }, 
      { apiVersion: 'v1' } 
    );

    const result = await model.generateContent(prompt || "Hola");
    const response = await result.response;
    
    return res.json({ respuesta: response.text() });

  } catch (error) {
    console.error("LOG DE ERROR:", error.message);
    return res.status(500).json({ 
      respuesta: "Error de comunicación: " + error.message 
    });
  }
});

export default app;
