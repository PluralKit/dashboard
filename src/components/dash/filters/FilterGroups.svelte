<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode, type Filter, type FilterGroup } from "$lib/dash/filters.svelte"
  import { IconTrash } from "@tabler/icons-svelte"
  import type { DndEvent } from "svelte-dnd-action"
  import { dndzone } from "svelte-dnd-action"

  let {
    filterGroups = $bindable(),
  }: {
    filterGroups: FilterGroup[]
  } = $props()

  function updateFilterValue(
    event: Event,
    groupIndex: number,
    filterIndex: number,
    number: boolean
  ) {
    const target = event.target as HTMLInputElement
    let value: number | string = target.value

    if (number && !isNaN(parseInt(value))) value = parseInt(value)

    filterGroups[groupIndex].filters[filterIndex].value = value
    dash.members.process()
    dash.members.paginate()
  }

  function handleConsider(event: CustomEvent<DndEvent<Filter>>, id: string) {
    const idx = filterGroups.findIndex((g) => g.id === id)
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })
    filterGroups[idx].filters = items
    filterGroups = filterGroups
  }

  function handleFinal(event: CustomEvent<DndEvent<Filter>>, id: string) {
    const idx = filterGroups.findIndex((g) => g.id === id)
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })
    filterGroups[idx].filters = items
    filterGroups = filterGroups

    dash.members.process()
    dash.members.paginate()
  }

  function removeFilter(gid: string, fid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
    filterGroups[group].filters = filterGroups[group].filters.filter((item) => item.id !== fid)
    if (filterGroups[group].filters.length < 1) filterGroups = filterGroups.filter(g => g.id !== gid)
    else filterGroups = filterGroups

    dash.members.process()
    dash.members.paginate()
  }
</script>

<div class="p-3 bg-base-300 rounded-lg">
  {#each filterGroups as group, index (group.id)}
    <div
      use:dndzone={{ items: group.filters, type: "filter-group", dropTargetStyle: {}}}
      class={`p-3 flex flex-col gap-3 bg-base-100 border-base-content/20 rounded-lg outline-secondary hover:border-secondary border-2 outline-2`}
      aria-label={`Filter Group ${index}`}
      onconsider={(e) => handleConsider(e, group.id)}
      onfinalize={(e) => handleFinal(e, group.id)}
    >
      {#each group.filters as filter, i (filter.id)}
        <div
          class="flex bg-base-100 p-3 rounded-lg flex-col hover:border-primary outline-primary border-2 gap-1 relative"
          aria-label={`${filter.fieldName} filter: ${filter.mode}`}
        >
          <button class="absolute top-1 right-2 text-error" onclick={() => removeFilter(group.id, filter.id)}>
            <IconTrash />
          </button>
          {#if filter.mode !== FilterMode.EMPTY && filter.mode !== FilterMode.NOTEMPTY}
            {#if filter.mode === FilterMode.HIGHERTHAN || filter.mode === FilterMode.LOWERTHAN}
              <span class="text-sm">
                <b>{filter.fieldName}s</b> that are {filter.mode}
                {filter.value}
                {#if filter.field !== "message_count"}
                  characters long.
                {/if}
              </span>
              <input
                class="input input-sm input-bordered"
                placeholder={`Filter by ${filter.field}...`}
                type="number"
                min={0}
                onchange={(e) => updateFilterValue(e, index, i, true)}
              />
            {:else}
              <span class="text-sm"
                ><b>{filter.fieldName}s</b> that {filter.mode}
                {filter.value ? `"${filter.value}"` : "..."}</span
              >
              <input
                class="input input-sm input-bordered"
                placeholder={`Filter by ${filter.fieldName}...`}
                type="text"
                onchange={(e) => updateFilterValue(e, index, i, false)}
              />
            {/if}
          {:else}
            <span class="text-sm"><b>{filter.fieldName}s</b> that are {filter.mode}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
