<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="tabs tabs-boxed mb-3">
    <a role="tab" class="tab tab-active" href={`/dash/${dash.system.id}`}>Overview</a>
    <a role="tab" class="tab" href={`/dash/${dash.system.id}/system`}>System</a>
    <a role="tab" class="tab" href={`/dash/${dash.system.id}/members`}>Members</a>
    <a role="tab" class="tab" href={`/dash/${dash.system.id}/groups`}>Groups</a>
  </div>
  <main>
    <p>
      {#if dash.privacyMode === PrivacyMode.PRIVATE}
        You currently have registered
      {:else}
        This system currently has registered
      {/if}
      {dash.members.length} members and {dash.groups.length} groups!
    </p>
  </main>
</div>
