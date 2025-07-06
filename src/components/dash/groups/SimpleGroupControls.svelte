<script lang="ts">
  import type { Group } from "$api/types"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { defaultSortMode } from "$lib/dash/sorts.svelte"
  import { IconSearch } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"
  // @ts-ignore
  import { autoresize } from "svelte-textarea-autoresize"

  let {
    list = $bindable(),
    wide = true,
  }: {
    list: DashList<Group>
    wide?: boolean
  } = $props()
</script>

<div class="flex flex-col mb-3">
  <label class="label justify-start gap-2" for="group-list-name-search"
    ><IconSearch /> Group search</label
  >
  <textarea
    use:autoresize
    class="input input-bordered resize-none p-2"
    bind:value={list.simpleFilters[0].filters[0].value}
    oninput={() => {
      list.process(list.list.raw)
      list.paginate()
    }}
    placeholder="Search by name..."
  ></textarea>
</div>
<div class="flex flex-col mt-3">
  <button
    class="btn btn-neutral btn-sm mb-4"
    onclick={() => (list.settings.extraFields = !list.settings.extraFields)}
  >
    Show additional fields
  </button>
  {#if list.settings.extraFields}
    <div
      class={`mb-4 gap-2 grid grid-col-1 md:grid-cols-2 lg:grid-cols-2 ${
        wide === true ? "xl:grid-cols-2" : "xl:grid-cols-1"
      }`}
    >
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="group-list-dn-search">Display name</label
        >
        <textarea
          use:autoresize
          class="input input-bordered input-sm flex-1 join-item resize-none"
          id="group-list-dn-search"
          bind:value={list.simpleFilters[0].filters[1].value}
          oninput={() => {
            list.process(list.list.raw)
            list.paginate()
          }}
          placeholder="Search by display name..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="group-list-desc-search">Description</label
        >
        <textarea
          class="input input-bordered input-sm flex-1 join-item resize-none"
          id="group-list-desc-search"
          value={list.simpleFilters[0].filters[2].value}
          oninput={(e) => {
            list.simpleFilters[0].filters[2].value = (e.target as HTMLInputElement).value
            list.process(list.list.raw)
            list.paginate()
          }}
          placeholder="Search by description..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="group-list-id-search">ID</label
        >
        <textarea
          class="input input-bordered input-sm flex-1 join-item resize-none"
          id="group-list-id-search"
          bind:value={list.simpleFilters[0].filters[3].value}
          use:autoresize
          oninput={() => {
            list.process(list.list.raw)
            list.paginate()
          }}
          placeholder="Search by ID..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="group-list-member-search">Members</label
        >
        <Svelecte
          class="svelecte-control-pk join-item w-full text-sm"
          options={dash.members.list.options}
          multiple
          valueField="value"
          labelField="text"
          inputId="group-list-member-search"
          bind:value={list.simpleFilters[0].filters[5].value}
          onChange={() => {
            list.process(list.list.raw)
            list.paginate()
          }}
        />
      </div>
    </div>
  {/if}
  <div
    class={`grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 ${
      wide === true ? "xl:grid-cols-3" : "xl:grid-cols-2"
    }`}
  >
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="group-list-sort-by">Sort by</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="group-list-sort-by"
        bind:value={list.simpleSorts[1].field}
        onchange={() => {
          list.simpleSorts[1].mode = defaultSortMode(list.simpleSorts[1].field)
          list.process(list.list.raw)
          list.paginate()
        }}
      >
        <option value="name">Name</option>
        <option value="display_name">Display Name</option>
        <option value="ID">ID</option>
        <option value="description">Description</option>
        <option value="color">Color</option>
        <option value="members">Member Count</option>
        <option value="created">Created</option>
      </select>
    </div>
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="group-list-sort-order">Order</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="group-list-sort-order"
        bind:value={list.simpleSorts[1].order}
        onchange={() => {
          list.process(list.list.raw)
          list.paginate()
        }}
      >
        <option value={1}>Ascending</option>
        <option value={-1}>Descending</option>
      </select>
    </div>
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="group-list-filter-privacy">Visibility</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="group-list-filter-privacy"
        bind:value={list.simpleFilters[0].filters[4].value}
        onchange={() => {
          list.process(list.list.raw)
          list.paginate()
        }}
      >
        <option value="all">All</option>
        <option value="public">Public only</option>
        <option value="private">Private only</option>
      </select>
    </div>
  </div>
</div>
