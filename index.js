import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Sistema Jarvis Kappa: Motor Llama-3 🦾"));

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) return res.status(500).json({ respuesta: "Falta HF_TOKEN en el servidor." });

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
    console.log("Respuesta bruta de la API:", JSON.stringify(data));

    // Validar si la API está cargando el modelo (Error 503)
    if (data.error && data.estimated_time) {
      return res.status(503).json({ respuesta: "Señor, los sistemas están calentando. Reintente en 20 segundos." });
    }

    // Hugging Face devuelve un array con el texto generado
    const textoFinal = Array.isArray(data) ? data[0].generated_text : (data.generated_text || "Error de formato.");

    return res.json({ respuesta: textoFinal.replace(prompt, "").trim() });

  } catch (error) {
    console.error("Error en /chat:", error.message);
    return res.status(500).json({ respuesta: "Fallo de energía: " + error.message });
  }
});

export default app;
