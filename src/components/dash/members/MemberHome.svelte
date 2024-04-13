<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
  import MemberControls from "./MemberControls.svelte"
  import MemberList from "./MemberList.svelte"
</script>

{#if dash.errors.members}
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
      <IconAlertTriangle class="text-error" /> Error fetching members: {dash.errors.members}
  </div>
{/if}
<div
  class={`flex flex-col gap-8 mx-auto w-full max-w-7xl ${
    dash.settings.display?.forceControlsAtTop === true ? "lg:w-2/3" : "lg:flex-row"
  }`}
>
  <MemberControls />
  <MemberList />
</div>
