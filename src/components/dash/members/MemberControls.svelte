<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconSettings, IconUsers } from "@tabler/icons-svelte"
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
  <p>Controls will go here etc</p>
</div>
