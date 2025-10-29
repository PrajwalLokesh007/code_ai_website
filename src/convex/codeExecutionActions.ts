"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

const LANGUAGE_IDS: Record<string, number> = {
  // Original 5 languages
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  c: 50,
  
  // Additional popular languages
  typescript: 74,
  ruby: 72,
  go: 60,
  rust: 73,
  php: 68,
  swift: 83,
  csharp: 51,
  r: 80,
  perl: 85,
  scala: 81,
  haskell: 61,
  lua: 64,
  bash: 46,
  sql: 82,
  assembly: 45,
  clojure: 86,
  cobol: 77,
  commonlisp: 55,
  d: 56,
  elixir: 57,
  erlang: 58,
  fsharp: 87,
  fortran: 59,
  groovy: 88,
  objectivec: 79,
  ocaml: 65,
  octave: 66,
  pascal: 67,
  prolog: 69,
  racket: 88,
  scheme: 55,
  visualbasic: 84,
};

export const executeCode = action({
  args: {
    code: v.string(),
    language: v.string(),
    input: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiHost = process.env.JUDGE0_API_HOST;
    const apiKey = process.env.JUDGE0_API_KEY;
    const apiHostHeader = process.env.JUDGE0_API_HOST_HEADER;

    if (!apiHost) {
      throw new Error("Judge0 API host not configured");
    }

    const languageId = LANGUAGE_IDS[args.language];
    
    if (!languageId) {
      throw new Error(`Unsupported language: ${args.language}`);
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      if (apiHostHeader) {
        headers["X-RapidAPI-Key"] = apiKey;
        headers["X-RapidAPI-Host"] = apiHostHeader;
      } else {
        headers["X-Auth-Token"] = apiKey;
      }
    }

    // Submit code
    const submitResponse = await fetch(`${apiHost}/submissions?wait=false`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: args.code,
        language_id: languageId,
        stdin: args.input || "",
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`Submission failed: ${errorText}`);
    }

    const { token } = await submitResponse.json();

    // Poll for result
    let result;
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const resultResponse = await fetch(
        `${apiHost}/submissions/${token}?fields=stdout,stderr,status,time,memory,compile_output`,
        { headers }
      );

      if (!resultResponse.ok) {
        throw new Error("Failed to get submission result");
      }

      result = await resultResponse.json();

      if (result.status.id >= 3) {
        break;
      }
    }

    return {
      output: result.stdout || "",
      error: result.stderr || result.compile_output || "",
      status: result.status.description,
      time: result.time,
      memory: result.memory,
    };
  },
});