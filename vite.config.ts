import { sveltekit } from "@sveltejs/kit/vite"
import commonjs from "vite-plugin-commonjs"
import { defineConfig } from "vite"
import { execSync } from "node:child_process"
import MagicString from "magic-string"

const hash = execSync("git rev-parse --short HEAD").toString().trim()

export default defineConfig({
  plugins: [sveltekit(), commonjs(), tablerOptimizer()],
  define: {
    __COMMIT_HASH__: JSON.stringify("_" + hash),
  },
})

// taken from https://github.com/tabler/tabler-icons/issues/669#issuecomment-1993756128
// converts all named imports to direct imports during transforming
function tablerOptimizer(): import("vite").Plugin {
  return {
    name: "tabler-svelte optimizer",
    transform(code, id) {
      const ms = new MagicString(code, { filename: id })
      ms.replace(
        /([ \t]*)import\s+\{([^;]*?)\}\s+from\s+['"]@tabler\/icons-svelte['"];/g,
        (match, whitespace: string, importNames: string) => {
          const hasSemi = match.endsWith(";")
          const imports = importNames
            .split(",")
            .map((v) => v.trim())
            .map((name) => {
              const path = name
              return `${whitespace}import ${name} from '@tabler/icons-svelte/dist/svelte/icons/${path}.svelte'${
                hasSemi ? ";" : ""
              }`
            })
          return imports.join("\n")
        }
      )

      if (ms.hasChanged()) {
        return {
          code: ms.toString(),
          map: ms.generateMap(),
        }
      }
    },
  }
}
