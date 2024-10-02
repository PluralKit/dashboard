<script lang="ts">
  import type { Group } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
  import GroupCreate from "./create/GroupCreate.svelte"

  let {
    list,
  }: {
    list: DashList<Group>
  } = $props()

  let fetching = $state(false)

  async function refreshList() {
    fetching = true
    dash.errors.groups = ""
    try {
      const token =
        (dash.privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token")) || undefined
      await list.fetch(token)
      dash.members.process(list.list.raw)
      dash.members.paginate()
    } catch (e) {
      dash.errors.groups = (e as Error).message
    }
    fetching = false
  }
</script>

{#if dash.privacyMode === PrivacyMode.PRIVATE}
  <GroupCreate />
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
{#each list.list.paginated as group (group.uuid)}
  <ItemCollapse item={group} type="group" />
{/each}
{#if list.list.processed.length === 0}
  <div class="alert bg-info/20 flex flex-col text-center">No groups found.</div>
{/if}
<Pagination class="mx-auto" bind:list />
