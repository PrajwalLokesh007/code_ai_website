import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createFolder = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("Must be authenticated to create folders");
    }

    const folderId = await ctx.db.insert("folders", {
      userId: user._id,
      name: args.name,
      description: args.description,
    });

    return folderId;
  },
});

export const getUserFolders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("folders")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const deleteFolder = mutation({
  args: {
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const folder = await ctx.db.get(args.folderId);
    
    if (!folder || folder.userId !== user._id) {
      throw new Error("Folder not found or unauthorized");
    }

    // Delete all snippets in this folder
    const snippets = await ctx.db
      .query("codeSnippets")
      .withIndex("by_folderId", (q) => q.eq("folderId", args.folderId))
      .collect();
    
    for (const snippet of snippets) {
      await ctx.db.delete(snippet._id);
    }

    await ctx.db.delete(args.folderId);
  },
});

export const renameFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const folder = await ctx.db.get(args.folderId);
    
    if (!folder || folder.userId !== user._id) {
      throw new Error("Folder not found or unauthorized");
    }

    await ctx.db.patch(args.folderId, { name: args.name });
  },
});
