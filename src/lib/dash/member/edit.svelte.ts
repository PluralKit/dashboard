import apiClient, { type ApiError } from "$api"
import type { Group, Member, System } from "$api/types"
import moment from "moment"
import { browser } from  "$app/environment"
import { dash } from "../dash.svelte"

// TODO: move this to it's own file
export async function submitMemberSave(
  editedState: Member | Group | System,
  path: string,
  state: {
    asPage: boolean
    err: string | undefined
    success: boolean
    loading: boolean
  }
) {
  state.err = ""

  // first trim every field
  let body = Object.fromEntries(
    Object.entries(editedState)
      .map(([key, value]) => [key, value ? value.trim() : value])
      .filter(([_, value]) => value != null)
  )

  // check the fields that need a specific format
  if (body.birthday) {
    // replace slashes with dashes
    body.birthday.split("/").join("-")

    // check if there's a year included, if not, we add 0004
    // we're just looking for the amount of dashes in the string
    if (body.birthday.split("-").length === 2) {
      body.birthday = "0004-" + body.birthday
    }

    if (body.birthday.split("-").length !== 3 || !moment(body.birthday, "YYYY-MM-DD").isValid()) {
      // invalid format!
      state.err = "Invalid birthday format (use YYYY-MM-DD instead)"
      return
    }
  }

  const token = (browser && localStorage.getItem("pk-token")) || ""
  const api = apiClient(fetch)

  let response: Member | Group | System | undefined = undefined
  state.loading = true

  try {
    response = await api<Member | Group | System>(path, {
      token,
      method: "PATCH",
      body,
    })
    state.success = true

    if (response) {
      // if we're on the dash we need to replace the member in the list
      // if not, we just need to replace the member
      if (!state.asPage) {
        const toReplace = dash.members.list.raw.find((m) => m.uuid === response?.uuid) || {}
        Object.assign(toReplace, response)
      } else {
        Object.assign(dash.member.member || {}, response)
      }
    }
  } catch (e) {
    const error = e as ApiError
    state.err = error.message
  }

  state.loading = false

  await new Promise((res) => setTimeout(res, 5000))
  state.success = false
}

export const createViewEditState = (member: Member) => {
  let name = $state(member.name)
  let display_name = $state(member.display_name)
  let pronouns = $state(member.pronouns)
  let birthday = $state(member.birthday)
  let description = $state(member.description)
  let avatar_url = $state(member.avatar_url)
  let webhook_avatar_url = $state(member.webhook_avatar_url)
  let banner = $state(member.banner)

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
  }
}
