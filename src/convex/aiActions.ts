"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

export const getCodeAssistance = action({
  args: {
    code: v.string(),
    language: v.string(),
    question: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = "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";

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const systemPrompt = `You are an expert programming assistant. Help users understand, debug, and improve their code. Be concise and clear.`;

    const userPrompt = `Language: ${args.language}\n\nCode:\n${args.code}\n\nQuestion: ${args.question}`;

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "No response generated";
  },
});

export const explainCode = action({
  args: {
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = "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";

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        {
          role: "system",
          content: "You are a code explanation expert. Explain code clearly and concisely.",
        },
        {
          role: "user",
          content: `Explain this ${args.language} code:\n\n${args.code}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    return response.choices[0]?.message?.content || "No explanation generated";
  },
});

export const generateCodeEdit = action({
  args: {
    code: v.string(),
    language: v.string(),
    instruction: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = "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";

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const systemPrompt = `You are an expert code editor AI. When given code and an instruction, you should return ONLY the modified code without any explanations, markdown formatting, or additional text. Return the complete modified code that can directly replace the original code.`;

    const userPrompt = `Language: ${args.language}\n\nCurrent Code:\n${args.code}\n\nInstruction: ${args.instruction}\n\nReturn ONLY the modified code, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    let modifiedCode = response.choices[0]?.message?.content || args.code;

    // Remove markdown code blocks if present
    modifiedCode = modifiedCode.replace(/```(?:\w+)?\n?/g, '');
    modifiedCode = modifiedCode.replace(/```(?:\w+)?\n?/g, '');

    return modifiedCode;
  },
});