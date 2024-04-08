<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
</script>

<main class="prose">
  <ol>
    {#each dash.groups as group (group.uuid)}
      <li><b>{group.name}:</b> ({group.id})</li>
    {/each}
  </ol>
</main>
