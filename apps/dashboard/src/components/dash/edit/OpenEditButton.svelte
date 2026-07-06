<script lang="ts">
  import { PrivacyMode } from "$lib/dash/dash.svelte"
  import { IconEdit } from "@tabler/icons-svelte"

  let {
    mode = $bindable(),
    class: className,
    color = "primary",
    privacyMode,
  }: {
    mode: "view" | "edit"
    color?: "primary" | "neutral"
    class?: string
    privacyMode: PrivacyMode
  } = $props()
</script>

{#if privacyMode === PrivacyMode.PRIVATE}
  <button onclick={() => (mode = "edit")} class={`btn btn-sm p-2 ${className} btn-${color}`}>
    <IconEdit class="inline" size={18} /> Edit
  </button>
{/if}
