import type { Group, Member } from "$api/types"
import { browser } from "$app/environment"
import { PrivacyMode, type DashList } from "../dash.svelte"

export async function deriveGroupsAsync(
  member: Member,
  current: Group[],
  privacyMode: PrivacyMode
): Promise<Group[]> {
  if (privacyMode !== PrivacyMode.PRIVATE) {
    if (!browser) return current

    // we're viewing the public list! we want to fetch the groups for the individual member
    // any group with their member list privated will not show up here otherwise
    const groups = (await window.api<Group[]>(`members/${member.uuid}/groups`)) ?? []
    return groups.sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
    // if not, just return the existing groups
  } else return current
}

export function deriveGroups(
  member: Member,
  asPage: boolean,
  groupList: DashList<Group>,
  privacyMode: PrivacyMode
) {
  return filterGroups(groupList.list.raw, member, privacyMode === PrivacyMode.PRIVATE)
}

function filterGroups(list: Group[], member: Member, filter = true) {
  let l = [...list]
  if (filter) l = l.filter((g) => g.members?.includes(member.uuid || ""))
  return l.sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
}
