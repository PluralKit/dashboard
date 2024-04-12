<script lang="ts">
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
</script>

<main class="prose">
  <p>
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
      You currently have registered
    {:else}
      This system currently has registered
    {/if}
    {dash.members.list.raw.length} members and {dash.groups.list.raw.length} groups!
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
      <a target="_blank" class="link-primary" href={`/dash/${dash.system?.id}?public=true`}
        >Visit public profile</a
      >
    {/if}
  </p>
</main>
