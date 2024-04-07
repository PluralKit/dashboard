import apiClient from "$api"
import type { System } from "$api/types"
import { login } from "$api/utils"
import { env } from "$env/dynamic/private"

export async function load({ cookies }) {
  const theme = cookies.get("pk-theme") ?? "dark"

  const token = cookies.get("pk-token")

  let system: System | null = null
  if (token) {
    const api = apiClient(fetch)
    try {
      system = await login(api, cookies)
      cookies.set("pk-sid", system?.id || "", {
        path: "/",
        secure: env.NODE_ENV !== "development",
      })
    } catch (err) {
      return {
        error: (err as Error).message,
      }
    }
  }

  return {
    system: system,
    token: token,
    theme: theme,
  }
}
