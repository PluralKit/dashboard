<script lang="ts">
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import FilterGroupHeader from "./FilterGroupHeader.svelte"
  import type { Group, Member } from "$api/types"
  import { IconChevronDown, IconChevronUp } from "@tabler/icons-svelte"
  import FilterInfo from "./FilterInfo.svelte"
  import StaticFilterHeader from "./FilterHeader.svelte"
  import type { Filter, FilterGroup } from "$lib/dash/filters.svelte"
  import { send, receive } from "./transition"
  import { flip } from "svelte/animate"

  let {
    list,
  }: {
    list: DashList<Member | Group>
  } = $props()

  const moveGroup = (group: FilterGroup, shift: 1 | -1) => {
    const from = list.filters.indexOf(group)
    // make sure to check array bounds
    const to = from + shift > list.filters.length || from + shift < 0 ? from : from + shift

    list.filters.splice(to, 0, list.filters.splice(from, 1)[0])

    list.process(dash.groups.list.raw)
    list.paginate()
  }

  const moveFilter = (filter: Filter, group: FilterGroup, shift: 1 | -1) => {
    const groupFrom = list.filters.indexOf(group)
    const filterFrom = group.filters.indexOf(filter)

    // check array bounds, but make sure to move the filter to the adjacent group if one is available
    let groupTo = groupFrom
    let filterTo = 0
    if (filterFrom + shift < group.filters.length && filterFrom + shift >= 0) {
      // we shift within the same group!
      filterTo = filterFrom + shift
    } else if (
      filterFrom + shift >= group.filters.length &&
      groupFrom + shift < list.filters.length
    ) {
      // we shift to first item of the next group
      groupTo += 1
      filterTo = 0
    } else if (filterFrom + shift < 0 && groupFrom + shift >= 0) {
      // we shift to the last item of the previous group
      groupTo -= 1
      filterTo = list.filters[groupTo].filters.length
    }

    const moved = list.filters[groupFrom].filters.splice(filterFrom, 1)[0]
    list.filters[groupTo].filters.splice(filterTo, 0, moved)

    list.process(dash.groups.list.raw)
    list.paginate()
  }
</script>

{#if list.filters.length === 0}
  <div class="bg-base-300 rounded-lg text-center p-2">No filters added.</div>
{:else}
  <ul class="bg-base-300 rounded-lg p-3 gap-3 flex flex-col">
    {#each list.filters as group, index (group.id)}
      <li class="flex flex-row bg-base-100 rounded-lg" animate:flip={{ duration: 300 }}>
        <div
          class="flex flex-col justify-between items-center bg-neutral text-neutral-content rounded-l-lg w-6"
        >
          {#if index > 0}
            <button
              aria-label="Move group up"
              onclick={() => moveGroup(group, -1)}
              class="mb-auto btn btn-ghost btn-xs btn-circle focus:text-neutral-content/50 hover:text-neutral-content/80 active:text-accent"
            >
              <IconChevronUp />
            </button>
          {/if}
          {#if index + 1 < list.filters.length}
            <button
              aria-label="Move group down"
              onclick={() => moveGroup(group, 1)}
              class="mt-auto btn btn-ghost btn-xs btn-circle hover:text-neutral-content/50 active:text-accent"
            >
              <IconChevronDown />
            </button>
          {/if}
        </div>
        <ul class="flex flex-col p-2 rounded-r-lg gap-2 flex-1">
          <FilterGroupHeader {list} {group} />
          {#if group.filters.length === 0}
            <div class="text-sm text-muted">
              <span>No filters in this group.</span>
            </div>
          {/if}
          {#each group.filters as filter, i (filter.id)}
            <li
              class="border border-muted/50 rounded-lg flex flex-row"
              in:receive={{ key: filter.id }}
              out:send={{ key: filter.id }}
              animate:flip={{ duration: 300 }}
            >
              <div
                class="flex flex-col justify-between items-center bg-neutral text-neutral-content rounded-l-lg w-6"
              >
                {#if !(index === 0 && i === 0)}
                  <button
                    onclick={() => moveFilter(filter, group, -1)}
                    aria-label="Move filter up"
                    class="mb-auto btn btn-ghost btn-xs btn-circle hover:text-neutral-content/80 active:text-accent"
                  >
                    <IconChevronUp />
                  </button>
                {/if}
                {#if !(index + 1 >= list.filters.length && i + 1 >= group.filters.length)}
                  <button
                    onclick={() => moveFilter(filter, group, 1)}
                    aria-label="Move filter down"
                    class="mt-auto btn btn-ghost btn-xs btn-circle hover:text-neutral-content/80 active:text-accent"
                  >
                    <IconChevronDown />
                  </button>
                {/if}
              </div>
              <div class="flex flex-col p-2 gap-2 flex-1">
                <StaticFilterHeader {list} {filter} {group} />
                <FilterInfo {filter} {list} />
              </div>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
{/if}
