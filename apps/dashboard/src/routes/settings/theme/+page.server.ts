import type { Actions } from "@sveltejs/kit"

export function load({ cookies }) {
  const theme = cookies.get("pk-theme") ?? "dark"
  return {
    theme: theme,
  }
}

export const actions = {
  theme: async ({ request, cookies }) => {
    const formData = await request.formData()
    const theme = formData.get("theme")
    if (!theme)
      return {
        error: "Error setting theme.",
      }

    cookies.set("pk-theme", theme as string, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // a year long
    })

    return {
      success: "Theme set successfully!",
    }
  },
} satisfies Actions
