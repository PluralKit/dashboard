<script lang="ts">
  import type { ApiError } from "$api"
  import type { Group, GroupPrivacy, Member } from "$api/types"
  import DeleteButton from "$components/dash/edit/DeleteButton.svelte"
  import EditPrivacy from "$components/dash/edit/EditPrivacy.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import Spinny from "$components/Spinny.svelte"
  import { type DashList } from "$lib/dash/dash.svelte"
  import { createInfoEditState } from "$lib/dash/group/edit.svelte"
  import { IconX } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    mode = $bindable(),
    group: g = $bindable(),
    asPage,
    list,
  }: {
    mode: "view" | "edit"
    group: Group
    asPage: boolean
    list: DashList<Group>
    memberList: DashList<Member>
  } = $props()

  let group = $state(g)
  let editedState = $derived(createInfoEditState(group))

  let edited: Group = $derived.by(() => {
    // privacy has a $state for each privacy value
    // so loop through all of them and check if they're the same
    let privacy: GroupPrivacy | undefined = Object.fromEntries(
      Object.entries(editedState.privacy || {}).filter(([key, value]) => {
        return (
          $state.snapshot(value) !==
            $state.snapshot(group.privacy || {})[key as unknown as keyof GroupPrivacy] &&
          !(
            !$state.snapshot(value) &&
            !$state.snapshot(group.privacy || {})[key as unknown as keyof GroupPrivacy]
          )
        )
      })
    )

    if (Object.entries(privacy).length === 0) privacy = undefined

    // handle this the same way we do with members
    return Object.fromEntries(
      Object.entries({
        privacy,
      }).filter(([_, value]) => value !== undefined)
    )
  })

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  function changeAllPrivacy(event: Event) {
    const target = event.target as HTMLSelectElement
    if (target.value === "public" || target.value === "private") {
      Object.entries(editedState.privacy).forEach(
        ([key]) => (editedState.privacy[key as keyof GroupPrivacy] = target.value)
      )
    } else if (target.value) {
      Object.entries(editedState.privacy).forEach(
        ([key]) =>
          (editedState.privacy[key as keyof GroupPrivacy] = (group.privacy as GroupPrivacy)[
            key as keyof GroupPrivacy
          ])
      )
    }
  }

  async function submitEdit(token: string) {
    success = false
    err = []
    const body = edited

    if (err.length > 0) return

    const response = await window.api(`groups/${group.uuid}`, {
      token,
      method: "PATCH",
      body: body,
    })
    Object.assign(group || {}, response)
    list.process(list.list.raw)
    list.paginate()

    success = true
  }
</script>

<div class="flex flex-row items-center justify-between gap-2 mb-3">
  <h4 class="ml-3 text-2xl font-medium">Editing details</h4>
  {#if !loading}
    {#if Object.keys(edited).length > 0}
      <button
        onclick={() => (mode = "view")}
        class="btn btn-sm btn-neutral join-item"
        aria-label="Cancel edit"
      >
        <IconX /> Cancel
      </button>
    {:else}
      <button
        onclick={() => (mode = "view")}
        class="btn btn-sm btn-neutral join-item"
        aria-label="Exit edit"
      >
        <IconX /> Exit
      </button>
    {/if}
  {:else}
    <button class="btn btn-sm btn-neutral join-item" disabled>
      <Spinny /> Loading...
    </button>
  {/if}
</div>
<div class="flex flex-col gap-2 h-min lg:gap-3">
  <div class="flex flex-col flex-1 gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Privacy</h5>
    <hr />
    <ul class="flex flex-row flex-wrap">
      <li class="flex flex-col w-full px-2 py-1">
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
      <li class="w-full px-2 py-1 md:w-1/2">
        <div class="flex flex-col">
          <EditPrivacy
            item={group}
            bind:value={editedState.privacy.visibility}
            original={group.privacy?.visibility}
            field="Visibility"
          />
        </div>
      </li>
      <li class="w-full px-2 py-1 md:w-1/2">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.list_privacy}
          original={group.privacy?.list_privacy}
          field="Member list"
        />
      </li>
      <li class="w-full px-2 py-1 md:w-1/2">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.name_privacy}
          original={group.privacy?.name_privacy}
          field="Name"
        />
      </li>
      <li class="w-full px-2 py-1 md:w-1/2">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.description_privacy}
          original={group.privacy?.description_privacy}
          field="Description"
        />
      </li>
      <li class="w-full px-2 py-1 md:w-1/2">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.icon_privacy}
          original={group.privacy?.icon_privacy}
          field="Icon"
        />
      </li>
      <li class="w-full px-2 py-1 md:w-1/2">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.banner_privacy}
          original={group.privacy?.banner_privacy}
          field="Banner"
        />
      </li>
      <li class="w-full px-2 py-1 md:w-1/2">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.metadata_privacy}
          original={group.privacy?.metadata_privacy}
          field="Metadata"
        />
      </li>
    </ul>
  </div>
</div>
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
    Group successfully edited
  </div>
{/if}
<div class="flex flex-row items-center">
  <div class="mt-2 join">
    {#if !loading}
      {#if Object.keys(edited).length > 0}
        <SubmitEditButton bind:err {submitEdit} />
        <button
          onclick={() => (mode = "view")}
          class="btn btn-sm btn-neutral join-item"
          aria-label="Cancel edit"
        >
          <IconX /> Cancel
        </button>
      {:else}
        <button
          onclick={() => (mode = "view")}
          class="btn btn-sm btn-neutral join-item"
          aria-label="Exit edit"
        >
          <IconX /> Exit
        </button>
      {/if}
    {:else}
      <button onclick={() => (mode = "view")} class="btn btn-sm btn-neutral join-item" disabled>
        <Spinny /> Loading...
      </button>
    {/if}
  </div>
  <DeleteButton type="group" item={group} {asPage} {list} groupList={list} />
</div>
