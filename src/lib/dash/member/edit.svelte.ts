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
    get aliases() {
      return view.aliases
    },
    set aliases(value: string[]|undefined) {
      view.aliases = value
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
  let aliases: string[] = $state([])
  member.aliases?.forEach(a => aliases.push(a))

  return {
get name() {
      return name
    },
    set name(value: string | undefined) {
      name = value
    },
    get aliases() {
      return aliases
    },
    set aliases(value: string[]) {
      aliases = value
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
    }
  }
}

const createPrivacyEditState = (member: Member): MemberPrivacy => {
  const privacyState: MemberPrivacy = $state({})

  // assign each field individually for state to be reactive
  Object.entries(member.privacy ?? {}).forEach(([k, v]) => privacyState[k as keyof MemberPrivacy] = v)

  return privacyState
}
