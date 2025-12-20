<script lang="ts">
  import type { Group, Member, System } from "$api/types"
  import { browser } from "$app/environment"

  let {
    type,
    item,
  }: {
    type: "member" | "group" | "system"
    item: Member | Group | System
  } = $props()
</script>

{#if browser}
{#if type === "member"}
  {#if (item as Member).webhook_avatar_url || (item as Member).avatar_url}
    <div class="avatar w-14 h-14">
      <img
        class="object-cover rounded-full item-icon"
        src={(item as Member).webhook_avatar_url || (item as Member).avatar_url || ""}
        alt={`${item.name}'s avatar'`}
      />
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      <img
        class="object-cover rounded-full item-icon"
        src="/discord_icon.svg"
        alt="Default avatar"
      />
    </div>
  {/if}
{:else if type === "system"}
  {#if (item as System).avatar_url}
    <div class="avatar w-14 h-14">
      <img
        class="object-cover rounded-full item-icon"
        src={(item as System).avatar_url || ""}
        alt={`Avatar of ${item.name ?? "this system"}`}
      />
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      <img
        class="object-cover rounded-full item-icon"
        src="/discord_icon.svg"
        alt="Default avatar"
      />
    </div>
  {/if}
{:else if type === "group"}
  {#if (item as Group).icon}
    <div class="avatar w-14 h-14">
      <img
        class="object-cover rounded-full item-icon"
        src={(item as Group).icon || ""}
        alt={`${item.name}'s icon'`}
      />
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      <img
        class="object-cover rounded-full item-icon"
        src="/discord_icon.svg"
        alt="Default avatar"
      />
    </div>
  {/if}
{/if}
{/if}