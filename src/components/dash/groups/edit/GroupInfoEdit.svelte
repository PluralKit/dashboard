<script lang="ts">
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
    group,
    asPage,
    list,
    memberList,
  }: {
    mode: "view" | "edit"
    group: Group
    asPage: boolean
    list: DashList<Group>
    memberList: DashList<Member>
  } = $props()

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
</script>

<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing details</h4>
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
            bind:value={editedState.privacy.visibility}
            original={group.privacy?.visibility}
            field="Visibility"
          />
        </div>
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.list_privacy}
          original={group.privacy?.list_privacy}
          field="Member list"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.name_privacy}
          original={group.privacy?.name_privacy}
          field="Name"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.description_privacy}
          original={group.privacy?.description_privacy}
          field="Description"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={group}
          bind:value={editedState.privacy.icon_privacy}
          original={group.privacy?.icon_privacy}
          field="Icon"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
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
      <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-error/20 mt-2">
        {e}
      </div>
    {/if}
  {/each}
{/if}
{#if success}
  <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-success/20 mt-2">
    Group successfully edited
  </div>
{/if}
<div class="flex flex-row items-center">
  <div class="join mt-2">
    {#if !loading}
      {#if Object.keys(edited).length > 0}
        <SubmitEditButton
          bind:loading
          bind:err
          bind:success
          options={{
            item: group,
            body: edited,
            list,
          }}
          {memberList}
          groupList={list}
          path={`groups/${group.uuid}`}
        />
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
