<script lang="ts">
  import type { System } from "$api/types"
  import { IconEdit } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import ImageModal from "../ImageModal.svelte"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import CopyField from "../CopyField.svelte"
  import SystemViewEdit from "./edit/SystemViewEdit.svelte"

  let {
    system,
    tab,
    open,
    asPage,
  }: {
    system: System
    tab: string
    open: boolean
    asPage: boolean
  } = $props()

  let mode: "view" | "edit" = $state("view")
</script>

<div style={tab !== "view" ? "display: none;" : ""}>
  {#if mode === "view"}
    <div class="flex flex-row gap-2 justify-between items-center mb-3">
      <h4 class="text-2xl ml-3 font-medium">General information</h4>
      {#if (!asPage && dash.privacyMode !== PrivacyMode.PUBLIC)}
        <button onclick={() => (mode = "edit")} class="btn btn-sm btn-primary p-2">
          <IconEdit class="inline" size={18} /> Edit
        </button>
      {/if}
    </div>
    <div class={`flex flex-col gap-2 lg:gap-3 ${system.avatar_url ? "sm:flex-row" : ""}`}>
      {#if system.avatar_url || system.banner}
        <div class="flex flex-col gap-2">
          {#if system.avatar_url && open}
            <img
              class="rounded-lg hidden sm:block sm:w-36 h-auto self-start"
              src={system.avatar_url}
              alt={`Avatar of ${system.name ?? "this system"}`}
            />
          {/if}
          <ul class="flex-1 flex flex-col gap-1 justify-start">
            {#if system.avatar_url}
              <li>
                <ImageModal url={system.avatar_url} imageType="avatar" itemName={system.name || "this system"} />
              </li>
            {/if}
            {#if system.banner}
              <li>
                <ImageModal url={system.banner} imageType="banner" itemName={system.name || "this system"} />
              </li>
            {/if}
          </ul>
        </div>
      {/if}
      <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 flex-wrap">
        <ul class="menu bg-base-100 flex-1 rounded-box text-base">
          {#if system.id}
            <li>
              <span
                class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
              >
                <span class="flex flex-row justify-start gap-2"
                  ><b>ID:</b>
                  {system.id}
                </span>
                <CopyField class="ml-auto" field="id" value={system.id} />
              </span>
            </li>
          {/if}
          {#if system.name}
            <li>
              <span
                class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
              >
                <span class="flex flex-row justify-start gap-2"
                  ><b>Name:</b>
                  {system.name}
                </span>
                <CopyField class="ml-auto" field="name" value={system.name} />
              </span>
            </li>
          {/if}
        </ul>
        {#if system.pronouns || system.color}
          <ul class="menu bg-base-100 flex-1 rounded-box text-base">
            {#if system.pronouns}
              <li>
                <span
                  class="items-start discord-markdown text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
                >
                  <span class="flex flex-row justify-start gap-2"
                    ><b>Pronouns:</b>
                    <span><AwaitHtml htmlPromise={parseMarkdown(system.pronouns, { embed: true })} /></span>
                  </span>
                  <CopyField class="ml-auto" field="pronouns" value={system.pronouns} />
                </span>
              </li>
            {/if}
            {#if system.color}
              <li>
                <span
                  class="items-start text-left pr-1 justify-between gap-1 hover:bg-transparent hover:cursor-default"
                >
                  <span class="flex flex-row justify-start gap-2"
                    ><b>Color:</b>
                    #{system.color}
                  </span>
                  <CopyField class="ml-auto" field="color" value={system.color} />
                </span>
              </li>
            {/if}
          </ul>
        {/if}
        {#if system.description}
          <div class="flex flex-col w-full">
            <div
              class="ml-4 px-4 pt-2 pb-1 rounded-t-xl bg-base-100 w-fit font-bold flex flex-row gap-3"
            >
              Description <CopyField field="description" value={system.description} />
            </div>
            <div class="rounded-xl bg-base-100">
              <div class="discord-markdown p-6 py-4"
                style="word-wrap: anywhere;"
              >
                <AwaitHtml htmlPromise={parseMarkdown(system.description, { embed: true })} />
              </div>
              {#if system.banner && open}
                <img
                  class="rounded-b-xl w-full h-auto"
                  src={system.banner}
                  alt={`${system.name}'s banner`}
                />
              {/if}
            </div>
          </div>
        {:else if system.banner && open}
          <img
            class="rounded-xl w-full h-auto"
            src={system.banner}
            alt={`${system.name || "this system"}'s banner`}
          />
        {/if}
      </div>
    </div>
  {:else if mode === "edit"}
    <SystemViewEdit bind:mode />
  {/if}
</div>