<script lang="ts">
  import type { Group } from "$api/types"
  import { page } from "$app/stores"
  import { dash } from "$lib/dash/dash.svelte"
  import { IconLock, IconShare, IconUser } from "@tabler/icons-svelte"

  let {
    group,
    asPage,
    wide = dash.settings.display?.forceControlsAtTop === true,
  }: {
    group: Group
    asPage: boolean
    wide?: boolean
  } = $props()

  let params = $page.url.searchParams
  if (!asPage) params.delete("tab")
  else params.append("tab", "groups")

  const link = () => {
    if (!asPage)
      return `/dash/g/${group.id}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
    else
      return `/dash/${group.system}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
  }
</script>

<a
  class={`
    center-small
    self-stretch flex flex-col w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 ${!wide ? "xl:w-1/5" : ""}
  `}
  href={link()}
  aria-label={asPage ? "View group list" : "View group page"}
>
  <div
    class="box rounded-lg m-1 flex flex-col gap-2 p-0 transition-all hover:scale-105 h-full"
    style={group.color ? `border: 4px solid #${group.color}` : ""}
  >
    <img
      class="rounded-t-md aspect-square object-cover"
      src={group.icon ?? "/discord_icon.svg"}
      alt={group.icon ? `${group.name}'s icon` : "Default icon"}
    />
    <div class="text-sm relative">
      <div class="absolute -top-4 left-0 right-0 w-full flex">
        <button class="btn btn-neutral btn-sm btn-circle mx-auto">
          {#if !group.privacy || !group.privacy.visibility}
            <IconUser size={20} />
          {:else if group.privacy.visibility === "private"}
            <IconLock size={20} />
          {:else}
            <IconShare size={20} />
          {/if}
        </button>
      </div>
      <div class="text-center pt-5 pb-2 px-2">
        <span class="font-bold break-words">{group.name}</span><br />({group.id})
      </div>
    </div>
  </div>
</a>

<style>
  @media (max-width: 399px) {
    .center-small {
      margin: 0 auto;
      width: 100%;
      max-width: 10rem;
    }
  }
</style>
