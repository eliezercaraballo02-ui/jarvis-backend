import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Jarvis con Super-Logs Activos 🚀"));

app.post("/chat", async (req, res) => {
  console.log("--- INICIO DE PETICIÓN ---");
  
  try {
    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // LOG 1: Verificación de clave (sin mostrarla toda por seguridad)
    if (!API_KEY) {
      console.error("LOG: ❌ Error Crítico: GEMINI_API_KEY no encontrada en process.env");
      return res.status(500).json({ respuesta: "Error: No hay API_KEY configurada en Vercel" });
    }
    console.log("LOG: ✅ API_KEY detectada (Inicia con: " + API_KEY.substring(0, 5) + "...)");

    // LOG 2: Configuración de la IA
    console.log("LOG: 🤖 Intentando conectar con modelo gemini-1.5-flash en v1");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Forzamos la versión 1 estable
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" }, 
      { apiVersion: 'v1' }
    );

    // LOG 3: Enviando prompt
    console.log("LOG: 💬 Prompt recibido:", prompt);

    const result = await model.generateContent(prompt || "Hola");
    const response = await result.response;
    const text = response.text();

    console.log("LOG: ✨ Respuesta generada con éxito");
    console.log("--- FIN DE PETICIÓN ---");
    
    return res.json({ respuesta: text });

  } catch (error) {
    // LOG DE ERROR ULTRA DETALLADO
    console.error("--- 🛑 ERROR DETECTADO 🛑 ---");
    console.error("MENSAJE:", error.message);
    console.error("NOMBRE:", error.name);
    console.error("STATUS:", error.status);
    console.error("DETALLES:", JSON.stringify(error, null, 2));
    console.error("-----------------------------");

    return res.status(500).json({ 
      respuesta: "Error técnico: " + error.message,
      detalles: error.status || "Sin código de estado"
    });
  }
});

export default app;
