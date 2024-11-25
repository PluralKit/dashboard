<script lang="ts">
  import type { ActionData } from "./$types"
  import { enhance } from "$app/forms"
  import { PUBLIC_BASE_API_URL } from "$env/static/public"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"

  import ConfigOption from "./option.svelte"
  import { IconDeviceFloppy } from "@tabler/icons-svelte"
  import { IconPencil, IconTool } from "@tabler/icons-svelte"

  export let form: ActionData

  import type { PageData } from "./$types"

  export let data: PageData
  let editedData = { ...data.configData }

  async function submitEdit() {
    const token = localStorage.getItem("pk-token") || ""
    let response = await window.api(`systems/@me/settings`, {
      token,
      method: "PATCH",
      body: editedData,
    })
  }
</script>

<h2 class="text-3xl mb-4 font-bold" id="api-url">Config settings</h2>
<div class="flex flex-col gap-5">
  <ConfigOption
    original={data.configData.pings_enabled}
    value={editedData.pings_enabled}
    field="ping"
    description="Whether other users are able to mention you via a 🔔 reaction"
  >
    <input type="checkbox" bind:checked={editedData.pings_enabled} class="toggle" />
  </ConfigOption>

  <ConfigOption
    original={data.configData.member_default_private}
    value={editedData.member_default_private}
    field="private member"
    description="Whether member privacy is automatically set to private for new members"
  >
    <input type="checkbox" bind:checked={editedData.member_default_private} class="toggle" />
  </ConfigOption>

  <ConfigOption
    original={data.configData.group_default_private}
    value={editedData.group_default_private}
    field="private group"
    description="Whether group privacy is automatically set to private for new groups"
  >
    <input type="checkbox" bind:checked={editedData.group_default_private} class="toggle" />
  </ConfigOption>

  <ConfigOption
    original={data.configData.show_private_info}
    value={editedData.show_private_info}
    field="show private"
    description="Whether private information is shown to linked accounts by default"
  >
    <input type="checkbox" bind:checked={editedData.show_private_info} class="toggle" />
  </ConfigOption>

  <ConfigOption
    original={data.configData.member_limit}
    value={data.configData.member_limit}
    field="member limit"
    description="The maximum number of registered members for your system"
  >
    <span>{data.configData.member_limit}</span>
  </ConfigOption>

  <ConfigOption
    original={data.configData.group_limit}
    value={data.configData.group_limit}
    field="group limit"
    description="The maximum number of registered groups for your system"
  >
    <span>{data.configData.group_limit}</span>
  </ConfigOption>

  <button onclick={() => submitEdit()} class="btn btn-sm btn-success join-item">
    <IconDeviceFloppy /> Save
  </button>
</div>
