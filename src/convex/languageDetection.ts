"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

export const detectLanguage = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = "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";

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://code-ai.app",
        "X-Title": "Code.AI"
      }
    });

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: `Detect programming language. Respond with ONE word only from: python, javascript, typescript, java, cpp, c, csharp, go, rust, ruby, php, swift, kotlin, r, perl, scala, haskell, lua, bash, sql\n\nCode:\n${args.code.substring(0, 500)}`,
        },
      ],
      temperature: 0,
      max_tokens: 5,
    });

    const detectedLanguage = response.choices[0]?.message?.content?.trim().toLowerCase() || "python";
    
    // Validate the response is one of our supported languages
    const supportedLanguages = [
      "python", "javascript", "typescript", "java", "cpp", "c", "csharp",
      "go", "rust", "ruby", "php", "swift", "kotlin", "r", "perl", "scala",
      "haskell", "lua", "bash", "sql", "assembly", "clojure", "cobol",
      "commonlisp", "d", "elixir", "erlang", "fsharp", "fortran", "groovy",
      "objectivec", "ocaml", "octave", "pascal", "prolog", "racket", "scheme",
      "visualbasic"
    ];
    
    if (supportedLanguages.includes(detectedLanguage)) {
      return detectedLanguage;
    }
    
    // Default to python if detection fails
    return "python";
  },
});