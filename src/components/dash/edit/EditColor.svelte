<script lang="ts">
  import type { Member } from "$api/types"
  import { IconPencil } from "@tabler/icons-svelte"
  // @ts-ignore
  import { autoresize } from "svelte-textarea-autoresize"

  let {
    original,
    value = $bindable(),
    item,
  }: {
    original: string | undefined | null
    value: string | undefined
    item: Member
  } = $props()

  function changeColor(event: Event) {
    value = (event.target as HTMLInputElement).value.replace("#", "")
  }
</script>

<div class="flex flex-col">
  <span class="flex flex-row justify-between mb-1">
    <label for={`${item.uuid}-edit-color`}>Color</label>
    {#if original !== value && original !== null}
      <span title="edited">
        <IconPencil size={26} class="text-info" />
      </span>
    {/if}
  </span>
  <div class="flex flex-row gap-2 justify-between items-center">
    <input
      id={`${item.uuid}-edit-color`}
      bind:value
      type="text"
      placeholder={original}
      class="flex-1 input input-bordered placeholder:text-base-content/40 w-full"
    />
    <input
      type="color"
      class="w-16 rounded-md p-2 input-bordered input"
      onchange={(e) => changeColor(e)}
    />
  </div>
</div>
