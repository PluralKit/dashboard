<script lang="ts">
  import { IconEdit } from "@tabler/icons-svelte"
  import type { Group } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import PrivacyDisplay from "../PrivacyDisplay.svelte"
  import moment from "moment"
  import CopyField from "../CopyField.svelte"
  import GroupLink from "./GroupLink.svelte"

  let {
    group,
    tab,
    asPage,
  }: {
    group: Group
    tab: string
    asPage: boolean
  } = $props()
</script>

<div style={tab !== "info" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Group details</h4>
    {#if (!asPage && dash.privacyMode !== PrivacyMode.PUBLIC) || (asPage && dash.group.privacyMode !== PrivacyMode.PUBLIC)}
      <button class="btn btn-sm btn-primary p-2">
        <IconEdit class="inline" size={18} /> Edit
      </button>
    {/if}
  </div>
  {#if dash.settings.devMode && group.uuid}
    <div class="flex flex-col h-min mb-2 lg:mb-3">
      <ul class="menu bg-base-100 flex-1 rounded-box text-base">
        <li>
          <span
            class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
          >
            <span class="flex flex-row justify-start gap-2"
              ><b>UUID:</b>
              {group.uuid}
            </span>
            <CopyField class="ml-auto" field="UUID" value={group.uuid} />
          </span>
        </li>
      </ul>
    </div>
  {/if}
  {#if !group.created && !group.privacy}
    <div class="bg-base-100 rounded-box p-4 gap-2">
      <p>There is no additional information available for this group.</p>
    </div>
  {/if}
  <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
    {#if group.created}
      <ul class="menu bg-base-100 flex-1 rounded-box text-base">
        {#if group.created}
          <li>
            <span
              class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
            >
              <span class="flex flex-row justify-start gap-2"
                ><b>Created:</b>
                {moment(group.created).format("MMMM Do, YYYY")} (at {new Date(
                  group.created
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })})
              </span>
              <CopyField class="ml-auto" field="creation date" value={group.created} />
            </span>
          </li>
        {/if}
      </ul>
    {/if}
    {#if group.privacy}
      <div
        class="flex flex-col w-full bg-base-100 gap-2 md:flex-row xl:flex-row lg:gap-3 p-2 rounded-xl flex-wrap"
      >
        <b class="inline-block px-4 pt-2 w-full">Privacy settings:</b>
        <ul class="menu flex-1 text-base p-0 flex flex-col sm:flex-row">
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Visibility:</b> <PrivacyDisplay value={group.privacy.visibility} />
            </span>
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Member list:</b> <PrivacyDisplay value={group.privacy.list_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Name:</b> <PrivacyDisplay value={group.privacy.name_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Description:</b>
              <PrivacyDisplay value={group.privacy.description_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Icon:</b> <PrivacyDisplay value={group.privacy.icon_privacy} /></span
            >
          </li>
          <li class="w-1/2">
            <span
              class="items-start text-left justify-start hover:bg-transparent hover:cursor-default"
              ><b>Metadata:</b> <PrivacyDisplay value={group.privacy.metadata_privacy} /></span
            >
          </li>
        </ul>
      </div>
    {/if}
  </div>
  <GroupLink {asPage} item={group} />
</div>
