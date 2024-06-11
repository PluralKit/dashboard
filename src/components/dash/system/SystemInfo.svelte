<script lang="ts">
  import { IconEdit } from "@tabler/icons-svelte"
  import type { System } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import PrivacyDisplay from "../PrivacyDisplay.svelte"
  import moment from "moment"
  import CopyField from "../CopyField.svelte"

  let {
    system,
    tab,
    asPage,
  }: {
    system: System
    tab: string
    asPage: boolean
  } = $props()
</script>

<div style={tab !== "info" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">System details</h4>
    {#if !asPage && dash.privacyMode !== PrivacyMode.PUBLIC}
      <button class="btn btn-sm btn-primary p-2">
        <IconEdit class="inline" size={18} /> Edit
      </button>
    {/if}
  </div>
  {#if dash.settings.devMode && system.uuid}
    <div class="flex flex-col h-min mb-2 lg:mb-3">
      <ul class="menu bg-base-100 flex-1 rounded-box text-base">
        <li>
          <span
            class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
          >
            <span class="flex flex-row justify-start gap-2"
              ><b>UUID:</b>
              {system.uuid}
            </span>
            <CopyField class="ml-auto" field="UUID" value={system.uuid} />
          </span>
        </li>
      </ul>
    </div>
  {/if}
  {#if !system.created && !system.privacy}
    <div class="bg-base-100 rounded-box p-4 gap-2">
      <p>There is no additional information available for this system.</p>
    </div>
  {/if}
  <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
    {#if system.created}
      <ul class="menu bg-base-100 flex-1 rounded-box text-base">
        {#if system.created}
          <li>
            <span
              class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
            >
              <span class="flex flex-row justify-start gap-2"
                ><b>Created:</b>
                {moment(system.created).format("MMMM Do, YYYY")} (at {new Date(
                  system.created
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })})
              </span>
              <CopyField class="ml-auto" field="creation date" value={system.created} />
            </span>
          </li>
        {/if}
      </ul>
    {/if}
    {#if system.privacy}
      <div
        class="flex flex-col w-full bg-base-100 gap-2 md:flex-row xl:flex-row lg:gap-3 p-2 rounded-xl flex-wrap"
      >
        <b class="inline-block px-4 pt-2 w-full">Privacy settings:</b>
        <ul class="menu flex-1 text-base p-0 flex flex-col sm:flex-row">
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Member list:</b>
              <PrivacyDisplay value={system.privacy.member_list_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Group list:</b> <PrivacyDisplay value={system.privacy.group_list_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Description:</b>
              <PrivacyDisplay value={system.privacy.description_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Pronouns:</b> <PrivacyDisplay value={system.privacy.pronoun_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Current front:</b> <PrivacyDisplay value={system.privacy.front_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Front history:</b>
              <PrivacyDisplay value={system.privacy.front_history_privacy} /></span
            >
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>
