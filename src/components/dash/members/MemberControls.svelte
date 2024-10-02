<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAdjustments, IconUsers } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import AddFilterGroup from "../filters/AddFilterGroup.svelte"
  import Sorts from "../filters/Sorts.svelte"
  import AddSort from "../filters/AddSort.svelte"
  import { toggleSetting } from "$lib/dash/utils"
  import SimpleMemberControls from "./SimpleMemberControls.svelte"

  let mode: "simple" | "advanced" = $state("simple")

  function changeMode() {
    mode === "simple" ? (mode = "advanced") : (mode = "simple")

    if (mode === "simple") {
      dash.members.process(
        dash.groups.list.raw,
        dash.members.simpleFilters,
        dash.members.simpleSorts
      )
    } else {
      dash.members.process(dash.groups.list.raw)
    }
    dash.members.paginate()
  }
</script>

<div
  class={`box bg-base-100 h-min ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "xl:w-1/3"
  }`}
>
  <div class="flex flex-row justify-between items-center">
    <h2 class="text-xl flex-1">
      <IconUsers class="inline mr-2" /> Member list options
    </h2>
    <button class="btn btn-sm btn-primary mt-2 w-min h-10" onclick={() => changeMode()}>
      <div class="flex flex-row items-center gap-2">
        <IconAdjustments size={32} />
        <span>{mode === "simple" ? "Advanced" : "Simple"} mode</span>
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
  {#if mode === "simple"}
    <SimpleMemberControls />
  {:else if mode === "advanced"}
    <div
      class={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
        dash.settings.display?.forceControlsAtTop === true ? "xl:grid-cols-2" : "xl:grid-cols-1"
      }`}
    >
      <div>
        <h3 class="text-xl">Filter list</h3>
        <hr class="my-2" />
        <AddFilterGroup
          bind:filterGroups={dash.members.filters}
          list={dash.members}
          type="members"
        />
        <FilterGroups list={dash.members} />
      </div>
      <div>
        <h3 class="text-xl">Sort list</h3>
        <hr class="my-2" />
        <AddSort bind:sorts={dash.members.sorts} list={dash.members} type="members" />
        <Sorts list={dash.members} />
      </div>
    </div>
  {/if}
</div>
