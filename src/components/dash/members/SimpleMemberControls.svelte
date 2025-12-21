<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, PrivacyMode, type DashList } from "$lib/dash/dash.svelte"
  import { defaultSortMode } from "$lib/dash/sorts.svelte"
  import { IconSearch } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"
  // @ts-ignore
  import { autoresize } from "svelte-textarea-autoresize"

  let {
    list,
    groupList,
    wide = true,
  }: {
    list: DashList<Member>
    groupList: DashList<Group>
    wide?: boolean
  } = $props()
</script>

<div class="flex flex-col mb-3">
  <label class="label justify-start gap-2" for="member-list-name-search"
    ><IconSearch /> Member search</label
  >
  <textarea
    class="input input-bordered resize-none p-2"
    use:autoresize
    bind:value={list.simpleFilters[0].filters[0].value}
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
          for="member-list-dn-search">Display name</label
        >
        <textarea
          use:autoresize
          class="input input-bordered input-sm flex-1 join-item resize-none"
          id="member-list-dn-search"
          bind:value={list.simpleFilters[0].filters[1].value}
          placeholder="Search by display name..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-desc-search">Description</label
        >
        <textarea
          class="input input-bordered input-sm flex-1 join-item resize-none"
          use:autoresize
          id="member-list-desc-search"
          bind:value={list.simpleFilters[0].filters[2].value}
          placeholder="Search by description..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-id-search">ID</label
        >
        <textarea
          use:autoresize
          class="input input-bordered input-sm flex-1 join-item resize-none"
          id="member-list-id-search"
          bind:value={list.simpleFilters[0].filters[3].value}
          placeholder="Search by ID..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-prns-search">Pronouns</label
        >
        <textarea
          use:autoresize
          class="input input-bordered input-sm flex-1 join-item resize-none"
          id="member-list-prns-search"
          bind:value={list.simpleFilters[0].filters[4].value}
          placeholder="Search by pronouns..."
        ></textarea>
      </div>
      <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-group-search">Groups</label
        >
        <Svelecte
          class="svelecte-control-pk join-item w-full text-sm"
          options={groupList.list.options}
          multiple
          valueField="value"
          labelField="text"
          bind:value={list.simpleFilters[0].filters[6].value}
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
        for="member-list-sort-by">Sort by</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="member-list-sort-by"
        bind:value={list.simpleSorts[1].field}
        onchange={() => {
          list.simpleSorts[1].mode = defaultSortMode(list.simpleSorts[1].field)
        }}
      >
        <option value="name">Name</option>
        <option value="display_name">Display Name</option>
        <option value="id">ID</option>
        <option value="description">Description</option>
        <option value="pronouns">Pronouns</option>
        <option value="birthday">Birthday</option>
        <option value="color">Color</option>
        <option value="message_count">Message Count</option>
        <option value="groups">Group Count</option>
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
        bind:value={list.simpleSorts[1].order}
      >
        <option value={1}>Ascending</option>
        <option value={-1}>Descending</option>
      </select>
    </div>
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
    <div class="join">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="member-list-filter-privacy">Visibility</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="member-list-filter-privacy"
        bind:value={list.simpleFilters[0].filters[5].value}
      >
        <option value="all">All</option>
        <option value="public">Public only</option>
        <option value="private">Private only</option>
      </select>
    </div>
    {/if}
  </div>
</div>
