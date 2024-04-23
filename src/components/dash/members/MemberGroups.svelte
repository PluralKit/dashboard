<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import { IconEdit } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import SimplePagination from "../SimplePagination.svelte"
  import { copyToClipboard } from "$lib/dash/utils"
  import CopyField from "../CopyField.svelte"
  import MemberLink from "./MemberLink.svelte"

  let {
    asPage = false,
    member,
    tab,
  }: {
    asPage?: boolean
    member: Member
    tab: string
  } = $props()

  let groups: Group[] = $derived(
    !asPage
      ? dash.groups.list.raw
          .filter((g) => g.members?.includes(member.uuid || ""))
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
      : dash.member.privacyMode === PrivacyMode.PRIVATE
        ? dash.member.groups
            .filter((g) => g.members?.includes(member.uuid || ""))
            .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
        : dash.member.groups.sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )
  let formattedGroups: string = $derived(
    groups.length <= 5
      ? groups.map((g) => `[\`${g.id}\`] ${g.display_name || g.name}`).join("\n")
      : groups.map((g) => g.display_name).join(", ")
  )

  let itemsPerPage = 5
  let currentPage = $state(1)
  let paginatedGroups = $derived.by(() => {
    let last = currentPage * itemsPerPage
    let first = last - itemsPerPage
    return groups.slice(first, last)
  })
</script>

<div style={tab !== "groups" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Group list</h4>
    {#if dash.privacyMode !== PrivacyMode.PUBLIC}
      <button class="btn btn-sm btn-primary p-2">
        <IconEdit class="inline" size={18} /> Edit
      </button>
    {/if}
  </div>
  <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
    <div class="rounded-xl bg-base-100 flex-1 p-6 py-4">
      <h5 class="text-lg mb-2">Group info</h5>
      <div class="flex flex-row justify-between gap-2 items-start">
        <p class="mb-3">{groups.length} total groups</p>
        <SimplePagination {itemsPerPage} rawList={groups} bind:currentPage />
      </div>
      <ol
        class="menu flex-1 text-base p-0 flex flex-col list-decimal pl-8"
        start={currentPage * itemsPerPage - itemsPerPage + 1}
      >
        {#each paginatedGroups as group, i (group.uuid)}
          <li class="list-item border-b border-muted/50">
            <span class="hover:bg-transparent hover:cursor-default flex flex-row">
              <div class="flex flex-row w-full justify-between">
                <span
                  >[<code class="bg-base-200">{group.id}</code>] <AwaitHtml
                    htmlPromise={parseMarkdown(group.name || "", { embed: true })}
                  />
                </span><CopyField class="ml-auto" field="group id" value={group.id} />
              </div>
            </span>
          </li>
        {/each}
      </ol>
    </div>
    {#if groups.length > 0}
      <div class="rounded-xl text-sm discord-markdown bg-base-100 p-6 py-4 flex-1">
        <h5 class="text-lg mb-2">Formatted list</h5>
        <p>
          <AwaitHtml htmlPromise={parseMarkdown(formattedGroups, { embed: true })} />
        </p>
      </div>
    {/if}
  </div>
  <div class="flex flex-row justify-end items-center">
    <MemberLink item={member} {asPage} />
  </div>
</div>
