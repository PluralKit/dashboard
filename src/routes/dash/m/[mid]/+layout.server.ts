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

  let member: Member | undefined = undefined
  let groups: Group[] = []
  let members: Member[] = []
  let errs: string[] = []
  let privacyMode: PrivacyMode = PrivacyMode.PUBLIC

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
    } catch (err) {
      const e = err as ApiError
      if (e.type === ErrorType.RateLimit) errs.push(e.message || e.code.toString())
      else error(e.code, e.message)
    }
  }

  return {
    privacyMode,
    errors: errs,
    member: member as Member,
    groups,
    members,
    meta: {
      title: member?.name || "Dash",
      color: member?.color,
      ogTitle: member?.name || "Dash",
      ogDescription: member?.id ? `View ${member?.name} on the dashboard` : "",
    },
  }
}
