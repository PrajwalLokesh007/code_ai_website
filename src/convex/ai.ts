"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

// Initialize OpenAI client pointing to Mistral AI
const mistral = new OpenAI({
  baseURL: "https://api.mistral.ai/v1",
  apiKey: process.env.MISTRAL_API_KEY || "missing_key",
});

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      const completion = await mistral.chat.completions.create({
        model: "codestral-latest",
        messages: args.messages as any,
      });

      return { success: true, data: completion.choices[0]?.message?.content };
    } catch (error: any) {
      console.error("AI Error:", error);
      return { success: false, error: error.message || "Failed to generate AI response" };
    }
  },
});

// AI Explain Code Feature
export const explainCode = action({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    try {
      const completion = await mistral.chat.completions.create({
        model: "codestral-latest",
        messages: [
          { role: "system", content: "You are an expert coding tutor. Explain the following code clearly and concisely." },
          { role: "user", content: args.code }
        ],
      });
      return { success: true, data: completion.choices[0]?.message?.content };
    } catch (error: any) {
      console.error("AI Explain Error:", error);
      return { success: false, error: error.message || "Failed to generate explanation" };
    }
  },
});

// AI Code Generation Feature
export const generateCode = action({
  args: { prompt: v.string(), code: v.optional(v.string()) },
  handler: async (ctx, args) => {
    try {
      const completion = await mistral.chat.completions.create({
        model: "codestral-latest",
        messages: [
          { role: "system", content: "You are an expert AI programmer. Output ONLY the raw code requested. Do not include markdown blocks, backticks, or explanations." },
          { role: "user", content: `Existing Code:\n${args.code || "None"}\n\nUser Request: ${args.prompt}` }
        ],
      });
      return { success: true, data: completion.choices[0]?.message?.content };
    } catch (error: any) {
      console.error("AI Generate Error:", error);
      return { success: false, error: error.message || "Failed to generate code" };
    }
  },
});

// Aliases just in case the frontend uses different names
export const explain = explainCode;
export const generate = generateCode;