<script lang="ts">
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

<button onclick={() => (mode = "edit")} class={`btn btn-sm p-2 ${className} btn-${color}`}>
  <IconEdit class="inline" size={18} /> Edit
</button>
