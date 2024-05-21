import type { Group } from "$api/types"

export const createViewEditState = (group: Group): Group => {
  let name = $state(group.name)
  let display_name = $state(group.display_name)
  let description = $state(group.description)
  let icon = $state(group.icon)
  let banner = $state(group.banner)
  let color = $state(group.color)

  return {
    get name() {
      return name
    },
    set name(value: string | undefined) {
      name = value
    },
    get display_name() {
      return display_name
    },
    set display_name(value: string | undefined) {
      display_name = value
    },
    get description() {
      return description
    },
    set description(value: string | undefined) {
      description = value
    },
    get icon() {
      return icon
    },
    set icon(value: string | undefined) {
      icon = value
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