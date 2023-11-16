<script lang="ts">
  import NavBar from "$components/NavBar.svelte"
  import "$lib/app.css"
  import type { LayoutData } from "./$types"

  export let data: LayoutData
</script>

<div class="w-screen min-h-screen bg-base-100 flex flex-col" data-theme={data.theme}>
  <NavBar />
  <slot />
</div>
