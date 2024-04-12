<script lang="ts">
  import type { LayoutData } from "./$types"
  import { dash } from "$lib/dash/dash.svelte"

  export let data: LayoutData
  dash.tab = data.tab || "overview"
  dash.init(data.system, data.members, data.groups, data.privacyMode)
  dash.errors = data.errors
</script>

<slot />
