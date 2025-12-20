<script lang="ts">
  import { dash, PrivacyMode, type DashList } from "$lib/dash/dash.svelte"
  import { IconAdjustments, IconUsers } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import AddFilterGroup from "../filters/AddFilterGroup.svelte"
  import Sorts from "../filters/Sorts.svelte"
  import AddSort from "../filters/AddSort.svelte"
  import { toggleSetting } from "$lib/dash/utils"
  import SimpleGroupControls from "./SimpleGroupControls.svelte"
  import type { Group, Member } from "$api/types"
  import { ViewType } from "$lib/dash/settings.svelte"

  let {
    list,
    memberList,
    privacyMode,
    simpleOnly = false,
    wide = false,
  }: {
    list: DashList<Group>
    memberList: DashList<Member>
    privacyMode: PrivacyMode
    simpleOnly?: boolean
    wide?: boolean
  } = $props()

  function changeMode() {
    list.settings.filterMode === "simple"
      ? (list.settings.filterMode = "advanced")
      : (list.settings.filterMode = "simple")
  }

  if (dash.settings.display?.keepOpen && list.settings.view.type === ViewType.COLLAPSE) {
    list.settings.viewType = ViewType.OPEN
  }
</script>

<div class="flex flex-col-reverse sm:flex-row sm:justify-between">
  <span class="mt-2 sm:mt-0">
    <h2 class="text-xl flex-1">
      <IconUsers class="inline mr-2" /> Group list options
    </h2>
    <div class="text-sm mt-2">
      <a href="/settings/layout" class="link-secondary">Change layout settings</a>
    </div>
  </span>
  {#if !simpleOnly}
    <button class="btn btn-sm btn-primary h-10" onclick={() => changeMode()}>
      <div class="flex flex-row items-center gap-2">
        <IconAdjustments size={32} />
        <span>{list.settings.filterMode === "simple" ? "Advanced" : "Simple"} mode</span>
      </div>
    </button>
  {/if}
</div>
<div
  class={`grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 mb-2 ${
    wide === true ? "xl:grid-cols-3" : "xl:grid-cols-2"
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
      bind:value={list.settings.itemsPerPage}
    >
      {#each list.settings.view.itemsPerPageSelection as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
  <div class="join flex-1">
    <label
      class="input input-disabled input-bordered input-sm w-fit join-item"
      for="member-list-view">View mode</label
    >
    <select
      class="input input-sm input-bordered join-item flex-1"
      id="member-list-view"
      bind:value={list.settings.viewType}
    >
      <option value={dash.settings.display?.keepOpen === true ? ViewType.OPEN : ViewType.COLLAPSE}
        >List</option
      >
      <option value={ViewType.CARD}>Card</option>
      <option value={ViewType.TINY}>Tiny</option>
    </select>
  </div>
</div>
{#if simpleOnly || list.settings.filterMode === "simple"}
  <SimpleGroupControls {list} {wide} />
{:else if list.settings.filterMode === "advanced"}
  <div
    class={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 ${
      wide ? "xl:grid-cols-2" : "xl:grid-cols-1"
    }`}
  >
    <div class="flex flex-col gap-2">
      <h3 class="text-xl">Filter list</h3>
      <AddFilterGroup
        {privacyMode}
        groupList={list}
        {memberList}
        bind:filterGroups={list.filters}
        {list}
        type="groups"
      />
      <FilterGroups groupList={list} {list} {memberList} />
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl">Sort list</h3>
      <AddSort groupList={list} bind:sorts={list.sorts} {list} type="groups" />
      <Sorts groupList={list} {list} />
    </div>
  </div>
{/if}
