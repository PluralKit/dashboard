<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import { IconLock, IconShare } from "@tabler/icons-svelte"
  import MemberView from "./members/MemberView.svelte"
  import MemberInfo from "./members/MemberInfo.svelte"

  let {
    type,
    item,
    open = $bindable(false),
  }: {
    type: "member" | "group"
    item: Member | Group
    open?: boolean
  } = $props()

  let tab: "view" | "info" | "groups" = $state("view")

  $effect(() => console.log(open))
</script>

<div
  class="collapse bg-base-100 rounded-lg"
  style={item.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${item.color}; border-left-width: 6px;`
    : ""}
>
  <input type="checkbox" bind:checked={open} />
  <div class="collapse-title px-2 py-2 lg:px-4 text-xl font-medium flex justify-between items-center">
    <div class="flex items-center">
      <div class="mr-3">
        {#if item.privacy && item.privacy.visibility === "public"}
          <IconShare />
        {:else}
          <IconLock />
        {/if}
      </div>
      <span class="h-min">{item.name} <span class="font-light">({item.id})</span></span>
    </div>
    <div class="h-14 ml-3">
      {#if type === "member"}
        {@render memberIcon(item)}
      {/if}
    </div>
  </div>
  <div
    class="collapse-content px-2 lg:px-4"
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
      <button
        role="tab"
        class={`tab ${tab === "groups" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "groups")}>{type === "member" ? "Groups" : "Members"}</button
      >
    </div>
    <div class="tab-contents flex flex-col rounded-b-lg p-2 lg:p-4 bg-base-200">
      {#if type === "member"}
        {@render memberTabs(item, tab)}
      {/if}
    </div>
  </div>
</div>

{#snippet memberTabs(member: Member, tab: "view"|"info"|"groups")}
    <MemberView {member} {tab} {open} />
    <MemberInfo {member} {tab} />
{/snippet}

{#snippet memberIcon(member: Member)}
  {#if member.webhook_avatar_url || member.avatar_url}
    <button class="avatar w-14">
      {@render iconImage(
      member.webhook_avatar_url || member.avatar_url || "",
      `${member.name}'s avatar'`
    )}
  </button>
  {:else}
    <div class="avatar w-14">
      {@render iconImage(
        "/discord_icon.svg",
        "Default avatar"
      )}
    </div>
  {/if}
{/snippet}

{#snippet iconImage(url: string, altText: string)}
  <img class="item-icon rounded-full" src={url} alt={altText} />
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
