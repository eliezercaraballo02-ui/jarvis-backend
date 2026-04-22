import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).json({ mensaje: "Servidor OK" }));

app.post("/chat", async (req, res) => {
  // Aseguramos que la cabecera siempre sea JSON
  res.setHeader('Content-Type', 'application/json');

  try {
    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ respuesta: "Falta el token HF_TOKEN en el servidor." });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        headers: { 
          "Authorization": `Bearer ${HF_TOKEN}`, 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 150 }
        }),
      }
    );

    const data = await response.json();

    // Si Hugging Face devuelve error de carga (503)
    if (data.error) {
      return res.status(200).json({ respuesta: "Sistemas cargando, señor. Reintente en un momento." });
    }

    const textoIA = Array.isArray(data) ? data[0].generated_text : (data.generated_text || "Sin respuesta.");
    
    return res.json({ respuesta: textoIA.replace(prompt, "").trim() });

  } catch (error) {
    console.error("Error crítico:", error);
    return res.status(500).json({ respuesta: "Fallo de conexión: " + error.message });
  }
});

export default app;
