<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { type DashList } from "$lib/dash/dash.svelte"
  import type { FilterGroup } from "$lib/dash/filters.svelte"
  import { IconTrash } from "@tabler/icons-svelte"

  let {
    group,
    list,
    groupList,
  }: {
    group: FilterGroup
    list: DashList<Member | Group>
    groupList: DashList<Group>
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
      }}>And</button
    >
    <button
      class={`join-item uppercase btn btn-xs ${
        group.mode === "or" ? "btn-primary" : "btn-neutral"
      }`}
      onclick={() => {
        group.mode = "or"
      }}>Or</button
    >
  </div>
  <button
    class="text-muted hover:text-error hover:scale-110 transition-all focus:text-error focus:scale-110 btn-circle btn-xs"
    onclick={() => {
      list.filters = list.filters.filter((g) => g.id !== group.id)
    }}
    aria-label="Delete filter group"><IconTrash /></button
  >
</div>
