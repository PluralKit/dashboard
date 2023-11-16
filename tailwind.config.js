import daisyui from "daisyui"
import typography from "@tailwindcss/typography"
import { light, dark, night, autumn, coffee, halloween, pastel } from "daisyui/src/theming/themes"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [typography(), daisyui],
  daisyui: {
    themes: [
      {
        // cool light
        light: {
          ...light,
          primary: "#da9317",
          secondary: "#9e66ff",
          accent: "#22ded8",
        },
        // cool dark
        dark: {
          ...dark,
          primary: "#da9317",
          secondary: "#ae81fc",
          accent: "#6df1fc",
        },
        // bright dark
        acid: {
          ...night,
          primary: "#9ff20f",
          secondary: "#11e8f7",
          accent: "#ff7d19",
        },
        // bright light (trans rights!)
        cotton: {
          ...pastel,
          primary: "#ff94c4",
          secondary: "#6dcffc",
          accent: "#fcd551",
        },
        // warm light
        autumn: {
          ...autumn,
          primary: "#e38010",
        },
        // warm dark
        coffee: {
          ...halloween,
          secondary: "#ad330a",
          accent: coffee.accent,
          primary: coffee.primary,
          neutral: coffee.neutral,
        },
      },
    ],
  },
}
