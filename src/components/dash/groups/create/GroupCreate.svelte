<script lang="ts">
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconLoader, IconPlus, IconAlertTriangle } from "@tabler/icons-svelte"
  import { untrack } from "svelte"
  import type { Group, GroupPrivacy, Member } from "$api/types"
  import { fade } from "svelte/transition"
  import SubmitCreateButton from "$components/dash/edit/SubmitCreateButton.svelte"
  import { createGroupCreationState } from "$lib/dash/group/edit.svelte"
  import GroupViewCreate from "./GroupViewCreate.svelte"
  import GroupInfoCreate from "./GroupInfoCreate.svelte"
  import GroupMemberCreate from "./GroupMemberCreate.svelte"
  import DuplicateName from "$components/dash/edit/DuplicateName.svelte"

  let {
    forceOpen = false,
    open = $bindable(false),
    groupList,
    memberList,
  }: {
    forceOpen?: boolean
    open?: boolean
    groupList: DashList<Group>
    memberList: DashList<Member>
  } = $props()

  let group: Group & {
    privacy: GroupPrivacy
  } = $state(createGroupCreationState())
  let members: string[] = $state([])

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
  class="bg-base-100 rounded-lg"
  style={group.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${group.color}; border-left-width: 6px;`
    : ""}
>
  <button
    aria-label={`Open or close ${group.name}'s card`}
    onclick={() => (open = !open)}
    class="collapse-title px-2 py-2 lg:px-4 text-xl font-medium flex justify-between items-center"
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
    <div class="h-14 ml-3">
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
    <div class="tab-contents flex flex-col rounded-b-lg p-2 lg:p-4 bg-base-200">
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
            <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-error/20 mt-2">
              {e}
            </div>
          {/if}
        {/each}
      {/if}
      {#if success}
        <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-success/20 mt-2">
          Group successfully created
        </div>
      {/if}
      <div class="flex flex-row items-center">
        <div class="join mt-2">
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
              <IconLoader /> Loading...
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

{#snippet iconImage(url: string, altText: string)}
  <img class="item-icon object-cover rounded-full" src={url} alt={altText} />
{/snippet}
