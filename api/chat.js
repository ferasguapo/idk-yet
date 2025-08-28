// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { messages } = req.body
    if (!messages) {
      return res.status(400).json({ error: "Missing messages" })
    }

    // Combine messages into a single prompt for HF
    const userPrompt = messages.map(m => `${m.role}: ${m.content}`).join("\n")

    // System-style instructions
    const systemPrompt = `
You are obuddy5000, a professional auto mechanic assistant.
Teach someone with zero repair experience step by step.
Always reply in **valid JSON** with this schema:
{
  "overview": "...",
  "diagnostic_steps": ["..."],
  "repair_steps": ["..."],
  "tools": ["..."],
  "time_estimate": "...",
  "cost_estimate": "...",
  "parts": [{ "name": "...", "price_range": "...", "links": { "oreilly": "..." } }],
  "videos": ["..."],
  "diagrams": []
}`

    // Call Hugging Face model (example: Mixtral-8x7B-Instruct)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\n${userPrompt}`,
          parameters: {
            temperature: 0.7,
            max_new_tokens: 800,
          },
        }),
      }
    )

    const data = await response.json()

    // Hugging Face responses can be string or array
    const text =
      typeof data === "string"
        ? data
        : Array.isArray(data)
        ? data[0]?.generated_text || ""
        : data.generated_text || ""

    res.status(200).json({ reply: JSON.parse(text) })
  } catch (err) {
    console.error("API error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
