<script lang="ts">
  import type { Member } from "$api/types"
  import Pagination from "$components/dash/Pagination.svelte"
  import type { DashList } from "$lib/dash/dash.svelte"
  import { IconPlus, IconRefresh } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"
  import GroupMemberList from "../GroupMemberList.svelte"

  let {
    tab,
    members = $bindable(),
    memberList,
  }: {
    tab: "view" | "info" | "groups"
    members: string[]
    memberList: DashList<Member>
  } = $props()

  let allOptions = $derived(
    memberList.list.raw
      .map((m) => {
        return {
          value: m.uuid,
          text: `${m.name} (${m.id})`,
          extra: m.display_name,
        }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  )

  let selectedMembers = $derived(
    memberList.list.raw
      .filter((m) => members.includes(m.uuid || ""))
      .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let itemsPerPage = 10
  let currentPage = $state(1)
</script>

<div style={tab !== "groups" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Group members</h4>
  </div>
  <div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
    <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Edit members</h5>
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex flex-row gap-2 items-center">
            <button
              class="btn btn-success btn-xs"
              title="Add all"
              aria-label="Add all members to group"
              onclick={() => (members = memberList.list.raw.map((g) => g.uuid || ""))}
            >
              <IconPlus size={18} class="inline" />
            </button>
            <label for={`create-group-member-input`}>Add members</label>
            {#if members.length > 0}
              <button
                class="btn btn-warning btn-xs ml-auto"
                title="Reset"
                aria-label="Reset added members"
                onclick={() => {
                  members = []
                }}
              >
                <IconRefresh size={18} class="inline" />
              </button>
            {/if}
          </div>
          <Svelecte
            inputId={`create-group-member-input`}
            class="svelecte-control-pk"
            options={allOptions}
            multiple
            collapseSelection="blur"
            valueField="value"
            labelField="text"
            bind:value={members}
            {option}
          />
        </div>
      </div>
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Changes</h5>
      <div class="text-sm">
        {members.length} members total
      </div>
      {#if members.length > 0}
        <div>
          <h6 class="flex flex-row gap-1 items-center mb-1 mt-2">
            <IconPlus class="text-success" size={22} />
            Members added
            <button
              class="btn btn-warning btn-xs ml-auto"
              title="Reset"
              aria-label="Reset added members"
              onclick={() => (members = [])}
            >
              <IconRefresh size={18} class="inline" />
            </button>
          </h6>
          {@render joinMembers(selectedMembers)}
        </div>
      {:else}
        <div class="mt-3">No members have been selected yet.</div>
      {/if}
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Member list</h5>
      <Pagination {itemsPerPage} rawList={selectedMembers} bind:currentPage />
      <GroupMemberList members={selectedMembers} bind:currentPage {itemsPerPage} small={true} />
    </div>
  </div>
</div>

{#snippet option(opt: any)}
  <div
    class={`option w-full flex flex-row justify-between rounded px-1.5 py-1 bg-success/10 hover:bg-success/20`}
  >
    <span>{opt.text}</span>
    <span title="Add member">
      <IconPlus size={20} />
    </span>
  </div>
{/snippet}

{#snippet joinMembers(members: Member[])}
  <ul class="discord-markdown text-sm flex flex-row flex-wrap gap-y-1 gap-x-2">
    {#each members as member, i}
      {#if i <= 10}
        <li>[<code>{member.id}</code>] {member.name}{i < members.length - 1 ? ", " : ""}</li>
      {/if}
    {/each}
    {#if members.length > 10}
      <li>and {members.length - 10} more...</li>
    {/if}
  </ul>
{/snippet}
