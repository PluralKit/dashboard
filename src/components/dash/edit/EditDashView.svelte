<script lang="ts">
  import type { Config, DashView } from "$api/types"
  import { createConfigState } from "$lib/dash/dash.svelte"
  import {
    IconShare2,
    IconTrash,
  } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    config = $bindable(),
    editedState = $bindable(),
    view,
  }: {
    view: DashView
    editedState: any
    config: Config
  } = $props()

  let element: HTMLDialogElement
  let saving = $state(false)
  let err = $state()

  async function submitDelete() {
    const token = localStorage.getItem("pk-token")

    if (!token) {
      err = "No token found in browser storage."
      return
    }

    saving = true

    try {
      await window.api<DashView>("private/dash_views", {
        method: "POST",
        token,
        body: {
          action: "remove",
          id: view.id
        }
      })

      saving = false
      element.close()

      if (config.dash_views) {
        config.dash_views.splice(config.dash_views.indexOf(view), 1)
      }
      editedState = createConfigState(JSON.parse(JSON.stringify(config)))

    } catch (e) {
      err = (e as Error).message
    }
  }
</script>

<div class="flex flex-row gap-3 items-center p-2 bg-base-200 rounded-xl">
  <a
    class="link-info"
    href={`/view/${view.id}`}
    target="_blank"
    title={`Go to view (${view.name})`}
  >
    <IconShare2 size={26} />
  </a>
  <div class="text-lg flex-1">{view.name}</div>
  <button onclick={() => element.showModal()} class="btn btn-sm btn-ghost" title="Delete View">
    <IconTrash class="inline link-error" size={26} />
  </button>
</div>

<dialog bind:this={element} class="modal">
  <div class="max-w-xl modal-box">
    <form method="dialog">
      <button class="absolute text-lg btn btn-circle btn-ghost right-2 top-2">✕</button>
    </form>
    <h3 class="text-xl">Delete Dashboard View (<b>{view.name}</b>)</h3>
    <p class="my-2 mb-3">Are you sure you want to delete this view?</p>
    {#if err}
      <div transition:fade={{ duration: 400 }} role="alert" class="my-2 alert bg-error/20">
        {err}
      </div>
    {/if}
    <div class="flex flex-col md:flex-row mt-3">
      <button
        class="btn btn-sm btn-error mt-1 md:mt-0 md:ml-auto"
        disabled={saving}
        onclick={() => submitDelete()}
      >
        <IconTrash /> Yes, delete
      </button>
    </div>
  </div>
</dialog>
