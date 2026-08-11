import { sveltekit } from "@sveltejs/kit/vite"
import commonjs from "vite-plugin-commonjs"
import { defineConfig, type PluginOption } from "vite"
import { execSync } from "node:child_process"
import MagicString from "magic-string"

function getHash(): string {
  if (process.env.COMMIT_HASH) return process.env.COMMIT_HASH
  try {
    return execSync("git rev-parse --short HEAD").toString().trim()
  } catch {
    return "unknown"
  }
}

export default defineConfig({
  plugins: [sveltekit(), commonjs() as PluginOption],
  define: {
    __COMMIT_HASH__: JSON.stringify("_" + getHash()),
  },
})
