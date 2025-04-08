<script lang="ts">
  import type { Config } from "$api/types"
  import EditBoolean from "$components/dash/edit/EditBoolean.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import Spinny from "$components/Spinny.svelte"
  import { createConfigState, dash } from "$lib/dash/dash.svelte"
  import { IconSettings } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let editedState = $state(createConfigState(dash.config))
  let edited = $derived(
    Object.fromEntries(
      Object.entries(editedState).filter(([key, value]) => {
        return (
          $state.snapshot(value) !==
          $state.snapshot(dash.config ? dash.config[key as unknown as keyof Config] : undefined)
        )
      })
    )
  )

  let loading = $state(false)
  let err = $state([])
  let success = $state(false)

  async function submitEdit(token: string) {
    success = false
    err = []
    const body = edited

    if (err.length > 0) return

    const response = await window.api("systems/@me/settings", {
      token,
      method: "PATCH",
      body: body,
    })
    Object.assign(dash.config || {}, response)
    editedState = createConfigState(dash.config)
    success = true
    await new Promise((res) => setTimeout(res, 5000))
    success = false
  }
</script>

<div class="flex max-w-6xl gap-4 flex-col md:flex-row mx-auto items-start flex-wrap">
  <div class="box bg-base-100 md:max-w-sm">
    <h2 class="text-2xl font-semibold mb-1"><IconSettings class="inline" /> Config</h2>
    <p class="mb-2">
      You can edit your system's bot config settings here, as well as description templates.
    </p>
    <hr class="my-3" />
    <p class="text-sm">
      <b>Note:</b> this page is still a WIP. More config settings will be added eventually, for now just
      the dashboard relevant ones can be found here.
    </p>
    <div class="mt-auto">
      {#if err.length > 0}
        {#each err as e}
          {#if e}
            <div
              transition:fade={{ duration: 400 }}
              role="alert"
              class="mt-2 alert bg-error/20 p-3 text-sm rounded-xl"
            >
              {e}
            </div>
          {/if}
        {/each}
      {/if}
      {#if success}
        <div
          transition:fade={{ duration: 400 }}
          role="alert"
          class="mt-2 alert bg-success/20 p-3 text-sm rounded-xl"
        >
          Bot config successfully edited
        </div>
      {/if}
      <div class="flex flex-row items-center">
        <div class="mt-2 join ml-auto">
          {#if !loading}
            {#if Object.keys(edited).length > 0}
              <SubmitEditButton bind:err {submitEdit} />
            {:else}
              <SubmitEditButton disabled bind:err submitEdit={async () => {}} />
            {/if}
          {:else}
            <button class="btn btn-sm btn-neutral join-item" disabled>
              <Spinny /> Loading...
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col flex-1 gap-3">
    <div class="box bg-base-100 flex flex-col p-5 w-full">
      <h3 class="font-semibold text-lg mb-2">Bot config settings</h3>
      <div class="grid grid-rows-1 md:grid-cols-2 grid-rows-auto gap-4">
        <EditBoolean
          default={false}
          bind:value={editedState.member_default_private}
          original={dash.config?.member_default_private}
          field="Private Member"
        >
          Whether member privacy is automatically set to private for new members.
        </EditBoolean>
        <EditBoolean
          default={false}
          bind:value={editedState.group_default_private}
          original={dash.config?.group_default_private}
          field="Private Group"
        >
          Whether group privacy is automatically set to private for new groups.
        </EditBoolean>
      </div>
    </div>
  </div>
</div>
