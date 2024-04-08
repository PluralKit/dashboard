<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"

  let {
    type,
    item,
    open = $bindable(false),
  }: {
    type: "member" | "group"
    item: Member | Group
    open?: boolean
  } = $props()

  let tab: "view" | "edit" | "groups" = $state("view")
</script>

<div
  class="collapse bg-base-100 rounded-lg"
  style={item.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${item.color}; border-left-width: 6px;`
    : ""}
>
  <input type="checkbox" bind:checked={open} />
  <div class="collapse-title pr-4 py-2 text-xl font-medium flex justify-between items-center">
    <span class="h-min">{item.name} <span class="font-light">({item.id})</span></span>
    <div class="h-14">
      {#if type === "member"}
        {@render memberIcon(item)}
      {/if}
    </div>
  </div>
  <div
    class="collapse-content"
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
        class={`tab ${tab === "edit" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "edit")}>Edit</button
      >
      <button
        role="tab"
        class={`tab ${tab === "groups" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "groups")}>{type === "member" ? "Groups" : "Members"}</button
      >
    </div>
    <div class="tab-contents flex flex-col rounded-b-lg p-4 bg-base-200">
      {#if type === "member"}
        {@render memberTabs(item, tab)}
      {/if}
    </div>
  </div>
</div>

{#snippet memberTabs(member: Member, tab: "view"|"edit"|"groups")}
  {#if tab === "view"}
    hi {member.name}!
  {:else if tab === "edit"}
    oooo an edit tab
  {:else if tab === "groups"}
    group info goes here :D
  {:else}
    what. how
  {/if}
{/snippet}

{#snippet memberIcon(member: Member)}
  {#if member.webhook_avatar_url || member.avatar_url}
    <button class="avatar w-14 z-10">
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
