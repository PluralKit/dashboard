<script lang="ts">
  import type { Member } from "$api/types"
  import { page } from "$app/stores"
  import { IconLock, IconShare, IconUser } from "@tabler/icons-svelte"

  let {
    member,
    asPage,
  }: {
    member: Member
    asPage: boolean
  } = $props()

  let params = $page.url.searchParams
  if (!asPage) params.delete("tab")
  else params.append("tab", "members")

  const link = () => {
    if (!asPage)
      return `/dash/m/${member.id}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
    else
      return `/dash/${(member as Member).system}${params.toString().length > 0 ? `?${params.toString()}` : ""}`
  }
</script>

<a
  class={`self-stretch flex flex-col`}
  href={link()}
  aria-label={asPage ? "View member list" : "View member page"}
>
  <div
    class="box rounded-lg flex flex-col gap-2 p-0 transition-all hover:scale-105 h-full"
    style={member.color ? `border: 4px solid #${member.color}` : ""}
  >
    {#if member.avatar_url || member.webhook_avatar_url}
      <img
        class="rounded-t-md"
        src={member.webhook_avatar_url ?? member.avatar_url}
        alt="Default avatar"
      />
    {:else}
      <img class="rounded-t-md" src="/discord_icon.svg" alt="Default avatar" />
    {/if}
    <div class="text-sm relative">
      <div class="absolute -top-4 left-0 right-0 w-full flex">
        <button class="btn btn-neutral btn-sm btn-circle mx-auto">
          {#if !member.privacy || !member.privacy.visibility}
            <IconUser size={20} />
          {:else if member.privacy.visibility === "private"}
            <IconLock size={20} />
          {:else}
            <IconShare size={20} />
          {/if}
        </button>
      </div>
      <div class="text-center pt-5 pb-2 px-2">
        <span class="font-bold break-words">{member.name}</span><br />({member.id})
      </div>
    </div>
  </div>
</a>
