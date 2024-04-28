<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { FilterMode, filterFieldType, filterModeText, groupArrayModes, type Filter, type FilterGroup } from "$lib/dash/filters.svelte"
  import { IconTrash } from "@tabler/icons-svelte"

  let {
    filter,
    group,
    list
  }: {
    filter: Filter,
    group: FilterGroup,
    list: DashList<Member|Group>
  } = $props()
</script>

<div class="flex flex-row justify-between align-center w-full">
  <div class="mr-2">
    <!-- group and member filtering are #special so we just handle them manually -->
    <!-- TODO: potentially move these to the same string handling functions the other use? -->
    {#if filter.field === "group"}
    <span class="text-sm">
      {#if groupArrayModes.includes(filter.mode)}
        members with <b>groups</b> that {filterModeText(filter.mode, filter.valueType)
          .verb}...
      {:else if filter.mode === FilterMode.HIGHERTHAN}
        members with more than {filter.value} <b>groups</b>
      {:else if filter.mode === FilterMode.LOWERTHAN}
        members with less than {filter.value} <b>groups</b>
      {:else if filter.mode === FilterMode.EMPTY}
        members without a <b>group</b>
      {:else if filter.mode === FilterMode.NOTEMPTY}
        members with a <b>group</b>
      {/if}
    </span>
    {:else if filter.field === "member"}
    <span class="text-sm">
      {#if groupArrayModes.includes(filter.mode)}
        groups with <b>members</b> that {filterModeText(filter.mode, filter.valueType)
          .verb}...
      {:else if filter.mode === FilterMode.HIGHERTHAN}
        groups with more than {filter.value} <b>members</b>
      {:else if filter.mode === FilterMode.LOWERTHAN}
        groups with less than {filter.value} <b>members</b>
      {:else if filter.mode === FilterMode.EMPTY}
        groups without a <b>members</b>
      {:else if filter.mode === FilterMode.NOTEMPTY}
        groups with a <b>members</b>
      {/if}
    </span>
    <!-- The other filters are just able to be done in one swoop -->
    {:else}
    <span class="text-sm"
    >
    <b>{filter.fieldName}s</b> that {filterModeText(filter.mode, filter.valueType)
      .verb}
    {filter.value !== null && filter.value !== ""
      ? `${filter.valueType === "string" ? `"${filter.value}"` : filter.value}`
      : "..."}
    {filterModeText(filter.mode, filterFieldType(filter.field)).afterVerb}
    </span
  >
    {/if}
  </div>
  <button
    class="text-muted hover:text-error hover:scale-110 transition-all focus:text-error focus:scale-110 btn-circle btn-xs"
    onclick={() => {
      group.filters = group.filters.filter(f => f.id !== filter.id)
      list.process(dash.groups.list.raw)
      list.paginate()
    }}
    aria-label="Delete filter"
  >
    <IconTrash />
  </button>
</div>
