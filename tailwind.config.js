import daisyui from "daisyui"
import typography from "@tailwindcss/typography"
import { light, dark, night, autumn, coffee, halloween, pastel } from "daisyui/src/theming/themes"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [typography(), daisyui],
  theme: {
    extend: {
      colors: {
        muted: "oklch(var(--muted) / <alpha-value>)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        // cool light
        light: {
          ...light,
          primary: "#da9317",
          secondary: "#9e66ff",
          accent: "#22ded8",
          "--muted": "69.38% 0.01 252.85",
        },
        // cool dark
        dark: {
          ...dark,
          primary: "#da9317",
          secondary: "#ae81fc",
          accent: "#6df1fc",
          "--muted": "57.65% 0.022 254.07",
        },
        // bright dark
        acid: {
          ...night,
          "base-100": "#1a2433",
          primary: "#66d11f",
          secondary: "#30d0db",
          accent: "#f29838",
          "--muted": "60.29% 0.047 275.29",
        },
        // bright light (trans rights!)
        cotton: {
          ...pastel,
          primary: "#f868a4",
          secondary: "#58aff5",
          accent: "#f8b939",
          neutral: "b6bec8",
          "--muted": "69.38% 0.01 252.85",
          "--rounded-btn": "0.5rem",
        },
        // warm light
        autumn: {
          ...autumn,
          primary: "#e38010",
          "--muted": "67.94% 0.01 39.18",
        },
        // warm dark
        coffee: {
          ...halloween,
          secondary: "#ad330a",
          accent: coffee.accent,
          primary: coffee.primary,
          neutral: coffee.neutral,
          "--muted": "55.65% 0 54",
        },
      },
    ],
  },
}
