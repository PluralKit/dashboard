<script lang="ts">
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconAdjustments, IconUsers } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import AddFilterGroup from "../filters/AddFilterGroup.svelte"
  import Sorts from "../filters/Sorts.svelte"
  import AddSort from "../filters/AddSort.svelte"
  import { toggleSetting } from "$lib/dash/utils"
  import SimpleMemberControls from "./SimpleMemberControls.svelte"
  import type { Member } from "$api/types"

  let {
    list,
  }: {
    list: DashList<Member>
  } = $props()

  function changeMode() {
    list.settings.filterMode === "simple"
      ? (list.settings.filterMode = "advanced")
      : (list.settings.filterMode = "simple")

    list.process(dash.groups.list.raw)
    list.paginate()
  }
</script>

<div class="flex flex-row justify-between items-center">
  <h2 class="text-xl flex-1">
    <IconUsers class="inline mr-2" /> Member list options
  </h2>
  <button class="btn btn-sm btn-primary mt-2 w-min h-10" onclick={() => changeMode()}>
    <div class="flex flex-row items-center gap-2">
      <IconAdjustments size={32} />
      <span>{list.settings.filterMode === "simple" ? "Advanced" : "Simple"} mode</span>
    </div>
  </button>
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
</div>
<hr class="my-2" />
{#if list.settings.filterMode === "simple"}
  <SimpleMemberControls {list} />
{:else if list.settings.filterMode === "advanced"}
  <div
    class={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
      dash.settings.display?.forceControlsAtTop === true ? "xl:grid-cols-2" : "xl:grid-cols-1"
    }`}
  >
    <div>
      <h3 class="text-xl">Filter list</h3>
      <hr class="my-2" />
      <AddFilterGroup bind:filterGroups={list.filters} {list} type="members" />
      <FilterGroups {list} />
    </div>
    <div>
      <h3 class="text-xl">Sort list</h3>
      <hr class="my-2" />
      <AddSort bind:sorts={list.sorts} {list} type="members" />
      <Sorts {list} />
    </div>
  </div>
{/if}
