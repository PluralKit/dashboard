<script lang="ts">
  import type { System, SystemPrivacy } from "$api/types"
  import EditPrivacy from "$components/dash/edit/EditPrivacy.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import Spinny from "$components/Spinny.svelte"
  import { createInfoEditState } from "$lib/dash/system/edit.svelte"
  import { IconX } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    mode = $bindable(),
    system,
  }: {
    mode: "view" | "edit"
    system: System
  } = $props()

  let editedState = $derived(createInfoEditState(system))

  let edited: System = $derived.by(() => {
    // privacy has a $state for each privacy value
    // so loop through all of them and check if they're the same
    let privacy: SystemPrivacy | undefined = Object.fromEntries(
      Object.entries(editedState.privacy || {}).filter(([key, value]) => {
        return (
          $state.snapshot(value) !==
            $state.snapshot(system.privacy || {})[key as unknown as keyof SystemPrivacy] &&
          !(
            !$state.snapshot(value) &&
            !$state.snapshot(system.privacy || {})[key as unknown as keyof SystemPrivacy]
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
        ([key]) => (editedState.privacy[key as keyof SystemPrivacy] = target.value)
      )
    } else if (target.value) {
      Object.entries(editedState.privacy).forEach(
        ([key]) =>
          (editedState.privacy[key as keyof SystemPrivacy] = (system.privacy as SystemPrivacy)[
            key as keyof SystemPrivacy
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
        <label class="mb-1" for={`${system.uuid}-privacy-all`}>Set all to</label>
        <select
          class="input input-bordered input-sm"
          onchange={(e) => changeAllPrivacy(e)}
          id={`${system.uuid}-privacy-all`}
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
            item={system}
            bind:value={editedState.privacy.member_list_privacy}
            original={system.privacy?.member_list_privacy}
            field="Member list"
          />
        </div>
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.group_list_privacy}
          original={system.privacy?.group_list_privacy}
          field="Group list"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.name_privacy}
          original={system.privacy?.name_privacy}
          field="Name"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.description_privacy}
          original={system.privacy?.description_privacy}
          field="Description"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.avatar_privacy}
          original={system.privacy?.avatar_privacy}
          field="Avatar"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.pronoun_privacy}
          original={system.privacy?.pronoun_privacy}
          field="Pronouns"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.front_privacy}
          original={system.privacy?.front_privacy}
          field="Current front"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={system}
          bind:value={editedState.privacy.front_history_privacy}
          original={system.privacy?.front_history_privacy}
          field="Front history"
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
    System successfully edited
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
            system,
            body: edited,
          }}
          path={`systems/@me`}
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
</div>
