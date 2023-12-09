import { redirect, type Actions } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import apiClient from "$api"
import { login } from "$api/utils"

export async function load({ url }) {
  return {
    logout: url.searchParams.get("logout") === "true" ? true : false,
  }
}

export const actions = {
  login: async ({ request, fetch, cookies }) => {
    const formData = await request.formData()
    const token = formData.get("token")

    if (!token)
      return {
        error: "Token is required.",
      }

    const api = apiClient(fetch)

    try {
      await login(api, token as string, cookies)
      throw redirect(302, "/")
    } catch (err) {
      return {
        error: (err as Error).message,
      }
    }
  },

  logout: async ({ cookies }) => {
    cookies.delete("pk-token", {
      path: "/",
      secure: env.NODE_ENV !== "development",
    })

    throw redirect(302, "/?logout=true")
  },
} satisfies Actions
