<script lang="ts">
  import type { Group } from "$api/types"
  import EditColor from "$components/dash/edit/EditColor.svelte"
  import EditDescription from "$components/dash/edit/EditDescription.svelte"
  import EditField from "$components/dash/edit/EditField.svelte"
  import EditImage from "$components/dash/edit/EditImage.svelte"

  let {
    tab,
    group = $bindable(),
    icon = $bindable(),
  }: {
    tab: "view" | "info" | "groups"
    group: Group
    icon: string
  } = $props()
</script>

<div style={tab !== "view" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Group info</h4>
  </div>
  <div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Names</h5>
      <hr />
      <EditField item={group} original={null} bind:value={group.name} field="Name" />
      <EditField
        item={group}
        original={null}
        bind:value={group.display_name}
        field="Display name"
      />
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Information</h5>
      <hr />
      <EditColor item={group} original={null} bind:value={group.color} />
    </div>
    <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Images</h5>
      <hr />
      <EditImage
        item={group}
        original={null}
        bind:value={group.icon}
        field="Avatar"
        onChange={() => (icon = group.icon || "")}
      />
      <EditImage item={group} original={null} bind:value={group.banner} field="Banner" />
    </div>
    <EditDescription item={group} bind:value={group.description} original={null} />
  </div>
</div>
