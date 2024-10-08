<script lang="ts">
  import type { ApiError } from "$api"
  import type { Group, Member } from "$api/types"
  import { browser } from "$app/environment"
  import { type DashList } from "$lib/dash/dash.svelte"
  import { groupCount } from "$lib/dash/member/utils"
  import { IconDeviceFloppy } from "@tabler/icons-svelte"
  import moment from "moment"

  let {
    item,
    list,
    groups,
    memberList,
    groupList,
    itemPath,
    groupPath,
    loading = $bindable(),
    err = $bindable(),
    success = $bindable(),
    onSuccess,
  }: {
    list: DashList<Member | Group>
    item: Member | Group
    groups?: string[]
    groupList: DashList<Group>
    memberList: DashList<Member>
    loading: boolean
    success: boolean
    err: string[]
    itemPath: string
    groupPath?: string
    onSuccess: () => void
  } = $props()

  async function submitCreate() {
    if (!browser) return

    err = []
    success = false

    // first trim every field
    let body = Object.fromEntries(
      Object.entries(item)
        .map(([key, value]) => [key, value && typeof value === "string" ? value.trim() : value])
        .filter(([_, value]) => value != null)
    )

    // check the fields that need a specific format
    if (body?.birthday) {
      // replace slashes with dashes
      body.birthday = body.birthday.split("/").join("-")

      // check if there's a year included, if not, we add 0004
      // we're just looking for the amount of dashes in the string
      if (body?.birthday.split("-").length === 2) {
        body.birthday = "0004-" + body.birthday
      }

      if (body.birthday.split("-").length !== 3 || !moment(body.birthday, "YYYY-MM-DD").isValid()) {
        // invalid format!
        err.push("Invalid birthday format (use YYYY-MM-DD instead)")
      }
    }

    if (body?.color) {
      body.color = body.color.replace("#", "")
      const match = new RegExp(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i).test(body.color)
      if (!match) {
        err.push("Invalid color format")
      }
    }

    if (err.length > 0) return

    const token = localStorage.getItem("pk-token") || ""
    loading = true

    try {
      let response = await window.api<Member | Group>(itemPath, {
        token,
        method: "POST",
        body,
      })

      if (response) {
        if (groupPath && groups && groups.length > 0) {
          await window.api(`${itemPath}/${response.uuid}/${groupPath}/overwrite`, {
            token,
            method: "POST",
            body: groups,
          })
        }

        if (groups) {
          if (itemPath === "members" && groupPath === "groups") {
            groupList.list.raw.forEach((g) => {
              if (groups.includes(g.uuid ?? "")) {
                g.members?.push(response.uuid || "")
              }
            })
          } else if (itemPath === "groups" && groupPath === "members") {
            ;(response as Group).members = groups
          }

          if (list.filter && list.page) {
            if (groups.includes(list.page.uuid || "")) list.filter.push(response.uuid || "")
          }
        }

        if (itemPath === "members")
          (response as Member).group_count = groupCount(response.uuid || "", groupList.list.raw)

        list.list.raw.push(response)

        groupList.process(groupList.list.raw)
        memberList.process(groupList.list.raw)
        list.paginate()
      }
    } catch (e) {
      const error = e as ApiError
      console.error(error.data)
      err.push(error.message || "")
    }
    loading = false
    success = true

    if (success && onSuccess) {
      onSuccess()
    }

    await new Promise((res) => setTimeout(res, 5000))
    success = false
  }
</script>

<button
  onclick={() => submitCreate()}
  class={`btn btn-sm ${!item.name ? "btn-disabled text-muted" : "btn-success"}`}
  disabled={!item.name}
>
  <IconDeviceFloppy /> Create
  {#if itemPath === "members"}
    member
  {:else if itemPath === "groups"}
    group
  {/if}
</button>
