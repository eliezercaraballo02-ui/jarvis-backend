import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Jarvis Online 🚀"));

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ respuesta: "Error: No hay API_KEY" });

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Usamos la configuración más segura posible
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt || "Hola");
    const response = await result.response;
    
    return res.json({ respuesta: response.text() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ respuesta: "Error: " + error.message });
  }
});

export default app;
