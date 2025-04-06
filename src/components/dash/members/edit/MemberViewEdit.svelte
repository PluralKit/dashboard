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
  import { validateViewEdit } from "$lib/dash/edit"
  import { createViewEditState } from "$lib/dash/member/edit.svelte"
  import { IconX } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    mode = $bindable(),
    member,
    asPage,
    list,
    groupList,
  }: {
    mode: "view" | "edit"
    member: Member
    asPage: boolean
    list: DashList<Member>
    groupList: DashList<Group>
  } = $props()

  let editedState: Member = $derived(createViewEditState(member))

  let edited = $derived(
    Object.fromEntries(
      Object.entries(editedState).filter(([key, value]) => {
        return (
          value !== $state.snapshot(member)[key as unknown as keyof Member] &&
          !(!value && !$state.snapshot(member)[key as unknown as keyof Member])
        )
      })
    )
  )

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  let duplicate = $derived(
    list.list.raw
      .filter((m) => m.name?.toLowerCase() === editedState.name?.toLowerCase())
      .find((m) => m.name !== member.name)
  )

  async function submitEdit(token: string) {
    success = false
    err = []
    const body = validateViewEdit(edited, err)

    if (err.length > 0) return

    const response = await window.api(`members/${member.uuid}`, {
      token,
      method: "PATCH",
      body: body,
    })
    Object.assign(member || {}, response)
    list.process(groupList.list.raw)
    list.paginate()

    success = true
  }
</script>

<div class="flex flex-row items-center justify-between gap-2 mb-3">
  <h4 class="ml-3 text-2xl font-medium">Editing member</h4>
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
<div class="flex flex-col flex-wrap gap-2 h-min md:flex-row lg:gap-3">
  <div class="flex flex-col flex-1 gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Names</h5>
    <hr />
    <EditField item={member} original={member.name} bind:value={editedState.name} field="Name" />
    <EditField
      item={member}
      original={member.display_name}
      bind:value={editedState.display_name}
      field="Display name"
    />
  </div>
  <div class="flex flex-col flex-1 gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Information</h5>
    <hr />
    <EditField
      item={member}
      original={member.pronouns}
      bind:value={editedState.pronouns}
      field="Pronouns"
    />
    <EditField
      item={member}
      original={member.birthday}
      showCount={false}
      bind:value={editedState.birthday}
      field="Birthday"
    />
    <EditColor item={member} original={member.color} bind:value={editedState.color} />
  </div>
  <div class="flex flex-col w-full gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Images</h5>
    <hr />
    <EditImage
      item={member}
      original={member.avatar_url}
      bind:value={editedState.avatar_url}
      field="Avatar"
    />
    <EditImage
      item={member}
      original={member.webhook_avatar_url}
      bind:value={editedState.webhook_avatar_url}
      field="Proxy avatar"
    />
    <EditImage
      item={member}
      original={member.banner}
      bind:value={editedState.banner}
      field="Banner"
    />
  </div>
  <EditDescription
    item={member}
    bind:value={editedState.description}
    original={member.description}
  />
</div>
{#if duplicate}
  <DuplicateName type="member" {duplicate} />
{/if}
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
    Member successfully edited
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
  <DeleteButton type="member" item={member} {asPage} {list} {groupList} />
</div>
