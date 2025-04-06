<script lang="ts">
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconPlus } from "@tabler/icons-svelte"
  import { untrack } from "svelte"
  import type { Group, GroupPrivacy, Member } from "$api/types"
  import { fade } from "svelte/transition"
  import SubmitCreateButton from "$components/dash/edit/SubmitCreateButton.svelte"
  import { createGroupCreationState } from "$lib/dash/group/edit.svelte"
  import GroupViewCreate from "./GroupViewCreate.svelte"
  import GroupInfoCreate from "./GroupInfoCreate.svelte"
  import GroupMemberCreate from "./GroupMemberCreate.svelte"
  import DuplicateName from "$components/dash/edit/DuplicateName.svelte"
  import Spinny from "$components/Spinny.svelte"

  let {
    forceOpen = false,
    open = $bindable(false),
    groupList,
    memberList,
    initialMembers = [],
  }: {
    forceOpen?: boolean
    open?: boolean
    groupList: DashList<Group>
    memberList: DashList<Member>
    initialMembers?: Member[]
  } = $props()

  let group: Group & {
    privacy: GroupPrivacy
  } = $state(createGroupCreationState())
  let members: string[] = $state(initialMembers.map((m) => m.uuid || ""))

  let tab: "view" | "info" | "groups" = $state("view")

  let openedOnce = $state(false)
  $effect(() => {
    if (untrack(() => openedOnce)) return
    else if (isOpen) openedOnce = true
  })

  let isOpen = $derived(forceOpen ? true : open)

  let tabbedOnce = $state(false)
  $effect(() => {
    if (untrack(() => tabbedOnce)) return
    else if (tab === "groups") tabbedOnce = true
  })

  let err: string[] = $state([])
  let loading: boolean = $state(false)
  let success: boolean = $state(false)

  let icon = $state("")

  let duplicate = $derived(
    groupList.list.raw.find((g) => g.name?.toLowerCase() === group.name?.toLowerCase())
  )
</script>

<div
  class="rounded-lg bg-base-100"
  style={group.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${group.color}; border-left-width: 6px;`
    : ""}
>
  <button
    aria-label="Create new group"
    onclick={() => (open = !open)}
    class="flex items-center justify-between w-full px-2 py-2 text-xl font-medium collapse-title lg:px-4"
  >
    <div class="flex items-center">
      <div class="mr-3">
        <IconPlus />
      </div>
      <span class="h-min"
        >Create new group
        <span class="font-light">
          {#if group.name}
            ({group.name})
          {/if}
        </span>
      </span>
    </div>
    <div class="ml-3 h-14">
      {#if icon}
        <div class="avatar w-14 h-14">
          {@render iconImage(icon || "", `${group.name}'s avatar'`)}
        </div>
      {/if}
    </div>
  </button>
  <div
    class={`px-2 lg:px-4 pb-4 rounded-b-lg  ${forceOpen || open ? "" : "hidden"}`}
    style={group.color && !dash.settings.display?.fullColorBorder
      ? `border-color: #${group.color}; border-left-width: 6px;`
      : ""}
  >
    <hr class="mb-3 -mx-4" />
    <div role="tablist" class="tabs tabs-lifted tabs-box">
      <button
        role="tab"
        class={`tab ${tab === "view" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "view")}>View</button
      >
      <button
        role="tab"
        class={`tab ${tab === "info" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "info")}>Info</button
      >
      <button
        role="tab"
        class={`tab ${tab === "groups" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "groups")}>Members</button
      >
    </div>
    <div class="flex flex-col p-2 rounded-b-lg tab-contents lg:p-4 bg-base-200">
      <GroupViewCreate bind:group {tab} bind:icon />
      <GroupInfoCreate bind:group {tab} bind:privacy={group.privacy} />
      {#if openedOnce && tabbedOnce}
        <GroupMemberCreate {memberList} {tab} bind:members />
      {/if}
      {#if duplicate}
        <DuplicateName type="group" {duplicate} />
      {/if}
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
          Group successfully created
        </div>
      {/if}
      <div class="flex flex-row items-center">
        <div class="mt-2 join">
          {#if !loading}
            <SubmitCreateButton
              bind:loading
              bind:err
              bind:success
              item={group}
              itemPath="groups"
              groupPath="members"
              {groupList}
              {memberList}
              groups={members}
              list={groupList}
              onSuccess={() => {
                group = createGroupCreationState()
                members = []
                icon = ""
              }}
            />
          {:else}
            <button class="btn btn-sm btn-neutral join-item" disabled>
              <Spinny /> Loading...
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

{#snippet iconImage(url: string, altText: string)}
  <img class="object-cover rounded-full item-icon" src={url} alt={altText} />
{/snippet}
