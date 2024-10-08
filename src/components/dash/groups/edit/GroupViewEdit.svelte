<script lang="ts">
  import type { Group, Member } from "$api/types"
  import DeleteButton from "$components/dash/edit/DeleteButton.svelte"
  import DuplicateName from "$components/dash/edit/DuplicateName.svelte"
  import EditColor from "$components/dash/edit/EditColor.svelte"
  import EditDescription from "$components/dash/edit/EditDescription.svelte"
  import EditField from "$components/dash/edit/EditField.svelte"
  import EditImage from "$components/dash/edit/EditImage.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import Spinny from "$components/Spinny.svelte"
  import { type DashList } from "$lib/dash/dash.svelte"
  import { createViewEditState } from "$lib/dash/group/edit.svelte"
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

  let editedState: Group = $derived(createViewEditState(group))

  let edited = $derived(
    Object.fromEntries(
      Object.entries(editedState).filter(([key, value]) => {
        return (
          value !== $state.snapshot(group)[key as unknown as keyof Group] &&
          !(!value && !$state.snapshot(group)[key as unknown as keyof Group])
        )
      })
    )
  )

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  let duplicate = $derived(
    list.list.raw
      .filter((g) => g.name?.toLowerCase() === editedState.name?.toLowerCase())
      .find((g) => g.name !== group.name)
  )
</script>

<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing group</h4>
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
    <button onclick={() => (mode = "view")} class="btn btn-sm btn-neutral join-item" disabled>
      <Spinny /> Loading...
    </button>
  {/if}
</div>
<div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Names</h5>
    <hr />
    <EditField item={group} original={group.name} bind:value={editedState.name} field="Name" />
    <EditField
      item={group}
      original={group.display_name}
      bind:value={editedState.display_name}
      field="Display name"
    />
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Information</h5>
    <hr />
    <EditColor item={group} original={group.color} bind:value={editedState.color} />
  </div>
  <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Images</h5>
    <hr />
    <EditImage item={group} original={group.icon} bind:value={editedState.icon} field="Avatar" />
    <EditImage
      item={group}
      original={group.banner}
      bind:value={editedState.banner}
      field="Banner"
    />
  </div>
  <EditDescription item={group} bind:value={editedState.description} original={group.description} />
</div>
{#if duplicate}
  <DuplicateName type="group" {duplicate} />
{/if}
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
          {memberList}
          groupList={list}
          options={{
            item: group,
            body: edited,
            list,
          }}
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
