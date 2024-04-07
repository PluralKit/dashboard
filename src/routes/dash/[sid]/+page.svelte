<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
</script>

<ol>
  {#each dash.members as member (member.uuid)}
    <li><b>{member.name}</b> ({member.id})</li>
  {/each}
</ol>
