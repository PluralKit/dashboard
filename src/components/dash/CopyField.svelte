<script lang="ts">
  import { IconClipboard, IconClipboardCheck } from "@tabler/icons-svelte"
  import { copyToClipboard } from "$lib/dash/utils"
  import { dash } from "$lib/dash/dash.svelte"

  let {
    value,
    field,
    class: className,
    visible = false,
  }: {
    class?: string
    field: string
    value?: string
    visible?: boolean
  } = $props()

  let copied = $state(false)

  async function copy() {
    copied = true
    copyToClipboard(value)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    copied = false
  }
</script>

{#if dash.settings.devMode || visible}
  <button
    title={`Copy ${field}`}
    onclick={() => copy()}
    aria-label={`Copy ${field}`}
    disabled={copied}
    class={`transition-all hover:scale-110 hover:bg-base-200 active:scale-110 active:bg-base-300 rounded-md ${className}`}
  >
    {#if copied}
      <IconClipboardCheck size={22} class="text-success" />
    {:else}
      <IconClipboard size={22} class="text-muted" />
    {/if}
  </button>
{/if}
