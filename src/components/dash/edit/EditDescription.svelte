<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil, IconX } from "@tabler/icons-svelte"
  // @ts-ignore
  import { autoresize } from "svelte-textarea-autoresize"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"

  let {
    original,
    value = $bindable(),
    item,
  }: {
    original: string | undefined | null
    value: string | undefined
    item: Member | Group | System
  } = $props()

  let popupElement: HTMLDialogElement
</script>

<div class="flex flex-col w-full">
  <div
    class="mx-4 px-4 pt-2 pb-1 rounded-t-xl bg-base-100 w-fit font-bold flex flex-row gap-3 items-center flex-wrap"
  >
    <label for={`${item.uuid}-edit-description`} class="text-lg">Description</label>
    <button onclick={() => popupElement.showModal()} class="btn btn-primary btn-xs">Preview</button>
    <span
      title={original === value || original === null ? "" : "Edited"}
      class={original === value || original === null ? "hidden" : "text-info"}
    >
      <IconPencil size={26} />
    </span>
    <span class="font-normal text-sm">
      {value?.length ?? 0}/1000
    </span>
  </div>
  <div class="rounded-xl bg-base-100 p-4">
    <textarea
      id={`${item.uuid}-edit-description`}
      bind:value
      use:autoresize
      rows={5}
      placeholder={original}
      maxlength={1000}
      class="w-full textarea resize-none textarea-bordered placeholder:text-base-content/40"
    ></textarea>
  </div>
</div>

<dialog tabindex="-1" bind:this={popupElement} class="modal">
  <div class="modal-box w-11/12 max-w-3xl">
    <h3 class="text-lg">Description preview</h3>
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        aria-label="Close modal"
      >
        <IconX size={24} />
      </button>
    </form>
    <div class="my-2 discord-markdown border-muted border p-5 rounded-lg">
      <AwaitHtml htmlPromise={parseMarkdown(value || "", { embed: true })} />
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button tabindex="-1">close</button>
  </form>
</dialog>
