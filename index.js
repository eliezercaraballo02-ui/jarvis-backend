import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

// Configuraciones iniciales
app.use(cors());
app.use(express.json());

// Ruta de diagnóstico (para ver si el servidor vive)
app.get("/", (req, res) => {
  res.send("Jarvis operativo 🚀");
});

// Ruta principal del chat
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 1. Validar que la clave exista en Vercel
    if (!API_KEY) {
      return res.status(500).json({ 
        respuesta: "Error: No se encontró la GEMINI_API_KEY en el servidor." 
      });
    }

    // 2. Validar que el usuario envió texto
    if (!prompt) {
      return res.status(400).json({ 
        respuesta: "No recibí texto para procesar." 
      });
    }

    // 3. Configurar la IA (Modelo estable para evitar errores 404)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const instruccion = `Responde como Jarvis (asistente de Iron Man), sé breve, técnico y en español: ${prompt}`;

    // 4. Generar respuesta
    const result = await model.generateContent(instruccion);
    const response = await result.response;
    const text = response.text();

    return res.json({ respuesta: text });

  } catch (error) {
    console.error("ERROR CRÍTICO:", error.message);
    
    // Devolvemos el error real para que puedas verlo en tu chat
    return res.status(500).json({
      respuesta: "Error en núcleo: " + error.message
    });
  }
});

export default app;
