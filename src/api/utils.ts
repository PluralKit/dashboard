import { ErrorType, type ApiError, type ApiClient, type ApiOptions } from "$api"
import type { Cookies } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import type { Member, System, Group } from "./types"
import { PUBLIC_API_COOLDOWN } from "$env/static/public"

export async function login(api: ApiClient, cookies: Cookies): Promise<System | null> {
  try {
    const token = cookies.get("pk-token")
    if (!token) return null

    let system = await api<System>(`systems/@me`, {
      token: token as string,
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

export async function getDashInfo(api: ApiClient, sid: string, token?: string) {
  // if passing a token, use @me with token
  // else just use the system id
  let options: ApiOptions = {}
  if (token) {
    options = { token }
    sid = "@me"
  }

  let system: System = (await api<System>(`systems/${sid}`, options)) || {}
  await new Promise((resolve) => setTimeout(resolve, parseInt(PUBLIC_API_COOLDOWN)))
  let members: Member[] = (await api<Member[]>(`systems/${sid}/members`, options)) || []
  await new Promise((resolve) => setTimeout(resolve, parseInt(PUBLIC_API_COOLDOWN)))
  let groups: Group[] = (await api<Group[]>(`systems/${sid}/groups${token ? "?with_members=true" : ""}`, options)) || []

  return {
    system,
    members,
    groups,
  }
}
