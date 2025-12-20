<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
  import MemberControls from "./MemberControls.svelte"
  import MemberList from "./MemberList.svelte"
  import CopyPermaLink from "../CopyPermaLink.svelte"
</script>

{#if dash.errors.members}
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
    <IconAlertTriangle class="text-error" /> Error fetching members: {dash.errors.members}
  </div>
{/if}
<div
  class={`flex flex-col gap-8 mx-auto w-full max-w-4xl ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "xl:flex-row xl:max-w-7xl"
  }`}
>
  <div class={dash.settings.display?.forceControlsAtTop === true ? "" : "xl:w-1/3"}>
    <div class="box bg-base-100 h-min">
      <MemberControls privacyMode={dash.privacyMode} groupList={dash.groups} list={dash.members} wide={dash.settings.display?.forceControlsAtTop === true} />
    </div>
    {#if dash.members.settings.filterMode === "advanced"}
      <CopyPermaLink tab="members" />
    {/if}
  </div>
  <div
    class={`flex flex-col gap-3 sm:gap-4 ${
      dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
    }`}
  >
    <MemberList privacyMode={dash.privacyMode} groupList={dash.groups} list={dash.members} />
  </div>
</div>
