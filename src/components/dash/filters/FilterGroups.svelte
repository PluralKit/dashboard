<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import {
    type Filter,
    type FilterGroup,
    filterModeText,
    filterFieldType,
  } from "$lib/dash/filters.svelte"
  import type { DndEvent } from "svelte-dnd-action"
  import { dndzone } from "svelte-dnd-action"
  import FilterHeader from "./FilterHeader.svelte"
  import { IconTrash } from "@tabler/icons-svelte"

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

  function handleConsiderFilter(event: CustomEvent<DndEvent<Filter>>, gid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
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
    handleConsiderFilter(event, gid)

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
    handleConsiderGroup(event)

    dash.members.process()
    dash.members.paginate()
  }

  function removeFilter(gid: string, fid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
    filterGroups[group].filters = filterGroups[group].filters.filter((item) => item.id !== fid)
    let newGroups = filterGroups
    if (filterGroups[group].filters.length < 1) newGroups = filterGroups.filter((g) => g.id !== gid)

    filterGroups = newGroups

    dash.members.process()
    dash.members.paginate()
  }

  function removeGroup(gid: string) {
    filterGroups = filterGroups.filter((g) => g.id !== gid)

    dash.members.process()
    dash.members.paginate()
  }

  function changeMode(mode: "and" | "or", gid: string) {
    const group = filterGroups.findIndex((g) => g.id === gid)
    filterGroups[group].mode = mode

    dash.members.process()
    dash.members.paginate()
  }
</script>

<div
  class={`bg-base-300 rounded-lg flex flex-col gap-4 p-3 ${filterGroups.length === 0 ? "hidden" : ""}`}
  use:dndzone={{ items: filterGroups, type: "filter-groups", dropTargetStyle: {} }}
  aria-label="Filter Groups"
  onconsider={(e) => handleConsiderGroup(e)}
  onfinalize={(e) => handleFinalGroup(e)}
>
  {#each filterGroups as group, index (group.id)}
    <div
      class="flex flex-col p-3 gap-2 bg-base-100 border-base-content/20 rounded-lg hover:border-secondary border-2"
    >
      <div class="flex flex-row gap-3 items-center justify-between">
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
        <button
          class="text-error"
          onclick={() => removeGroup(group.id)}
          ontouchend={() => removeGroup(group.id)}
          aria-label="Delete filter group"><IconTrash class="text-error" /></button
        >
      </div>
      <div
        use:dndzone={{ items: group.filters, type: "filters", dropTargetStyle: {} }}
        class={`flex flex-col gap-3 rounded-lg outline-secondary outline-2 ${
          group.filters.length === 0 ? "p-5 border-2 border-base-content/25" : "p-0"
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
                ><b>{filter.fieldName}s</b> that {filterModeText(filter.mode, filter.valueType)
                  .verb}
                {filter.value ? `"${filter.value}"` : "..."}
                {filterModeText(filter.mode, filterFieldType(filter.field)).afterVerb}</span
              >
            </FilterHeader>
            {#if filter.valueType === "number"}
              <input
                class="input input-sm input-bordered"
                placeholder={`Filter by ${filter.fieldName}...`}
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
{#if filterGroups.length === 0}
  <div class="bg-base-300 rounded-lg gap-4 p-3 text-center">
    No filters added.
  </div>
{/if}
