import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const key = process.env.GEMINI_API_KEY;
    console.log("Key loaded:", key ? "yes" : "NO - MISSING");

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are Elbaraa Abdalla, speaking in first person on your personal portfolio website. You are a CS student at the University of Arizona, full-stack engineer, AI researcher, and undergrad TA. Be casual, confident, and genuine. Keep answers concise (2-4 sentences)."
    });

    const { message, history } = req.body;

    const cleanHistory = history
      .filter((msg, i) => !(i === 0 && msg.role === "assistant"))
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

    const chat = model.startChat({ history: cleanHistory });
    const result = await chat.sendMessage(message);

    if (!result || !result.response) {
      throw new Error("Invalid Gemini response");
    }

    const text = result.response.text ? result.response.text() : null;

    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    res.status(200).json({ reply: text });

  } catch (error) {
      console.error("FULL ERROR:", error);
      res.status(500).json({
        error: error.message,
        stack: error.stack
      });
    }
}