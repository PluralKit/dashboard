<script lang="ts">
  import ItemCollapse from "$components/dash/ItemCollapse.svelte"
  import { dash } from "$lib/dash/dash.svelte";
</script>

<div
  class="flex flex-col gap-8 mx-auto w-full max-w-4xl"
>
  <ItemCollapse asPage={true} forceOpen={true} type="member" item={dash.member.member ?? {}}/>
</div>
