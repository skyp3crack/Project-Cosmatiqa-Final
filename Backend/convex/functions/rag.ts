import { query } from "../_generated/server";
import { v } from "convex/values";

export const retrieveKnowledge = query({
  args: { 
    keywords: v.array(v.string()), 
    ingredientTags: v.array(v.string()), 
    limit: v.number(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results;

    // Use search index if keywords are provided
    if (args.keywords.length > 0) {
      const knowledgeQuery = ctx.db
        .query("knowledge_base")
        .withSearchIndex("by_keywords", (q) =>
          q.search("keywords", args.keywords.join(" "))
        );
      
      // Filter by category if provided (can be chained after withSearchIndex)
      if (args.category) {
        results = await knowledgeQuery
          .filter((q) => q.eq(q.field("category"), args.category))
          .collect();
      } else {
        results = await knowledgeQuery.collect();
      }
    } else {
      // No keywords, start with regular query
      let knowledgeQuery = ctx.db.query("knowledge_base");
      
      // Filter by category if provided
      if (args.category) {
        knowledgeQuery = knowledgeQuery.filter((q) => 
          q.eq(q.field("category"), args.category)
        );
      }
      
      results = await knowledgeQuery.collect();
    }
    
    // Filter by ingredientTags if provided (in JavaScript since array.contains isn't supported in query builder)
    if (args.ingredientTags.length > 0) {
      results = results.filter((doc) => {
        // Check if any of the requested tags are in the document's ingredientTags array
        return args.ingredientTags.some(tag => doc.ingredientTags.includes(tag));
      });
    }

    // Apply limit
    return results.slice(0, args.limit);
  },
});
