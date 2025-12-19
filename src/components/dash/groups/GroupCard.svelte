<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte";
  import type { Group } from "$api/types"
  import { IconLock, IconShare, IconUser } from "@tabler/icons-svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import GroupLink from "./GroupLink.svelte"

  let {
    group,
    wide = dash.settings.display?.forceControlsAtTop === true,
    asPage,
  }: {
    group: Group
    asPage: boolean
    wide: boolean
  } = $props()
</script>

<div
  class={`center-small
    self-stretch flex flex-col w-full sm:w-1/2 md:w-1/3 ${!wide ? "xl:w-1/3" : ""}`}
>
  <div class="box bg-base-100 m-1 h-full px-0">
    <h4 class="text-xl p-3 pt-0 flex gap-2 items-center">
          {#if !group.privacy || !group.privacy.visibility}
            <IconUser size={20} />
          {:else if group.privacy.visibility === "private"}
            <IconLock size={20} />
          {:else}
            <IconShare size={20} />
          {/if}
          {group.name}
    </h4>
    <hr />
    <div class=" max-h-96 overflow-y-auto p-4 text-center flex flex-col">
      <img
        class="rounded-md aspect-square object-cover"
        src={group.icon ?? "/discord_icon.svg"}
        alt={group.icon
          ? `${group.name}'s icon`
          : "Default avatar"}
      />
      <div class="my-2">
      {#if group.display_name}
        <h5 class="text-lg discord-markdown">
          <AwaitHtml htmlPromise={parseMarkdown(group.display_name, { embed: true })} /></h5>
      {/if}
      </div>
      {#if group.description}
      <hr class="mb-4" />
      <div class="discord-markdown text-left mb-4">
        <AwaitHtml htmlPromise={parseMarkdown(group.description, { embed: true })} />
      </div>
      {/if}
      <hr class="mb-2">
      <div class="flex justify-around">
        <!-- 
          If there's enough demand I'll add the edit button back. Otherwise it's just extra maintenance
        
          <button
          class="btn btn-ghost btn-circle btn-lg text-center"
          title={`Edit group (${group.name})`}
          onclick={() => mode = "edit"}
        >
          <IconPencil size={36} class="inline" />
        </button> -->
        <GroupLink style="ghost" item={group} {asPage} />
      </div>
    </div>
  </div>
</div>
