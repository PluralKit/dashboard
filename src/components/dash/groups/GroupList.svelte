<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import { ViewType } from "$lib/dash/settings.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
  import GroupCreate from "./create/GroupCreate.svelte"

  let {
    list,
    memberList,
    privacyMode,
    initialMembers,
  }: {
    list: DashList<Group>
    memberList: DashList<Member>
    privacyMode: PrivacyMode
    initialMembers?: Member[]
  } = $props()

  let fetching = $state(false)

  async function refreshList() {
    fetching = true
    dash.errors.groups = ""
    try {
      const token =
        (privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token")) || undefined
      await list.fetch(token)
      list.process(list.list.raw)
      list.paginate()
    } catch (e) {
      dash.errors.groups = (e as Error).message
    }
    fetching = false
  }
</script>

{#if privacyMode === PrivacyMode.PRIVATE}
  <GroupCreate groupList={list} {memberList} {initialMembers} />
{/if}
<div class="text-center">
  <p>
    {list.list.processed.length} groups ({list.list.paginated.length} shown)
    <button disabled={fetching} class="btn btn-xs btn-primary ml-2" onclick={() => refreshList()}
      >{fetching ? "Loading..." : "Refresh list"}</button
    >
  </p>
</div>
<Pagination class="mx-auto" bind:list />
{#if list.settings.view.type === ViewType.COLLAPSE || list.settings.view.type === ViewType.OPEN}
  {#each list.list.paginated as group (group.uuid)}
    <ItemCollapse
      {privacyMode}
      groupList={list}
      {memberList}
      item={group}
      type="group"
      forceOpen={list.settings.view.type === ViewType.OPEN}
    />
  {/each}
{/if}
{#if list.list.processed.length === 0}
  <div class="alert bg-info/20 flex flex-col text-center">No groups found.</div>
{/if}
<Pagination class="mx-auto" bind:list />
