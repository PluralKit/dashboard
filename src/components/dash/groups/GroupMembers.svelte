<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import { IconEdit } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import SimplePagination from "../SimplePagination.svelte"
  import CopyField from "../CopyField.svelte"

  let {
    asPage = false,
    group,
    tab,
  }: {
    asPage?: boolean
    group: Group
    tab: string
  } = $props()

  let members: Member[] = $derived(
    !asPage
      ? dash.members.list.raw
          .filter((m) =>
            dash.groups.list.raw.find((g) => g.uuid === group.uuid)?.members?.includes(m.uuid ?? "")
          )
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
      : [...dash.group.members].sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let itemsPerPage = 10
  let currentPage = $state(1)
  let paginatedGroups = $derived.by(() => {
    let last = currentPage * itemsPerPage
    let first = last - itemsPerPage
    return members.slice(first, last)
  })
</script>

<div style={tab !== "groups" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Member list</h4>
    {#if (!asPage && dash.privacyMode !== PrivacyMode.PUBLIC) || (asPage && dash.group.privacyMode !== PrivacyMode.PUBLIC)}
      <button class="btn btn-sm btn-primary p-2">
        <IconEdit class="inline" size={18} /> Edit
      </button>
    {/if}
  </div>
  <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
    <div class="rounded-xl bg-base-100 flex-1 p-6 py-4">
      <h5 class="text-lg mb-2">Member info</h5>
      <div class="flex flex-row justify-between gap-2 items-start">
        <p class="mb-3">{members.length} total members</p>
        <SimplePagination {itemsPerPage} rawList={members} bind:currentPage />
      </div>
      <ol
        class="menu flex-1 text-base p-0 flex flex-col list-decimal pl-8"
        start={currentPage * itemsPerPage - itemsPerPage + 1}
      >
        {#each paginatedGroups as member, i (member.uuid)}
          <li class="list-item border-b border-muted/50">
            <span class="hover:bg-transparent hover:cursor-default flex flex-row">
              <div class="flex flex-row w-full justify-between">
                <span
                  >[<code class="bg-base-200">{member.id}</code>] <AwaitHtml
                    htmlPromise={parseMarkdown(member.name || "", { embed: true })}
                  />
                </span><CopyField class="ml-auto" field="group id" value={member.id} />
              </div>
            </span>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</div>
