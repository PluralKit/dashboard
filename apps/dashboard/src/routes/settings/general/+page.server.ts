import type { Actions } from "@sveltejs/kit"

export const actions = {
  apiUrl: async ({ request, cookies }) => {
    const formData = await request.formData()
    const apiUrl = formData.get("api-url")
    if (!apiUrl)
      return {
        error: "Error setting base API url.",
      }

    cookies.set("pk-api-url", apiUrl as string, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // a year long
    })

    return {
      success: "API changed successfully!",
      apiBaseUrl: apiUrl,
    }
  },
} satisfies Actions
