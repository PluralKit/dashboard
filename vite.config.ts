import { sveltekit } from '@sveltejs/kit/vite';
import commonjs from "vite-plugin-commonjs"
import { defineConfig } from 'vite';
import { execSync } from "node:child_process"

const hash = execSync("git rev-parse --short HEAD").toString().trim()

export default defineConfig({ 
	plugins: [sveltekit(), commonjs()],
	define: {
		__COMMIT_HASH__: JSON.stringify("_" + hash)
	}
});
