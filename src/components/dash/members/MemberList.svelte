<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import MemberCollapse from "./MemberCollapse.svelte"
</script>

<div
  class={`flex flex-col gap-4 ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
  }`}
>
  {#each dash.members.list as member (member.uuid)}
    <MemberCollapse {member} />
  {/each}
</div>
