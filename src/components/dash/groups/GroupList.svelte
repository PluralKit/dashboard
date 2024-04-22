<script lang="ts">
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"

  let fetching = $state(false)

  async function refreshList() {
    fetching = true
    dash.errors.groups = ""
    try {
      const token =
        (dash.privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token")) || undefined
      await dash.groups.fetch(token)
    } catch (e) {
      dash.errors.groups = (e as Error).message
    }
    fetching = false
  }
</script>

<div
  class={`flex flex-col gap-3 sm:gap-4 ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
  }`}
>
  <div class="text-center">
    <p>
      {dash.groups.list.processed.length} groups ({dash.groups.list.paginated.length} shown)
      <button disabled={fetching} class="btn btn-xs btn-primary ml-2" onclick={() => refreshList()}
        >{fetching ? "Loading..." : "Refresh list"}</button
      >
    </p>
  </div>
  <Pagination class="mx-auto" bind:list={dash.groups} />
  {#each dash.groups.list.paginated as group (group.uuid)}
    <ItemCollapse item={group} type="group" />
  {/each}
  {#if dash.groups.list.processed.length === 0}
    <div class="text-center mx-auto">No groups found.</div>
  {/if}
  <Pagination class="mx-auto" bind:list={dash.groups} />
</div>
