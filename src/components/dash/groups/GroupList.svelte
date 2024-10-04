<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import { ViewType } from "$lib/dash/settings.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
  import GroupCreate from "./create/GroupCreate.svelte"
  import GroupTiny from "./GroupTiny.svelte"

  let {
    list,
    memberList,
    privacyMode,
    initialMembers,
    wide = dash.settings.display?.forceControlsAtTop === true,
  }: {
    list: DashList<Group>
    memberList: DashList<Member>
    privacyMode: PrivacyMode
    initialMembers?: Member[]
    wide?: boolean
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
{:else if list.settings.view.type === ViewType.TINY}
  <div class="max-w-96 sm:max-w-none mx-auto px-8 sm:px-0">
    <div class="w-full justify-start flex flex-wrap">
      {#each list.list.paginated as group (group.uuid)}
        <GroupTiny {group} asPage={false} {wide} />
      {/each}
    </div>
  </div>
{/if}
{#if list.list.processed.length === 0}
  <div class="alert bg-info/20 flex flex-col text-center">No groups found.</div>
{/if}
<Pagination class="mx-auto" bind:list />
