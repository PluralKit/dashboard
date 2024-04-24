import type { Member } from "$api/types"

export const createViewEditState = (member: Member) => {
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
    set color(value: string|undefined) {
      color = value
    }
  }
}
