<script lang="ts">
  import type { Group, GroupPrivacy, proxytag } from "$api/types"
  import EditPrivacy from "$components/dash/edit/EditPrivacy.svelte"
  import { IconPlus } from "@tabler/icons-svelte"

  let {
    tab,
    group = $bindable(),
    privacy = $bindable(),
  }: {
    tab: "view" | "info" | "groups"
    group: Group & {
      privacy: GroupPrivacy
    }
    privacy: GroupPrivacy
  } = $props()

  function changeAllPrivacy(event: Event) {
    const target = event.target as HTMLSelectElement
    if (target.value === "public" || target.value === "private") {
      Object.entries(privacy).forEach(
        ([key]) => (privacy[key as keyof GroupPrivacy] = target.value)
      )
    } else if (target.value) {
      Object.entries(privacy).forEach(
        ([key]) =>
          (privacy[key as keyof GroupPrivacy] = (privacy as GroupPrivacy)[
            key as keyof GroupPrivacy
          ])
      )
    }
  }
</script>

<div style={tab !== "info" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Editing details</h4>
  </div>
  <div class="flex flex-col h-min gap-2 lg:gap-3">
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Privacy</h5>
      <hr />
      <ul class="flex flex-row flex-wrap">
        <li class="w-full px-2 py-1 flex flex-col">
          <label class="mb-1" for={`${group.uuid}-privacy-all`}>Set all to</label>
          <select
            class="input input-bordered input-sm"
            onchange={(e) => changeAllPrivacy(e)}
            id={`${group.uuid}-privacy-all`}
          >
            <option value="">Select privacy level...</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="nope">Reset to current</option>
          </select>
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <div class="flex flex-col">
            <EditPrivacy
              item={group}
              bind:value={privacy.visibility}
              original={null}
              field="Visibility"
            />
          </div>
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={group}
            bind:value={privacy.list_privacy}
            original={null}
            field="Member list"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={group}
            bind:value={privacy.name_privacy}
            original={null}
            field="Name"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={group}
            bind:value={privacy.description_privacy}
            original={null}
            field="Description"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={group}
            bind:value={privacy.icon_privacy}
            original={null}
            field="Icon"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={group}
            bind:value={privacy.metadata_privacy}
            original={null}
            field="Metadata"
          />
        </li>
      </ul>
    </div>
  </div>
</div>
