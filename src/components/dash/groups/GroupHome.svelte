<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
  import GroupControls from "./GroupControls.svelte"
  import GroupList from "./GroupList.svelte"
</script>

{#if dash.errors.groups}
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
    <IconAlertTriangle class="text-error" /> Error fetching groups: {dash.errors.groups}
  </div>
{/if}
<div
  class={`flex flex-col gap-8 mx-auto w-full max-w-4xl ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "xl:flex-row xl:max-w-7xl"
  }`}
>
  <div
    class={`box bg-base-100 h-min ${
      dash.settings.display?.forceControlsAtTop === true ? "" : "xl:w-1/3"
    }`}
  >
    <GroupControls list={dash.groups} />
  </div>
  <div
    class={`flex flex-col gap-3 sm:gap-4 ${
      dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
    }`}
  >
    <GroupList list={dash.groups} />
  </div>
</div>
