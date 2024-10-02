<script lang="ts">
  import ItemCollapse from "$components/dash/ItemCollapse.svelte"
  import { dash } from "$lib/dash/dash.svelte"
</script>

<div class="flex flex-col gap-8 mx-auto w-full max-w-4xl">
  <ItemCollapse
    privacyMode={dash.group.privacyMode}
    memberList={dash.group.members}
    groupList={dash.group.groups}
    asPage={true}
    forceOpen={true}
    type="group"
    item={dash.group.group ?? {}}
  />
</div>
