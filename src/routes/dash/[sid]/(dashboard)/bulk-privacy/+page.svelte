<script lang="ts">
  import EditPrivacy from "$components/dash/edit/EditPrivacy.svelte"
  import type { GroupPrivacy, MemberPrivacy } from "$api/types"
  import { IconAlertTriangle, IconUsers } from "@tabler/icons-svelte"
  import { dash } from "$lib/dash/dash.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import Spinny from "$components/Spinny.svelte"
  import { fade } from "svelte/transition"

  let success = $state(false)
  let loading = $state(false)
  let err = $state([])

  const memberPrivacy: { [P in keyof MemberPrivacy]-?: string }  = $state({
		description_privacy: "no change",
		name_privacy: "no change",
		avatar_privacy: "no change",
		birthday_privacy: "no change",
		pronoun_privacy: "no change",
		visibility: "no change",
		metadata_privacy: "no change",
		proxy_privacy: "no change",
    banner_privacy: "no change",
    alias_privacy: "no change",
  })

  const groupPrivacy: { [P in keyof GroupPrivacy]-?: string } = $state({
    description_privacy:  "no change",
    name_privacy: "no change",
    list_privacy: "no change",
    icon_privacy: "no change",
    visibility: "no change",
    metadata_privacy: "no change",
    banner_privacy: "no change",
  })

  function changeAllMemberPrivacy(event: Event) {
    const target = event.target as HTMLSelectElement
    if (target.value === "public" || target.value === "private") {
      Object.entries(memberPrivacy).forEach(
        ([key]) => (memberPrivacy[key as keyof MemberPrivacy] = target.value)
      )
    } else if (target.value) {
      Object.entries(memberPrivacy).forEach(
        ([key]) =>
          memberPrivacy[key as keyof MemberPrivacy] = target.value
      )
    }
  }

  async function submitMember(token: string) {
    loading = true
    success = false
    err = []
    const body = Object.fromEntries(Object.entries(memberPrivacy).filter(([_, value]) => value !== "no change"))

    await window.api(`private/bulk_privacy/member`, {
      token,
      method: "POST",
      body: body,
    })

    success = true
    loading = false
    await setTimeout(() => success = false, 5000)
  }
</script>

<div class="flex flex-col flex-1 w-full p-6 px-2 mx-auto bg-base-200 sm:px-4 lg:px-6 xl:px-8">
  <div class="flex flex-col gap-8 mx-auto w-full max-w-4xl">
    <div class="box bg-base-100 h-min">
      <div class="flex flex-col-reverse sm:flex-row sm:justify-between">
        <span class="mt-2 sm:mt-0">
          <h2 class="text-xl flex-1">
            <IconUsers class="inline mr-2" /> Bulk Member Privacy
          </h2>
        </span>
      </div>
      <hr class="mt-4"/>
      <p class="my-4">You can change the privacy settings for <b>all</b> your members at once here.</p>
      <ul class="flex flex-row flex-wrap">
        <li class="flex flex-col w-full px-2 py-1">
          <label class="mb-1" for={`bulk-member-privacy-all`}>Set all to</label>
          <select
            class="input input-bordered input-sm"
            onchange={(e) => changeAllMemberPrivacy(e)}
            id={`bulk-member-privacy-all`}
          >
            <option value="">Select privacy level...</option>
            <option value="no change">No change</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <div class="flex flex-col">
            <EditPrivacy
              item={dash.system}
              bind:value={memberPrivacy.visibility}
              original="no change"
              field="Visibility"
              bulk={true}
            />
          </div>
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            bulk={true}
            item={dash.system}
            bind:value={memberPrivacy.name_privacy}
            original="no change"
            field="Name"
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            bulk={true}
            item={dash.system}
            bind:value={memberPrivacy.description_privacy}
            original="no change"
            field="Description"
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            bulk={true}
            item={dash.system}
            bind:value={memberPrivacy.avatar_privacy}
            original="no change"
            field="Avatar"
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            item={dash.system}
            bind:value={memberPrivacy.banner_privacy}
            original="no change"
            field="Banner"
            bulk={true}
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            item={dash.system}
            bind:value={memberPrivacy.pronoun_privacy}
            original="no change"
            field="Pronouns"
            bulk={true}
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            item={dash.system}
            bind:value={memberPrivacy.birthday_privacy}
            original="no change"
            field="Birthday"
            bulk={true}
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            item={dash.system}
            bind:value={memberPrivacy.proxy_privacy}
            original="no change"
            field="Proxy tags"
            bulk={true}
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            item={dash.system}
            bind:value={memberPrivacy.alias_privacy}
            original="no change"
            field="Aliases"
            bulk={true}
          />
        </li>
        <li class="w-full px-2 py-1 md:w-1/2">
          <EditPrivacy
            item={dash.system}
            bind:value={memberPrivacy.metadata_privacy}
            original="no change"
            field="Metadata"
            bulk={true}
          />
        </li>
      </ul>
      <div class="px-2 my-2">
        {#if err.length > 0}
          {#each err as e}
            {#if e}
              <div transition:fade={{ duration: 400 }} role="alert" class="mt-2 alert bg-error/20">
                {e}
              </div>
            {/if}
          {/each}
        {/if}
        {#if success}
          <div transition:fade={{ duration: 400 }} role="alert" class="mt-2 alert bg-success/20">
            Bulk member privacy successfully edited.
          </div>
        {/if}
        <div class="flex flex-row items-center">
          <div class="mt-2 join">
            {#if !loading}
              <SubmitEditButton bind:loading bind:err submitEdit={submitMember} />
            {:else}
              <button class="btn btn-sm btn-neutral join-item" disabled>
                <Spinny /> Loading...
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="alert bg-info/10 mb-4 w-full mx-auto">
      <IconAlertTriangle class="text-info" /> Bulk group privacy is being worked on. Use the main dash for now!
    </div>
  </div>
</div>