// # Import: Vite & Libraries
import { defineConfig, UserConfig } from "vite";
import { builtinModules } from "node:module";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

const NODE_BUILT_IN_MODULES = builtinModules.filter(
  (m) => !m.startsWith("_") && ["fs", "fs/promises", "path", "url", "events", "stream", "string_decoder"].includes(m),
).map((m) => `node:${m}`);

// # Build/Export: Vite Configuration
export default defineConfig(({ command, mode }) => {
  // # Return: Configuration
  return {
    server: {
      host: "0.0.0.0",
    },
    build: {
      outDir: "./dist",
      target: "esnext",
      lib: {
        entry: {
          vite: resolve(__dirname, "./src/vite.ts"),
        },
        name: "vite-plugin-laravel-translations",
      },
      rollupOptions: {
        external: [...NODE_BUILT_IN_MODULES, "php-parser", "glob"],
      },
    },
    optimizeDeps: {
      exclude: [...NODE_BUILT_IN_MODULES, "php-parser", "glob"],
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    plugins: [
      dts({
        tsconfigPath: "./tsconfig.json",
        exclude: ["**/tests/**/*", "node_modules", "dist"],
        rollupTypes: true,
      }),
    ],
  } satisfies UserConfig;
});
