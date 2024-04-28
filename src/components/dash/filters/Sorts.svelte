<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { filterFieldText, filterFieldType } from "$lib/dash/filters.svelte"
  import { sortModeText, type Sort } from "$lib/dash/sorts.svelte"
  import { IconChevronDown, IconChevronUp, IconTrash } from "@tabler/icons-svelte"
  import { flip } from "svelte/animate"

  let {
    list,
  }: {
    list: DashList<Member | Group>
  } = $props()

  const moveSort = (sort: Sort, shift: 1 | -1) => {
    const from = list.sorts.indexOf(sort)
    // make sure to check array bounds
    const to = from + shift > list.filters.length || from + shift < 0 ? from : from + shift

    list.sorts.splice(to, 0, list.sorts.splice(from, 1)[0])

    list.process(dash.groups.list.raw)
    list.paginate()
  }

  function changeOrder(sort: Sort, order: 1 | -1) {
    sort.order = order

    list.process(dash.groups.list.raw)
    list.paginate()
  }
</script>

{#if list.sorts.length === 0}
  <div class="bg-base-300 rounded-lg gap-3 p-3 text-center">No sorting added.</div>
{:else}
  <ul class="bg-base-300 rounded-lg flex flex-col gap-2 p-3">
    {#each list.sorts as sort, index (sort.id)}
      <li
        animate:flip={{ duration: 300 }}
        class="bg-base-100 flex flex-row rounded-lg gap-2 relative"
      >
        <div
          class="flex flex-col justify-between items-center bg-neutral text-neutral-content rounded-l-lg w-6"
        >
          {#if index > 0}
            <button
              onclick={() => moveSort(sort, -1)}
              class="mb-auto btn btn-ghost btn-xs btn-circle focus:text-neutral-content/50 hover:text-neutral-content/80 active:text-accent"
            >
              <IconChevronUp />
            </button>
          {/if}
          {#if index + 1 < list.sorts.length}
            <button
              onclick={() => moveSort(sort, 1)}
              class="mt-auto btn btn-ghost btn-xs btn-circle hover:text-neutral-content/50 active:text-accent"
            >
              <IconChevronDown />
            </button>
          {/if}
        </div>
        <div class="p-2 flex flex-col gap-2 flex-1">
          <div class="flex flex-row gap-3 items-center justify-between">
            <div class="join w-fit mr-auto">
              <button
                class={`join-item uppercase btn btn-xs ${
                  sort.order === 1 ? "btn-primary" : "btn-neutral"
                }`}
                onclick={() => changeOrder(sort, 1)}
                aria-label="Ascending">Asc</button
              >
              <button
                class={`join-item uppercase btn btn-xs ${
                  sort.order === -1 ? "btn-primary" : "btn-neutral"
                }`}
                onclick={() => changeOrder(sort, -1)}
                aria-label="Descending">Desc</button
              >
            </div>
            <button
              class="text-muted hover:text-error hover:scale-110 transition-all focus:text-error focus:scale-110 btn-circle btn-xs"
              onclick={() => {
                list.sorts = list.sorts.filter((s) => s.id !== sort.id)
                list.process(dash.groups.list.raw)
                list.paginate()
              }}
              aria-label="Delete sort"
            >
              <IconTrash />
            </button>
          </div>
          <span class="text-sm"
            >Sort by <b>{filterFieldText(sort.field)}</b>
            {sortModeText(sort.mode, filterFieldType(sort.field)).text},
            {#if sort.order !== -1}
              in <b>ascending</b> order
            {:else}
              in <b>descending</b> order
            {/if}
          </span>
        </div>
      </li>
    {/each}
    </ul>
{/if}
