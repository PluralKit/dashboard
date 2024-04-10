<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode, createFilter } from "$lib/dash/filters.svelte"
  import { IconSettings, IconUsers } from "@tabler/icons-svelte"
  import FilterGroups from "../filters/FilterGroups.svelte"
  import { randomId } from "$lib/dash/ids"
  import { onMount } from "svelte"

  let nameFilter = createFilter("name", "name", FilterMode.INCLUDES, "")

  dash.members.filters = [{
    mode: "and",
    filters: [nameFilter],
    id: randomId()
  }, {
    mode: "and",
    filters: [],
    id: randomId()
  }]

  onMount(() => {
    dash.members.process()
    dash.members.paginate()
  })
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
  <p class="my-4">Controls will go here etc</p>
  <h3 class="text-xl">Filter list</h3>
  <hr class="my-2" />
  <FilterGroups bind:filterGroups={dash.members.filters} />
</div>
