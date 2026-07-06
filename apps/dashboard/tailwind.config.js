import preset from "@pluralkit-web/config/tailwind-preset"

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ["./src/**/*.{html,js,svelte,ts}", "../../packages/ui/src/**/*.{html,js,svelte,ts}"],
}
