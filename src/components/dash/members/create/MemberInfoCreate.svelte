<script lang="ts">
  import type { Member, MemberPrivacy, proxytag } from "$api/types"
  import EditPrivacy from "$components/dash/edit/EditPrivacy.svelte"
  import EditProxyTag from "$components/dash/edit/EditProxyTag.svelte"
  import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-svelte"

  let {
    tab,
    member = $bindable(),
    privacy = $bindable(),
  }: {
    tab: "view" | "info" | "groups"
    member: Member & {
      privacy: MemberPrivacy
      proxy_tags: proxytag[]
    }
    privacy: MemberPrivacy
  } = $props()

  // we can't bind to the proxy tags directly
  // so we'll have to replace the whole array on edit
  function editProxyTag(event: Event, index: number, placement: "suffix" | "prefix") {
    const target = event.target as HTMLInputElement
    let tags = [...member.proxy_tags]

    tags.splice(index, 1, {
      prefix: placement === "prefix" ? target.value : member.proxy_tags[index].prefix,
      suffix: placement === "suffix" ? target.value : member.proxy_tags[index].suffix,
    })

    member.proxy_tags = tags
  }

  function changeAllPrivacy(event: Event) {
    const target = event.target as HTMLSelectElement
    if (target.value === "public" || target.value === "private") {
      Object.entries(privacy).forEach(
        ([key]) => (privacy[key as keyof MemberPrivacy] = target.value)
      )
    } else if (target.value) {
      Object.entries(privacy).forEach(
        ([key]) =>
          (privacy[key as keyof MemberPrivacy] = (privacy as MemberPrivacy)[
            key as keyof MemberPrivacy
          ])
      )
    }
  }
</script>

<div style={tab !== "info" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Member details</h4>
  </div>
  <div class="flex flex-col h-min gap-2 lg:gap-3">
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <div class="flex flex-row gap-3 items-center">
        <h5 class="text-lg">Proxy Tags</h5>
      </div>
      <hr />
      <div class="flex flex-col md:flex-row w-full flex-wrap">
        {#each member.proxy_tags as tag, index}
          <EditProxyTag {index} {tag} {editProxyTag} />
        {/each}
        <button
          class="btn btn-sm btn-success mx-2 my-1"
          onclick={() => {
            member.proxy_tags.push({
              prefix: "",
              suffix: "",
            })
          }}
        >
          <IconPlus size={20} /> Add proxy tag
        </button>
      </div>
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Privacy</h5>
      <hr />
      <ul class="flex flex-row flex-wrap">
        <li class="w-full px-2 py-1 flex flex-col">
          <label class="mb-1" for={`create-member-privacy-all`}>Set all to</label>
          <select
            class="input input-bordered input-sm"
            onchange={(e) => changeAllPrivacy(e)}
            id={`create-member-privacy-all`}
          >
            <option value="">Select privacy level...</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <div class="flex flex-col">
            <EditPrivacy
              item={member}
              bind:value={privacy.visibility}
              original={null}
              field="Visibility"
            />
          </div>
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.name_privacy}
            original={null}
            field="Name"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.description_privacy}
            original={null}
            field="Description"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.avatar_privacy}
            original={null}
            field="Avatar"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.pronoun_privacy}
            original={null}
            field="Pronouns"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.birthday_privacy}
            original={null}
            field="Birthday"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.proxy_privacy}
            original={null}
            field="Proxy tags"
          />
        </li>
        <li class="w-full md:w-1/2 px-2 py-1">
          <EditPrivacy
            item={member}
            bind:value={privacy.metadata_privacy}
            original={null}
            field="Metadata"
          />
        </li>
      </ul>
    </div>
  </div>
</div>
