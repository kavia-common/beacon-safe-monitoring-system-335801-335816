import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite runs in Node and can access process.env variables injected by the container runtime.
 * We proxy browser calls from `/api/*` to the backend to avoid CORS and avoid requiring
 * VITE_* prefixed env vars in the client bundle.
 */
export default defineConfig(() => {
  const backendUrl =
    process.env.API_BASE ||
    process.env.BACKEND_URL ||
    "http://localhost:3001";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    }
  };
});
