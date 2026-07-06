<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil, IconSquareRotatedFilled } from "@tabler/icons-svelte"
  import type { Snippet } from "svelte"

  let {
    default: botDefault,
    original,
    value = $bindable(),
    field,
    children,
  }: {
    default: boolean
    original: boolean | undefined
    value: boolean | undefined
    field: string
    children?: Snippet
  } = $props()
</script>

<div class="flex flex-col">
  <span class="flex flex-row gap-2 items-center mb-1">
    <span>
      <input type="checkbox" class="toggle toggle-sm align-text-bottom" bind:checked={value} />
      <label for={`${field}-edit`}>{field}</label>
      <span class="text-sm text-muted">
        ({value ? "enabled" : "disabled"})
      </span>
    </span>
    {#if original !== value}
      <span title="edited" class="ml-2">
        <IconPencil size={22} class="text-info inline" />
      </span>
    {/if}
  </span>
  {#if children}
    <p class="text-sm">
      {#if original !== botDefault}
        <span title="this option is different from the default">
          <IconSquareRotatedFilled size={20} class="text-info inline" />
        </span>
      {/if}
      {@render children()}
    </p>
  {/if}
</div>
