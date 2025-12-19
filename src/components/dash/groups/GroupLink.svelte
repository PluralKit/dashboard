<script lang="ts">
  import type { Group } from "$api/types"
  import { page } from "$app/stores"
  import { dash } from "$lib/dash/dash.svelte"
  import { IconExternalLink, IconShare2 } from "@tabler/icons-svelte"

  let {
    item,
    asPage = false,
    color = "neutral",
    style = "button",
    class: className,
  }: {
    item: Group
    asPage?: boolean
    color?: "primary" | "neutral"
    style?: "button" | "icon" | "ghost"
    class?: string
  } = $props()

  let params = $page.url.searchParams
  if (!asPage) params.delete("tab")
  else params.append("tab", "groups")

  const getLink = () => {
    if (dash.group.group?.uuid !== item.uuid || !asPage)
      return `/dash/g/${item.id}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
    else
      return `/dash/${(item as Group).system}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
  }
</script>

{#if style === "button"}
  <div class="flex flex-row justify-end items-center">
    <a target="_blank" class={`btn btn-sm mt-2 btn-${color}`} href={getLink()}>
      {#if dash.group.group?.uuid !== item.uuid || !asPage}
        View page
      {:else}
        View system
      {/if}
    </a>
  </div>
{:else if style === "icon"}
  <a
    target="_blank"
    class={`
      text-muted flex items-center hover:text-primary
      transition-all hover:scale-110 hover:bg-base-200 active:scale-110 active:bg-base-300 rounded-md
      ${className}
      `}
    href={getLink()}
    aria-label="View group page"
  >
    <IconExternalLink size={22} />
  </a>
{:else if style === "ghost"}
  <a href={getLink()} class="btn btn-ghost btn-circle btn-lg text-center" title={`View group page (${item.name})`}>
    <IconShare2 size={36} class="inline" />
  </a>
{/if}
