<script lang="ts">
  import { type DashList } from "$lib/dash/dash.svelte"
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
  import type { Group, Member } from "$api/types"

  let {
    list
  }: {
    list: DashList<Member|Group>
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

    list.filters[groupIndex].filters[filterIndex].value = value
    list.process()
    list.paginate()
  }

  function handleConsiderFilter(event: CustomEvent<DndEvent<Filter>>, gid: string) {
    const group = list.filters.findIndex((g) => g.id === gid)
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })
    list.filters[group].filters = items
    list.filters = list.filters
  }

  function handleFinalFilter(event: CustomEvent<DndEvent<Filter>>, gid: string) {
    handleConsiderFilter(event, gid)

    list.process()
    list.paginate()
  }

  function handleConsiderGroup(event: CustomEvent<DndEvent<FilterGroup>>) {
    const dupes = new Set()
    const items = event.detail.items.filter((item) => {
      const dupe = dupes.has(item.id)
      dupes.add(item.id)
      return !dupe
    })

    list.filters = items
  }

  function handleFinalGroup(event: CustomEvent<DndEvent<FilterGroup>>) {
    handleConsiderGroup(event)

    list.process()
    list.paginate()
  }

  function removeFilter(gid: string, fid: string) {
    const group = list.filters.findIndex((g) => g.id === gid)
    list.filters[group].filters = list.filters[group].filters.filter((item) => item.id !== fid)
    let newGroups = list.filters
    if (list.filters[group].filters.length < 1) newGroups = list.filters.filter((g) => g.id !== gid)

    list.filters = newGroups

    list.process()
    list.paginate()
  }

  function removeGroup(gid: string) {
    list.filters = list.filters.filter((g) => g.id !== gid)

    list.process()
    list.paginate()
  }

  function changeMode(mode: "and" | "or", gid: string) {
    const group = list.filters.findIndex((g) => g.id === gid)
    list.filters[group].mode = mode

    list.process()
    list.paginate()
  }
</script>

<div
  class={`bg-base-300 rounded-lg flex flex-col gap-4 p-3 ${list.filters.length === 0 ? "hidden" : ""}`}
  use:dndzone={{ items: list.filters, type: "filter-groups", dropTargetStyle: {} }}
  aria-label="Filter Groups"
  onconsider={(e) => handleConsiderGroup(e)}
  onfinalize={(e) => handleFinalGroup(e)}
>
  {#each list.filters as group, index (group.id)}
    <div
      class="flex flex-col p-3 gap-2 bg-base-100 border-muted/50 rounded-lg hover:border-secondary border-2"
    >
      <div class="flex flex-row gap-3 items-center justify-between">
        <div class="join w-fit mr-auto">
          <button
            class={`join-item uppercase btn btn-xs ${group.mode === "and" ? "btn-primary" : "btn-neutral"}`}
            onclick={() => changeMode("and", group.id)}
            ontouchend={() => changeMode("and", group.id)}>And</button
          >
          <button
            class={`join-item uppercase btn btn-xs ${group.mode === "or" ? "btn-primary" : "btn-neutral"}`}
            onclick={() => changeMode("or", group.id)}
            ontouchend={() => changeMode("or", group.id)}>Or</button
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
          group.filters.length === 0 ? "p-5 border-2 border-muted/50" : "p-0"
        }`}
        aria-label={`Filter Group ${index}`}
        onconsider={(e) => handleConsiderFilter(e, group.id)}
        onfinalize={(e) => handleFinalFilter(e, group.id)}
      >
        {#each group.filters as filter, i (filter.id)}
          <div
            class="bg-base-100 p-3 flex flex-col rounded-lg hover:border-primary border-muted/50 outline-primary border-2 gap-1 relative"
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
{#if list.filters.length === 0}
  <div class="bg-base-300 rounded-lg gap-4 p-3 text-center">
    No filters added.
  </div>
{/if}
