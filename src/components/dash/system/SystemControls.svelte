<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { toggleSetting } from "$lib/dash/utils"
  import { IconAddressBook, IconSettings } from "@tabler/icons-svelte"
</script>

<div class={`box bg-base-100 h-min`}>
  <div class="flex flex-col-reverse sm:flex-row sm:justify-between">
    <span class="mt-2 sm:mt-0">
      <h2 class="text-xl flex-1">
        <IconAddressBook class="inline mr-2" /> System options
      </h2>
      <div class="text-sm mt-2">
        <a href="/settings/layout" class="link-secondary">Change layout settings</a>
      </div>
    </span>
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
      <a class="btn btn-sm btn-primary p-2 ml-2" href={`./${dash.system?.id}/config`}>
        <IconSettings class="inline" size={16} /> Config
      </a>
    {/if}
  </div>
  <hr class="my-2" />
  <p class="my-4">Links to bulk privacy will go here.</p>
</div>
