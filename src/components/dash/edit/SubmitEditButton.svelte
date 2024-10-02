<script lang="ts">
  import type { ApiError } from "$api"
  import type { Group, Member, System } from "$api/types"
  import { browser } from "$app/environment"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconDeviceFloppy } from "@tabler/icons-svelte"
  import moment from "moment"

  type ItemEditOptions = {
    // base member/group edit
    body: Member | Group
    list: DashList<Member | Group>
    item: Member | Group
  }

  type MemberGroupEditOptions = {
    // member groups edit
    member: Member
    body: string[]
  }
  type GroupMemberEditOptions = {
    // group member list edit
    group: Group
    body: string[]
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
    memberList,
    groupList,
  }: {
    loading: boolean
    success: boolean
    err: string[]
    path: string
    options: ItemEditOptions | MemberGroupEditOptions | GroupMemberEditOptions | SystemEditOptions
    onSuccess?: () => void
    memberList: DashList<Member>
    groupList: DashList<Group>
  } = $props()

  export async function submitEdit() {
    if (!browser) return

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
        body.birthday = body.birthday.split("/").join("-")

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

    const token = localStorage.getItem("pk-token") || ""
    loading = true

    if (body && ((options as ItemEditOptions).item || (options as SystemEditOptions).system)) {
      let opts = options as ItemEditOptions | SystemEditOptions

      try {
        let response = await window.api<Member | Group | System>(path, {
          token,
          method: "PATCH",
          body,
        })
        success = true

        if (response && (opts as ItemEditOptions).item) {
          opts = opts as ItemEditOptions

          Object.assign(opts.item || {}, response)
          opts.list.process(groupList.list.raw)
          opts.list.paginate()
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
        await window.api(path, {
          token,
          method: "POST",
          body: listBody,
        })

        if ((options as MemberGroupEditOptions).member) {
          const opts = options as MemberGroupEditOptions

          // add the member's uuid to each group added
          for (const group of groupList.list.raw) {
            const g = group as Group
            if (listBody.includes(g.uuid || "")) {
              if (g.members && !g.members.includes(opts.member.uuid || "")) {
                g.members = [...(g.members || []), opts.member.uuid || ""]
              }
            } else {
              g.members = [...(g.members || [])].filter((m) => m !== opts.member.uuid)
            }
          }

          // if on the group page: remove self from list if no longer in group
          if (memberList.filter && memberList.page) {
            if (
              listBody.includes(opts.member.uuid || "") &&
              !memberList.filter.includes(opts.member.uuid || "")
            ) {
              memberList.filter.push(opts.member.uuid || "")
            } else memberList.filter = memberList.filter.filter((m) => m !== opts.member.uuid)
          }

          // if on the member page: filter out groups that no longer belong to this member
          if (groupList.filter && groupList.page) {
            groupList.filter = listBody

            groupList.process(groupList.list.raw)
            groupList.paginate()
          } else {
            groupList.process(groupList.list.raw)
          }
          memberList.process(groupList.list.raw)
          memberList.paginate()
        } else if ((options as GroupMemberEditOptions).group) {
          const opts = options as GroupMemberEditOptions

          // edit the group like we would normally
          const group = groupList.list.raw.find((g) => g.uuid === opts.group.uuid)
          if (group) group.members = listBody

          // if on the member page: remove self from list if no longer containing member
          if (groupList.filter && groupList.page) {
            if (
              listBody.includes(opts.group.uuid || "") &&
              !groupList.filter.includes(opts.group.uuid || "")
            ) {
              groupList.filter.push(opts.group.uuid || "")
            } else groupList.filter = groupList.filter.filter((m) => m !== opts.group.uuid)
          }

          // if on the group page: filter out members that no longer belong in this group
          if (memberList.filter && memberList.page) {
            memberList.filter = listBody

            memberList.process(groupList.list.raw)
            memberList.paginate()
          }

          groupList.process(groupList.list.raw)
          groupList.paginate()
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
