<script lang="ts">
  import type { System } from "$api/types"
  import EditColor from "$components/dash/edit/EditColor.svelte"
  import EditDescription from "$components/dash/edit/EditDescription.svelte"
  import EditField from "$components/dash/edit/EditField.svelte"
  import EditImage from "$components/dash/edit/EditImage.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import Spinny from "$components/Spinny.svelte"
  import { validateViewEdit } from "$lib/dash/edit"
  import { createViewEditState } from "$lib/dash/system/edit.svelte"
  import { IconX } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    mode = $bindable(),
    system,
  }: {
    mode: "view" | "edit"
    system: System
  } = $props()

  let editedState: System = $derived(createViewEditState(system))

  let edited = $derived(
    Object.fromEntries(
      Object.entries(editedState).filter(([key, value]) => {
        return (
          value !== $state.snapshot(system)[key as unknown as keyof System] &&
          !(!value && !$state.snapshot(system)[key as unknown as keyof System])
        )
      })
    )
  )

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  async function submitEdit(token: string) {
    success = false
    err = []
    const body = validateViewEdit(edited, err)

    if (err.length > 0) return

    const response = await window.api(`systems/@me`, {
      token,
      method: "PATCH",
      body: body,
    })
    Object.assign(system || {}, response)

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
    <EditField item={system} original={system.name} bind:value={editedState.name} field="Name" />
    <EditField item={system} original={system.tag} bind:value={editedState.tag} field="Tag" />
  </div>
  <div class="flex flex-col flex-1 gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Information</h5>
    <hr />
    <EditField
      item={system}
      original={system.pronouns}
      bind:value={editedState.pronouns}
      field="Pronouns"
    />
    <EditColor item={system} original={system.color} bind:value={editedState.color} />
  </div>
  <div class="flex flex-col w-full gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Images</h5>
    <hr />
    <EditImage
      item={system}
      original={system.avatar_url}
      bind:value={editedState.avatar_url}
      field="Avatar"
    />
    <EditImage
      item={system}
      original={system.banner}
      bind:value={editedState.banner}
      field="Banner"
    />
  </div>
  <EditDescription
    item={system}
    bind:value={editedState.description}
    original={system.description}
  />
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
    System successfully edited
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
</div>
