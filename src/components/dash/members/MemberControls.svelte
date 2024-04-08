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
      <IconUsers class="inline mr-2" /> Control member list
    </h2>
    <a
      class="btn btn-ghost tooltip tooltip-left min-h-0 h-auto p-1 min-w-0 w-auto"
      data-tip="Change display settings"
      href="/settings/layout#Members"
    >
      <IconSettings />
    </a>
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
