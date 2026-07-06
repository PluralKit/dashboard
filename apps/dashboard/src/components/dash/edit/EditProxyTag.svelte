<script lang="ts">
  import type { proxytag } from "$api/types"
  import { IconTrash } from "@tabler/icons-svelte"

  let {
    editProxyTag,
    index,
    tag,
    editedState,
  }: {
    editProxyTag: (event: Event, index: number, placement: "suffix" | "prefix") => void
    index: number
    tag: proxytag
    editedState?: any
  } = $props()
</script>

<ul class="flex flex-col w-full md:w-1/2 px-2 py-1">
  <li class="join w-full">
    <input
      class="input input-bordered input-sm join-item w-full"
      onchange={(e) => editProxyTag(e, index, "prefix")}
      value={tag.prefix}
    />
    <div class="bg-base-300 join-item text-sm p-1 border border-base-content/20 px-4">text</div>
    <input
      class="input input-bordered input-sm join-item w-full"
      onchange={(e) => editProxyTag(e, index, "suffix")}
      value={tag.suffix}
    />
    <button
      class="btn btn-sm btn-error join-item px-1"
      title="Remove proxy tag"
      onclick={() => {
        if (editedState) editedState.proxy_tags.splice(index, 1)
      }}
    >
      <IconTrash />
    </button>
  </li>
</ul>
