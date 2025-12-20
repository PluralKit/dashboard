<script lang="ts">
  import type { Group, Member, MemberPrivacy, System } from "$api/types"
  import { dash, PrivacyMode, type DashList } from "$lib/dash/dash.svelte"
  import { IconLock, IconShare, IconUser } from "@tabler/icons-svelte"
  import MemberView from "./members/MemberView.svelte"
  import MemberInfo from "./members/MemberInfo.svelte"
  import MemberGroups from "./members/MemberGroups.svelte"
  import GroupView from "./groups/GroupView.svelte"
  import GroupInfo from "./groups/GroupInfo.svelte"
  import GroupMembers from "./groups/GroupMembers.svelte"
  import SystemView from "./system/SystemView.svelte"
  import SystemInfo from "./system/SystemInfo.svelte"
  import { untrack } from "svelte"

  let {
    type,
    item: i,
    forceOpen = false,
    asPage = false,
    open = $bindable(false),
    privacyMode,
    memberList,
    groupList,
  }: {
    type: "member" | "group" | "system"
    item: Member | Group | System
    open?: boolean
    asPage?: boolean
    forceOpen?: boolean
    privacyMode: PrivacyMode
    memberList: DashList<Member>
    groupList: DashList<Group>
  } = $props()

  let tab: "view" | "info" | "groups" = $state("view")

  let isOpen = $derived(forceOpen ? true : open)

  // checking which members are in what groups is a very expensive operation
  // we only load in the membergroup components when ready
  // so: 1. we've opened the card AND 2. already tabbed over to the group tab
  // but we don't want to unload the groups afterwards
  // which for example would cause us to lose state when editing
  // hence why these two variables exist
  let openedOnce = $state(false)
  $effect(() => {
    if (untrack(() => openedOnce)) return
    else if (isOpen) openedOnce = true
  })

  let tabbedOnce = $state(false)
  $effect(() => {
    if (untrack(() => tabbedOnce)) return
    else if (tab === "groups") tabbedOnce = true
  })

  let item = $state(i)
</script>

<div
  class="rounded-lg bg-base-100"
  style={item.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${item.color}; border-left-width: 6px;`
    : ""}
>
  <button
    aria-label={`Open or close ${item.name}'s card`}
    onclick={() => (open = !open)}
    class="flex items-center justify-between w-full px-2 py-2 text-xl font-medium collapse-title lg:px-4"
  >
    <div class="flex items-center min-w-0">
      <div class="mr-3">
        {#if !item.privacy || !(item.privacy as MemberPrivacy).visibility}
          <IconUser />
        {:else if (item.privacy as MemberPrivacy).visibility === "private"}
          <IconLock />
        {:else}
          <IconShare />
        {/if}
      </div>
      <div class="min-w-0 text-left h-min">
        <span class="break-words">{item.name}</span> <span class="font-light">({item.id})</span>
      </div>
    </div>
    <div class="ml-3 h-14">
      {#if type === "member"}
        {@render memberIcon(item)}
      {:else if type === "system"}
        {@render systemIcon(item)}
      {:else if type === "group"}
        {@render groupIcon(item)}
      {/if}
    </div>
  </button>
  <div
    class={`px-2 lg:px-4 pb-4 rounded-b-lg  ${forceOpen || open ? "" : "hidden"}`}
    style={item.color && !dash.settings.display?.fullColorBorder
      ? `border-color: #${item.color}; border-left-width: 6px;`
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
      {#if type === "member" || type === "group"}
        <button
          role="tab"
          class={`tab ${tab === "groups" ? "tab-active bg-base-200" : ""}`}
          onclick={() => (tab = "groups")}>{type === "member" ? "Groups" : "Members"}</button
        >
      {/if}
    </div>
    <div class="flex flex-col p-2 rounded-b-lg tab-contents lg:p-4 bg-base-200">
      {#if type === "member"}
          {#if openedOnce}
            <MemberView {privacyMode} {memberList} {groupList} bind:member={item} {tab} open={isOpen} {asPage} />
            <MemberInfo {privacyMode} {memberList} {groupList} bind:member={item} {tab} {asPage} />
            {#if tabbedOnce}
              <MemberGroups {privacyMode} {memberList} {groupList} bind:member={item} {tab} {asPage} />
            {/if}
          {/if}
      {:else if type === "system"}
          <SystemView bind:system={item} {tab} open={isOpen} {asPage} />
          <SystemInfo bind:system={item} {tab} {asPage} />
      {:else if type === "group"}
          {#if openedOnce}
            <GroupView {memberList} {privacyMode} list={groupList} bind:group={item} {tab} open={isOpen} {asPage} />
            <GroupInfo {memberList} {privacyMode} list={groupList} bind:group={item} {tab} {asPage} />
            {#if tabbedOnce}
              <GroupMembers {privacyMode} {memberList} {groupList} bind:group={item} {tab} {asPage} />
            {/if}
          {/if}
      {/if}
    </div>
  </div>
</div>

{#snippet memberIcon(member: Member)}
  {#if member.webhook_avatar_url || member.avatar_url}
    <div class="avatar w-14 h-14">
      {@render iconImage(
        member.webhook_avatar_url || member.avatar_url || "",
        `${member.name}'s avatar'`
      )}
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      {@render iconImage("/discord_icon.svg", "Default avatar")}
    </div>
  {/if}
{/snippet}

{#snippet systemIcon(system: System)}
  {#if system.avatar_url}
    <div class="avatar w-14 h-14">
      {@render iconImage(system.avatar_url || "", `Avatar of ${system.name ?? "this system"}`)}
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      {@render iconImage("/discord_icon.svg", "Default avatar")}
    </div>
  {/if}
{/snippet}

{#snippet groupIcon(group: Group)}
  {#if group.icon}
    <div class="avatar w-14 h-14">
      {@render iconImage(group.icon || "", `${group.name}'s icon'`)}
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      {@render iconImage("/discord_icon.svg", "Default avatar")}
    </div>
  {/if}
{/snippet}

{#snippet iconImage(url: string, altText: string)}
  <img class="object-cover rounded-full item-icon" src={url} alt={altText} />
{/snippet}

<style>
  .tab-contents {
    border: var(--tab-border, 1px) solid var(--fallback-b3, oklch(var(--b3) / 1));
    border-width: 0 var(--tab-border, 1px) var(--tab-border, 1px) var(--tab-border, 1px);
  }

  .item-icon {
    object-fit: cover;
  }
</style>
