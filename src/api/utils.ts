import { ErrorType, type ApiError, type ApiClient, type ApiOptions } from "$api"
import type { Cookies } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import type { Member, System, Group, Config } from "./types"

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

  let ratelimited: Record<string, boolean> = {}
  let errors: Record<string, string> = {}

  let system: System = {}
  try {
    system = (await api<System>(`systems/${sid}`, options)) || {}
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.RateLimit) ratelimited.system = true
    errors.system = e.message || "Unknown error while fetching system"
  }

  let members: Member[] = []
  try {
    members = (await api<Member[]>(`systems/${sid}/members`, options)) || []
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.RateLimit) ratelimited.members = true
    errors.members = e.message || "Unknown error while fetching members"
  }

  let groups: Group[] = []
  try {
    groups = (await api<Group[]>(`systems/${sid}/groups?with_members=true`, options)) || []
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.RateLimit) ratelimited.groups = true
    errors.groups = e.message || "Unknown error while fetching groups"
  }

  let config: Config | undefined = undefined
  try {
    config = (await api<Config>(`systems/${sid}/settings`, options)) ?? undefined
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.RateLimit) ratelimited.config = true
    errors.config = e.message || "Unknown error while fetching config"
  }

  return {
    errors,
    ratelimited,
    system,
    members,
    groups,
    config,
  }
}
