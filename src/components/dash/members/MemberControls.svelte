<script lang="ts">
  import { dash, PrivacyMode, type DashList } from "$lib/dash/dash.svelte"
  import { IconAdjustments, IconUsers } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import AddFilterGroup from "../filters/AddFilterGroup.svelte"
  import Sorts from "../filters/Sorts.svelte"
  import AddSort from "../filters/AddSort.svelte"
  import { toggleSetting } from "$lib/dash/utils"
  import SimpleMemberControls from "./SimpleMemberControls.svelte"
  import type { Group, Member } from "$api/types"
  import { ViewType } from "$lib/dash/settings.svelte"

  let {
    list,
    groupList,
    privacyMode,
    simpleOnly = false,
    wide = false,
  }: {
    list: DashList<Member>
    groupList: DashList<Group>
    privacyMode: PrivacyMode
    simpleOnly?: boolean
    wide?: boolean
  } = $props()

  function changeMode() {
    list.settings.filterMode === "simple"
      ? (list.settings.filterMode = "advanced")
      : (list.settings.filterMode = "simple")

    list.process(groupList.list.raw)
    list.paginate()
  }
</script>

<div class="flex flex-row justify-between items-center">
  <h2 class="text-xl flex-1">
    <IconUsers class="inline mr-2" /> Member list options
  </h2>
  {#if !simpleOnly}
    <button class="btn btn-sm btn-primary mt-2 w-min h-10" onclick={() => changeMode()}>
      <div class="flex flex-row items-center gap-2">
        <IconAdjustments size={32} />
        <span>{list.settings.filterMode === "simple" ? "Advanced" : "Simple"} mode</span>
      </div>
    </button>
  {/if}
</div>
<div class="text-sm mt-2">
  <button
    class="text-secondary hover:text-primary cursor-pointer transition-all"
    onclick={() => toggleSetting(dash, "devMode")}
  >
    Dev mode
  </button>
  |
  <button
    class="text-secondary hover:text-primary cursor-pointer transition-all"
    onclick={() => toggleSetting(dash, "display", "forceControlsAtTop")}
  >
    Controls at top
  </button>
  |
  <button
    class="text-secondary hover:text-primary cursor-pointer transition-all"
    onclick={() => toggleSetting(dash, "display", "fullColorBorder")}
  >
    Show colors
  </button>
  |
  <button
    class="text-secondary hover:text-primary cursor-pointer transition-all"
    onclick={() => {
      toggleSetting(dash, "display", "keepOpen")

      if (
        list.settings.view.type === ViewType.COLLAPSE &&
        dash.settings.display?.keepOpen === true
      ) {
        list.settings.viewType = ViewType.OPEN
      } else if (list.settings.view.type === ViewType.OPEN && !dash.settings.display?.keepOpen) {
        list.settings.viewType = ViewType.COLLAPSE
      }
      list.settings.changeView()

      list.paginate()
    }}
  >
    Force open
  </button>
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
      onchange={() => list.paginate()}
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
      onchange={() => {
        list.settings.changeView()
        list.paginate()
      }}
    >
      <option value={dash.settings.display?.keepOpen === true ? ViewType.OPEN : ViewType.COLLAPSE}
        >List</option
      >
      <option value={ViewType.TINY}>Tiny</option>
    </select>
  </div>
</div>
{#if simpleOnly || list.settings.filterMode === "simple"}
  <SimpleMemberControls
    {groupList}
    {list}
    wide={wide || dash.settings.display?.forceControlsAtTop === true}
  />
{:else if list.settings.filterMode === "advanced"}
  <div
    class={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 ${
      wide || dash.settings.display?.forceControlsAtTop === true
        ? "xl:grid-cols-2"
        : "xl:grid-cols-1"
    }`}
  >
    <div class="flex flex-col gap-2">
      <h3 class="text-xl">Filter list</h3>
      <AddFilterGroup
        {privacyMode}
        memberList={list}
        {groupList}
        bind:filterGroups={list.filters}
        {list}
        type="members"
      />
      <FilterGroups {groupList} {list} memberList={list} />
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl">Sort list</h3>
      <AddSort {groupList} bind:sorts={list.sorts} {list} type="members" />
      <Sorts {groupList} {list} />
    </div>
  </div>
{/if}
