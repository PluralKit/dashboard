<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte";
  import type { Member } from "$api/types"
  import { IconLock, IconPencil, IconShare, IconShare2, IconUser } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import MemberLink from "./MemberLink.svelte"

  let {
    member,
    wide = dash.settings.display?.forceControlsAtTop === true,
    asPage,
  }: {
    member: Member
    asPage: boolean
    wide: boolean
  } = $props()
</script>

<div
  class={`center-small
    self-stretch flex flex-col w-full sm:w-1/2 md:w-1/3 ${!wide ? "xl:w-1/3" : ""}`}
>
  <div class="box bg-base-100 m-1 h-full px-0 flex flex-col" style={`border-bottom: 4px solid #${member.color}`}>
    <h4 class="text-xl p-3 pt-0 flex gap-2 items-center">
          {#if !member.privacy || !member.privacy.visibility}
            <IconUser size={20} />
          {:else if member.privacy.visibility === "private"}
            <IconLock size={20} />
          {:else}
            <IconShare size={20} />
          {/if}
          {member.name}
    </h4>
    <hr />
    <div class=" max-h-96 overflow-y-auto p-4 pb-0 flex-1 text-center flex flex-col">
      <img
        class="rounded-md aspect-square object-cover"
        src={member.webhook_avatar_url ?? member.avatar_url ?? "/discord_icon.svg"}
        alt={member.webhook_avatar_url || member.avatar_url
          ? `${member.name}'s avatar`
          : "Default avatar"}
      />
      <div class="my-2">
      {#if member.display_name}
        <h5 class="text-lg">{member.display_name}</h5>
      {/if}
      {#if member.pronouns}
          <p class="discord-markdown">
            <AwaitHtml htmlPromise={parseMarkdown(member.pronouns.replaceAll("\n", " "), { embed: true })} />
          </p>
      {/if}
      </div>
      {#if member.description}
      <hr class="mb-4" />
      <div class="discord-markdown text-left mb-4">
        <AwaitHtml htmlPromise={parseMarkdown(member.description, { embed: true })} />
      </div>
      {/if}
      <hr class="mb-2">
      <div class="flex justify-around mt-auto">
        <!-- 
          If there's enough demand I'll add the edit button back. Otherwise it's just extra maintenance
        
          <button
          class="btn btn-ghost btn-circle btn-lg text-center"
          title={`Edit member (${member.name})`}
          onclick={() => mode = "edit"}
        >
          <IconPencil size={36} class="inline" />
        </button> -->
        <MemberLink style="ghost" item={member} {asPage} />
      </div>
    </div>
  </div>
</div>
