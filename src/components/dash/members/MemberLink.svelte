<script lang="ts">
  import type { Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import { page } from "$app/stores"

  let {
    asPage,
    item,
    color = "neutral",
  }: {
    asPage: boolean
    item: Member
    color?: "primary" | "neutral"
  } = $props()
</script>

{#if dash.member.member?.uuid !== item.uuid || !asPage}
  <a
    target="_blank"
    class={`btn btn-sm mt-2 btn-${color}`}
    href={`/dash/m/${item.id}${$page.url.searchParams.get("public") ? "?public=true" : ""}`}
  >
    View page
  </a>
{:else}
  <a
    target="_blank"
    class={`btn btn-sm mt-2 btn-${color}`}
    href={`/dash/${(item as Member).system}?tab=members${$page.url.searchParams.get("public") ? "&public=true" : ""}`}
  >
    View system
  </a>
{/if}
