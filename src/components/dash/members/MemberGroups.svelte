<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import { IconEdit } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import SimplePagination from "../SimplePagination.svelte"

  let {
    member,
    tab,
  }: {
    member: Member
    tab: string
  } = $props()

  let groups: Group[] = $derived(
    dash.privacyMode === PrivacyMode.PRIVATE
      ? dash.groups.list.raw
          .filter((g) => g.members?.includes(member.uuid || ""))
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
      : []
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
  <div
    class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 lg:flex-col xl:flex-row flex-wrap"
  >
    <div class="rounded-xl bg-base-100 flex-1 p-6 py-4">
      {#if dash.privacyMode !== PrivacyMode.PRIVATE}
        <p>Can't get group information in public view {":("}</p>
      {:else}
      <h5 class="text-lg mb-2">Group info</h5>
      <div class="flex flex-row justify-between gap-2 items-start">
        <p class="mb-3">{groups.length} total groups</p>
        <SimplePagination {itemsPerPage} rawList={groups} bind:currentPage />
      </div>
      <ol
        class="menu flex-1 text-base p-0 flex flex-col list-decimal pl-8"
        start={currentPage * itemsPerPage - itemsPerPage + 1}
      >
        {#each paginatedGroups as group (group.uuid)}
          <li class="list-item border-b border-base-content/20">
            <span class="items-center gap-2">
              <span>[<code>{group.id}</code>] {group.name}</span>
            </span>
          </li>
        {/each}
      </ol>
      {/if}
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
</div>
