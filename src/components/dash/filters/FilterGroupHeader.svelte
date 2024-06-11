<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import type { FilterGroup } from "$lib/dash/filters.svelte"
  import { IconTrash } from "@tabler/icons-svelte"

  let {
    group,
    list,
  }: {
    group: FilterGroup
    list: DashList<Member | Group>
  } = $props()
</script>

<div class="flex flex-row gap-3 items-center justify-between">
  <div class="join w-fit mr-auto">
    <button
      class={`join-item uppercase btn btn-xs ${
        group.mode === "and" ? "btn-primary" : "btn-neutral"
      }`}
      onclick={() => {
        group.mode = "and"
        list.process(dash.groups.list.raw)
        list.paginate()
      }}>And</button
    >
    <button
      class={`join-item uppercase btn btn-xs ${
        group.mode === "or" ? "btn-primary" : "btn-neutral"
      }`}
      onclick={() => {
        group.mode = "or"
        list.process(dash.groups.list.raw)
        list.paginate()
      }}>Or</button
    >
  </div>
  <button
    class="text-muted hover:text-error hover:scale-110 transition-all focus:text-error focus:scale-110 btn-circle btn-xs"
    onclick={() => {
      list.filters = list.filters.filter((g) => g.id !== group.id)
      list.process(dash.groups.list.raw)
      list.paginate()
    }}
    aria-label="Delete filter group"><IconTrash /></button
  >
</div>
