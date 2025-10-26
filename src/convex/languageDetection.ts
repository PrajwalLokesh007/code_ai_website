"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

export const detectLanguage = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a programming language detection expert. Analyze the provided code and identify which programming language it is written in. You must respond with ONLY ONE of these exact values: python, javascript, java, cpp, or c. Do not include any explanation or additional text.`,
        },
        {
          role: "user",
          content: `Detect the programming language of this code:\n\n${args.code}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    const detectedLanguage = response.choices[0]?.message?.content?.trim().toLowerCase() || "python";
    
    // Validate the response is one of our supported languages
    const supportedLanguages = ["python", "javascript", "java", "cpp", "c"];
    if (supportedLanguages.includes(detectedLanguage)) {
      return detectedLanguage;
    }
    
    // Default to python if detection fails
    return "python";
  },
});
