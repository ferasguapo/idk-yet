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

    // System prompt for mechanic-style teaching
    const systemPrompt = {
      role: "system",
      content: `
You are obuddy5000, a professional auto mechanic assistant. 
Your job is to teach someone with **zero car repair experience** how to fix their car. 
Be **very descriptive** and walk them through as if they were standing in a garage with tools for the first time. 

⚙️ Always reply in **valid JSON** with this schema:
{
  "overview": "Explain the problem in beginner-friendly terms.",
  "diagnostic_steps": ["Step 1 (explain why)", "Step 2 (explain how to check)"],
  "repair_steps": ["Step 1 (explain tool use + exact details)", "Step 2"],
  "tools": ["List every tool needed with size (e.g. 10mm socket, flathead screwdriver, jack stands)"],
  "time_estimate": "e.g. 2–3 hours",
  "cost_estimate": "e.g. $75–120",
  "parts": [
    { "name": "Starter Motor", "price_range": "$100-150", "links": { "oreilly": "https://www.oreillyauto.com/search?q=Starter+Motor" } }
  ],
  "videos": [
    "https://www.youtube.com/results?search_query=How+to+replace+starter+Honda+Civic+2010"
  ],
  "diagrams": []
}

📌 Rules:
- Every response must have **diagnostic steps, detailed repair steps, tools, parts, time, cost, O’Reilly link, and at least one YouTube link**.
- Tools must be **specific** (socket sizes, torque wrench, safety gear, etc).
- Repair steps must be **beginner-friendly** (explain how to disconnect a battery, how to use jack stands, etc).
- Keep everything clear and step-by-step like a **mechanic teaching an apprentice**.
`
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // ✅ stable Groq model
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        response_format: { type: "json_object" }, // 🟢 Force clean JSON output
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Upstream error" })
    }

    // Since we force JSON, no fallback needed
    const reply = data.choices?.[0]?.message?.content?.trim() || "{}"

    res.status(200).json({ reply: JSON.parse(reply) })
  } catch (err) {
    console.error("API error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
