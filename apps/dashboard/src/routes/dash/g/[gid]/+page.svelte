<script lang="ts">
  import ItemCollapse from "$components/dash/ItemCollapse.svelte"
  import MemberControls from "$components/dash/members/MemberControls.svelte"
  import MemberList from "$components/dash/members/MemberList.svelte"
  import { dash, initDash } from "$lib/dash/dash.svelte"

  let { data } = $props()

  initDash(data)
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

  <div class={`box bg-base-100 h-min`}>
    <MemberControls
      wide={true}
      groupList={dash.group.groups}
      list={dash.group.members}
      privacyMode={dash.group.privacyMode}
    />
  </div>

  <div class="flex flex-col gap-3 sm:gap-4">
    <MemberList
      list={dash.group.members}
      groupList={dash.group.groups}
      privacyMode={dash.group.privacyMode}
      initialGroups={dash.group.group ? [dash.group.group] : undefined}
      wide={true}
    />
  </div>
</div>
