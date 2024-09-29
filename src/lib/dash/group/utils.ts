import type { ApiError } from "$api"
import apiClient from "$api"
import type { Group, Member } from "$api/types"
import { dash, PrivacyMode } from "../dash.svelte"

export async function deriveGroupsAsync(
  member: Member,
  current: Group[],
  asPage: boolean,
  done: boolean
): Promise<Group[]> {
  if (!asPage && dash.privacyMode !== PrivacyMode.PRIVATE) {
    // we're viewing the public list! we want to fetch the groups for the individual member
    // any group with their member list privated will not show up here otherwise
    const api = apiClient(fetch, dash.apiBaseUrl)
    const groups = (await api<Group[]>(`members/${member.uuid}/groups`)) ?? []
    return groups.sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
    // if not, just return the existing groups
  } else return current
}

export function deriveGroups(member: Member, asPage: boolean) {
  if (!asPage) return filterGroups(dash.groups.list.raw, member)

  return filterGroups(dash.member.groups, member, dash.member.privacyMode === PrivacyMode.PRIVATE)
}

function filterGroups(list: Group[], member: Member, filter = true) {
  let l = [...list]
  if (filter) l = l.filter((g) => g.members?.includes(member.uuid || ""))
  return l.sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
}
