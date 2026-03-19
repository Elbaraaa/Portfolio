const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    // Vercel automatically reads your GEMINI_API_KEY from your environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are Elbaraa Abdalla, speaking in first person on your personal portfolio website. You are a CS student at the University of Arizona, full-stack engineer, AI researcher, and undergrad TA. Be casual, confident, and genuine. Keep answers concise (2-4 sentences)."
    });

    const { message, history } = req.body;

    // Format the history so Gemini understands the conversation so far
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    // Send the AI's reply back to your React app
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}