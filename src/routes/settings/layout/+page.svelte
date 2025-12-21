<script lang="ts">
  import { dash, initDash } from "$lib/dash/dash.svelte"
  import { toggleSetting } from "$lib/dash/utils"

  initDash({ user: dash.user })
</script>

<h2 class="text-3xl my-4 font-bold" id="display">Display Settings</h2>
<p class="my-4">These settings affect the general display of the dashboard.<br/>
  They are saved in your browser's local storage, which means they will reset if you change browsers, or clear your browser data.</p>
<div class="grid grid-flow-row grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
  <div class="flex flex-row items-center gap-3 box justify-between">
    <label for="display-devmode">Show copy button next to fields (Dev Mode)</label>
    <input
      id="display-devmode"
      type="checkbox"
      class="toggle toggle-primary"
      checked={dash.settings.devMode}
      onchange={() => {
        toggleSetting(dash, "devMode")
      }}
    />
  </div>
</div>
<h3 class="text-2xl my-4" id="layout">Layout Settings</h3>
<div class="grid grid-flow-row grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
  <div class="flex flex-row items-center gap-3 box justify-between">
    <label for="layout-controlsattop">Show list controls at top of page</label>
    <input
      id="layout-controlsattop"
      type="checkbox"
      class="toggle toggle-primary"
      checked={dash.settings.display?.forceControlsAtTop}
      onchange={() => {
        toggleSetting(dash, "display", "forceControlsAtTop")
      }}
    />
  </div>

  <div class="flex flex-row items-center gap-3 box justify-between">
    <label for="layout-keepopen">Force collapsible cards open</label>
    <input
      id="layout-keepopen"
      type="checkbox"
      class="toggle toggle-primary"
      checked={dash.settings.display?.keepOpen}
      onchange={() => {
        toggleSetting(dash, "display", "keepOpen")
      }}
    />
  </div>

  <div class="flex flex-row items-center gap-3 box justify-between">
    <label for="layout-fullcolorborder">Show colored border on collapsed card</label>
    <input
      id="layout-fullcolorborder"
      type="checkbox"
      class="toggle toggle-primary"
      checked={dash.settings.display?.fullColorBorder}
      onchange={() => {
        toggleSetting(dash, "display", "fullColorBorder")
      }}
    />
  </div>
</div>
