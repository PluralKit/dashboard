<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { type DashList } from "$lib/dash/dash.svelte"
  import {
    FilterMode,
    type Filter,
    type FilterGroup,
    createFilter,
    filterFieldText,
    filterFieldType,
  } from "$lib/dash/filters.svelte"
  import { randomId } from "$lib/dash/ids"
  import { IconPlus } from "@tabler/icons-svelte"

  let {
    list,
    filterGroups = $bindable(),
    type,
  }: {
    list: DashList<Group | Member>
    type: "members" | "groups"
    filterGroups: FilterGroup[]
  } = $props()

  let filterField = $state("")
  let filterMode: null | FilterMode = $state(null)

  function addFilter() {
    let value: string | number | null = ""

    if (filterMode === FilterMode.EMPTY || filterMode === FilterMode.NOTEMPTY) value = null
    else if (
      filterFieldType(filterField) === "number" ||
      filterMode === FilterMode.LOWERTHAN ||
      filterMode === FilterMode.HIGHERTHAN
    )
      value = 0

    const filter: Filter = createFilter(
      filterField,
      filterFieldText(filterField),
      filterMode ?? FilterMode.NOTEMPTY,
      value
    )

    // we want to add the filter to the last non-empty filter group
    // or the first empty filter group if there are no non-empty ones
    // OR a new filter group if there are no groups somehow?
    let group: FilterGroup | null = null
    if (filterGroups.length === 0) {
      group = {
        mode: "and",
        filters: [filter],
        id: randomId(),
      }
      filterGroups.push(group)
    } else {
      for (let i = filterGroups.length - 1; i === 0; i--) {
        if (filterGroups[i].filters.length > 0) group = filterGroups[i]
      }
      if (!group) {
        group = filterGroups[0]
      }
      group.filters = [...group.filters, filter]
    }

    list.process()
    list.paginate()

    filterField = ""
    filterMode = null
  }
</script>

<div class="rounded-lg border-base-content/25 border mb-3 p-4">
  <p class="text-lg mb-2 mr-2">Add new filter</p>
  <div class="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    <div class="flex flex-col">
      <label class="text-sm mb-1" for={`${type}-new-filter-field`}>Filter by...</label>
      <select
        id={`${type}-new-filter-field`}
        class="select select-sm select-bordered"
        bind:value={filterField}
      >
        <option disabled value="">select a field to filter by</option>
        <option value="id">id</option>
        <option value="name">name</option>
        <option value="display_name">display name</option>
        <option value="description">description</option>
        {#if type === "members"}
          <option value="pronouns">pronouns</option>
          <option value="avatar_url">avatar</option>
          <option value="webhook_avatar_url">proxy avatar</option>
        {:else if type === "groups"}
          <option value="icon">icon</option>
        {/if}
        <option value="banner">banner</option>
        <option value="color">color</option>
        {#if type === "members"}
          <option value="birthday">birthday</option>
          <option value="message_count">message count</option>
        {/if}
        <option value="created">created</option>
      </select>
    </div>
    <div class="flex flex-col">
      <label class="text-sm mb-1" for={`${type}-new-filter-mode`}>Filter mode</label>
      <select
        id={`${type}-new-filter-mode`}
        class="select select-sm select-bordered"
        bind:value={filterMode}
      >
        {#if !filterField}
          <option value={null} disabled>Select a field first</option>
        {:else}
          <option value={null} disabled>Select a filter mode</option>
          {#if filterField !== "message_count"}
            <option value={FilterMode.INCLUDES}>include</option>
            <option value={FilterMode.EXCLUDES}>exclude</option>
            <option value={FilterMode.EXACT}>match</option>
            <option value={FilterMode.NOTEXACT}>don't match</option>
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.HIGHERTHAN}>longer than</option>
            <option value={FilterMode.LOWERTHAN}>shorter than</option>
          {:else}
            <option value={FilterMode.HIGHERTHAN}>more than</option>
            <option value={FilterMode.LOWERTHAN}>less than</option>
          {/if}
        {/if}
      </select>
    </div>
  </div>
  {#if filterField && filterMode}
    <div class="flex flex-row">
      <button class="btn btn-success btn-sm mt-4 ml-auto" onclick={() => addFilter()}>
        <IconPlus size={14} /> add filter
      </button>
    </div>
  {/if}
</div>
