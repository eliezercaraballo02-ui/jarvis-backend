import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(express.json());

// Cache del modelo (IMPORTANTE)
const KEY = process.env.GEMINI_API_KEY;

const genAI = KEY ? new GoogleGenerativeAI(KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

app.get("/", (req, res) => {
    res.send("Jarvis operativo en Vercel 🚀");
});

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body?.prompt;

        if (!KEY) {
            return res.status(500).json({
                respuesta: "❌ API KEY no configurada en Vercel"
            });
        }

        if (!model) {
            return res.status(500).json({
                respuesta: "❌ Modelo no inicializado"
            });
        }

        if (!prompt) {
            return res.status(400).json({
                respuesta: "No recibí texto"
            });
        }

        const instruccion = `Responde como Jarvis, breve y técnico en español: ${prompt}`;

        const result = await model.generateContent(instruccion);

        const response = await result.response;

        // 🔥 PROTECCIÓN ANTI-CRASH
        const text = response?.text?.() || "No pude generar respuesta";

        return res.json({ respuesta: text });

    } catch (error) {
        console.error("ERROR COMPLETO:", error);

        return res.status(500).json({
            respuesta: "Error en núcleo: " + (error.message || "desconocido")
        });
    }
});

export default app;
