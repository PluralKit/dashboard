<script lang="ts">
  import type { Group } from "$api/types"
  import { page } from "$app/stores"
  import { dash } from "$lib/dash/dash.svelte"

  let {
    item,
    asPage = false,
    color = "neutral",
  }: {
    item: Group
    asPage?: boolean
    color?: "primary" | "neutral"
  } = $props()

  let params = $page.url.searchParams
  params.delete("tab")
</script>

<div class="flex flex-row justify-end items-center">
  {#if dash.group.group?.uuid !== item.uuid || !asPage}
    <a
      target="_blank"
      class={`btn btn-sm mt-2 btn-${color}`}
      href={`/dash/g/${item.id}${params.toString().length > 0 ? `?${params.toString()}` : ""}`}
    >
      View page
    </a>
  {:else}
    <a
      target="_blank"
      class={`btn btn-sm mt-2 btn-${color}`}
      href={`/dash/${(item as Group).system}?tab=groups${$page.url.searchParams.get("public") ? "&public=true" : ""}`}
    >
      View system
    </a>
  {/if}
</div>
