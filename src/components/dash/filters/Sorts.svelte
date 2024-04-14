<script lang="ts">
  import { type DashList } from "$lib/dash/dash.svelte"
  import type { DndEvent } from "svelte-dnd-action"
  import { dndzone } from "svelte-dnd-action"
  import { IconTrash } from "@tabler/icons-svelte"
  import { sortModeText, type Sort } from "$lib/dash/sorts.svelte"
  import type { Group, Member } from "$api/types"
  import { filterFieldText, filterFieldType } from "$lib/dash/filters.svelte"

  let {
    list,
  }: {
    list: DashList<Member | Group>
    sorts: Sort[]
  } = $props()

  function handleConsider(event: CustomEvent<DndEvent<Sort>>) {
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })
    
    list.sorts = items
  }

  function handleFinal(event: CustomEvent<DndEvent<Sort>>) {
    handleConsider(event)

    list.process()
    list.paginate()
  }

  function removeSort(id: string) {
    list.sorts = list.sorts.filter((s) => s.id !== id)

    list.process()
    list.paginate()
  }

  function changeOrder(order: 1 | -1, id: string) {
    const sort = list.sorts.findIndex((s) => s.id === id)
    list.sorts[sort].order = order

    list.process()
    list.paginate()
  }
</script>

<div
  class={`bg-base-300 rounded-lg flex flex-col gap-2 p-3 ${list.sorts.length === 0 ? "hidden" : ""}`}
  use:dndzone={{ items: list.sorts, type: "sorts", dropTargetStyle: {} }}
  aria-label="Sorting items"
  onconsider={(e) => handleConsider(e)}
  onfinalize={(e) => handleFinal(e)}
>
  {#each list.sorts as sort (sort.id)}
    <div
      class="bg-base-100 p-3 flex flex-col rounded-lg hover:border-primary border-base-content/20 outline-primary border-2 gap-2 relative"
      aria-label={`Sort ${sort.field}: ${sort.mode}`}
    >
      <div class="flex flex-row gap-3 items-center justify-between">
        <div class="join w-fit mr-auto">
          <button
            class={`join-item uppercase btn btn-xs ${
              sort.order === 1 ? "btn-primary" : "btn-neutral"
            }`}
            onclick={() => changeOrder(1, sort.id)}
            aria-label="Ascending">Asc</button
          >
          <button
            class={`join-item uppercase btn btn-xs ${
              sort.order === -1 ? "btn-primary" : "btn-neutral"
            }`}
            onclick={() => changeOrder(-1, sort.id)}
            aria-label="Descending">Desc</button
          >
        </div>
        <button
          class="text-error"
          onclick={() => removeSort(sort.id)}
          ontouchend={() => removeSort(sort.id)}
          aria-label="Delete sort"><IconTrash class="text-error" /></button
        >
      </div>
      <span class="text-sm"
        >Sort by <b>{filterFieldText(sort.field)}</b>
        {sortModeText(sort.mode, filterFieldType(sort.field)).text},
        {#if sort.order !== -1}
          in <b>ascending</b> order
        {:else}
          in <b>descending</b> order
        {/if}
        </span
      >
    </div>
  {/each}
</div>
{#if list.sorts.length === 0}
  <div class="bg-base-300 rounded-lg gap-4 p-3 text-center">No sorting added.</div>
{/if}
