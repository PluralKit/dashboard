<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil } from "@tabler/icons-svelte"

  let {
    original,
    value = $bindable(),
    item,
    field,
    onChange,
  }: {
    original: string | undefined | null
    value: string | undefined
    item: Member | Group | System
    field: string
    onChange?: () => void
  } = $props()

  let previewValue = $state(value)
</script>

<div class="flex flex-row gap-2 justify-between items-end">
  <div class="flex flex-col flex-1">
    <span class="flex flex-row gap-2 justify-between items-center mb-1">
      <span class="flex-1 flex flex-row gap-2 justify-between items-center">
        <label for={`${item.uuid}-edit-${field}`}>{field}</label>
        <span class="text-xs">{value?.length ?? 0}/256</span>
      </span>
      {#if original !== value && original !== null}
        <span title="edited">
          <IconPencil size={26} class="text-info" />
        </span>
      {/if}
    </span>
    <input
      id={`${item.uuid}-edit-${field}`}
      bind:value
      type="url"
      placeholder={original}
      class="flex-grow input input-bordered placeholder:text-base-content/40 w-full"
      onchange={() => {
        previewValue = value
        if (onChange) onChange()
      }}
      max={256}
    />
  </div>
  <div class="avatar w-12 h-12">
    {#if previewValue}
      <img src={previewValue} class="object-cover rounded-full" alt={`${field} preview`} />
    {/if}
  </div>
</div>
