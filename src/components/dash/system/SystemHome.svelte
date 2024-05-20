<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
</script>

{#if dash.errors.system}
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
    <IconAlertTriangle class="text-error" /> Error fetching system: {dash.errors.system}
  </div>
{/if}
<div
  class={`flex flex-col gap-8 mx-auto w-full max-w-4xl`}
>
  <ItemCollapse item={dash.system || {}} forceOpen={true} type="system" />
</div>