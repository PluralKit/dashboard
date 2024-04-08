<script lang="ts">
  import { page } from "$app/stores"
  import { dash } from "$lib/dash/dash.svelte"
  import { FilterMode } from "$lib/dash/filters"
  import { getDashLink } from "$lib/dash/utils"
</script>

<main class="prose">
  <ol>
    {#each dash.members.list as member (member.uuid)}
      <li><b>{member.name}:</b> ({member.id})</li>
    {/each}
  </ol>
</main>
