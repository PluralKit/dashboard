<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import MemberControls from "./MemberControls.svelte"
  import MemberList from "./MemberList.svelte"
</script>

<div
  class={`flex flex-col gap-8 mx-auto w-full ${
    dash.settings.display?.forceControlsAtTop === true ? "lg:w-2/3" : "lg:flex-row"
  }`}
>
  <MemberControls />
  <MemberList />
</div>
