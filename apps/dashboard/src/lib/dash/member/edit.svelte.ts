import type { Member, MemberPrivacy, proxytag } from "$api/types"

const blankMember: Member = {
  proxy_tags: [],
  privacy: {
    name_privacy: "public",
    visibility: "public",
    metadata_privacy: "public",
    description_privacy: "public",
    avatar_privacy: "public",
    birthday_privacy: "public",
    pronoun_privacy: "public",
    proxy_privacy: "public",
  },
}

export const createMemberCreationState = (): Member & {
  privacy: MemberPrivacy
  proxy_tags: proxytag[]
} => {
  let view = $state(createViewEditState(blankMember))
  let info = $state(createInfoEditState(blankMember))

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
    get pronouns() {
      return view.pronouns
    },
    set pronouns(value: string | undefined) {
      view.pronouns = value
    },
    get birthday() {
      return view.birthday
    },
    set birthday(value: string | undefined) {
      view.birthday = value
    },
    get description() {
      return view.description
    },
    set description(value: string | undefined) {
      view.description = value
    },
    get avatar_url() {
      return view.avatar_url
    },
    set avatar_url(value: string | undefined) {
      view.avatar_url = value
    },
    get webhook_avatar_url() {
      return view.webhook_avatar_url
    },
    set webhook_avatar_url(value: string | undefined) {
      view.webhook_avatar_url = value
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
    get proxy_tags() {
      return info.proxy_tags
    },
    set proxy_tags(value: proxytag[]) {
      info.proxy_tags = value
    },
    get privacy() {
      return info.privacy
    },
    set privacy(value: MemberPrivacy) {
      info.privacy = value
    },
  }
}

export const createViewEditState = (member: Member): Member => {
  let name = $state(member.name)
  let display_name = $state(member.display_name)
  let pronouns = $state(member.pronouns)
  let birthday = $state(member.birthday)
  let description = $state(member.description)
  let avatar_url = $state(member.avatar_url)
  let webhook_avatar_url = $state(member.webhook_avatar_url)
  let banner = $state(member.banner)
  let color = $state(member.color)

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
    get pronouns() {
      return pronouns
    },
    set pronouns(value: string | undefined) {
      pronouns = value
    },
    get birthday() {
      return birthday
    },
    set birthday(value: string | undefined) {
      birthday = value
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
    get webhook_avatar_url() {
      return webhook_avatar_url
    },
    set webhook_avatar_url(value: string | undefined) {
      webhook_avatar_url = value
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
  member: Member
): Member & {
  proxy_tags: proxytag[]
  privacy: MemberPrivacy
} => {
  let proxy_tags: proxytag[] = $state(JSON.parse(JSON.stringify(member.proxy_tags)) || [])
  let privacy = $state(createPrivacyEditState(member))

  return {
    get proxy_tags() {
      return proxy_tags
    },
    set proxy_tags(value: proxytag[]) {
      proxy_tags = value
    },
    get privacy() {
      return privacy
    },
    set privacy(value: MemberPrivacy) {
      privacy = value
    },
  }
}

const createPrivacyEditState = (member: Member): MemberPrivacy => {
  let visibility = $state(member.privacy?.visibility)
  let description_privacy = $state(member.privacy?.description_privacy)
  let name_privacy = $state(member.privacy?.name_privacy)
  let birthday_privacy = $state(member.privacy?.birthday_privacy)
  let pronoun_privacy = $state(member.privacy?.pronoun_privacy)
  let avatar_privacy = $state(member.privacy?.avatar_privacy)
  let metadata_privacy = $state(member.privacy?.metadata_privacy)
  let proxy_privacy = $state(member.privacy?.proxy_privacy)
  let banner_privacy = $state(member.privacy?.banner_privacy)
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
    get birthday_privacy() {
      return birthday_privacy
    },
    set birthday_privacy(value: string | undefined) {
      birthday_privacy = value
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
    get metadata_privacy() {
      return metadata_privacy
    },
    set metadata_privacy(value: string | undefined) {
      metadata_privacy = value
    },
    get proxy_privacy() {
      return proxy_privacy
    },
    set proxy_privacy(value: string | undefined) {
      proxy_privacy = value
    },
    get banner_privacy() {
      return banner_privacy
    },
    set banner_privacy(value: string | undefined) {
      banner_privacy = value
    },
  }
}
