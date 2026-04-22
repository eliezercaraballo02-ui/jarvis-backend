const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors()); 
app.use(express.json());

// REEMPLAZA CON TU API KEY REAL
const genAI = new GoogleGenerativeAI("AIzaSyDnbYAoTJ1n152b7_rIpb7TFI1WmkFlTDA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ respuesta: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Esto es lo que cambia: Vercel necesita que exportes 'app'
module.exports = app;
