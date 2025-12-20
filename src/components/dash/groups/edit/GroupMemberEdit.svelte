<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { type DashList } from "$lib/dash/dash.svelte"
  import { IconRefresh, IconMinus, IconPlus, IconX } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import { fade } from "svelte/transition"
  import Pagination from "$components/dash/Pagination.svelte"
  import GroupMemberList from "../GroupMemberList.svelte"
  import DeleteButton from "$components/dash/edit/DeleteButton.svelte"
  import Spinny from "$components/Spinny.svelte"

  let {
    membersCurrent,
    group: g = $bindable(),
    mode = $bindable(),
    asPage = false,
    groupList,
    memberList,
  }: {
    membersCurrent: Member[]
    group: Group
    mode: "view" | "edit"
    asPage?: boolean
    groupList: DashList<Group>
    memberList: DashList<Member>
  } = $props()

  let group = $state(g)

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  let uuidsCurrent: string[] = $derived(membersCurrent.map((g) => g.uuid || ""))
  let uuidSelection: string[] = $state(membersCurrent.map((g) => g.uuid || ""))

  let memberSelection: Group[] = $derived(
    memberList.list.raw
      .filter((m) => uuidSelection.includes(m.uuid || ""))
      .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let allOptions = $derived(
    memberList.list.raw
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

  let toAdd: string[] = $state([])
  let toRemove: string[] = $state([])

  let added = $derived(memberSelection.filter((m) => !uuidsCurrent.includes(m.uuid || "")))
  let removed = $derived(membersCurrent.filter((m) => !uuidSelection.includes(m.uuid || "")))

  let itemsPerPage = 10
  let currentPage = $state(1)

  async function submitEdit(token: string) {
    const listBody = uuidSelection

    await window.api(`groups/${group.uuid}/members/overwrite`, {
      token,
      method: "POST",
      body: listBody,
    })
    for (const mid of listBody) {
      if (!group.members?.includes(mid) || false) {
        const member = memberList.list.raw.find((m) => m.uuid === mid)
        if (member?.group_count) member.group_count += 1
      }
    }

    // and those removed
    for (const mid of group.members || []) {
      if (!listBody.includes(mid)) {
        const member = memberList.list.raw.find((m) => m.uuid === mid)
        if (member?.group_count) member.group_count -= 1
      }
    }

    group.members = listBody

    // if on the member page: remove self from list if no longer containing member
    if (groupList.filter && groupList.page) {
      if (listBody.includes(group.uuid || "") && !groupList.filter.includes(group.uuid || "")) {
        groupList.filter.push(group.uuid || "")
      } else groupList.filter = groupList.filter.filter((m) => m !== group.uuid)
    }

    // if on the group page: filter out members that no longer belong in this group
    if (memberList.filter && memberList.page) {
      memberList.filter = listBody
    }

    memberList.process(groupList.list.raw)
    memberList.paginate()
    groupList.process(groupList.list.raw)
    groupList.paginate()

    toAdd = []
    toRemove = []
    uuidSelection = uuidsCurrent

    success = true
  }
</script>

<div class="flex flex-row items-center justify-between gap-2 mb-3">
  <h4 class="ml-3 text-2xl font-medium">Editing group members</h4>
  {#if !loading}
    {#if added.length > 0 || removed.length > 0}
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
      <Spinny /> Loading...
    </button>
  {/if}
</div>
<div class="flex flex-col flex-wrap gap-2 h-min md:flex-row lg:gap-3">
  <div class="flex flex-col w-full gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Edit members</h5>
    <div class="flex flex-col gap-3 md:flex-row">
      <div class="flex flex-col flex-1 gap-2">
        <div class="flex flex-row items-center gap-2">
          <label for={`${group.id}-add-member-input`}>Add members</label>
          <button
            class="ml-auto btn btn-success btn-xs"
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
          class="svelecte-control-pk group-control"
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
      <div class="flex flex-col flex-1 gap-2">
        <div class="flex flex-row items-center gap-2">
          <label for={`${group.id}-remove-member-input`}>Remove members</label>
          <button
            class="ml-auto btn btn-error btn-xs"
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
          class="svelecte-control-pk group-control"
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
  <div class="flex flex-col flex-1 gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Changes</h5>
    <div class="text-sm">
      {uuidSelection.length} groups total ({added.length} added, {removed.length} removed)
    </div>
    {#if added.length > 0}
      <div>
        <h6 class="flex flex-row items-center gap-1 mt-2 mb-1">
          <IconPlus class="text-success" size={22} />
          Members added
          <button
            class="ml-auto btn btn-warning btn-xs"
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
        <h6 class="flex flex-row items-center gap-1 mt-2 mb-1">
          <IconMinus class="text-error" size={22} />
          Members removed
          <button
            class="ml-auto btn btn-warning btn-xs"
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
  <div class="flex flex-col flex-1 gap-2 p-4 bg-base-100 rounded-box">
    <h5 class="text-lg">Member list</h5>
    <Pagination {itemsPerPage} rawList={memberSelection} bind:currentPage />
    <GroupMemberList members={memberSelection} bind:currentPage {itemsPerPage} small={true} />
  </div>
</div>

{#if err.length > 0}
  {#each err as e}
    {#if e}
      <div transition:fade={{ duration: 400 }} role="alert" class="mt-2 alert bg-error/20">
        {e}
      </div>
    {/if}
  {/each}
{/if}
{#if success}
  <div transition:fade={{ duration: 400 }} role="alert" class="mt-2 alert bg-success/20">
    Group successfully edited
  </div>
{/if}
<div class="flex flex-row items-center">
  <div class="mt-2 join">
    {#if !loading}
      {#if added.length > 0 || removed.length > 0}
        <SubmitEditButton bind:err {submitEdit} />
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
        <Spinny /> Loading...
      </button>
    {/if}
  </div>
  <DeleteButton type="group" item={group} {asPage} list={groupList} {groupList} />
</div>

{#snippet option(opt: any)}
  <div
    class={`option flex flex-row justify-between rounded px-1.5 py-1 ${
      !opt.included ? "bg-success/10 hover:bg-success/20" : "bg-error/10 hover:bg-error/20"
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
  <ul class="flex flex-row flex-wrap text-sm discord-markdown gap-y-1 gap-x-2">
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
