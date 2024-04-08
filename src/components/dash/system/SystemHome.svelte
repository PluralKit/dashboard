<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
</script>

<main class="prose">
  <h2>{dash.system?.name || dash.system?.id}</h2>
  <p>Stuff will go here</p>
</main>
