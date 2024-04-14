<script lang="ts">
  import { browser } from "$app/environment"

  let {
    class: className,
    itemsPerPage,
    rawList,
    currentPage = $bindable(),
  }: {
    itemsPerPage: number
    class?: string
    rawList: any[]
    currentPage: number
  } = $props()

  let pageAmount = $derived(Math.ceil(rawList.length / itemsPerPage))

  function jumpToPage() {
    if (browser) {
      let page = parseInt(window.prompt("Jump to the following page") || "nope")
      if (!isNaN(page)) goToPage(page)
    }
  }

  function goToPage(page: number) {
    currentPage = page
  }
</script>

<nav class={`join ${className}`} aria-label="List pagination">
  {#if pageAmount > 1}
    <button
      aria-label="Go to page 1"
      class={`btn btn-xs join-item ${currentPage === 1 ? "btn-primary" : "btn-neutral"}`}
      onclick={() => goToPage(1)}
    >
      1
    </button>
    {#if currentPage > 3}
      <button
        aria-label="Jump to any page"
        class="btn btn-xs btn-neutral join-item"
        onclick={() => jumpToPage()}
      >
        ...
      </button>
    {/if}
    {#if currentPage > 2}
      <button
        aria-label={`Go to page ${currentPage - 1}`}
        class="btn btn-xs btn-neutral join-item"
        onclick={() => goToPage(currentPage - 1)}
      >
        {currentPage - 1}
      </button>
    {/if}
    {#if currentPage > 1 && currentPage < pageAmount}
      <button
        aria-label={`Page ${currentPage} (current page)`}
        class="btn btn-xs join-item btn-primary"
      >
        {currentPage}
      </button>
    {/if}
    {#if (currentPage < pageAmount - 1 && pageAmount > 3) || (currentPage === 1 && pageAmount === 3)}
      <button
        aria-label={`Go to page ${currentPage + 1}`}
        class="btn btn-xs btn-neutral join-item"
        onclick={() => goToPage(currentPage + 1)}
      >
        {currentPage + 1}
      </button>
    {/if}
    {#if currentPage < pageAmount - 2 && pageAmount > 3}
      <button
        aria-label="Jump to any page"
        class="btn btn-xs btn-neutral join-item"
        onclick={() => jumpToPage()}
      >
        ...
      </button>
    {/if}
    {#if pageAmount > 1}
      <button
        aria-label={`Go to page ${pageAmount} (last page)`}
        class={`btn btn-xs join-item ${currentPage === pageAmount ? "btn-primary" : "btn-neutral"}`}
        onclick={() => goToPage(pageAmount)}
      >
        {pageAmount}
      </button>
    {/if}
  {/if}
</nav>
