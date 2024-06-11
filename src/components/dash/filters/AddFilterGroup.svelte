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
    groupArrayModes,
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

  let filterField = $state("")
  let filterMode: null | FilterMode = $state(null)
  let filterValue: null | string | number = $state(null)

  let inputType: string = $derived.by(() => {
    if (filterMode === FilterMode.EMPTY || filterMode === FilterMode.NOTEMPTY) return "null"
    if (filterFieldType(filterField) === "date") return "text"
    if (
      filterFieldType(filterField) === "number" ||
      filterMode === FilterMode.LOWERTHAN ||
      filterMode === FilterMode.HIGHERTHAN
    )
      return "number"

    return "text"
  })

  function changeFilterValue() {
    filterValue = ""
    if (filterFieldType(filterField) === "date") {
      filterValue = ""
    } else if (
      filterFieldType(filterField) === "number" ||
      filterMode === FilterMode.LOWERTHAN ||
      filterMode === FilterMode.HIGHERTHAN
    ) {
      filterValue = 0
    }
    
    if (filterMode === FilterMode.EMPTY || filterMode === FilterMode.NOTEMPTY) {
      filterValue = ""
    }
  }

  function addFilter() {
    const value =
      filterFieldType(filterField) === "date" &&
      (filterMode === FilterMode.INCLUDES || filterMode === FilterMode.EXCLUDES)
        ? dateString
        : filterValue

    const filter: Filter = createFilter(
      filterField,
      filterFieldText(filterField),
      filterMode ?? FilterMode.NOTEMPTY,
      value
    )

    // we want to add the filter to the last empty filter group
    // unless it's a non-draggable group
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
    dateDay = null
    dateWeekday = null
    dateMonth = null
    dateYear = null
  }

  let dateDay: number|null = $state(null)
  let dateWeekday: number|null = $state(null)
  let dateMonth: number|null = $state(null)
  let dateYear: number|null = $state(null)

  let dateString: string = $derived.by(() => {
    let params = new URLSearchParams()
    if (dateDay !== null) params.set("day", dateDay.toString())
    if (dateWeekday !== null) params.set("weekday", dateWeekday.toString())
    if (dateMonth !== null) params.set("month", dateMonth.toString())
    if (dateYear !== null) params.set("year", dateYear.toString())

    return params.toString()
  })
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
          {#if filterField === "group" || filterField === "member"}
            <option value={FilterMode.INCLUDES}>include any</option>
            <option value={FilterMode.EXCLUDES}>exclude any</option>
            <option value={FilterMode.EXACT}>match all</option>
            <option value={FilterMode.NOTEXACT}>don't match all</option>
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.HIGHERTHAN}>more than</option>
            <option value={FilterMode.LOWERTHAN}>less than</option>
          {:else if filterFieldType(filterField) === "date"}
            <option value={FilterMode.HIGHERTHAN}>after date</option>
            <option value={FilterMode.LOWERTHAN}>before date</option>
            <option value={FilterMode.EXACT}>match</option>
            <option value={FilterMode.NOTEXACT}>don't match</option>
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.INCLUDES}>in time period</option>
            <option value={FilterMode.EXCLUDES}>not in time period</option>
          {:else if inputType === "number"}
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.HIGHERTHAN}>more than</option>
            <option value={FilterMode.LOWERTHAN}>less than</option>
          {:else}
            <option value={FilterMode.INCLUDES}>include</option>
            <option value={FilterMode.EXCLUDES}>exclude</option>
            <option value={FilterMode.EXACT}>match</option>
            <option value={FilterMode.NOTEXACT}>don't match</option>
            <option value={FilterMode.EMPTY}>empty</option>
            <option value={FilterMode.NOTEMPTY}>not empty</option>
            <option value={FilterMode.HIGHERTHAN}>longer than</option>
            <option value={FilterMode.LOWERTHAN}>shorter than</option>
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
      {#if filterField === "group" && groupArrayModes.includes(filterMode)}
        <Svelecte
          class="svelecte-control-pk w-full"
          options={dash.groups.list.options}
          multiple
          bind:value={filterValue}
          valueField="value"
          labelField="text"
        />
      {:else if filterField === "member" && groupArrayModes.includes(filterMode)}
        <Svelecte
          class="svelecte-control-pk w-full"
          options={dash.members.list.options}
          multiple
          bind:value={filterValue}
          valueField="value"
          labelField="text"
        />
      {:else if inputType !== "null" && filterFieldType(filterField) === "date"}
        {#if filterMode === FilterMode.INCLUDES || filterMode === FilterMode.EXCLUDES}
          <div class="flex flex-col w-full">
            <hr class="mt-3" />
            <label class="text-sm mb-1 block mt-3" for="new-filter-day">Day</label>
            <input
              class="input input-bordered input-sm"
              type="number"
              id="new-filter-day"
              bind:value={dateDay}
              min={1}
              max={31}
            />
            <label class="text-sm mb-1 block mt-3" for="new-filter-month">Month</label>
            <select
              class="input input-bordered input-sm"
              bind:value={dateMonth}
              id="new-filter-month"
            >
              <option value={0}>January</option>
              <option value={1}>February</option>
              <option value={2}>March</option>
              <option value={3}>April</option>
              <option value={4}>May</option>
              <option value={5}>June</option>
              <option value={6}>July</option>
              <option value={7}>August</option>
              <option value={8}>September</option>
              <option value={9}>October</option>
              <option value={10}>November</option>
              <option value={11}>December</option>
            </select>
            <label class="text-sm mb-1 block mt-3" for="new-filter-year">Year</label>
            <input
              class="input input-bordered input-sm"
              type="number"
              id="new-filter-year"
              bind:value={dateYear}
              min={0}
              max={new Date().getFullYear()}
            />
            <label class="text-sm mb-1 block mt-3" for="new-filter-weekday">Weekday</label>
            <select
              class="input input-bordered input-sm"
              bind:value={dateWeekday}
              id="new-filter-weekday"
            >
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
              <option value={0}>Sunday</option>
            </select>
          </div>
        {:else}
          <input
            id={`${type}-new-filter-field`}
            bind:value={filterValue}
            class="input flex-1 input-bordered input-sm"
            type="date"
          />
        {/if}
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
