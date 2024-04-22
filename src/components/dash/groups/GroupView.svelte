<script lang="ts">
  import type { Group } from "$api/types"
  import { IconEdit } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import ImageModal from "../ImageModal.svelte"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import CopyField from "../CopyField.svelte"

  let {
    group,
    tab,
    open,
  }: {
    group: Group
    tab: string
    open: boolean
  } = $props()
</script>

<div style={tab !== "view" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">General information</h4>
    {#if dash.privacyMode !== PrivacyMode.PUBLIC}
      <button class="btn btn-sm btn-primary p-2">
        <IconEdit class="inline" size={18} /> Edit
      </button>
    {/if}
  </div>
  <div class={`flex flex-col gap-2 lg:gap-3 ${group.icon ? "sm:flex-row" : ""}`}>
    {#if group.icon || group.banner}
      <div class="flex flex-col gap-2">
        {#if group.icon && open}
          <img
            class="rounded-lg hidden sm:block sm:w-36 h-auto self-start"
            src={group.icon}
            alt={`${group.name}'s icon`}
          />
        {/if}
        <ul class="flex-1 flex flex-col gap-1 justify-start">
          {#if group.icon}
            <li>
              <ImageModal url={group.icon} imageType="icon" itemName={group.name} />
            </li>
          {/if}
          {#if group.banner}
            <li>
              <ImageModal url={group.banner} imageType="banner" itemName={group.name} />
            </li>
          {/if}
        </ul>
      </div>
    {/if}
    <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
      <ul class="menu bg-base-100 flex-1 rounded-box text-base">
        {#if group.id}
          <li>
            <span
              class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
            >
              <span class="flex flex-row justify-start gap-2"
                ><b>ID:</b>
                {group.id}
              </span>
              <CopyField class="ml-auto" field="id" value={group.id} />
            </span>
          </li>
        {/if}
        {#if group.name}
          <li>
            <span
              class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
            >
              <span class="flex flex-row justify-start gap-2"
                ><b>Name:</b>
                {group.name}
              </span>
              <CopyField class="ml-auto" field="name" value={group.name} />
            </span>
          </li>
        {/if}
        {#if group.display_name}
          <li>
            <span
              class="items-start pr-1 text-left justify-between gap-1 hover:bg-transparent hover:cursor-default"
            >
              <span class="flex flex-row justify-start gap-2 discord-markdown"
                ><b class="block w-fit">Display name:</b>
                <span><AwaitHtml htmlPromise={parseMarkdown(group.display_name, { embed: true })} /></span>
              </span>
              <CopyField class="ml-auto" field="display name" value={group.display_name} />
            </span>
          </li>
        {/if}
      </ul>
      {#if group.description}
        <div class="flex flex-col w-full">
          <div
            class="ml-4 px-4 pt-2 pb-1 rounded-t-xl bg-base-100 w-fit font-bold flex flex-row gap-3"
          >
            Description <CopyField field="description" value={group.description} />
          </div>
          <div class="rounded-xl bg-base-100">
            <div class="discord-markdown p-6 py-4">
              <AwaitHtml htmlPromise={parseMarkdown(group.description, { embed: true })} />
            </div>
            {#if group.banner && open}
              <img
                class="rounded-b-xl w-full h-auto"
                src={group.banner}
                alt={`${group.name}'s banner`}
              />
            {/if}
          </div>
        </div>
      {:else if group.banner && open}
        <img class="rounded-xl w-full h-auto" src={group.banner} alt={`${group.name}'s banner`} />
      {/if}
    </div>
  </div>
</div>
