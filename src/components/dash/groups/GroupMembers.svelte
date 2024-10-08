<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconEdit } from "@tabler/icons-svelte"
  import Pagination from "../Pagination.svelte"
  import GroupLink from "./GroupLink.svelte"
  import GroupMemberEdit from "./edit/GroupMemberEdit.svelte"
  import GroupMemberList from "./GroupMemberList.svelte"
  import OpenEditButton from "../edit/OpenEditButton.svelte"

  let {
    asPage = false,
    group,
    tab,
    memberList,
    groupList,
    privacyMode,
  }: {
    asPage?: boolean
    group: Group
    tab: string
    memberList: DashList<Member>
    groupList: DashList<Group>
    privacyMode: PrivacyMode
  } = $props()

  let mode: "view" | "edit" = $state("view")

  let members: Member[] = $derived(
    memberList.list.raw
      .filter((m) =>
        groupList.list.raw.find((g) => g.uuid === group.uuid)?.members?.includes(m.uuid || "")
      )
      .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let itemsPerPage = 10
  let currentPage = $state(1)
</script>

<div style={tab !== "groups" ? "display: none;" : ""}>
  {#if mode === "view"}
    <div class="flex flex-row gap-2 justify-between items-center mb-3">
      <h4 class="text-2xl ml-3 font-medium">Member list</h4>
      <OpenEditButton {privacyMode} bind:mode />
    </div>
    <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
      <div class="rounded-xl bg-base-100 flex-1 p-6 py-4">
        <h5 class="text-lg mb-2">Member info</h5>
        <div class="flex flex-row justify-between gap-2 items-start">
          <p class="mb-3">{members.length} total members</p>
          <Pagination {itemsPerPage} rawList={members} bind:currentPage />
        </div>
        <GroupMemberList {members} bind:currentPage {itemsPerPage} />
      </div>
      <div class="flex flex-row items-center justify-end gap-2 w-full">
        <OpenEditButton {privacyMode} class="mt-2" bind:mode />
        <GroupLink item={group} {asPage} />
      </div>
    </div>
  {:else if mode === "edit"}
    <GroupMemberEdit {memberList} {groupList} membersCurrent={members} {group} {asPage} bind:mode />
  {/if}
</div>
