<script lang="ts">
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte"
  import { Base64 } from "js-base64"
  import CopyField from "./CopyField.svelte"
  import { page } from "$app/state"
  import { IconInfoCircle } from "@tabler/icons-svelte"

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
        m: [dash.members.filters, dash.members.sorts],
        g: [dash.groups.filters, dash.groups.sorts],
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
    <span class="text-muted text-sm block mt-2"
      ><IconInfoCircle class="inline" /> This will copy a link to your current dashboard view, including
      filters.</span
    >
  </div>
</div>
