<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import {
    IconRefresh,
    IconLoader,
    IconMinus,
    IconPlus,
    IconX,
    IconAlertTriangle,
  } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"
  import AwaitHtml from "$components/dash/AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import { fade } from "svelte/transition"
  import SimplePagination from "$components/dash/SimplePagination.svelte"
  import GroupMemberList from "../GroupMemberList.svelte"
  import DeleteButton from "$components/dash/edit/DeleteButton.svelte"

  let {
    membersCurrent,
    group,
    mode = $bindable(),
    asPage = false,
  }: {
    membersCurrent: Member[]
    group: Group
    mode: "view" | "edit"
    asPage?: boolean
  } = $props()

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  let uuidsCurrent: string[] = $derived(membersCurrent.map((g) => g.uuid || ""))
  let uuidSelection: string[] = $state(uuidsCurrent)

  let memberSelection: Group[] = $derived(
    !asPage
      ? dash.members.list.raw
          .filter((m) => uuidSelection.includes(m.uuid || ""))
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
      : dash.group.members
          .filter((m) => uuidSelection.includes(m.uuid || ""))
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let allOptions = $derived(
    !asPage
      ? dash.members.list.raw
          .map((m) => {
            return {
              value: m.uuid,
              text: `${m.name} (${m.id})`,
              extra: m.display_name,
              included: uuidsCurrent.includes(m.uuid || ""),
            }
          })
          .sort((a, b) => a.text.localeCompare(b.text))
      : dash.group.members
          .map((m) => {
            return {
              value: m.uuid,
              text: `${m.name} (${m.id})`,
              extra: m.display_name,
              included: uuidsCurrent.includes(m.uuid || ""),
            }
          })
          .sort((a, b) => a.text.localeCompare(b.text))
  )

  let edited = $derived(!$state.is(uuidSelection, uuidsCurrent))

  let toAdd: string[] = $state([])
  let toRemove: string[] = $state([])

  let added = $derived(memberSelection.filter((m) => !uuidsCurrent.includes(m.uuid || "")))
  let removed = $derived(membersCurrent.filter((m) => !uuidSelection.includes(m.uuid || "")))

  let itemsPerPage = 10
  let currentPage = $state(1)
</script>

<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing group members</h4>
  {#if !loading}
    {#if edited}
      <button
        onclick={() => (mode = "view")}
        class="btn btn-sm btn-neutral join-item"
        aria-label="Cancel edit"
      >
        <IconX /> Cancel
      </button>
    {:else}
      <button
        onclick={() => (mode = "view")}
        class="btn btn-sm btn-neutral join-item"
        aria-label="Exit edit"
      >
        <IconX /> Exit
      </button>
    {/if}
  {:else}
    <button class="btn btn-sm btn-neutral join-item" disabled>
      <IconLoader /> Loading...
    </button>
  {/if}
</div>
<div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
  <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Edit members</h5>
    <div class="flex flex-col md:flex-row gap-3">
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex flex-row gap-2 items-center">
          <label for={`${group.id}-add-member-input`}>Add members</label>
          <button
            class="btn btn-success btn-xs ml-auto"
            aria-label="Add all members to group"
            onclick={() => {
              toAdd = allOptions.filter((opt) => !opt.included).map((m) => m.value || "")
              uuidSelection = uuidSelection = [...uuidsCurrent, ...toAdd].filter(
                (m) => !toRemove.includes(m)
              )
            }}
          >
            <IconPlus size={18} class="inline" />
            Add all members
          </button>
        </div>
        <Svelecte
          inputId={`${group.id}-add-member-input`}
          class="svelecte-control-pk"
          options={allOptions.filter((opt) => !opt.included)}
          multiple
          collapseSelection="blur"
          valueField="value"
          labelField="text"
          bind:value={toAdd}
          onChange={() => {
            uuidSelection = [...uuidsCurrent, ...toAdd].filter((m) => !toRemove.includes(m))
          }}
          {option}
        />
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex flex-row gap-2 items-center">
          <label for={`${group.id}-remove-member-input`}>Remove members</label>
          <button
            class="btn btn-error btn-xs ml-auto"
            aria-label="Remove all members from group"
            onclick={() => {
              toRemove = allOptions.filter((opt) => opt.included).map((m) => m.value || "")
              uuidSelection = uuidSelection = [...uuidsCurrent, ...toAdd].filter(
                (m) => !toRemove.includes(m)
              )
            }}
          >
            <IconMinus size={18} class="inline" />
            Remove all members
          </button>
        </div>
        <Svelecte
          inputId={`${group.id}-remove-member-input`}
          class="svelecte-control-pk"
          options={allOptions.filter((opt) => opt.included)}
          multiple
          collapseSelection="blur"
          valueField="value"
          labelField="text"
          bind:value={toRemove}
          onChange={() => {
            uuidSelection = [...uuidsCurrent, ...toAdd].filter((m) => !toRemove.includes(m))
          }}
          {option}
        />
      </div>
    </div>
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Changes</h5>
    <div class="text-sm">
      {uuidSelection.length} groups total ({added.length} added, {removed.length} removed)
    </div>
    {#if added.length > 0}
      <div>
        <h6 class="flex flex-row gap-1 items-center mb-1 mt-2">
          <IconPlus class="text-success" size={22} />
          Members added
          <button
            class="btn btn-warning btn-xs ml-auto"
            title="Reset added members"
            aria-label="Reset added members"
            onclick={() => {
              uuidSelection = uuidSelection.filter((g) => uuidsCurrent.includes(g))
              toAdd = []
            }}
          >
            <IconRefresh size={18} class="inline" />
            Reset
          </button>
        </h6>
        {@render joinMembers(added)}
      </div>
    {/if}
    {#if removed.length > 0}
      <div>
        <h6 class="flex flex-row gap-1 items-center mb-1 mt-2">
          <IconMinus class="text-error" size={22} />
          Members removed
          <button
            class="btn btn-warning btn-xs ml-auto"
            title="Reset removed members"
            aria-label="Reset removed members"
            onclick={() => {
              uuidSelection = [
                ...uuidsCurrent,
                ...uuidSelection.filter((g) => !uuidsCurrent.includes(g)),
              ]
              toRemove = []
            }}
          >
            <IconRefresh size={18} class="inline" />
            Reset
          </button>
        </h6>
        {@render joinMembers(removed)}
      </div>
    {/if}
    {#if added.length === 0 && removed.length === 0}
      <div class="mt-3">No changes have been made yet.</div>
    {/if}
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Member list</h5>
    <SimplePagination {itemsPerPage} rawList={memberSelection} bind:currentPage />
    <GroupMemberList members={memberSelection} bind:currentPage {itemsPerPage} small={true} />
  </div>
</div>

{#if err.length > 0}
  {#each err as e}
    {#if e}
      <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-error/20 mt-2">
        {e}
      </div>
    {/if}
  {/each}
{/if}
{#if success}
  <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-success/20 mt-2">
    Member successfully edited
  </div>
{/if}
<div class="flex flex-row items-center">
  <div class="join mt-2">
    {#if !loading}
      {#if edited}
        <SubmitEditButton
          onSuccess={() => {
            toAdd = []
            toRemove = []
            uuidSelection = uuidsCurrent
          }}
          bind:loading
          bind:err
          bind:success
          options={{
            group,
            body: uuidSelection,
            asPage,
          }}
          path={`groups/${group.uuid}/members/overwrite`}
        />
        <button
          onclick={() => (mode = "view")}
          class="btn btn-sm btn-neutral join-item"
          aria-label="Cancel edit"
        >
          <IconX /> Cancel
        </button>
      {:else}
        <button
          onclick={() => (mode = "view")}
          class="btn btn-sm btn-neutral join-item"
          aria-label="Exit edit"
        >
          <IconX /> Exit
        </button>
      {/if}
    {:else}
      <button onclick={() => (mode = "view")} class="btn btn-sm btn-neutral join-item" disabled>
        <IconLoader /> Loading...
      </button>
    {/if}
  </div>
  <DeleteButton type="group" item={group} {asPage} />
</div>

{#snippet option(opt)}
  <div
    class={`option flex flex-row justify-between rounded -m-1 p-1 ${
      !opt.included ? "bg-success/10 hover:bg-success/25" : "bg-error/10 hover:bg-error/25"
    }`}
  >
    <span>{opt.text}</span>
    {#if !opt.included}
      <span title="Add group">
        <IconPlus size={20} />
      </span>
    {:else}
      <span title="Remove group">
        <IconMinus size={20} />
      </span>
    {/if}
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

<style>
  .option {
    width: calc(100% + 0.5rem);
  }
</style>
