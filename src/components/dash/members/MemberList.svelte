<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
</script>

<div
  class={`flex flex-col gap-3 sm:gap-4 ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
  }`}
>
  <Pagination
    class="mx-auto"
    listLength={dash.members.list.processed.length}
    settings={dash.members.settings}
  />
  {#each dash.members.list.paginated as member (member.uuid)}
    <ItemCollapse item={member} type="member" />
  {/each}
  {#if dash.members.list.processed.length === 0}
    <div class="text-center mx-auto">
      No members found. Try adjusting your filter criteria?
    </div>
  {/if}
  <Pagination
    class="mx-auto"
    listLength={dash.members.list.processed.length}
    settings={dash.members.settings}
  />
</div>
