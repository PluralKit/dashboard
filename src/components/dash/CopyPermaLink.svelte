<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { Base64 } from "js-base64"
  import CopyField from "./CopyField.svelte"
  import { page } from "$app/state"

  let {
    tab,
  }: {
    tab: string
  } = $props()

  let viewUrl = $derived(
    Base64.encodeURI(
      JSON.stringify({
        system: dash.user?.id,
        public: dash.privacyMode !== PrivacyMode.PRIVATE,
        tab,
        m:
          dash.members.settings.filterMode === "advanced"
            ? [dash.members.filters, dash.members.sorts]
            : [dash.members.simpleFilters, dash.members.simpleSorts],
        g:
          dash.groups.settings.filterMode === "advanced"
            ? [dash.groups.filters, dash.groups.sorts]
            : [dash.groups.simpleFilters, dash.groups.simpleSorts],
      })
    )
  )
</script>

<div class="box bg-base-100 h-min mt-4">
  <div class="text-sm">
    <div class="flex flex-row gap-2 items-center w-full">
      <input
        id={`${dash.user?.uuid}-view-url`}
        type="text"
        disabled
        class="input input-bordered input-sm flex-1"
        value={viewUrl}
      />
      <CopyField
        value={`https://${page.url.host}/view/${viewUrl}`}
        field="permanent link"
        visible
      />
    </div>
  </div>
</div>
