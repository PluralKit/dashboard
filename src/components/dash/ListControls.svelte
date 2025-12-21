<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { ViewType } from "$lib/dash/settings.svelte"

  let {
    wide,
    list = $bindable(),
  }: {
    wide: boolean
    list: DashList<Member|Group>
  } = $props()
</script>

<div
  class={`grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 mb-2 ${
    wide === true ? "xl:grid-cols-3" : "xl:grid-cols-2"
  }`}
>
  <div class="join">
    <label
      class="input input-disabled input-bordered input-sm w-fit join-item"
      for="member-list-page-length">Page length</label
    >
    <select
      class="input input-sm input-bordered join-item flex-1"
      id="member-list-page-length"
      bind:value={list.settings.itemsPerPage}
    >
      {#each list.settings.view.itemsPerPageSelection as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
  <div class="join flex-1">
    <label
      class="input input-disabled input-bordered input-sm w-fit join-item"
      for="member-list-view">View mode</label
    >
    <select
      class="input input-sm input-bordered join-item flex-1"
      id="member-list-view"
      bind:value={list.settings.viewType}
    >
      <option value={dash.settings.display?.keepOpen === true ? ViewType.OPEN : ViewType.COLLAPSE}
        >List</option
      >
      <option value={ViewType.CARD}>Card</option>
      <option value={ViewType.TINY}>Tiny</option>
    </select>
  </div>
</div>