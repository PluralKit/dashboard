<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
</script>

<div
  class={`flex flex-col gap-3 sm:gap-4 ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
  }`}
>
  {#each dash.members.list as member (member.uuid)}
    <ItemCollapse item={member} type="member" />
  {/each}
</div>
