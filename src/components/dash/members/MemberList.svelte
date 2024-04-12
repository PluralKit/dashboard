<script lang="ts">
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"

  async function refreshList() {
    dash.errors.members = ""
    try {
      const token = dash.privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token") || undefined
      await dash.members.fetch(token)
    } catch (e) {
      dash.errors.members = (e as Error).message
    }
  }
</script>

<div
  class={`flex flex-col gap-3 sm:gap-4 ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
  }`}
>
  <div class="text-center">
    <p>
      {dash.members.list.processed.length} members ({dash.members.list.paginated.length} shown)
      <button class="link-primary" onclick={() => refreshList()}>Refresh list</button>
    </p>
  </div>
  <Pagination class="mx-auto" bind:list={dash.members} />
  {#each dash.members.list.paginated as member (member.uuid)}
    <ItemCollapse item={member} type="member" />
  {/each}
  {#if dash.members.list.processed.length === 0}
    <div class="text-center mx-auto">No members found.</div>
  {/if}
  <Pagination class="mx-auto" bind:list={dash.members} />
</div>
