<script lang="ts">
  import parseMarkdown from "$api/parseMarkdown"
  import type { Group } from "$api/types"
  import AwaitHtml from "../AwaitHtml.svelte"
  import CopyField from "../CopyField.svelte"
  import GroupLink from "../groups/GroupLink.svelte"

  let {
    groups,
    itemsPerPage = 5,
    currentPage = $bindable(),
  }: {
    groups: Group[]
    itemsPerPage?: number
    currentPage: number
  } = $props()

  let paginatedGroups = $derived.by(() => {
    let last = currentPage * itemsPerPage
    let first = last - itemsPerPage
    return groups.slice(first, last)
  })
</script>

<ol
  class="menu flex-1 text-base p-0 flex flex-col list-decimal pl-8"
  start={currentPage * itemsPerPage - itemsPerPage + 1}
>
  {#each paginatedGroups as group, i (group.uuid)}
    <li class="list-item border-b border-muted/50">
      <span class="hover:bg-transparent hover:cursor-default flex flex-row px-1">
        <div class="flex flex-row w-full">
          <GroupLink class="mr-2" item={group} style="icon" asPage={false} />
          <span
            >[<code class="bg-base-200">{group.id}</code>] <AwaitHtml
              htmlPromise={parseMarkdown(group.name || "", { embed: true })}
            />
          </span>
          <CopyField class="ml-auto" field="group id" value={group.id} />
        </div>
      </span>
    </li>
  {/each}
</ol>
