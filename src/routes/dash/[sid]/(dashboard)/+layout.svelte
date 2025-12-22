<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { dashTabs } from "$lib/dash/utils"
  import { initDash } from "$lib/dash/dash.svelte.js"
  let { children, data } = $props()

  initDash({...data, user: dash.user})
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="grid-cols-2 mb-4 tabs tabs-boxed md:grid-cols-none">
    {#each dashTabs as tab}
      {#if !tab.private || dash.privacyMode === PrivacyMode.PRIVATE}
        <a
          href={`/dash/${dash.system?.id}?tab=${tab.title.toLowerCase()}`}
          class="tab row-auto md:row-start-1"
        >
          {tab.title}
        </a>
      {/if}
    {/each}
  </div>
</div>


{@render children()}
