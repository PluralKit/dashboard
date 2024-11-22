import type { System, SystemPrivacy } from "$api/types"

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

export const createInfoEditState = (
  system: System
): System & {
  privacy: SystemPrivacy
} => {
  let privacy = $state(createPrivacyEditState(system))

  return {
    get privacy() {
      return privacy
    },
    set privacy(value: SystemPrivacy) {
      privacy = value
    },
  }
}

const createPrivacyEditState = (system: System): SystemPrivacy => {
  let member_list_privacy = $state(system.privacy?.member_list_privacy)
  let group_list_privacy = $state(system.privacy?.group_list_privacy)
  let name_privacy = $state(system.privacy?.name_privacy)
  let description_privacy = $state(system.privacy?.description_privacy)
  let avatar_privacy = $state(system.privacy?.avatar_privacy)
  let pronoun_privacy = $state(system.privacy?.pronoun_privacy)
  let front_privacy = $state(system.privacy?.front_privacy)
  let front_history_privacy = $state(system.privacy?.front_history_privacy)
  let banner_privacy = $state(system.privacy?.banner_privacy)
  return {
    get member_list_privacy() {
      return member_list_privacy
    },
    set member_list_privacy(value: string | undefined) {
      member_list_privacy = value
    },
    get name_privacy() {
      return name_privacy
    },
    set name_privacy(value: string | undefined) {
      name_privacy = value
    },
    get description_privacy() {
      return description_privacy
    },
    set description_privacy(value: string | undefined) {
      description_privacy = value
    },
    get group_list_privacy() {
      return group_list_privacy
    },
    set group_list_privacy(value: string | undefined) {
      group_list_privacy = value
    },
    get pronoun_privacy() {
      return pronoun_privacy
    },
    set pronoun_privacy(value: string | undefined) {
      pronoun_privacy = value
    },
    get avatar_privacy() {
      return avatar_privacy
    },
    set avatar_privacy(value: string | undefined) {
      avatar_privacy = value
    },
    get front_privacy() {
      return front_privacy
    },
    set front_privacy(value: string | undefined) {
      front_privacy = value
    },
    get front_history_privacy() {
      return front_history_privacy
    },
    set front_history_privacy(value: string | undefined) {
      front_history_privacy = value
    },
    get banner_privacy() {
      return banner_privacy
    },
    set banner_privacy(value: string | undefined) {
      banner_privacy = value
    },
  }
}
