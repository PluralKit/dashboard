<script lang="ts">
  import { browser } from "$app/environment"

  let {
    class: className,
    itemsPerPage,
    rawList,
    size = "xs",
    currentPage = $bindable(),
    paginate,
  }: {
    itemsPerPage: number
    class?: string
    rawList: any[]
    currentPage: number
    size?: "sm" | "xs"
    paginate?: () => void
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
    if (paginate) paginate()
  }
</script>

<nav class={`join ${className}`} aria-label="List pagination">
  {#if pageAmount > 1}
    <!-- first page (visible if 1 < previous page)-->
    {#if 1 < currentPage - 1}
      <button
        aria-label={`Go to first page (page 1)`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(1)}
      >
        1
      </button>
    {/if}

    <!-- second page
   visible if previous page > 2
   AND there's more than 4 pages
   AND skip forwards + 1 isn't visible OR skip backwards isn't visible
   -->
    {#if currentPage - 1 > 2 && pageAmount > 4 && (!(currentPage + 1 < pageAmount - 1) || !(currentPage - 1 > 3 && pageAmount > 6))}
      <button
        aria-label={`Go to second page (page 2)`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(2)}
      >
        2
      </button>
    {/if}

    <!-- third page, only visible if we're on the last two pages AND there's more than 5 pages-->
    {#if currentPage > pageAmount - 2 && pageAmount > 5}
      <button
        aria-label={`Go to third page (page 3)`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(3)}
      >
        3
      </button>
    {/if}

    <!-- 7 pages special case - 4th or 5th page
     only visible if currentPage + 3 === pageAmount - 3 (aka we have 7 pages, 3 and 4 will go missing)
     AND currentPage - 1 > 3
     displays 4 if currentPage > 4, displays 3 otherwise
     -->
    {#if pageAmount === 7 && currentPage - 1 > 3}
      <button
        aria-label={`Jump to page ${currentPage > 5 ? 4 : 3}`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(currentPage > 5 ? 4 : 3)}
      >
        {currentPage > 5 ? 4 : 3}
      </button>
    {/if}

    <!-- skip backward (visible if previous page > third page) AND there's more than 7 pages -->
    {#if currentPage - 1 > 3 && pageAmount > 7}
      <button
        aria-label="Jump to any page"
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => jumpToPage()}
      >
        ...
      </button>
    {/if}

    <!-- third to last page
   ONLY visible if we're on the last page
   -->
    {#if currentPage === pageAmount && pageAmount > 3}
      <button
        aria-label={`Go to third page (page ${pageAmount - 2})`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(pageAmount - 2)}
      >
        {pageAmount - 2}
      </button>
    {/if}

    {#if pageAmount > 1}
      <!-- previous page (visible if we're not on first page)-->
      {#if currentPage != 1}
        <button
          aria-label={`Go to previous page (page ${currentPage - 1})`}
          class={`btn btn-${size} join-item btn-neutral`}
          onclick={() => goToPage(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      {/if}

      <!-- Current page (always visible)-->
      <button
        aria-label={`Go to current page (page ${currentPage})`}
        class={`btn btn-${size} join-item btn-primary`}
        onclick={() => goToPage(currentPage)}
      >
        {currentPage}
      </button>
    {/if}

    <!-- next page (visible if we're not on the last page)-->
    {#if currentPage < pageAmount}
      <button
        aria-label={`Go to next page (page ${currentPage + 1})`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(currentPage + 1)}
      >
        {currentPage + 1}
      </button>
    {/if}
    <!-- third page
   ONLY visible if there's more than 3 pages and we're on page 1
   -->
    {#if currentPage === 1 && pageAmount > 3}
      <button
        aria-label={`Go to third page (page 3)`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(3)}
      >
        3
      </button>
    {/if}

    <!-- skip forward (visible if next page < third to last page) AND there's more than 7 pages -->
    {#if currentPage + 1 < pageAmount - 2 && pageAmount > 7}
      <button
        aria-label="Jump to any page"
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => jumpToPage()}
      >
        ...
      </button>
    {/if}
    <!-- 7 pages special case - 4th or 5th page
     only visible if currentPage + 3 === pageAmount - 3 (aka we have 7 pages, 4 and 5 will go missing)
     AND currentPage + 1 < 5
     displays 4 if currentPage < 3, displays 5 otherwise
     -->
    {#if pageAmount === 7 && currentPage + 1 < 5}
      <button
        aria-label={`Jump to page ${currentPage < 3 ? 4 : 5}`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(currentPage < 3 ? 4 : 5)}
      >
        {currentPage < 3 ? 4 : 5}
      </button>
    {/if}

    <!-- third to last page, only visible if we're on the first two pages AND there's more than 5 pages-->
    {#if currentPage < 3 && pageAmount > 5}
      <button
        aria-label={`Go to third to last page (page ${pageAmount - 2})`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(pageAmount - 2)}
      >
        {pageAmount - 2}
      </button>
    {/if}

    <!-- second to last page
      visible if next page < second to last page
      AND there's more than 4 pages
      AND skip backwards - 1 isn't visible OR skip forwards isn't visible
      -->
    {#if pageAmount > 4 && currentPage + 1 < pageAmount - 1 && (!(currentPage > 3) || !(currentPage + 1 < pageAmount - 2))}
      <button
        aria-label={`Go to second to last page ${pageAmount - 1}`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(pageAmount - 1)}
      >
        {pageAmount - 1}
      </button>
    {/if}

    <!-- last page (visible if last page > next page)-->
    {#if pageAmount > currentPage + 1}
      <button
        aria-label={`Go to next page (page ${pageAmount})`}
        class={`btn btn-${size} join-item btn-neutral`}
        onclick={() => goToPage(pageAmount)}
      >
        {pageAmount}
      </button>
    {/if}
  {/if}
</nav>
