<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { Base64 } from "js-base64"
  import { IconDeviceFloppy, IconInfoCircle } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"
  import type { DashView } from "$api/types"

  let {
    tab,
  }: {
    tab: string
  } = $props()

  let viewUrl = $derived(
    Base64.encodeURI(
      JSON.stringify({
        system: dash.system.id,
        public: dash.privacyMode !== PrivacyMode.PRIVATE,
        tab,
        m: [dash.members.filters, dash.members.sorts, dash.members.settings.view.type],
        g: [dash.groups.filters, dash.groups.sorts, dash.groups.settings.view.type],
      })
    )
  )
  let name = $state("")
  let id: string|undefined = $state("")
  let err = $state("")
  let success = $state(false)
  let saved = $state(false)

  async function save() {
    success = false
    err = ""

    if (!name) {
      err = "A view name is required."
      return
    }

    const token = localStorage.getItem("pk-token")
    if (!token) {
      err = "No token found in browser storage"
      return
    }

    try {
      const resp = await window.api<DashView>("private/dash_views", {
        method: "POST",
        token,
        body: {
          action: "add",
          name: name,
          value: viewUrl
        }
      })

      id = resp?.id
      name = resp?.name ?? name
      success = true
      err = ""
    } catch (e) {
      console.error(e)
      err = (e as Error).message
    }
    saved = true
    await new Promise((resolve) => setTimeout(resolve, 3000))
    saved = false
  }
</script>

<div class="box bg-base-100 h-min mt-4">
  <div class="text-sm">
    {#if err}
      <div transition:fade={{ duration: 400 }} role="alert" class="my-2 alert bg-error/20">
        {err}
      </div>
    {/if}
    {#if success}
      <div transition:fade={{ duration: 400 }} role="alert" class="my-2 alert bg-success/20 flex-col">
        <span>View successfully saved! You can use the following link to access it:
        <a class="link-primary" href={`/view/${id}`}>{`${window.location.host}/view/${id}`}</a></span>
      </div>
    {/if}
    <div class="flex flex-row gap-2 items-center w-full">
      <input
        id={`${dash.system.uuid}-view-name`}
        type="text"
        class="input input-bordered input-sm flex-1"
        bind:value={name}
        placeholder="View name..."
      />
      <button
        title="Save dashboard view"
        onclick={() => save()}
        disabled={saved}
        class={`transition-all hover:scale-110 hover:bg-base-200 active:scale-110 active:bg-base-300 rounded-md`}
      >
        {#if saved}
          <IconDeviceFloppy size={22} class="text-success" />
        {:else}
          <IconDeviceFloppy size={22} class="text-muted" />
        {/if}
      </button>
    </div>
    <span class="text-muted text-sm block mt-2"
      ><IconInfoCircle class="inline" /> Save your current dashboard view to your
      <a class="link-primary" href={`/dash/${dash.system.id}/config`}>system settings</a>, including
      filters.</span
    >
  </div>
</div>
