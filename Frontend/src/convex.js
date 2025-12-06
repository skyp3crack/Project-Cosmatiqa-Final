import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL); // Use VITE_CONVEX_URL for Vite

export default convex;