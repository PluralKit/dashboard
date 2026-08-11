import apiClient, { ErrorType, type ApiError } from "$api"
import type { System } from "$api/types"
import { login } from "$api/utils"
import { env } from "$env/dynamic/private"

export async function load({ cookies, url, locals }) {
  const theme = cookies.get("pk-theme") ?? "dark"

  const token = cookies.get("pk-token")

  let error: string | null = null

  let system: System | null = null
  if (token) {
    try {
      system = await login(locals.api, cookies)
      cookies.set("pk-sid", system?.id || "", {
        path: "/",
        secure: env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 90, // 90 days
      })
    } catch (err) {
      if ((err as ApiError).type === ErrorType.InvalidToken && !url.searchParams.get("api")) {
        cookies.delete("pk-token", {
          path: "/",
          secure: env.NODE_ENV !== "development",
        })
        cookies.delete("pk-sid", {
          path: "/",
          secure: env.NODE_ENV !== "development",
        })
      }
      error = (err as Error).message
    }
  }

  return {
    system,
    token,
    theme,
    error,
    apiBaseUrl: locals.apiBaseUrl,
  }
}
