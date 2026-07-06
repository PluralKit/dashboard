<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { IconPencil, IconX } from "@tabler/icons-svelte"
  // @ts-ignore
  import { autoresize } from "svelte-textarea-autoresize"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import { dash } from "$lib/dash/dash.svelte"

  let {
    original,
    value = $bindable(),
    item,
    index,
    title,
    showTemplates = true,
  }: {
    original: string | undefined | null
    value: string | undefined
    item?: Member | Group | System
    index?: number
    title?: string
    showTemplates?: boolean
  } = $props()

  let popupElement: HTMLDialogElement

  let templatesVisible =
    showTemplates &&
    dash.config?.description_templates &&
    dash.config?.description_templates.length > 0

  function insertTemplate(index: number) {
    value = dash.config?.description_templates[index]
  }
</script>

<div class="flex flex-col w-full">
  <div
    class="flex flex-row flex-wrap items-center gap-3 px-4 pt-2 pb-1 mx-4 font-bold rounded-t-xl bg-base-100 w-fit"
  >
    <label for={`${item?.uuid ?? index ?? ""}-edit-description`} class="text-lg"
      >{title ?? "Description"}</label
    >
    <button onclick={() => popupElement.showModal()} class="btn btn-primary btn-xs">Preview</button>
    <span
      title={original === value || original === null ? "" : "Edited"}
      class={original === value || original === null ? "hidden" : "text-info"}
    >
      <IconPencil size={26} />
    </span>
    <span class="text-sm font-normal">
      {value?.length ?? 0}/1000
    </span>
  </div>
  <div class={`p-4 rounded-xl bg-base-100 flex flex-col gap-2 ${templatesVisible ? "pt-2" : ""}`}>
    {#if templatesVisible}
      <ol class="flex flex-row gap-2 items-center">
        {#each dash.config?.description_templates ?? [] as template, i}
          <li>
            <button class="btn btn-xs btn-neutral" onclick={() => insertTemplate(i)}
              >Template {i + 1}</button
            >
          </li>
        {/each}
      </ol>
    {/if}
    <textarea
      id={`${item?.uuid ?? index ?? ""}-edit-description`}
      bind:value
      use:autoresize
      rows={5}
      placeholder={original}
      maxlength={1000}
      class="w-full resize-none textarea textarea-bordered placeholder:text-base-content/40"
    ></textarea>
  </div>
</div>

<dialog bind:this={popupElement} class="modal">
  <div class="w-11/12 max-w-3xl modal-box">
    <h3 class="text-lg">{title ?? "Description"} preview</h3>
    <form method="dialog">
      <button
        class="absolute btn btn-sm btn-circle btn-ghost right-4 top-4"
        aria-label="Close modal"
      >
        <IconX size={24} />
      </button>
    </form>
    <div class="p-5 my-2 border rounded-lg discord-markdown border-muted">
      <AwaitHtml htmlPromise={parseMarkdown(value || "", { embed: true })} />
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
