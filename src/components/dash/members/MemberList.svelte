<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import { ViewType } from "$lib/dash/settings.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
  import MemberCreate from "./create/MemberCreate.svelte"
  import MemberTiny from "./MemberTiny.svelte"

  let {
    list,
    groupList,
    privacyMode,
    initialGroups = [],
    wide = dash.settings.display?.forceControlsAtTop === true,
  }: {
    list: DashList<Member>
    groupList: DashList<Group>
    privacyMode: PrivacyMode
    initialGroups?: Group[]
    wide?: boolean
  } = $props()

  let fetching = $state(false)

  async function refreshList() {
    fetching = true
    dash.errors.members = ""
    try {
      const token =
        (dash.privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token")) || undefined
      await list.fetch(token, groupList.list.raw)
    } catch (e) {
      dash.errors.members = (e as Error).message
    }
    fetching = false
  }
</script>

{#if privacyMode === PrivacyMode.PRIVATE}
  <MemberCreate memberList={list} {groupList} {initialGroups} />
{/if}
<div class="text-center">
  <p>
    {list.list.processed.length} members ({list.list.paginated.length} shown)
    <button disabled={fetching} class="btn btn-xs btn-primary ml-2" onclick={() => refreshList()}
      >{fetching ? "Loading..." : "Refresh list"}</button
    >
  </p>
</div>
<Pagination
  class="mx-auto"
  size="sm"
  rawList={list.list.processed}
  paginate={list.paginate}
  itemsPerPage={list.settings.itemsPerPage}
  bind:currentPage={list.settings.currentPage}
/>

{#if list.settings.view.type === ViewType.COLLAPSE || list.settings.view.type === ViewType.OPEN}
  {#each list.list.paginated as member (member.uuid)}
    <ItemCollapse
      {privacyMode}
      {groupList}
      memberList={list}
      item={member}
      type="member"
      forceOpen={list.settings.view.type === ViewType.OPEN}
    />
  {/each}
{:else if list.settings.view.type === ViewType.TINY}
  <div class="w-full max-w-96 sm:max-w-none mx-auto px-8 sm:px-0">
    <div class="w-full justify-start flex flex-wrap">
      {#each list.list.paginated as member (member.uuid)}
        <MemberTiny {member} asPage={false} {wide} />
      {/each}
    </div>
  </div>
{/if}
{#if list.list.processed.length === 0}
  <div class="alert bg-info/20 flex flex-col text-center">No members found.</div>
{/if}
<Pagination
  class="mx-auto"
  rawList={list.list.processed}
  paginate={list.paginate}
  size="sm"
  itemsPerPage={list.settings.itemsPerPage}
  bind:currentPage={list.settings.currentPage}
/>
