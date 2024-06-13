<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil } from "@tabler/icons-svelte"
  // @ts-ignore
  import { autoresize } from "svelte-textarea-autoresize"

  let {
    maxLength = 100,
    original,
    value = $bindable(),
    item,
    field,
    showCount = true,
  }: {
    maxLength?: number
    showCount?: boolean
    original: string | undefined | null
    value: string | undefined
    item: Member | Group | System
    field: string
  } = $props()
</script>

<div class="flex flex-col">
  <span class="flex flex-row gap-2 justify-between items-center mb-1">
    <span class="flex-1 flex flex-row gap-2 justify-between items-center">
      <label for={`${item.uuid}-edit-${field}`}>{field}</label>
      {#if showCount}
        <span class="text-xs">{value?.length ?? 0}/{maxLength}</span>
      {/if}
    </span>
    {#if original !== value && original !== null}
      <span title="edited">
        <IconPencil size={26} class="text-info" />
      </span>
    {/if}
  </span>
  <textarea
    id={`${item.uuid}-edit-${field}`}
    bind:value
    use:autoresize
    placeholder={original}
    class="w-full textarea resize-none textarea-bordered placeholder:text-base-content/40"
    max={maxLength}
  ></textarea>
</div>
