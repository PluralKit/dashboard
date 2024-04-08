<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
</script>

<main class="prose">
  <ol>
    {#each dash.members.list as member (member.uuid)}
      <li><b>{member.name}:</b> ({member.id})</li>
    {/each}
  </ol>
</main>
