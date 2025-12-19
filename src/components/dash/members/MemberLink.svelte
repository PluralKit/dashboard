<script lang="ts">
  import type { Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import { page } from "$app/stores"
  import { IconExternalLink, IconShare2 } from "@tabler/icons-svelte"

  let {
    asPage,
    item,
    color = "neutral",
    style = "button",
    class: className,
  }: {
    asPage: boolean
    item: Member
    color?: "primary" | "neutral"
    style?: "button" | "icon" | "ghost"
    class?: string
  } = $props()

  let params = $page.url.searchParams
  if (!asPage) params.delete("tab")
  else params.append("tab", "members")

  const getLink = () => {
    if (dash.group.group?.uuid !== item.uuid || !asPage)
      return `/dash/m/${item.id}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
    else
      return `/dash/${(item as Member).system}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
  }
</script>

{#if style === "button"}
  <div class="flex flex-row justify-end items-center">
    <a class={`btn btn-sm mt-2 btn-${color}`} href={getLink()}>
      {#if dash.member.member?.uuid !== item.uuid || !asPage}
        View page
      {:else}
        View system
      {/if}
    </a>
  </div>
{:else if style === "icon"}
  <a
    class={`
      text-muted flex items-center hover:text-primary
      transition-all hover:scale-110 hover:bg-base-200 active:scale-110 active:bg-base-300 rounded-md
      ${className}
      `}
    href={getLink()}
    aria-label="View member page"
  >
    <IconExternalLink size={22} />
  </a>
{:else if style === "ghost"}
  <a href={getLink()} class="btn btn-ghost btn-circle btn-lg text-center" title={`View member page (${item.name})`}>
    <IconShare2 size={36} class="inline" />
  </a>
{/if}
