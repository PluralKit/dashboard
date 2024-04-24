<script lang="ts">
  import apiClient, { type ApiError } from "$api"
  import type { Group, Member, System } from "$api/types"
  import { browser } from "$app/environment"
  import type { DashList } from "$lib/dash/dash.svelte"
  import { IconDeviceFloppy } from "@tabler/icons-svelte"
  import moment from "moment"

  let { asPage, loading = $bindable(), success = $bindable(), err = $bindable(), edited, path, pageItem, list }: {
    asPage: boolean,
    loading: boolean,
    success: boolean,
    err: string[],
    edited: Member|Group|System
    path: string,
    list: DashList<Member|Group>,
    pageItem: Member|Group|System
  } = $props()

  export async function submitEdit() {
  err = []

  // first trim every field
  let body = Object.fromEntries(
    Object.entries(edited)
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
      err.push("Invalid birthday format (use YYYY-MM-DD instead)")
    }
  }

  if (body.color) {
    body.color = body.color.replace("#", "")
    const match = new RegExp(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i).test(body.color)
    if (!match) {
      err.push("Invalid color format")
    }
  }

  if (err.length > 0) return

  const token = (browser && localStorage.getItem("pk-token")) || ""
  const api = apiClient(fetch)

  let response: Member | Group | System | undefined = undefined
  loading = true

  try {
    response = await api<Member | Group | System>(path, {
      token,
      method: "PATCH",
      body,
    })
    success = true

    if (response) {
      // if we're on the dash we need to replace the member in the list
      // if not, we just need to replace the member
      if (!asPage) {
        const toReplace = list.list.raw.find((m) => m.uuid === response?.uuid) || {}
        Object.assign(toReplace, response)
      } else {
        Object.assign(pageItem || {}, response)
      }
    }
  } catch (e) {
    const error = e as ApiError
    console.error(error.data)
    err.push(error.message || "")
  }

  loading = false

  await new Promise((res) => setTimeout(res, 5000))
  success = false
}
</script>

<button onclick={() => submitEdit()} class="btn btn-sm btn-success join-item">
  <IconDeviceFloppy /> Save
</button>