import type { System } from "$api/types"

export const createViewEditState = (system: System): System => {
  let name = $state(system.name)
  let pronouns = $state(system.pronouns)
  let tag = $state(system.tag)
  let description = $state(system.description)
  let avatar_url = $state(system.avatar_url)
  let banner = $state(system.banner)
  let color = $state(system.color)

  return {
    get name() {
      return name
    },
    set name(value: string | undefined) {
      name = value
    },
    get pronouns() {
      return pronouns
    },
    set pronouns(value: string | undefined) {
      pronouns = value
    },
    get tag() {
      return tag
    },
    set tag(value: string | undefined) {
      tag = value
    },
    get description() {
      return description
    },
    set description(value: string | undefined) {
      description = value
    },
    get avatar_url() {
      return avatar_url
    },
    set avatar_url(value: string | undefined) {
      avatar_url = value
    },
    get banner() {
      return banner
    },
    set banner(value: string | undefined) {
      banner = value
    },
    get color() {
      return color
    },
    set color(value: string | undefined) {
      color = value
    },
  }
}
