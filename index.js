import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Asegúrate de tenerlo o usa el fetch nativo de Node 18+

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Jarvis con Motor Llama-3 Activo 🚀"));

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) return res.status(500).json({ respuesta: "Falta HF_TOKEN" });

    // Llamada a Hugging Face (Modelo Llama 3)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          inputs: `Responde como Jarvis de Iron Man, breve y técnico: ${prompt}`,
          parameters: { max_new_tokens: 250 }
        }),
      }
    );

    const result = await response.json();
    
    // Hugging Face devuelve un array, extraemos el texto
    let textoFinal = result[0]?.generated_text || "Error al generar respuesta";
    
    // Limpiamos el texto para que no repita el prompt
    textoFinal = textoFinal.replace(`Responde como Jarvis de Iron Man, breve y técnico: ${prompt}`, "").trim();

    return res.json({ respuesta: textoFinal });

  } catch (error) {
    return res.status(500).json({ respuesta: "Error en motor: " + error.message });
  }
});

export default app;
