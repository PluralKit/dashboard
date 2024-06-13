<script lang="ts">
  import apiClient, { type ApiError } from "$api"
  import type { Group, Member, System } from "$api/types"
  import { browser } from "$app/environment"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconDeviceFloppy } from "@tabler/icons-svelte"
  import moment from "moment"

  type ItemEditOptions = {
    // base member/group edit
    body: Member | Group
    list: DashList<Member | Group>
    asPage: boolean
    item: Member | Group
  }

  type MemberGroupEditOptions = {
    // member groups edit
    member: Member
    body: string[]
    asPage: boolean
  }
  type GroupMemberEditOptions = {
    // group member list edit
    group: Group
    body: string[]
    asPage: boolean
  }
  type SystemEditOptions = {
    system: System
    body: System
  }

  let {
    loading = $bindable(),
    success = $bindable(),
    err = $bindable(),
    path,
    options,
    onSuccess,
  }: {
    loading: boolean
    success: boolean
    err: string[]
    path: string
    options: ItemEditOptions | MemberGroupEditOptions | GroupMemberEditOptions | SystemEditOptions
    onSuccess?: () => void
  } = $props()

  export async function submitEdit() {
    err = []
    let body: (Member & Group & System) | null = null
    let listBody: string[] | null = null

    if ((options as ItemEditOptions).item || (options as SystemEditOptions).system) {
      // first trim every field
      body = Object.fromEntries(
        Object.entries(options.body)
          .map(([key, value]) => [key, value && typeof value === "string" ? value.trim() : value])
          .filter(([_, value]) => value != null)
      )

      // check the fields that need a specific format
      if (body?.birthday) {
        // replace slashes with dashes
        body.birthday.split("/").join("-")

        // check if there's a year included, if not, we add 0004
        // we're just looking for the amount of dashes in the string
        if (body?.birthday.split("-").length === 2) {
          body.birthday = "0004-" + body.birthday
        }

        if (
          body.birthday.split("-").length !== 3 ||
          !moment(body.birthday, "YYYY-MM-DD").isValid()
        ) {
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
    } else if (
      (options as MemberGroupEditOptions).member ||
      (options as GroupMemberEditOptions).group
    ) {
      listBody = options.body as string[]
    }

    if (err.length > 0) return

    const token = (browser && localStorage.getItem("pk-token")) || ""
    const api = apiClient(fetch, dash.apiBaseUrl)
    loading = true

    if (body && ((options as ItemEditOptions).item || (options as SystemEditOptions).system)) {
      let opts = options as ItemEditOptions | SystemEditOptions

      try {
        let response = await api<Member | Group | System>(path, {
          token,
          method: "PATCH",
          body,
        })
        success = true

        if (response && (opts as ItemEditOptions).item) {
          opts = opts as ItemEditOptions

          // if we're on the dash we need to replace the member in the list
          // if not, we just need to replace the member
          if (!opts.asPage) {
            Object.assign(opts.item, response)
            opts.list.process(dash.groups.list.raw)
            opts.list.paginate()
          } else {
            Object.assign(opts.item || {}, response)
          }
        } else if (response && (opts as SystemEditOptions).system) {
          // systems don't have a page of their own (for now)
          // so replace the dash's system
          Object.assign(dash.system || {}, response)

          // replace the user also, to update the navbar
          Object.assign(dash.user || {}, response)
        }
      } catch (e) {
        const error = e as ApiError
        console.error(error.data)
        err.push(error.message || "")
      }
    } else if (listBody) {
      try {
        await api(path, {
          token,
          method: "POST",
          body: listBody,
        })

        if ((options as MemberGroupEditOptions).member) {
          const opts = options as MemberGroupEditOptions

          // add the member's uuid to each group added
          if (!opts.asPage) {
            for (const group of dash.groups.list.raw) {
              const g = group as Group
              if (listBody.includes(g.uuid || "")) {
                if (g.members && !g.members.includes(opts.member.uuid || "")) {
                  g.members = [...(g.members || []), opts.member.uuid || ""]
                }
              } else {
                g.members = [...(g.members || [])].filter((m) => m !== opts.member.uuid)
              }
            }
            dash.groups.process(dash.groups.list.raw)
            dash.members.process(dash.groups.list.raw)
            dash.members.paginate()
          } else {
            for (const group of dash.member.groups) {
              const g = group as Group
              if (listBody.includes(g.uuid || "")) {
                if (g.members && !g.members.includes(opts.member.uuid || "")) {
                  g.members = [...(g.members || []), opts.member.uuid || ""]
                }
              } else {
                g.members = [...(g.members || [])].filter((m) => m !== opts.member.uuid)
              }
            }
          }
        } else if ((options as GroupMemberEditOptions).group) {
          const opts = options as GroupMemberEditOptions

          // edit the group like we would normally
          opts.group.members = listBody
          if (!opts.asPage) {
            dash.groups.process(dash.groups.list.raw)
            dash.groups.paginate()
          }
        }

        success = true
      } catch (e) {
        const error = e as ApiError
        console.error(error.data)
        err.push(error.message || "")
      }
    } else {
      err.push(
        "No edit body found. If you see this, this is a bug and not supposed to happen. Please report it to the developers."
      )
    }
    loading = false
    if (success && onSuccess) {
      onSuccess()
    }

    await new Promise((res) => setTimeout(res, 5000))
    success = false
  }
</script>

<button onclick={() => submitEdit()} class="btn btn-sm btn-success join-item">
  <IconDeviceFloppy /> Save
</button>
