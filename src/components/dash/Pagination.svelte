<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { browser } from "$app/environment"
  import type { DashList } from "$lib/dash/dash.svelte"

  let {
    list = $bindable(),
    class: className = "",
  }: {
    list: DashList<Group | Member>
    class?: string
  } = $props()

  let pageAmount = $derived(Math.ceil(list.list.processed.length / list.settings.itemsPerPage))

  function jumpToPage() {
    if (browser) {
      let page = parseInt(window.prompt("Jump to the following page") || "nope")
      if (!isNaN(page)) list.settings.currentPage = page
      list.paginate()
    }
  }

  function goToPage(page: number) {
    list.settings.currentPage = page
    list.paginate()
  }
</script>

<nav class={`join ${className}`} aria-label="List pagination">
  {#if pageAmount > 0}
    <button
      aria-label="Go to page 1"
      class={`btn btn-sm join-item ${
        list.settings.currentPage === 1 ? "btn-primary" : "btn-neutral"
      }`}
      onclick={() => goToPage(1)}
    >
      1
    </button>
    {#if list.settings.currentPage > 3}
      <button
        aria-label="Jump to any page"
        class="btn btn-sm btn-neutral join-item"
        onclick={() => jumpToPage()}
      >
        ...
      </button>
    {/if}
    {#if list.settings.currentPage > 2}
      <button
        aria-label={`Go to page ${list.settings.currentPage - 1}`}
        class="btn btn-sm btn-neutral join-item"
        onclick={() => goToPage(list.settings.currentPage - 1)}
      >
        {list.settings.currentPage - 1}
      </button>
    {/if}
    {#if list.settings.currentPage > 1 && list.settings.currentPage < pageAmount}
      <button
        aria-label={`Page ${list.settings.currentPage} (current page)`}
        class="btn btn-sm join-item btn-primary"
      >
        {list.settings.currentPage}
      </button>
    {/if}
    {#if (list.settings.currentPage < pageAmount - 1 && pageAmount > 3) || (list.settings.currentPage === 1 && pageAmount === 3)}
      <button
        aria-label={`Go to page ${list.settings.currentPage + 1}`}
        class="btn btn-sm btn-neutral join-item"
        onclick={() => goToPage(list.settings.currentPage + 1)}
      >
        {list.settings.currentPage + 1}
      </button>
    {/if}
    {#if list.settings.currentPage < pageAmount - 2 && pageAmount > 3}
      <button
        aria-label="Jump to any page"
        class="btn btn-sm btn-neutral join-item"
        onclick={() => jumpToPage()}
      >
        ...
      </button>
    {/if}
    {#if pageAmount > 1}
      <button
        aria-label={`Go to page ${pageAmount} (last page)`}
        class={`btn btn-sm join-item ${
          list.settings.currentPage === pageAmount ? "btn-primary" : "btn-neutral"
        }`}
        onclick={() => goToPage(pageAmount)}
      >
        {pageAmount}
      </button>
    {/if}
  {/if}
</nav>
