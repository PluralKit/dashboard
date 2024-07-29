<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { IconEdit } from "@tabler/icons-svelte"

  let {
    mode = $bindable(),
    class: className,
    color = "primary",
  }: {
    mode: "view" | "edit"
    color?: "primary" | "neutral"
    class?: string
  } = $props()
</script>

{#if dash.privacyMode === PrivacyMode.PRIVATE}
  <button onclick={() => (mode = "edit")} class={`btn btn-sm p-2 ${className} btn-${color}`}>
    <IconEdit class="inline" size={18} /> Edit
  </button>
{/if}
