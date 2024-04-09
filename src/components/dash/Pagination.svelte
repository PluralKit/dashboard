<script lang="ts">
  import { browser } from "$app/environment"
  import type { ListSettings } from "$lib/dash/settings.svelte"

  let {
    listLength,
    settings,
    class: className,
  }: {
    listLength: number
    settings: ListSettings
    class: string
  } = $props()

  let pageAmount = $derived(Math.ceil(listLength / settings.itemsPerPage))

  function jumpToPage() {
    if (browser) {
      let page = parseInt(window.prompt("Jump to the following page") || "nope")
      if (!isNaN(page)) settings.currentPage = page
    }
  }
</script>

<div class={`join ${className}`}>
  {#if pageAmount > 0}
    <button
      class={`btn btn-sm join-item ${settings.currentPage === 1 ? "btn-primary" : "btn-neutral"}`}
      onclick={() => (settings.currentPage = 1)}
    >
      1
    </button>
    {#if settings.currentPage > 3}
      <button class="btn btn-sm btn-neutral join-item" onclick={() => jumpToPage()}> ... </button>
    {/if}
    {#if settings.currentPage > 2}
      <button class="btn btn-sm btn-neutral join-item" onclick={() => (settings.currentPage -= 1)}>
        {settings.currentPage - 1}
      </button>
    {/if}
    {#if settings.currentPage > 1 && settings.currentPage < pageAmount}
      <button class="btn btn-sm join-item btn-primary">
        {settings.currentPage}
      </button>
    {/if}
    {#if settings.currentPage < pageAmount - 1 && pageAmount > 4}
      <button class="btn btn-sm btn-neutral join-item" onclick={() => (settings.currentPage += 1)}>
        {settings.currentPage + 1}
      </button>
    {/if}
    {#if settings.currentPage < pageAmount - 2 && pageAmount > 5}
      <button class="btn btn-sm btn-neutral join-item" onclick={() => jumpToPage()}> ... </button>
    {/if}
    {#if pageAmount > 1}
      <button
        class={`btn btn-sm join-item ${
          settings.currentPage === pageAmount ? "btn-primary" : "btn-neutral"
        }`}
        onclick={() => (settings.currentPage = pageAmount)}
      >
        {pageAmount}
      </button>
    {/if}
  {/if}
</div>
