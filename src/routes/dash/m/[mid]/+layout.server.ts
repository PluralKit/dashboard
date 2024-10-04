import apiClient, { ErrorType, type ApiError, type ApiOptions } from "$api"
import type { Group, Member } from "$api/types"
import { PrivacyMode } from "$lib/dash/dash.svelte.js"
import { error } from "@sveltejs/kit"

export async function load({ cookies, params, url, locals }) {
  const token = cookies.get("pk-token")
  const sid = cookies.get("pk-sid")

  let options: ApiOptions = {}

  let member: Member | undefined = undefined
  let groups: Group[] = []
  let members: Member[] = []
  let memberGroups: Group[] = []
  let errs: string[] = []
  let privacyMode: PrivacyMode = PrivacyMode.PUBLIC

  const api = locals.api

  try {
    member = await api<Member>(`members/${params.mid}`)
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.NotFound) error(404, `Member with id "${params.mid}" not found.`)
    else error(e.code, e.message)
  }

  if (sid && token && !url.searchParams.get("public") && !url.searchParams.get("api")) {
    options = { token }
    privacyMode = PrivacyMode.PRIVATE
  }

  if (member) {
    try {
      member = await api<Member>(`members/${params.mid}`, options)

      // fetch all the groups in the system so people can edit that member's groups on the page
      groups =
        (await api<Group[]>(`systems/${member?.system}/groups?with_members=true`, options)) || []
      members = (await api<Member[]>(`systems/${member?.system}/members`, options)) || []
      memberGroups = (await api<Group[]>(`members/${params.mid}/groups`, options)) || []
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
    member: member as Member,
    groups,
    members,
    memberGroups,
    meta: {
      title: member?.name || "Dash",
      color: member?.color,
      ogTitle: member?.name || "Dash",
      ogDescription: member?.id ? `View ${member?.name} on the dashboard` : "",
    },
  }
}
