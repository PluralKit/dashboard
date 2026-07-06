<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil } from "@tabler/icons-svelte"

  let {
    original,
    value = $bindable(),
    item,
    field,
  }: {
    original: string | undefined | null
    value: string | undefined
    item: Member | Group | System
    field: string
  } = $props()
</script>

<div class="flex flex-col">
  <span class="flex flex-row gap-2 justify-between items-center mb-1">
    <span class="flex-1 flex flex-row gap-2 justify-between items-center">
      <label for={`${item.uuid}-privacy-${field}`}>{field}</label>
    </span>
    {#if original !== value && original !== null}
      <span title="edited">
        <IconPencil size={26} class="text-info" />
      </span>
    {/if}
  </span>
  <select bind:value class="input input-sm input-bordered">
    <option value="public">Public</option>
    <option value="private">Private</option>
  </select>
</div>
