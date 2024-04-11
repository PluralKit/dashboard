<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode, createFilter } from "$lib/dash/filters.svelte"
  import { IconSettings, IconUsers } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import { randomId } from "$lib/dash/ids"
  import { onMount } from "svelte"
  import AddFilterGroup from "../filters/AddFilterGroup.svelte"

  let mode: "simple" | "advanced" = $state("advanced")

  dash.members.filters = [
    {
      mode: "and",
      filters: [],
      id: randomId(),
    },
  ]
</script>

<div
  class={`box bg-base-100 h-min ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:w-1/3"
  }`}
>
  <div class="flex flex-row justify-between items-center">
    <h2 class="text-xl">
      <IconUsers class="inline mr-2" /> Member list options
    </h2>
    <button class="btn btn-sm btn-primary p-2 ml-2">
      <IconSettings class="inline" size={16} /> Settings
    </button>
  </div>
  <hr class="my-2" />
  <p class="my-4">More search options will go here later.</p>
  {#if mode === "advanced"}
    <div
      class={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 ${
        dash.settings.display?.forceControlsAtTop === true ? "xl:grid-cols-2" : ""
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
        <FilterGroups bind:filterGroups={dash.members.filters} />
      </div>
      <div>
        <h3 class="text-xl">Sort list</h3>
        <hr class="my-2" />
      </div>
    </div>
  {/if}
</div>
