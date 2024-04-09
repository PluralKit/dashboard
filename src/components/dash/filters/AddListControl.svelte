<script lang="ts">
  import type { Group, Member } from "$api/types"
  import type { DashList } from "$lib/dash/dash.svelte"
  import type { FilterGroup } from "$lib/dash/filters.svelte"

  let { list }: {
    list: DashList<Member|Group>
  } = $props()
</script>