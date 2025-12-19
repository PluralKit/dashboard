<script lang="ts">
  import { type System } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import { Base64 } from "js-base64"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import { IconEyeOff, IconSettings } from "@tabler/icons-svelte"
</script>

<div
  class="grid max-w-6xl grid-cols-1 gap-4 mx-auto sm:grid-cols-2 md:grid-cols-3 auto-cols-fr auto-rows-auto"
>
  <div class="box bg-base-100 sm:col-span-2 md:row-span-2 md:col-span-1">
    <div class="prose max-w-none">
      <h2>This is the dashboard!</h2>
      <p>You can view and edit your system, members and groups using the tabs right above.</p>
      <p>
        <b>Need help with anything?</b> You can
        <a class="text-primary" href="https://discord.gg/PczBt78"
          >find the support server over here</a
        >, or with the link in the header bar. The <i>#dashboard-website</i> channel is where questions
        about the dashboard should go.
      </p>
    </div>
  </div>
  <div class="flex flex-col box bg-base-100">
    <div class="flex flex-col flex-1 gap-3 md:flex-row">
      {#if dash.system}
        <div class="flex flex-row flex-1 gap-2">
          {@render systemIcon(dash.system)}
          <div class="flex flex-col flex-1 gap-1">
            <h3 class="text-lg font-semibold">
              {#if dash.system.name}
                <AwaitHtml htmlPromise={parseMarkdown(dash.system.name)}></AwaitHtml>
                <span class="font-normal text-muted">
                  ({dash.system.id})
                </span>
              {:else}
                System ID: {dash.system.id}
              {/if}
            </h3>
            <ul class="flex-1 text-sm">
              {#if !dash.errors.members}
                <li>
                  <span class="font-semibold">Member count:</span>
                  {dash.members.list.raw.length}
                </li>
              {/if}
              {#if !dash.errors.groups}
                <li>
                  <span class="font-semibold">Group count:</span>
                  {dash.groups.list.raw.length}
                </li>
              {/if}
            </ul>
          </div>
        </div>
      {:else}
        <div class="prose">
          <p>No info found about this user (this shouldn't even happen?)</p>
        </div>
      {/if}
    </div>
  </div>
  <div class="box bg-base-100">
    <h3 class="text-xl font-semibold">Statistics</h3>
    <p>Some cool stuff will go here.</p>
  </div>
  <div class="box bg-base-100 sm:col-span-2 md:row-span-2">
    <div class="prose max-w-none">
      <h3>Some useful tips</h3>
      <ul>
        <li>
          You can view your public system while logged in <a
            class="text-primary"
            href={`?public=true`}>by clicking this link</a
          >!
        </li>
        <li>
          There is an advanced filtering mode for powerusers, click the button on the top right of
          the filter panel to toggle.
        </li>
        <li>You can easily copy and paste anything by toggling dev mode.</li>
      </ul>
    </div>
  </div>
  <div class="box bg-base-100">
    <h3 class="font-semibold text-xl">Quick Links</h3>
    <ul class="mt-2 gap-1 flex flex-col">
      <li>
        <a class="btn btn-neutral btn-sm w-full" href={`./${dash.system?.id}/bulk-privacy`}>
          <IconEyeOff size={18} /> Bulk privacy settings
        </a>
      </li>
      <li></li>
      <li>
        <a class="btn btn-neutral btn-sm w-full" href={`./${dash.system?.id}/config`}>
          <IconSettings size={18} /> Config Settings
        </a>
      </li>
      <li></li>
    </ul>
  </div>
</div>

{#snippet systemIcon(system: System)}
  {#if system.avatar_url}
    <div class="avatar w-14 h-14">
      {@render iconImage(system.avatar_url || "", `Avatar of ${system.name ?? "this system"}`)}
    </div>
  {:else}
    <div class="avatar w-14 h-14">
      {@render iconImage("/discord_icon.svg", "Default avatar")}
    </div>
  {/if}
{/snippet}

{#snippet iconImage(url: string, altText: string)}
  <img class="object-cover rounded-full item-icon" src={url} alt={altText} />
{/snippet}
