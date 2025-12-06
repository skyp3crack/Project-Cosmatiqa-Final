/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as functions_analysis from "../functions/analysis.js";
import type * as functions_cleanup from "../functions/cleanup.js";
import type * as functions_helpers from "../functions/helpers.js";
import type * as functions_ingredients from "../functions/ingredients.js";
import type * as functions_llm from "../functions/llm.js";
import type * as functions_products from "../functions/products.js";
import type * as functions_rag from "../functions/rag.js";
import type * as functions_seed from "../functions/seed.js";
import type * as functions_tidb from "../functions/tidb.js";
import type * as functions_users from "../functions/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "functions/analysis": typeof functions_analysis;
  "functions/cleanup": typeof functions_cleanup;
  "functions/helpers": typeof functions_helpers;
  "functions/ingredients": typeof functions_ingredients;
  "functions/llm": typeof functions_llm;
  "functions/products": typeof functions_products;
  "functions/rag": typeof functions_rag;
  "functions/seed": typeof functions_seed;
  "functions/tidb": typeof functions_tidb;
  "functions/users": typeof functions_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
