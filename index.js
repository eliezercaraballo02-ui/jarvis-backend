import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Jarvis HF activo 🚀" });
});

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ respuesta: "No prompt enviado" });
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({
        respuesta: "Falta HF_TOKEN en Vercel"
      });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150
          }
        }),
      }
    );

    const data = await response.json();

    // Manejo seguro de respuesta
    const text =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "No pude generar respuesta";

    return res.json({
      respuesta: text
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      respuesta: "Error interno: " + error.message
    });
  }
});


export default app;
