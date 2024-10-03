<script lang="ts">
  import GroupControls from "$components/dash/groups/GroupControls.svelte"
  import GroupList from "$components/dash/groups/GroupList.svelte"
  import ItemCollapse from "$components/dash/ItemCollapse.svelte"
  import { dash } from "$lib/dash/dash.svelte"
</script>

<div class="flex flex-col gap-8 mx-auto w-full max-w-4xl">
  <ItemCollapse
    privacyMode={dash.member.privacyMode}
    memberList={dash.member.members}
    groupList={dash.member.groups}
    asPage={true}
    forceOpen={true}
    type="member"
    item={dash.member.member ?? {}}
  />

  <div class={`box bg-base-100 h-min`}>
    <GroupControls
      memberList={dash.member.members}
      wide={true}
      simpleOnly={true}
      list={dash.member.groups}
      privacyMode={dash.member.privacyMode}
    />
  </div>

  <div class="flex flex-col gap-3 sm:gap-4">
    <GroupList
      list={dash.member.groups}
      memberList={dash.member.members}
      privacyMode={dash.member.privacyMode}
      initialMembers={dash.member.member ? [dash.member.member] : undefined}
      wide={true}
    />
  </div>
</div>
