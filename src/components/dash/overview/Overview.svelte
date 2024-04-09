<script lang="ts">
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
</script>

<main>
  <p>
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
      You currently have registered
    {:else}
      This system currently has registered
    {/if}
    {dash.members.list.raw.length} members and {dash.groups.length} groups!
  </p>
</main>
