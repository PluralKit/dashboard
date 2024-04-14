<script lang="ts">
  import { IconEdit } from "@tabler/icons-svelte"
  import type { Member } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import PrivacyDisplay from "../PrivacyDisplay.svelte"
  import moment from "moment"
  import { copyToClipboard } from "$lib/dash/utils"

  let {
    member,
    tab,
  }: {
    member: Member
    tab: string
  } = $props()
</script>

<div style={tab !== "info" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Member details</h4>
    {#if dash.privacyMode !== PrivacyMode.PUBLIC}
      <button class="btn btn-sm btn-primary p-2">
        <IconEdit class="inline" size={18} /> Edit
      </button>
    {/if}
  </div>
  <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
    {#if member.message_count || member.created || member.color}
      <ul class="menu bg-base-100 flex-1 rounded-box text-base">
        {#if member.created}
          <li>
            <button
              title="Copy creation date"
              onclick={() => copyToClipboard(member.created)}
              class="items-start"
              ><b>Created:</b> {moment(member.created).format("MMMM Do, YYYY")}</button
            >
          </li>
        {/if}
        {#if member.message_count !== null}
          <li>
            <button
              title="Copy message count"
              onclick={() => copyToClipboard(member.message_count?.toString())}
              class="items-start"><b>Message count:</b> {member.message_count}</button
            >
          </li>
        {/if}
        {#if member.color}
          <li>
            <button
              title="Copy color"
              onclick={() => copyToClipboard(member.color)}
              class="items-start"><b>Color:</b> #{member.color}</button
            >
          </li>
        {/if}
      </ul>
    {/if}
    {#if member.proxy_tags && member.proxy_tags.length > 0}
      <ol class="menu bg-base-100 flex-1 rounded-box text-base gap-2" style="list-style-type: decimal;">
        <b class="inline-block px-4 pt-2">Proxy tags:</b>
        {#each member.proxy_tags as tag}
          <li class="ml-8" style="display: list-item">
            <button
              title="Copy proxy tag"
              onclick={() =>
                copyToClipboard(
                  `${tag.prefix ? tag.prefix : ""}text${tag.suffix ? tag.suffix : ""}`
                )}
              class="items-center px-2 py-0 w-full"
              ><code class="rounded-sm px-2 py-1 font-mono bg-base-200 text-sm discord-markdown"
                ><AwaitHtml
                  htmlPromise={parseMarkdown(
                    `${tag.prefix ? tag.prefix : ""}text${tag.suffix ? tag.suffix : ""}`,
                    { embed: true }
                  )}
                /></code
              ></button
            >
          </li>
        {/each}
      </ol>
    {/if}
    {#if member.privacy}
      <div
        class="flex flex-col w-full bg-base-100 gap-2 md:flex-row xl:flex-row lg:gap-3 p-2 rounded-xl flex-wrap"
      >
        <b class="inline-block px-4 pt-2 w-full">Privacy settings:</b>
        <ul class="menu flex-1 text-base p-0 flex flex-col sm:flex-row">
          <li class="w-1/2">
            <span class="items-start"
              ><b>Visibility:</b> <PrivacyDisplay value={member.privacy.visibility} />
            </span>
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Name:</b> <PrivacyDisplay value={member.privacy.name_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Description:</b>
              <PrivacyDisplay value={member.privacy.description_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Avatar:</b> <PrivacyDisplay value={member.privacy.avatar_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Pronouns:</b> <PrivacyDisplay value={member.privacy.pronoun_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Birthday:</b> <PrivacyDisplay value={member.privacy.birthday_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Proxy tags:</b> <PrivacyDisplay value={member.privacy.proxy_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span class="items-start"
              ><b>Metadata:</b> <PrivacyDisplay value={member.privacy.metadata_privacy} /></span
            >
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>
