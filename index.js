import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Motor Jarvis Llama-3 Listo 🦾"));

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ respuesta: "Error: Falta el Token de Hugging Face" });
    }

    // Usamos el fetch nativo de Node.js
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        headers: { 
          "Authorization": `Bearer ${HF_TOKEN}`, 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `System: Responde como Jarvis, el asistente de Iron Man. Sé breve, técnico y en español. User: ${prompt} Assistant:`,
          parameters: { max_new_tokens: 200, return_full_text: false }
        }),
      }
    );

    const data = await response.json();
    
    // Hugging Face a veces devuelve un array o un objeto de error
    if (data.error) {
      return res.status(500).json({ respuesta: "Hugging Face dice: " + data.error });
    }

    const respuestaIA = data[0]?.generated_text || "Lo siento señor, el motor no respondió.";
    return res.json({ respuesta: respuestaIA.trim() });

  } catch (error) {
    return res.status(500).json({ respuesta: "Fallo en el sistema: " + error.message });
  }
});

export default app;
