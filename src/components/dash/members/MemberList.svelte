<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
  import MemberCreate from "./create/MemberCreate.svelte"

  let {
    list,
    groupList,
    privacyMode,
    initialGroups = [],
  }: {
    list: DashList<Member>
    groupList: DashList<Group>
    privacyMode: PrivacyMode
    initalGroups?: Group[]
  } = $props()

  let fetching = $state(false)

  async function refreshList() {
    fetching = true
    dash.errors.members = ""
    try {
      const token =
        (dash.privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token")) || undefined
      await list.fetch(token)
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
<Pagination class="mx-auto" bind:list />
{#each list.list.paginated as member (member.uuid)}
  <ItemCollapse {privacyMode} {groupList} memberList={list} item={member} type="member" />
{/each}
{#if list.list.processed.length === 0}
  <div class="alert bg-info/20 flex flex-col text-center">No members found.</div>
{/if}
<Pagination class="mx-auto" bind:list />
