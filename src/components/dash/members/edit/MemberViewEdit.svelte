<script lang="ts">
  import type { Member } from "$api/types"
  import EditDescription from "$components/dash/edit/EditDescription.svelte"
  import EditField from "$components/dash/edit/EditField.svelte"
  import EditImage from "$components/dash/edit/EditImage.svelte"
  import { createViewEditState, submitMemberSave } from "$lib/dash/member/edit.svelte"
  import { IconDeviceFloppy, IconLoader, IconTrash, IconX } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    mode = $bindable(),
    member,
    asPage,
  }: {
    mode: "view" | "edit"
    member: Member
    asPage: boolean
  } = $props()

  let editedState: Member = createViewEditState(member)

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

  let err: string | undefined = $state("")
  let success = $state(false)
  let loading = $state(false)

  
</script>

<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing member</h4>
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
      <IconLoader /> Loading...
    </button>
  {/if}
</div>
<div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Names</h5>
    <hr />
    <EditField {member} original={member.name} bind:value={editedState.name} field="Name" />
    <EditField
      {member}
      original={member.display_name}
      bind:value={editedState.display_name}
      field="Display name"
    />
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Information</h5>
    <hr />
    <EditField
      {member}
      original={member.pronouns}
      bind:value={editedState.pronouns}
      field="Pronouns"
    />
    <EditField
      {member}
      original={member.birthday}
      bind:value={editedState.birthday}
      field="Birthday"
    />
  </div>
  <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Images</h5>
    <hr />
    <EditImage
      {member}
      original={member.avatar_url}
      bind:value={editedState.avatar_url}
      field="Avatar"
    />
    <EditImage
      {member}
      original={member.webhook_avatar_url}
      bind:value={editedState.webhook_avatar_url}
      field="Proxy avatar"
    />
    <EditImage
      {member}
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
{#if err}
  <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-error/20 mt-2">
    {err}
  </div>
{/if}
{#if success}
  <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-success/20 mt-2">
    Member successfully edited
  </div>
{/if}
<div class="flex flex-row items-center">
  <div class="join mt-2">
    {#if !loading}
      {#if Object.keys(edited).length > 0}
        <button onclick={() => submitMemberSave(edited, `members/${member.uuid}`, {
          asPage, loading, success, err
        })} class="btn btn-sm btn-success join-item">
          <IconDeviceFloppy /> Save
        </button>
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
        <IconLoader /> Loading...
      </button>
    {/if}
  </div>
  <button class="btn btn-sm btn-error mt-2 ml-auto">
    <IconTrash /> Delete
  </button>
</div>
