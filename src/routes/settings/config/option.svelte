<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil } from "@tabler/icons-svelte"

  let {
    original,
    value = $bindable(),
    description,
    field,
    htmlContent,
  }: {
    original: string | undefined | null
    value: string | undefined
    description: string
    field: string
    htmlContent: string
  } = $props()
</script>

<div class="flex flex-col">
  <span class="flex flex-row gap-2 justify-between items-center mb-1">
    <span class="flex-1 flex flex-row gap-2 justify-between items-center">
      <label for={`${field}`}><code>{field}</code>: <b>{description}</b></label>
      {#if original !== value && original !== null}
        <span title="edited">
          <IconPencil size={26} class="text-info" />
        </span>
      {/if}
    </span>
  </span>
  <slot></slot>
</div>
