<script lang="ts">
  import { IconX } from "@tabler/icons-svelte"

  let { mode = $bindable() }:
  {
    mode: "view"|"edit"
  } = $props()
</script>

<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing system</h4>
    <button
      onclick={() => (mode = "view")}
      class="btn btn-sm btn-neutral join-item"
      aria-label="Exit edit"
    >
      <IconX /> Exit
    </button>
</div>
<div class="flex flex-col h-min gap-2 lg:gap-3">
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    ooo editing
  </div>
</div>