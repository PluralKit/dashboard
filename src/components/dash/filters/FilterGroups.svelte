<script lang="ts">
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import {
    type Filter,
    type FilterGroup,
    filterModeText,
    filterFieldType,
    groupArrayModes,
    FilterMode,
  } from "$lib/dash/filters.svelte"
  import type { DndEvent } from "svelte-dnd-action"
  import { dndzone } from "svelte-dnd-action"
  import FilterHeader from "./FilterHeader.svelte"
  import { IconTrash } from "@tabler/icons-svelte"
  import type { Group, Member } from "$api/types"
  import Svelecte from "svelecte"

  let {
    list,
  }: {
    list: DashList<Member | Group>
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
    list.process(dash.groups.list.raw)
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

    list.process(dash.groups.list.raw)
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

    list.process(dash.groups.list.raw)
    list.paginate()
  }

  function removeFilter(gid: string, fid: string) {
    const group = list.filters.findIndex((g) => g.id === gid)
    list.filters[group].filters = list.filters[group].filters.filter((item) => item.id !== fid)
    list.filters = list.filters

    list.process(dash.groups.list.raw)
    list.paginate()
  }

  function removeGroup(gid: string) {
    list.filters = list.filters.filter((g) => g.id !== gid)

    list.process(dash.groups.list.raw)
    list.paginate()
  }

  function changeMode(mode: "and" | "or", gid: string) {
    const group = list.filters.findIndex((g) => g.id === gid)
    list.filters[group].mode = mode

    list.process(dash.groups.list.raw)
    list.paginate()
  }
</script>

<div
  class={`bg-base-300 rounded-lg flex flex-col gap-4 p-3 ${
    list.filters.length === 0 ? "hidden" : ""
  }`}
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
            class={`join-item uppercase btn btn-xs ${
              group.mode === "and" ? "btn-primary" : "btn-neutral"
            }`}
            onclick={() => changeMode("and", group.id)}
            ontouchend={() => changeMode("and", group.id)}>And</button
          >
          <button
            class={`join-item uppercase btn btn-xs ${
              group.mode === "or" ? "btn-primary" : "btn-neutral"
            }`}
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
            {#if filter.field === "group"}
              <FilterHeader action={removeFilter(group.id, filter.id)}>
                <span class="text-sm">
                  {#if groupArrayModes.includes(filter.mode)}
                    members with <b>groups</b> that {filterModeText(filter.mode, filter.valueType)
                      .verb}...
                  {:else if filter.mode === FilterMode.HIGHERTHAN}
                    members with more than {filter.value} <b>groups</b>
                  {:else if filter.mode === FilterMode.LOWERTHAN}
                    members with less than {filter.value} <b>groups</b>
                  {:else if filter.mode === FilterMode.EMPTY}
                    members without a <b>group</b>
                  {:else if filter.mode === FilterMode.NOTEMPTY}
                    members with a <b>group</b>
                  {/if}
                </span>
              </FilterHeader>
              {#if groupArrayModes.includes(filter.mode)}
                <Svelecte
                  class="svelecte-control-pk w-full"
                  options={dash.groups.list.options}
                  multiple
                  valueField="value"
                  labelField="text"
                  value={filter.value}
                  on:change={(e) => {
                    list.filters[index].filters[i].value = e.detail.map((i: any) => i.value)
                    list.process(dash.groups.list.raw)
                    list.paginate()
                  }}
                />
              {:else if filter.valueType === "number"}
                <input
                  class="input input-sm input-bordered"
                  placeholder={`Filter by groups...`}
                  type="number"
                  value={filter.value}
                  min={0}
                  onchange={(e) => updateFilterValue(e, index, i, true)}
                />
              {/if}
            {:else if filter.field === "member"}
              <FilterHeader action={removeFilter(group.id, filter.id)}>
                <span class="text-sm">
                  {#if groupArrayModes.includes(filter.mode)}
                    groups with <b>members</b> that {filterModeText(filter.mode, filter.valueType)
                      .verb}...
                  {:else if filter.mode === FilterMode.HIGHERTHAN}
                    groups with more than {filter.value} <b>members</b>
                  {:else if filter.mode === FilterMode.LOWERTHAN}
                    groups with less than {filter.value} <b>members</b>
                  {:else if filter.mode === FilterMode.EMPTY}
                    groups without a <b>members</b>
                  {:else if filter.mode === FilterMode.NOTEMPTY}
                    groups with a <b>members</b>
                  {/if}
                </span>
              </FilterHeader>
              {#if groupArrayModes.includes(filter.mode)}
                <Svelecte
                  class="svelecte-control-pk w-full"
                  options={dash.members.list.options}
                  multiple
                  valueField="value"
                  labelField="text"
                  value={filter.value}
                  on:change={(e) => {
                    list.filters[index].filters[i].value = e.detail.map((i: any) => i.value)
                    list.process(dash.groups.list.raw)
                    list.paginate()
                  }}
                />
              {:else if filter.valueType === "number"}
                <input
                  class="input input-sm input-bordered"
                  placeholder={`Filter by members...`}
                  type="number"
                  value={filter.value}
                  min={0}
                  onchange={(e) => updateFilterValue(e, index, i, true)}
                />
              {/if}
            {:else}
              <FilterHeader action={removeFilter(group.id, filter.id)}>
                <span class="text-sm"
                  ><b>{filter.fieldName}s</b> that {filterModeText(filter.mode, filter.valueType)
                    .verb}
                  {filter.value !== null && filter.value !== ""
                    ? `${filter.valueType === "string" ? `"${filter.value}"` : filter.value}`
                    : "..."}
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
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
{#if list.filters.length === 0}
  <div class="bg-base-300 rounded-lg gap-4 p-3 text-center">No filters added.</div>
{/if}
