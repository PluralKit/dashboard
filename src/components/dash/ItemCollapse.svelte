<script lang="ts">
  import { page } from "$app/stores"
  import type { Group, Member, MemberPrivacy, System } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import { IconLock, IconShare, IconUser } from "@tabler/icons-svelte"
  import MemberView from "./members/MemberView.svelte"
  import MemberInfo from "./members/MemberInfo.svelte"
  import MemberGroups from "./members/MemberGroups.svelte"
  import GroupView from "./groups/GroupView.svelte"
  import GroupInfo from "./groups/GroupInfo.svelte"
  import GroupMembers from "./groups/GroupMembers.svelte"
  import SystemView from "./system/SystemView.svelte"
  import SystemInfo from "./system/SystemInfo.svelte"

  let {
    type,
    item,
    forceOpen = false,
    asPage = false,
    open = $bindable(false),
  }: {
    type: "member" | "group" | "system"
    item: Member | Group | System
    open?: boolean
    asPage?: boolean
    forceOpen?: boolean
  } = $props()

  let tab: "view" | "info" | "groups" = $state("view")

  let isOpen = $derived(forceOpen ? true : open)
</script>

<div
  class="bg-base-100 rounded-lg"
  style={item.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${item.color}; border-left-width: 6px;`
    : ""}
>
  <button
    aria-label={`Open or close ${item.name}'s card`}
    onclick={() => (open = !open)}
    class="collapse-title px-2 py-2 lg:px-4 text-xl font-medium flex justify-between items-center"
  >
    <div class="flex items-center">
      <div class="mr-3">
        {#if !item.privacy || !(item.privacy as MemberPrivacy).visibility}
          <IconUser />
        {:else if (item.privacy as MemberPrivacy).visibility === "private"}
          <IconLock />
        {:else}
          <IconShare />
        {/if}
      </div>
      <span class="h-min">{item.name} <span class="font-light">({item.id})</span></span>
    </div>
    <div class="h-14 ml-3">
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
    <div class="tab-contents flex flex-col rounded-b-lg p-2 lg:p-4 bg-base-200">
      {#if type === "member"}
        {@render memberTabs(item, tab)}
      {:else if type === "system"}
        {@render systemTabs(item, tab)}
      {:else if type === "group"}
        {@render groupTabs(item, tab)}
      {/if}
    </div>
  </div>
</div>

{#snippet memberTabs(member: Member, tab: "view"|"info"|"groups")}
  <MemberView {member} {tab} open={isOpen} {asPage} />
  <MemberInfo {member} {tab} {asPage} />
  {#if tab === "groups"}
  <MemberGroups {member} {tab} {asPage} />
  {/if}
{/snippet}

{#snippet systemTabs(system: System, tab: "view"|"info"|"groups")}
  <SystemView {system} {tab} open={isOpen} {asPage} />
  <SystemInfo {system} {tab} {asPage}/>
{/snippet}

{#snippet groupTabs(group: Group, tab: "view"|"info"|"groups")}
  <GroupView {group} {tab} open={isOpen} {asPage} />
  <GroupInfo {group} {tab} {asPage} />
  {#if tab === "groups"}
  <GroupMembers {group} {tab} {asPage} />
  {/if}
{/snippet}

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
      {@render iconImage(
        system.avatar_url || "",
        `Avatar of ${system.name ?? "this system"}`
      )}
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
  <img class="item-icon object-cover rounded-full" src={url} alt={altText} />
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
