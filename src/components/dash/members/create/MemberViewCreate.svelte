<script lang="ts">
  import type { Member } from "$api/types"
  import EditColor from "$components/dash/edit/EditColor.svelte"
  import EditDescription from "$components/dash/edit/EditDescription.svelte"
  import EditField from "$components/dash/edit/EditField.svelte"
  import EditImage from "$components/dash/edit/EditImage.svelte"

  let {
    tab,
    member = $bindable(),
    avatar = $bindable(),
    proxyAvatar = $bindable(),
  }: {
    tab: "view" | "info" | "groups"
    member: Member
    avatar: string
    proxyAvatar: string
  } = $props()
</script>

<div style={tab !== "view" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Member info</h4>
  </div>
  <div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Names</h5>
      <hr />
      <EditField item={member} original={null} bind:value={member.name} field="Name" />
      <EditField
        item={member}
        original={null}
        bind:value={member.display_name}
        field="Display name"
      />
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Information</h5>
      <hr />
      <EditField item={member} original={null} bind:value={member.pronouns} field="Pronouns" />
      <EditField
        item={member}
        original={null}
        showCount={false}
        bind:value={member.birthday}
        field="Birthday"
      />
      <EditColor item={member} original={null} bind:value={member.color} />
    </div>
    <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Images</h5>
      <hr />
      <EditImage
        item={member}
        original={null}
        bind:value={member.avatar_url}
        field="Avatar"
        onChange={() => (avatar = member.avatar_url || "")}
      />
      <EditImage
        item={member}
        original={null}
        bind:value={member.webhook_avatar_url}
        field="Proxy avatar"
        onChange={() => (proxyAvatar = member.webhook_avatar_url || "")}
      />
      <EditImage item={member} original={null} bind:value={member.banner} field="Banner" />
    </div>
    <EditDescription item={member} bind:value={member.description} original={null} />
  </div>
</div>
