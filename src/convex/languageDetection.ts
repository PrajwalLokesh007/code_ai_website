"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

// Connect to our Mistral AI vault
const mistral = new OpenAI({
  baseURL: "https://api.mistral.ai/v1",
  apiKey: process.env.MISTRAL_API_KEY || "missing_key",
});

export const detectLanguage = action({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    try {
      const completion = await mistral.chat.completions.create({
        model: "codestral-latest",
        messages: [
          { 
            role: "system", 
            content: "You are a code language detector. Reply ONLY with the lowercase name of the programming language used in the code (e.g., javascript, python, cpp). Do not add any punctuation, markdown, or explanation." 
          },
          { role: "user", content: args.code }
        ],
      });

      // Extract the language name, or default to javascript if it gets confused
      const detectedLang = completion.choices[0]?.message?.content?.trim().toLowerCase();
      return detectedLang || "javascript";
      
    } catch (error: any) {
      console.error("Language Detection Error:", error);
      return "javascript"; // Safe fallback
    }
  },
});
