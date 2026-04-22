import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ IMPORTANTE: usa variable de entorno en Vercel (NO la pongas aquí)
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
    res.send("Jarvis operativo en Vercel 🚀");
});

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body?.prompt;

        if (!prompt) {
            return res.status(400).json({ respuesta: "No recibí texto" });
        }

        const instruccion = `Responde como Jarvis, breve y técnico en español: ${prompt}`;

        const result = await model.generateContent(instruccion);
        const response = await result.response;
        const text = response.text();

        return res.json({ respuesta: text });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            respuesta: "Error en el núcleo: " + error.message
        });
    }
});

export default app;
