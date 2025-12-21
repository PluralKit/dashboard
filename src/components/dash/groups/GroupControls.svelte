<script lang="ts">
  import { dash, PrivacyMode, type DashList } from "$lib/dash/dash.svelte"
  import { IconAdjustments, IconFolder } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import AddFilterGroup from "../filters/AddFilterGroup.svelte"
  import Sorts from "../filters/Sorts.svelte"
  import AddSort from "../filters/AddSort.svelte"
  import SimpleGroupControls from "./SimpleGroupControls.svelte"
  import type { Group, Member } from "$api/types"
  import { ViewType } from "$lib/dash/settings.svelte"
  import ListControls from "../ListControls.svelte"

  let {
    list = $bindable(),
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

  let filterGroups = $state(list.filters)
  let sorts = $state(list.sorts)
</script>

<div class="flex flex-col-reverse sm:flex-row sm:justify-between">
  <span class="mt-2 sm:mt-0">
    <h2 class="text-xl flex-1">
      <IconFolder class="inline mr-2" /> Group list options
    </h2>
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
<div class="text-sm mt-2">
      <a href="/settings/layout" class="link-secondary">Change layout settings</a>
      |
      <a href={`/dash/${dash.system?.id}/random?tab=groups`} class="link-secondary">
          Random Groups
        </a>
    </div>
<ListControls bind:list {wide} />
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
        bind:filterGroups
        {list}
        type="groups"
      />
      <FilterGroups groupList={list} {list} {memberList} />
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl">Sort list</h3>
      <AddSort bind:sorts type="groups" />
      <Sorts bind:list />
    </div>
  </div>
{/if}
