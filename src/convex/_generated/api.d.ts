/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiActions from "../aiActions.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as codeExecutionActions from "../codeExecutionActions.js";
import type * as codeExecutions from "../codeExecutions.js";
import type * as codeSnippets from "../codeSnippets.js";
import type * as folders from "../folders.js";
import type * as http from "../http.js";
import type * as languageDetection from "../languageDetection.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiActions: typeof aiActions;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  codeExecutionActions: typeof codeExecutionActions;
  codeExecutions: typeof codeExecutions;
  codeSnippets: typeof codeSnippets;
  folders: typeof folders;
  http: typeof http;
  languageDetection: typeof languageDetection;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
