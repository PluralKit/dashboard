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

  let params = $page.url.searchParams
  if (!asPage) params.delete("tab")
  else params.append("tab", "members")
</script>

{#if dash.member.member?.uuid !== item.uuid || !asPage}
  <a
    target="_blank"
    class={`btn btn-sm mt-2 btn-${color}`}
    href={`/dash/m/${item.id}${params.toString().length > 0 ? `?${params.toString()}` : ""}`}
  >
    View page
  </a>
{:else}
  <a
    target="_blank"
    class={`btn btn-sm mt-2 btn-${color}`}
    href={`/dash/${(item as Member).system}${params.toString().length > 0 ? `?${params.toString()}` : ""}`}
  >
    View system
  </a>
{/if}
