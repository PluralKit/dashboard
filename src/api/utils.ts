import { ErrorType, type ApiError, type ApiClient } from "$api"
import type { Cookies } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import type { System } from "./types"

export async function login(api: ApiClient, token: string, cookies: Cookies): Promise<System> {
  try {
    let system = await api<System>(`systems/@me`, {
      token: token as string,
    })

    cookies.set("pk-token", token, {
      path: "/",
      secure: env.NODE_ENV !== "development",
    })

    if (system) return system
  } catch (err: unknown) {
    let e = err as ApiError

    if (e.type === ErrorType.InvalidToken) {
      cookies.delete("pk-token", {
        path: "/",
        secure: env.NODE_ENV !== "development",
      })

      throw Error("Invalid token.")
    } else {
      throw Error((err as Error).message)
    }
  }

  throw Error("No system found.")
}
