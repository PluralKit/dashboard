<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash, type DashList } from "$lib/dash/dash.svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import PrivacyDisplay from "../PrivacyDisplay.svelte"
  import moment from "moment"
  import CopyField from "../CopyField.svelte"
  import MemberLink from "./MemberLink.svelte"
  import MemberInfoEdit from "./edit/MemberInfoEdit.svelte"
  import OpenEditButton from "../edit/OpenEditButton.svelte"

  let {
    member,
    tab,
    asPage,
    groupList,
    memberList,
    privacyMode,
  }: {
    member: Member
    tab: string
    asPage: boolean
    privacyMode: PrivacyMode
    groupList: DashList<Group>
    memberList: DashList<Member>
  } = $props()

  let mode: "view" | "edit" = $state("view")
</script>

<div style={tab !== "info" ? "display: none;" : ""}>
  {#if mode === "view"}
    <div class="flex flex-row gap-2 justify-between items-center mb-3">
      <h4 class="text-2xl ml-3 font-medium">Member details</h4>
      <OpenEditButton bind:mode {privacyMode} />
    </div>
    {#if dash.settings.devMode && member.uuid}
      <div class="flex flex-col h-min mb-2 lg:mb-3">
        <ul class="menu bg-base-100 flex-1 rounded-box text-base">
          <li>
            <span
              class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
            >
              <span class="flex flex-row justify-start gap-2"
                ><b>UUID:</b>
                {member.uuid}
              </span>
              <CopyField class="ml-auto" field="UUID" value={member.uuid} />
            </span>
          </li>
        </ul>
      </div>
    {/if}
    {#if !member.message_count && !member.created && (!member.proxy_tags || member.proxy_tags.length === 0) && !member.privacy}
      <div class="bg-base-100 rounded-box p-4 gap-2">
        <p>There is no additional information available for this member.</p>
      </div>
    {/if}
    <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
      {#if member.message_count || member.created}
        <ul class="menu bg-base-100 flex-1 rounded-box text-base">
          {#if member.created}
            <li>
              <span
                class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
              >
                <span class="flex flex-row justify-start gap-2"
                  ><b>Created:</b>
                  {moment(member.created).format("MMMM Do, YYYY")} (at {new Date(
                    member.created
                  ).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })})
                </span>
                <CopyField class="ml-auto" field="creation date" value={member.created} />
              </span>
            </li>
          {/if}
          {#if member.message_count !== null}
            <li>
              <span
                class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
              >
                <span class="flex flex-row justify-start gap-2"
                  ><b>Message count:</b>
                  {member.message_count}
                </span>
                <CopyField
                  class="ml-auto"
                  field="message count"
                  value={member.message_count?.toString()}
                />
              </span>
            </li>
          {/if}
        </ul>
      {/if}
      {#if member.proxy_tags && member.proxy_tags.length > 0}
        <ol
          class="menu bg-base-100 flex-1 rounded-box text-base gap-2"
          style="list-style-type: decimal;"
        >
          <b class="inline-block px-4 pt-2">Proxy tags:</b>
          {#each member.proxy_tags as tag}
            <li class="ml-8 list-item justify-between">
              <span
                class="items-center px-2 py-0 w-full text-left hover:bg-transparent hover:cursor-default"
                ><code class="rounded-sm px-2 py-1 font-mono bg-base-200 text-sm discord-markdown"
                  ><AwaitHtml
                    htmlPromise={parseMarkdown(
                      `${tag.prefix ? tag.prefix : ""}text${tag.suffix ? tag.suffix : ""}`,
                      { embed: true }
                    )}
                  /></code
                ><CopyField
                  class="ml-auto"
                  field="proxy tag"
                  value={`${tag.prefix ? tag.prefix : ""}text${tag.suffix ? tag.suffix : ""}`}
                /></span
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
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Visibility:</b> <PrivacyDisplay value={member.privacy.visibility} />
              </span>
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Name:</b> <PrivacyDisplay value={member.privacy.name_privacy} /></span
              >
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Description:</b>
                <PrivacyDisplay value={member.privacy.description_privacy} /></span
              >
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Avatar:</b> <PrivacyDisplay value={member.privacy.avatar_privacy} /></span
              >
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Pronouns:</b> <PrivacyDisplay value={member.privacy.pronoun_privacy} /></span
              >
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Birthday:</b> <PrivacyDisplay value={member.privacy.birthday_privacy} /></span
              >
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Proxy tags:</b> <PrivacyDisplay value={member.privacy.proxy_privacy} /></span
              >
            </li>
            <li class="w-1/2">
              <span
                class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
                ><b>Metadata:</b> <PrivacyDisplay value={member.privacy.metadata_privacy} /></span
              >
            </li>
          </ul>
        </div>
      {/if}
      <div class="flex flex-row items-center justify-end gap-2 w-full">
        <OpenEditButton {privacyMode} class="mt-2" bind:mode />
        <MemberLink item={member} {asPage} />
      </div>
    </div>
  {:else if mode === "edit"}
    <MemberInfoEdit {groupList} list={memberList} bind:mode {member} {asPage} />
  {/if}
</div>
