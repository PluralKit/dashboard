<script lang="ts">
  import { page } from "$app/stores"
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode } from "$lib/dash/filters"
  import { getDashLink } from "$lib/dash/utils"
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="tabs tabs-boxed mb-3">
    <a role="tab" class="tab" href={getDashLink(dash.sid, "", $page.url.searchParams)}>Overview</a>
    <a role="tab" class="tab" href={getDashLink(dash.sid, "system", $page.url.searchParams)}>System</a>
    <a role="tab" class="tab tab-active" href={getDashLink(dash.sid, "members", $page.url.searchParams)}>Members</a>
    <a role="tab" class="tab" href={getDashLink(dash.sid, "groups", $page.url.searchParams)}>Groups</a>
  </div>
  <main class="prose">
    <ol>
      {#each dash.members.list as member (member.uuid)}
        <li><b>{member.name}:</b> ({member.id})</li>
      {/each}
    </ol>
  </main>
</div>
