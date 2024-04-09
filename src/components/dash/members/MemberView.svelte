<script lang="ts">
  import type { Member } from "$api/types"
  import { IconEdit } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import { getBirthday } from "$lib/dash/member/utils";
  import ImageModal from "../ImageModal.svelte"

  let {
    member,
    tab,
  }: {
    member: Member
    tab: string
  } = $props()
</script>

<div style={tab !== "view" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">General information</h4>
    <button class="btn btn-sm btn-primary p-2">
      <IconEdit class="inline" size={18} /> Edit
    </button>
  </div>
  <div class="flex flex-col sm:flex-row gap-2 lg:gap-3">
    {#if member.avatar_url || member.banner || member.webhook_avatar_url}
      <div class="flex flex-col gap-2">
        {#if member.avatar_url}
          <img
            class="rounded-lg hidden sm:block sm:w-36 h-auto self-start"
            src={member.avatar_url}
            alt={`${member.name}'s avatar`}
          />
        {/if}
        <ul class="flex-1 flex flex-col gap-1 justify-start">
          {#if member.avatar_url}
            <li>
              <ImageModal url={member.avatar_url} imageType="avatar" itemName={member.name} />
            </li>
          {/if}
          {#if member.webhook_avatar_url}
            <li>
              <ImageModal url={member.webhook_avatar_url} imageType="proxy avatar" itemName={member.name} />
            </li>
          {/if}
          {#if member.banner}
            <li>
              <ImageModal url={member.banner} imageType="banner" itemName={member.name} />
            </li>
          {/if}
        </ul>
      </div>
    {/if}
    <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 flex-wrap">
      <ul class="menu bg-base-100 md:flex-1 rounded-box text-base">
        {#if member.id}
          <li><span class="items-start"><b>ID:</b> {member.id}</span></li>
        {/if}
        {#if member.name}
          <li><span class="items-start"><b>Name:</b> {member.name}</span></li>
        {/if}
        {#if member.display_name}
          <li><span class="items-start"><b>Display name:</b> {member.display_name}</span></li>
        {/if}
      </ul>
      {#if member.pronouns || member.birthday}
        <ul class="menu bg-base-100 md:flex-1 rounded-box text-base">
          {#if member.pronouns}
            <li>
              <span class="items-start"
                ><b>Pronouns:</b>
                <AwaitHtml htmlPromise={parseMarkdown(member.pronouns, { embed: true })} /></span
              >
            </li>
          {/if}
          {#if member.birthday}
            <li>
              <span class="items-start"
                ><b>Birthday:</b> {getBirthday(member.birthday)}</span
              >
            </li>
          {/if}
        </ul>
      {/if}
      {#if member.description}
        <div class="flex flex-col w-full">
          <div class="ml-4 px-4 pt-2 pb-1 rounded-t-xl bg-base-100 w-min font-medium">
            Description:
          </div>
          <div class="rounded-xl bg-base-100">
            <div class="discord-markdown p-6 py-4">
              <AwaitHtml htmlPromise={parseMarkdown(member.description, { embed: true })} />
            </div>
            {#if member.banner}
              <img class="rounded-b-xl w-full h-auto" src={member.banner} alt={`${member.name}'s banner`} />
            {/if}
          </div>
        </div>
      {:else if member.banner}
      <img class="rounded-xl w-full h-auto" src={member.banner} alt={`${member.name}'s banner`} />
      {/if}
    </div>
  </div>
</div>
