import apiClient, { ErrorType, type ApiError, type ApiOptions } from "$api"
import type { Group, Member } from "$api/types"
import { PUBLIC_API_COOLDOWN } from "$env/static/public"
import { PrivacyMode } from "$lib/dash/dash.svelte.js"
import { error } from "@sveltejs/kit"

export async function load({ cookies, params, url }) {
  const token = cookies.get("pk-token")
  const sid = cookies.get("pk-sid")

  const api = apiClient(fetch)

  let options: ApiOptions = {}

  let member: Member | undefined = undefined
  let groups: Group[] = []
  let errs: string[] = []
  let privacyMode: PrivacyMode = PrivacyMode.PUBLIC

  try {
    member = await api<Member>(`members/${params.mid}`)
  } catch (err) {
    const e = err as ApiError
    if (e.type === ErrorType.NotFound) error(404, `Member with id "${params.mid}" not found.`)
    else error(e.code, e.message)
  }

  if (sid && token && !url.searchParams.get("public")) options = { token }

  if (member) {
    if (member.system === sid && !url.searchParams.get("public")) {
      privacyMode = PrivacyMode.PRIVATE
      try {
        member = await api<Member>(`members/${params.mid}`, options)
        await new Promise((resolve) => setTimeout(resolve, parseInt(PUBLIC_API_COOLDOWN)))

        // fetch all the groups in the system so people can edit that member's groups on the page
        groups = (await api<Group[]>(`systems/${sid}/groups?with_members=true`, options)) || []
      } catch (err) {
        const e = err as ApiError
        if (e.type === ErrorType.RateLimit) errs.push(e.message || e.code.toString())
        else error(e.code, e.message)
      }
    } else {
      try {
        groups = (await api<Group[]>(`members/${params.mid}/groups`)) || []
      } catch (err) {
        const e = err as ApiError
        if (e.type === ErrorType.RateLimit) errs.push(e.message || e.code.toString())
        else error(e.code, e.message)
      }
    }
  }

  return {
    privacyMode,
    errors: errs,
    member: member as Member,
    groups,
    meta: {
      title: member?.name || "Dash",
      color: member?.color,
      ogTitle: member?.name || "Dash",
      ogDescription: member?.id ? `View ${member?.name} on the dashboard` : "",
    },
  }
}
