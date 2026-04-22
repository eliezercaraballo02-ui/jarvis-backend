import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Jarvis operativo en Vercel 🚀");
});

app.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // 1. Obtenemos la clave justo cuando llega el mensaje
        const KEY = process.env.GEMINI_API_KEY;

        if (!KEY) {
            return res.status(500).json({ respuesta: "Error: Clave API no configurada en Vercel." });
        }

        if (!prompt) {
            return res.status(400).json({ respuesta: "No recibí texto para procesar." });
        }

        // 2. Inicializamos el modelo dentro del bloque try
        const genAI = new GoogleGenerativeAI(KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const instruccion = `Responde como Jarvis (asistente de Iron Man), sé breve, técnico y siempre en español: ${prompt}`;

        const result = await model.generateContent(instruccion);
        const response = await result.response;
        const text = response.text();

        return res.json({ respuesta: text });

    } catch (error) {
        console.error("Error crítico:", error.message);
        return res.status(500).json({
            respuesta: "Error en el núcleo: " + error.message
        });
    }
});

export default app;
