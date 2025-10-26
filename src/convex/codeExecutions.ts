import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const saveExecution = mutation({
  args: {
    language: v.string(),
    code: v.string(),
    output: v.string(),
    error: v.optional(v.string()),
    executionTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    const executionId = await ctx.db.insert("codeExecutions", {
      userId: user?._id,
      language: args.language,
      code: args.code,
      output: args.output,
      error: args.error,
      executionTime: args.executionTime,
    });

    return executionId;
  },
});

export const getUserExecutions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

export const getRecentExecutions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);
  },
});
