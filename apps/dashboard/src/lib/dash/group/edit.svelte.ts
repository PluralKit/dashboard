import type { Group, GroupPrivacy } from "$api/types"

const defaultGroup: Group & {
  privacy: GroupPrivacy
} = {
  privacy: {
    name_privacy: "public",
    list_privacy: "public",
    visibility: "public",
    metadata_privacy: "public",
    icon_privacy: "public",
    description_privacy: "public",
  },
}

export const createGroupCreationState = (): Group & {
  privacy: GroupPrivacy
} => {
  let view = $state(createViewEditState(defaultGroup))
  let info = $state(createInfoEditState(defaultGroup))
  return {
    get name() {
      return view.name
    },
    set name(value: string | undefined) {
      view.name = value
    },
    get display_name() {
      return view.display_name
    },
    set display_name(value: string | undefined) {
      view.display_name = value
    },
    get description() {
      return view.description
    },
    set description(value: string | undefined) {
      view.description = value
    },
    get icon() {
      return view.icon
    },
    set icon(value: string | undefined) {
      view.icon = value
    },
    get banner() {
      return view.banner
    },
    set banner(value: string | undefined) {
      view.banner = value
    },
    get color() {
      return view.color
    },
    set color(value: string | undefined) {
      view.color = value
    },
    get privacy() {
      return info.privacy
    },
    set privacy(value: GroupPrivacy) {
      info.privacy = value
    },
  }
}

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

export const createInfoEditState = (
  group: Group
): Group & {
  privacy: GroupPrivacy
} => {
  let privacy = $state(createPrivacyEditState(group))

  return {
    get privacy() {
      return privacy
    },
    set privacy(value: GroupPrivacy) {
      privacy = value
    },
  }
}

const createPrivacyEditState = (group: Group): GroupPrivacy => {
  let visibility = $state(group.privacy?.visibility)
  let description_privacy = $state(group.privacy?.description_privacy)
  let name_privacy = $state(group.privacy?.name_privacy)
  let icon_privacy = $state(group.privacy?.icon_privacy)
  let metadata_privacy = $state(group.privacy?.metadata_privacy)
  let list_privacy = $state(group.privacy?.list_privacy)
  let banner_privacy = $state(group.privacy?.banner_privacy)
  return {
    get visibility() {
      return visibility
    },
    set visibility(value: string | undefined) {
      visibility = value
    },
    get description_privacy() {
      return description_privacy
    },
    set description_privacy(value: string | undefined) {
      description_privacy = value
    },
    get name_privacy() {
      return name_privacy
    },
    set name_privacy(value: string | undefined) {
      name_privacy = value
    },
    get icon_privacy() {
      return icon_privacy
    },
    set icon_privacy(value: string | undefined) {
      icon_privacy = value
    },
    get metadata_privacy() {
      return metadata_privacy
    },
    set metadata_privacy(value: string | undefined) {
      metadata_privacy = value
    },
    get list_privacy() {
      return list_privacy
    },
    set list_privacy(value: string | undefined) {
      list_privacy = value
    },
    get banner_privacy() {
      return banner_privacy
    },
    set banner_privacy(value: string | undefined) {
      banner_privacy = value
    },
  }
}
