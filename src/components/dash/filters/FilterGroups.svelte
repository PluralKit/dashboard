<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode, type Filter, type FilterGroup, filterModeText } from "$lib/dash/filters.svelte"
  import { randomId } from "$lib/dash/ids"
  import type { DndEvent } from "svelte-dnd-action"
  import { dndzone } from "svelte-dnd-action"
  import FilterHeader from "./FilterHeader.svelte"

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

  function handleConsiderFilter(event: CustomEvent<DndEvent<Filter>>, id: string) {
    const group = filterGroups.findIndex((g) => g.id === id)
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })
    filterGroups[group].filters = items
    filterGroups = filterGroups
  }

  function handleFinalFilter(event: CustomEvent<DndEvent<Filter>>, gid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })
    filterGroups[group].filters = items
    let newGroups = filterGroups
    if (filterGroups[group].filters.length < 1) newGroups = filterGroups.filter((g) => g.id !== gid)
    filterGroups = appendEmptyGroupIfNeeded(newGroups)

    dash.members.process()
    dash.members.paginate()
  }

  function handleConsiderGroup(event: CustomEvent<DndEvent<FilterGroup>>) {
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })

    filterGroups = items
  }

  function handleFinalGroup(event: CustomEvent<DndEvent<FilterGroup>>) {
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })

    let newGroups = items.filter((g) => g.filters.length > 0)
    filterGroups = appendEmptyGroupIfNeeded(newGroups)

    dash.members.process()
    dash.members.paginate()
  }

  function removeFilter(gid: string, fid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
    filterGroups[group].filters = filterGroups[group].filters.filter((item) => item.id !== fid)
    let newGroups = filterGroups
    if (filterGroups[group].filters.length < 1) newGroups = filterGroups.filter((g) => g.id !== gid)
    newGroups = appendEmptyGroupIfNeeded(newGroups)

    filterGroups = newGroups

    dash.members.process()
    dash.members.paginate()
  }

  function appendEmptyGroupIfNeeded(groups: FilterGroup[]) {
    if (groups.length === 0 || groups[groups.length - 1].filters.length > 0)
      groups = [
        ...groups,
        {
          id: randomId(),
          filters: [],
          mode: "and",
        },
      ]
    return groups
  }

  function changeMode(mode: "and" | "or", gid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
    filterGroups[group].mode = mode

    dash.members.process()
    dash.members.paginate()
  }
</script>

<div
  class="p-3 bg-base-300 rounded-lg flex flex-col gap-4"
  use:dndzone={{ items: filterGroups, type: "filter-groups", dropTargetStyle: {} }}
  aria-label="Filter Groups"
  onconsider={(e) => handleConsiderGroup(e)}
  onfinalize={(e) => handleFinalGroup(e)}
>
  {#each filterGroups as group, index (group.id)}
    <div
      class="flex flex-col p-3 gap-2 bg-base-100 border-base-content/20 rounded-lg hover:border-secondary border-2"
    >
      {#if group.filters.length > 0}
        <div class="join w-fit mr-auto">
          <button
            class={`join-item btn btn-xs ${group.mode === "and" ? "btn-primary" : "btn-neutral"}`}
            onclick={() => changeMode("and", group.id)}>AND</button
          >
          <button
            class={`join-item btn btn-xs ${group.mode === "or" ? "btn-primary" : "btn-neutral"}`}
            onclick={() => changeMode("or", group.id)}>OR</button
          >
        </div>
      {/if}
      <div
        use:dndzone={{ items: group.filters, type: "filters", dropTargetStyle: {} }}
        class={`flex flex-col gap-3 rounded-lg outline-secondary outline-2 ${
          group.filters.length < 1 ? "p-3" : "p-0"
        }`}
        aria-label={`Filter Group ${index}`}
        onconsider={(e) => handleConsiderFilter(e, group.id)}
        onfinalize={(e) => handleFinalFilter(e, group.id)}
      >
        {#each group.filters as filter, i (filter.id)}
          <div
            class="bg-base-100 p-3 flex flex-col rounded-lg hover:border-primary border-base-content/20 outline-primary border-2 gap-1 relative"
            aria-label={`${filter.fieldName} filter: ${filter.mode}`}
          >
              <FilterHeader action={removeFilter(group.id, filter.id)}>
                <span class="text-sm"
                  ><b>{filter.fieldName}s</b> that {filterModeText(filter.mode, filter.valueType).verb}
                  {filter.value ? `"${filter.value}"` : "..."} {filterModeText(filter.mode, filter.valueType).afterVerb}</span
                >
              </FilterHeader>
              {#if filter.valueType === "number"}
                <input
                  class="input input-sm input-bordered"
                  placeholder={`Filter by ${filter.field}...`}
                  type="number"
                  value={filter.value}
                  min={0}
                  onchange={(e) => updateFilterValue(e, index, i, true)}
                />
              {:else if filter.valueType === "string"}
                <input
                  class="input input-sm input-bordered"
                  placeholder={`Filter by ${filter.fieldName}...`}
                  type="text"
                  value={filter.value}
                  onchange={(e) => updateFilterValue(e, index, i, false)}
                />
              {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>