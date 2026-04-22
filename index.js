const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Configuración de seguridad y permisos
app.use(cors());
app.use(express.json());

// REEMPLAZA: Pon tu API KEY real aquí adentro de las comillas
const API_KEY = "AIzaSyDnbYAoTJ1n152b7_rIpb7TFI1WmkFlTDA"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. RUTA PRINCIPAL: Para verificar que el servidor funciona en el navegador
app.get('/', (req, res) => {
    res.send("Servidor de Jarvis operativo. Sistema listo para recibir peticiones en /chat");
});

// 2. RUTA DE CHAT: Esta es la que usa tu archivo ia.js
app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ respuesta: "Error: No se recibió ningún texto." });
        }

        // Configuración de Jarvis para que responda corto y en español
        const instruccion = `Responde como Jarvis (asistente de Iron Man), de forma breve y técnica en español: ${prompt}`;

        const result = await model.generateContent(instruccion);
        const response = await result.response;
        const text = response.text();

        res.json({ respuesta: text });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ 
            respuesta: "Error en mi núcleo: " + error.message 
        });
    }
});

// EXPORTAR PARA VERCEL (No uses app.listen)
module.exports = app;
