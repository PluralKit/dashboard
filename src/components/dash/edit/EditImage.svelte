<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil } from "@tabler/icons-svelte"

  let {
    original,
    value = $bindable(),
    item,
    field,
  }: {
    original: string | undefined
    value: string | undefined
    item: Member|Group|System
    field: string
  } = $props()

  let previewValue = $state(value)
</script>

<div class="flex flex-col">
  <label for={`${item.uuid}-edit-${field}`}>{field}</label>
  <div class="flex flex-row gap-2 justify-between items-center">
    <input
      id={`${item.uuid}-edit-${field}`}
      bind:value
      type="url"
      placeholder={original}
      class="flex-1 input input-bordered placeholder:text-base-content/40"
      onchange={() => previewValue = value}
    />
    {#if value}
      <div class="avatar w-12 h-12">
        <img src={previewValue} class="object-cover rounded-full" alt={`${field} preview`} />
      </div>
    {/if}
    <span title={original === value ? "" : "Edited"}>
      <IconPencil
        size={26}
        class={original === value || (!original && !value) ? "text-transparent" : "text-info"}
      />
    </span>
  </div>
</div>
