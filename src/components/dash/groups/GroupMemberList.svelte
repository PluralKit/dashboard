<script lang="ts">
  import parseMarkdown from "$api/parseMarkdown"
  import type { Member } from "$api/types"
  import AwaitHtml from "../AwaitHtml.svelte"
  import CopyField from "../CopyField.svelte"

  let {
    members,
    itemsPerPage = 5,
    currentPage = $bindable(),
    small = false,
  }: {
    members: Member[]
    itemsPerPage?: number
    currentPage: number
    small?: boolean
  } = $props()

  let paginatedMembers = $derived.by(() => {
    let last = currentPage * itemsPerPage
    let first = last - itemsPerPage
    return members.slice(first, last)
  })
</script>

<ol
  class={`menu flex-1 text-base p-0 flex flex-col list-decimal pl-8 ${small ? "text-sm" : ""}`}
  start={currentPage * itemsPerPage - itemsPerPage + 1}
>
  {#each paginatedMembers as member, i (member.uuid)}
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
