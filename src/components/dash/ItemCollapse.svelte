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
  <div class="collapse-title text-xl font-medium">
    {item.name} <span class="font-light">({item.id})</span>
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

<style>
  .tab-contents {
    border: var(--tab-border, 1px) solid var(--fallback-b3, oklch(var(--b3) / 1));
    border-width: 0 var(--tab-border, 1px) var(--tab-border, 1px) var(--tab-border, 1px);
  }
</style>
