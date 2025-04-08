<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { toggleSetting } from "$lib/dash/utils"
  import { IconAddressBook, IconSettings } from "@tabler/icons-svelte"
</script>

<div class={`box bg-base-100 h-min`}>
  <div class="flex flex-row justify-between items-center">
    <h2 class="text-xl">
      <IconAddressBook class="inline mr-2" /> System options
    </h2>
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
      <a class="btn btn-sm btn-primary p-2 ml-2" href={`./${dash.system?.id}/config`}>
        <IconSettings class="inline" size={16} /> Config
      </a>
    {/if}
  </div>
  <div class="text-sm mt-2">
    <button
      class="text-secondary hover:text-primary cursor-pointer transition-all"
      onclick={() => toggleSetting(dash, "devMode")}
    >
      Dev mode
    </button>
    |
    <button
      class="text-secondary hover:text-primary cursor-pointer transition-all"
      onclick={() => toggleSetting(dash, "display", "fullColorBorder")}
    >
      Show colors
    </button>
  </div>
  <hr class="my-2" />
  <p class="my-4">Links to bulk privacy will go here.</p>
</div>
