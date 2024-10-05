<script lang="ts">
  import type { Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import { page } from "$app/stores"
  import { IconExternalLink } from "@tabler/icons-svelte"

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
    style?: "button" | "icon"
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
    <a target="_blank" class={`btn btn-sm mt-2 btn-${color}`} href={getLink()}>
      {#if dash.member.member?.uuid !== item.uuid || !asPage}
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
    aria-label="View member page"
  >
    <IconExternalLink size={22} />
  </a>
{/if}
