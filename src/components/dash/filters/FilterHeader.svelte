<script lang="ts">
  import { IconTrash } from "@tabler/icons-svelte"
  import type { Snippet } from "svelte"

  let {
    children,
    action,
  }: {
    children: Snippet
    action: void
  } = $props()
</script>

<div class="flex flex-row justify-between align-center">
  <div class="mr-2">
    {@render children()}
  </div>
  <button class="text-error" onclick={() => action}>
    <IconTrash />
  </button>
</div>
