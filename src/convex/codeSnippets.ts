import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const saveSnippet = mutation({
  args: {
    title: v.string(),
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("Must be authenticated to save snippets");
    }

    const snippetId = await ctx.db.insert("codeSnippets", {
      userId: user._id,
      title: args.title,
      language: args.language,
      code: args.code,
    });

    return snippetId;
  },
});

export const getUserSnippets = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("codeSnippets")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const deleteSnippet = mutation({
  args: {
    snippetId: v.id("codeSnippets"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const snippet = await ctx.db.get(args.snippetId);
    
    if (!snippet || snippet.userId !== user._id) {
      throw new Error("Snippet not found or unauthorized");
    }

    await ctx.db.delete(args.snippetId);
  },
});
