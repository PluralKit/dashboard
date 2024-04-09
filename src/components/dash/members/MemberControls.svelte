<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode, createFilter } from "$lib/dash/filters.svelte"
  import { IconSettings, IconUsers } from "@tabler/icons-svelte"

  let nameFilter = createFilter("name", FilterMode.INCLUDES, "")

  dash.members.filters.clear()
  dash.members.filters.append({
    mode: "and",
    filters: [nameFilter],
  })
</script>

<div
  class={`box bg-base-100 h-min ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:w-1/3"
  }`}
>
  <div class="flex flex-row justify-between items-center">
    <h2 class="text-xl">
      <IconUsers class="inline mr-2" /> Filter member list
    </h2>
    <button class="btn btn-sm btn-primary p-2 ml-2">
      <IconSettings class="inline" size={16} /> Settings
    </button>
  </div>
  <hr class="my-2" />
  <input
    type="text"
    bind:value={nameFilter.value}
    oninput={() => dash.members.process()}
    placeholder="Search name..."
    class="input w-full input-bordered my-2 bg-base-200"
  />
  <p>Controls will go here etc</p>
</div>
