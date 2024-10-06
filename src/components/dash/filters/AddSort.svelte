<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { type DashList } from "$lib/dash/dash.svelte"
  import { filterFieldText, filterFieldType } from "$lib/dash/filters.svelte"
  import { createSort, SortMode, type Sort } from "$lib/dash/sorts.svelte"
  import { IconPlus } from "@tabler/icons-svelte"

  let {
    type,
    list,
    sorts = $bindable(),
    groupList,
  }: {
    type: "members" | "groups"
    list: DashList<Member | Group>
    sorts: Sort[]
    groupList: DashList<Group>
  } = $props()

  let sortMode: SortMode | null = $state(null)
  let sortField: string = $state("")
  let sortOrder: 1 | -1 = $state(1)

  const modeDisabled = ["color", "date", "members", "groups", "created", "birthday"]

  function addSort() {
    let mode = sortMode
    if (filterFieldType(sortField) === "number") mode = SortMode.SIZE

    const sort = createSort(
      mode || SortMode.ALPHABETICAL,
      sortField,
      filterFieldText(sortField),
      sortOrder
    )

    sorts = [...sorts, sort]

    sortField = ""
    sortMode = null
    sortOrder = 1

    list.process(groupList.list.raw)
    list.paginate()
  }
</script>

<div class="rounded-lg border-muted/50 border mb-3 p-4">
  <p class="text-lg mb-2 mr-2">Add new sort</p>
  <div class="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    <div class="flex flex-col">
      <label class="text-sm mb-1" for={`${type}-new-sort-field`}>Filter by</label>
      <select
        id={`${type}-new-sort-field`}
        class="select select-sm select-bordered"
        bind:value={sortField}
      >
        <option disabled value="">Sort by...</option>
        <option value="id">id</option>
        <option value="name">name</option>
        <option value="display_name">display name</option>
        <option value="description">description</option>
        {#if type === "members"}
          <option value="pronouns">pronouns</option>
        {/if}
        <option value="color">color</option>
        {#if type === "members"}
          <option value="birthday">birthday</option>
          <option value="message_count">message count</option>
          <option value="groups">groups</option>
        {:else if type === "groups"}
          <option value="members">members</option>
        {/if}
        <option value="created">created</option>
      </select>
    </div>
    <div class="flex flex-col">
      <label class="text-sm mb-1" for={`${type}-new-sort-mode`}>Filter mode</label>
      <select
        id={`${type}-new-sort-mode`}
        class="select select-sm select-bordered"
        bind:value={sortMode}
        disabled={!sortField || modeDisabled.includes(sortField)}
      >
        {#if !sortField}
          <option value={null} disabled>Select a field first</option>
        {:else if sortField === "color"}
          <option value={null} disabled>color</option>
        {:else if filterFieldType(sortField) === "date"}
          <option value={null} disabled>date</option>
        {:else if filterFieldType(sortField) === "number"}
          <option value={null} disabled>amount</option>
        {:else}
          <option value={null} disabled>Sort mode...</option>
          {#if filterFieldType(sortField) === "string"}
            <option value={SortMode.ALPHABETICAL}>alphabetical</option>
            <option value={SortMode.SIZE}>length</option>
          {/if}
        {/if}
      </select>
    </div>
  </div>
  {#if sortField && (sortMode || modeDisabled.includes(sortField) || filterFieldType(sortField) === "number")}
    <label class="mt-3" for={`${type}-new-sort-order`}>Order</label>
    <div class="flex flex-row gap-3">
      <select bind:value={sortOrder} class="flex-1 select select-sm select-bordered">
        <option value={1}>Ascending</option>
        <option value={-1}>Descending</option>
      </select>
      <button class="btn btn-success btn-sm ml-auto" onclick={() => addSort()}>
        <IconPlus size={14} /> sort
      </button>
    </div>
  {/if}
</div>
