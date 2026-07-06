import type { Group, Member } from "$api/types"
import moment from "moment"

export function getBirthday(birthday: string) {
  return moment(birthday).format("MMMM Do, YYYY").replace(", 0004", "")
}

export function proxyOptionFromString(inputValue: string) {
  if (!inputValue.includes("text")) {
    const tag = {
      prefix: inputValue,
      suffix: undefined,
    }

    const value = {
      value: `${inputValue}text`,
      text: `${inputValue}text`,
      extra: tag,
    }

    return value
  } else {
    const tag = {
      prefix: inputValue.slice(0, inputValue.indexOf("text")),
      suffix: inputValue.slice(inputValue.indexOf("text") + 4),
    }

    const value = {
      value: inputValue,
      text: inputValue,
      extra: tag,
    }

    return value
  }
}

export function mapMemberGroups(members: Member[], groups: Group[]) {
  return members.map((m) => ({
    ...m,
    group_count: groups.filter((g) => g.members?.includes(m.uuid || "") || false).length,
  }))
}

export function groupCount(mid: string, groups: Group[]) {
  return groups.filter((g) => g.members?.includes(mid || "") || false).length
}
