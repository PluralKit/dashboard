<script lang="ts">
  import type { LayoutData } from "./$types"
  import { createConfigState, dash } from "$lib/dash/dash.svelte"
  import type { Config } from "$api/types"

  export let data: LayoutData
  dash.init(data.system, data.members, data.groups, data.privacyMode, data.view)
  dash.config = createConfigState(data.config) as Config
  dash.errors = data.errors
</script>

<slot />
