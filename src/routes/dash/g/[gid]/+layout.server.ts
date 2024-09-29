import apiClient, { ErrorType, type ApiError, type ApiOptions } from "$api"
import type { Group, Member } from "$api/types"
import { PrivacyMode } from "$lib/dash/dash.svelte.js"
import { error } from "@sveltejs/kit"

export async function load({ cookies, params, url, parent }) {
  const token = cookies.get("pk-token")
  const sid = cookies.get("pk-sid")

  const { apiBaseUrl } = await parent()
  const api = apiClient(fetch, apiBaseUrl)

  let options: ApiOptions = {}

  let group: Group | undefined = undefined
  let members: Member[] = []
  let errs: string[] = []
  let privacyMode: PrivacyMode = PrivacyMode.PUBLIC

  try {
    group = await api<Group>(`groups/${params.gid}`)
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.NotFound) error(404, `Member with id "${params.gid}" not found.`)
    else error(e.code, e.message)
  }

  if (sid && token && !url.searchParams.get("public") && !url.searchParams.get("api"))
    options = { token }

  if (group) {
    if (group.system === sid && !url.searchParams.get("public") && !url.searchParams.get("api")) {
      privacyMode = PrivacyMode.PRIVATE
      try {
        group = await api<Group>(`groups/${params.gid}`, options)
        members = (await api<Member[]>(`groups/${params.gid}/members`, options)) || []
      } catch (err) {
        const e = err as ApiError
        if (e.type === ErrorType.RateLimit) errs.push(e.message || e.code.toString())
        else error(e.code, e.message)
      }
    } else {
      try {
        members = (await api<Member[]>(`groups/${params.gid}/members`)) || []
      } catch (err) {
        const e = err as ApiError
        if (e.type === ErrorType.RateLimit) errs.push(e.message || e.code.toString())
        else if (e.type === ErrorType.Forbidden) errs.push("Member list is private")
        else error(e.code, e.message)
      }
    }
  }

  return {
    privacyMode,
    errors: errs,
    group: group as Group,
    members,
    meta: {
      title: group?.name || "Dash",
      color: group?.color,
      ogTitle: group?.name || "Dash",
      ogDescription: group?.id ? `View ${group?.name} on the dashboard` : "",
    },
  }
}
