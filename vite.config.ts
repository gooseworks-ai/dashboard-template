import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The Gooseworks sandbox uses a symlink layout: source files live in
  // the workspace mount and are symlinked into the runnable project
  // directory. node_modules sits next to the symlinks, NOT next to the
  // canonical source. Without preserveSymlinks, vite/rollup would resolve
  // source files to their canonical paths and walk up looking for
  // node_modules from there — missing the local install entirely.
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
  // Pin the vite cache under the local project root so it never resolves
  // through to the workspace mount (which would slow rebuilds and leak
  // bytes into S3).
  cacheDir: ".vite",
});
