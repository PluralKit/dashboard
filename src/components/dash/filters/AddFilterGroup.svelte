<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { type DashList } from "$lib/dash/dash.svelte"
  import Svelecte from "svelecte"
  import {
    FilterMode,
    type Filter,
    type FilterGroup,
    createFilter,
    filterFieldText,
    filterFieldType,
    createFilterGroup,
  } from "$lib/dash/filters.svelte"
  import { dash } from "$lib/dash/dash.svelte"
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

  let groupOptions = $derived(
    dash.groups.list.raw.map((g) => {
      return { value: g.uuid, text: `${g.name} (${g.id})`, extra: g.display_name }
    }).sort((a,b) => a.text.localeCompare(b.text))
  )

  let filterField = $state("")
  let filterMode: null | FilterMode = $state(null)
  let filterValue: null | string | number = $state(null)

  let inputType: string = $derived.by(() => {
    let value: string = "text"

    if (filterMode === FilterMode.EMPTY || filterMode === FilterMode.NOTEMPTY) value = "null"
    else if (
      filterFieldType(filterField) === "number" ||
      filterMode === FilterMode.LOWERTHAN ||
      filterMode === FilterMode.HIGHERTHAN
    )
      value = "number"

    return value
  })

  function changeFilterValue() {
    if (
      filterFieldType(filterField) === "number" ||
      filterMode === FilterMode.LOWERTHAN ||
      filterMode === FilterMode.HIGHERTHAN
    )
      filterValue = 0
    else if (!(filterMode === FilterMode.EMPTY || filterMode === FilterMode.NOTEMPTY)) {
      filterValue = ""
    }
  }

  function addFilter() {
    const filter: Filter = createFilter(
      filterField,
      filterFieldText(filterField),
      filterMode ?? FilterMode.NOTEMPTY,
      filterValue
    )

    // we want to add the filter to the last empty filter group
    let group = createFilterGroup([filter])
    if (filterGroups.length === 0) filterGroups = [...filterGroups, group]
    else {
      let existingGroup: FilterGroup | null = null
      for (let i = filterGroups.length - 1; i >= 0; i--) {
        if (filterGroups[i].filters.length === 0) {
          existingGroup = filterGroups[i]
          break
        }
      }
      if (!existingGroup) filterGroups = [...filterGroups, group]
      else existingGroup.filters = [...existingGroup.filters, filter]
    }

    list.process(dash.groups.list.raw)
    list.paginate()

    filterField = ""
    filterMode = null
    filterValue = null
  }
</script>

<div class="rounded-lg border-muted/50 border mb-3 p-4">
  <p class="text-lg mb-2 mr-2">Add new filter</p>
  <div class="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    <div class="flex flex-col">
      <label class="text-sm mb-1" for={`${type}-new-filter-field`}>Filter by</label>
      <select
        id={`${type}-new-filter-field`}
        class="select select-sm select-bordered"
        bind:value={filterField}
      >
        <option disabled value="">Filter by...</option>
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
        {#if type === "members"}
          <option value="group">groups</option>
        {:else if type === "groups"}
          <option value="member">members</option>
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
        disabled={!filterField}
        onchange={() => changeFilterValue()}
      >
        {#if !filterField}
          <option value={null} disabled>Select a field first</option>
        {:else}
          <option value={null} disabled>Filter mode...</option>
          {#if inputType !== "number" || filterField === "groups" || filterField === "members"}
            <option value={FilterMode.INCLUDES}>include</option>
            <option value={FilterMode.EXCLUDES}>exclude</option>
            <option value={FilterMode.EXACT}>match</option>
            <option value={FilterMode.NOTEXACT}>don't match</option>
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.HIGHERTHAN}>longer than</option>
            <option value={FilterMode.LOWERTHAN}>shorter than</option>
          {:else}
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.HIGHERTHAN}>more than</option>
            <option value={FilterMode.LOWERTHAN}>less than</option>
          {/if}
        {/if}
      </select>
    </div>
  </div>
  {#if filterField && filterMode}
    {#if inputType !== "null"}
      <label class="text-sm mb-1 block mt-3" for={`${type}-new-filter-field`}>Value</label>
    {/if}
    <div class="flex flex-row gap-3 flex-wrap">
      {#if filterField === "group" && [FilterMode.INCLUDES, FilterMode.EXCLUDES, FilterMode.EXACT, FilterMode.NOTEXACT].includes(filterMode)}
        <Svelecte
          class="svelecte-control w-full"
          options={groupOptions}
          multiple
          bind:value={filterValue}
          valueField="value"
          labelField="text"
        />
      {:else if inputType !== "null"}
        <input
          id={`${type}-new-filter-field`}
          bind:value={filterValue}
          class="input flex-1 input-bordered input-sm"
          type={inputType}
          placeholder={`Filter by ${filterFieldText(filterField)}...`}
        />
      {/if}
      <button
        class={`btn btn-success btn-sm ml-auto ${inputType === "null" ? "mt-3" : ""}`}
        onclick={() => addFilter()}
      >
        <IconPlus size={14} /> add filter
      </button>
    </div>
  {/if}
</div>
