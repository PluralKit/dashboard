import { ErrorType, type ApiError, type ApiOptions } from "$api"
import type { Group, Member } from "$api/types"
import { PrivacyMode } from "$lib/dash/dash.svelte.js"
import { error } from "@sveltejs/kit"

export async function load({ cookies, params, url, locals }) {
  const token = cookies.get("pk-token")
  const sid = cookies.get("pk-sid")

  let options: ApiOptions = {}

  let group: Group | undefined = undefined
  let members: Member[] = []
  let groups: Group[] = []
  let groupMembers: Member[] = []
  let errs: string[] = []
  let privacyMode: PrivacyMode = PrivacyMode.PUBLIC

  const api = locals.api

  try {
    group = await api<Group>(`groups/${params.gid}`)
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.NotFound) error(404, `Member with id "${params.gid}" not found.`)
    else error(e.code, e.message)
  }

  if (sid && token && !url.searchParams.get("public") && !url.searchParams.get("api")) {
    options = { token }
    privacyMode = PrivacyMode.PRIVATE
  }

  if (group) {
    try {
      group = await api<Group>(`groups/${params.gid}`, options)
      members = (await api<Member[]>(`systems/${group?.system}/members`, options)) || []
      groups =
        (await api<Group[]>(`systems/${group?.system}/groups?with_members=true`, options)) || []
      groupMembers = (await api<Member[]>(`groups/${params.gid}/members`, options)) || []
    } catch (err) {
      const e = err as ApiError
      if (e.type === ErrorType.RateLimit) errs.push(e.message || e.code.toString())
      if (e.type === ErrorType.Forbidden) errs.push(e.message || e.code.toString())
      else error(e.code, e.message)
    }
  }

  return {
    privacyMode,
    errors: errs,
    group: group as Group,
    members,
    groups,
    groupMembers,
    meta: {
      title: group?.name || "Dash",
      color: group?.color,
      ogTitle: group?.name || "Dash",
      ogDescription: group?.id ? `View ${group?.name} on the dashboard` : "",
    },
  }
}
