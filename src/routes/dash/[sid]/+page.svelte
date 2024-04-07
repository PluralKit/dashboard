<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { getDashLink } from "$lib/dash/utils"
  import { page } from "$app/stores"
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="tabs tabs-boxed mb-3">
    <a role="tab" class="tab tab-active" href={getDashLink(dash.sid, "", $page.url.searchParams)}>Overview</a>
    <a role="tab" class="tab" href={getDashLink(dash.sid, "system", $page.url.searchParams)}>System</a>
    <a role="tab" class="tab" href={getDashLink(dash.sid, "members", $page.url.searchParams)}>Members</a>
    <a role="tab" class="tab" href={getDashLink(dash.sid, "groups", $page.url.searchParams)}>Groups</a>
  </div>
  <main>
    <p>
      {#if dash.privacyMode === PrivacyMode.PRIVATE}
        You currently have registered
      {:else}
        This system currently has registered
      {/if}
      {dash.members.list.length} members and {dash.groups.length} groups!
    </p>
  </main>
</div>
