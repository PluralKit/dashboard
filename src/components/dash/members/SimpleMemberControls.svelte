<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconSearch } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"

  let showAdditionalFields = $state(false)
</script>

<div class="flex flex-col mb-3">
  <label class="label justify-start gap-2" for="member-list-name-search"
    ><IconSearch /> Member search</label
  >
  <input
    class="input input-bordered"
    type="text"
    bind:value={dash.members.simpleFilters[0].filters[0].value}
    oninput={(e) => {
      dash.members.process(dash.groups.list.raw)
      dash.members.paginate()
    }}
    placeholder="Search by name..."
  />
</div>
<div class="flex flex-col mt-3">
  <button
    class="btn btn-neutral btn-sm mb-4"
    onclick={() => (showAdditionalFields = !showAdditionalFields)}
  >
    Show additional fields
  </button>
  {#if showAdditionalFields}
    <div
      class={`mb-4 gap-2 grid grid-col-1 md:grid-cols-2 lg:grid-cols-2 ${
        dash.settings.display?.forceControlsAtTop === true ? "xl:grid-cols-2" : "xl:grid-cols-1"
      }`}
    >
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-dn-search">Display name</label
        >
        <input
          class="input input-bordered input-sm flex-1 join-item"
          type="text"
          id="member-list-dn-search"
          value={dash.members.simpleFilters[0].filters[1].value}
          oninput={(e) => {
            dash.members.simpleFilters[0].filters[1].value = (e.target as HTMLInputElement).value
            dash.members.process(dash.groups.list.raw)
            dash.members.paginate()
          }}
          placeholder="Search by display name..."
        />
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-desc-search">Description</label
        >
        <input
          class="input input-bordered input-sm flex-1 join-item"
          type="text"
          id="member-list-desc-search"
          value={dash.members.simpleFilters[0].filters[2].value}
          oninput={(e) => {
            dash.members.simpleFilters[0].filters[2].value = (e.target as HTMLInputElement).value
            dash.members.process(dash.groups.list.raw)
            dash.members.paginate()
          }}
          placeholder="Search by description..."
        />
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-id-search">ID</label
        >
        <input
          class="input input-bordered input-sm flex-1 join-item"
          type="text"
          id="member-list-id-search"
          value={dash.members.simpleFilters[0].filters[3].value}
          oninput={(e) => {
            dash.members.simpleFilters[0].filters[3].value = (e.target as HTMLInputElement).value
            dash.members.process(dash.groups.list.raw)
            dash.members.paginate()
          }}
          placeholder="Search by description..."
        />
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-prns-search">Pronouns</label
        >
        <input
          class="input input-bordered input-sm flex-1 join-item"
          type="text"
          id="member-list-prns-search"
          value={dash.members.simpleFilters[0].filters[4].value}
          oninput={(e) => {
            dash.members.simpleFilters[0].filters[4].value = (e.target as HTMLInputElement).value
            dash.members.process(dash.groups.list.raw)
            dash.members.paginate()
          }}
          placeholder="Search by description..."
        />
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-group-search">Groups</label
        >
        <Svelecte
          class="svelecte-control-pk join-item w-full text-sm"
          options={dash.groups.list.options}
          multiple
          valueField="value"
          labelField="text"
          bind:value={dash.members.simpleFilters[0].filters[6].value}
          onChange={() => {
            dash.members.process(dash.groups.list.raw)
            dash.members.paginate()
          }}
        />
      </div>
    </div>
  {/if}
  <hr />
  <div
    class={`grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 ${
      dash.settings.display?.forceControlsAtTop === true ? "xl:grid-cols-3" : "xl:grid-cols-2"
    }`}
  >
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="member-list-page-length">Page length</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="member-list-page-length"
        bind:value={dash.members.settings.itemsPerPage}
        onchange={() => dash.members.paginate()}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="member-list-sort-by">Sort by</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="member-list-sort-by"
        bind:value={dash.members.simpleSorts[0].field}
        onchange={() => {
          dash.members.process(dash.groups.list.raw)
          dash.members.paginate()
        }}
      >
        <option value="name">Name</option>
        <option value="display_name">Display Name</option>
        <option value="ID">ID</option>
        <option value="description">Description</option>
        <option value="pronouns">Pronouns</option>
        <option value="color">Color</option>
        <option value="created">Created</option>
      </select>
    </div>
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="member-list-sort-order">Order</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="member-list-sort-order"
        bind:value={dash.members.simpleSorts[0].order}
        onchange={() => {
          dash.members.process(dash.groups.list.raw)
          dash.members.paginate()
        }}
      >
        <option value={1}>Ascending</option>
        <option value={-1}>Descending</option>
      </select>
    </div>
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="member-list-filter-privacy">Visibility</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="member-list-filter-privacy"
        bind:value={dash.members.simpleFilters[0].filters[5].value}
        onchange={() => {
          dash.members.process(dash.groups.list.raw)
          dash.members.paginate()
        }}
      >
        <option value="all">All</option>
        <option value="public">Public only</option>
        <option value="private">Private only</option>
      </select>
    </div>
  </div>
</div>
