import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

// Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate AI Response with auto-fallback
const generateResponse = async (prompt) => {
  const models = [
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "allam-2-7b",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 2000,
      });

      let content = completion.choices[0]?.message?.content || "";

      // Clean markdown code blocks if present e.g. ```json ... ```
      content = content.trim();
      if (content.startsWith("```json")) {
        content = content.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
      } else if (content.startsWith("```")) {
        content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      return content.trim();
    } catch (error) {
      console.warn(`Model ${model} attempt failed:`, error.message);
      lastError = error;
    }
  }

  console.error("All AI Generation models failed:", lastError?.message);
  throw new Error(`AI Response Failed: ${lastError?.message}`);
};

export default generateResponse;