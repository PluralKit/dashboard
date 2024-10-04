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

    list.process(list.list.raw)
    list.paginate()
  }
</script>

<div class="flex flex-row justify-between items-center">
  <h2 class="text-xl">
    <IconUsers class="inline mr-2" /> Group list options
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
  class={`grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 ${
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
<hr class="my-2" />
<p class="my-4">Some options will be moved at some point.</p>
{#if simpleOnly || list.settings.filterMode === "simple"}
  <SimpleGroupControls {list} wide={wide || dash.settings.display?.forceControlsAtTop === true} />
{:else if list.settings.filterMode === "advanced"}
  <div
    class={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
      wide || dash.settings.display?.forceControlsAtTop === true
        ? "xl:grid-cols-2"
        : "xl:grid-cols-1"
    }`}
  >
    <div>
      <h3 class="text-xl">Filter list</h3>
      <hr class="my-2" />
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
    <div>
      <h3 class="text-xl">Sort list</h3>
      <hr class="my-2" />
      <AddSort groupList={list} bind:sorts={list.sorts} {list} type="groups" />
      <Sorts groupList={list} {list} />
    </div>
  </div>
{/if}
