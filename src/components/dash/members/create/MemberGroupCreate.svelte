<script lang="ts">
  import parseMarkdown from "$api/parseMarkdown"
  import type { Group, Member } from "$api/types"
  import AwaitHtml from "$components/dash/AwaitHtml.svelte"
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle, IconPlus, IconRefresh } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"

  let {
    tab,
    groups = $bindable(),
  }: {
    tab: "view" | "info" | "groups"
    groups: string[]
  } = $props()

  let allOptions = $derived(
    dash.groups.list.raw
      .map((g) => {
        return {
          value: g.uuid,
          text: `${g.name} (${g.id})`,
          extra: g.display_name,
        }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  )

  let selectedGroups = $derived(
    dash.groups.list.raw
      .filter((g) => groups.includes(g.uuid || ""))
      .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let formattedGroups = $derived(
    selectedGroups.length <= 5
      ? selectedGroups.map((g) => `[\`${g.id}\`] ${g.display_name || g.name}`).join("\n")
      : selectedGroups.map((g) => g.display_name || g.name).join(", ")
  )
</script>

<div style={tab !== "groups" ? "display: none;" : ""}>
  <div class="flex flex-row gap-2 justify-between items-center mb-3">
    <h4 class="text-2xl ml-3 font-medium">Member groups</h4>
  </div>
  <div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
    <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Edit groups</h5>
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex flex-row gap-2 items-center">
            <button
              class="btn btn-success btn-xs"
              title="Add all"
              aria-label="Add all groups to member"
              onclick={() => (groups = dash.groups.list.raw.map((g) => g.uuid || ""))}
            >
              <IconPlus size={18} class="inline" />
            </button>
            <label for={`create-member-group-input`}>Add groups</label>
            {#if groups.length > 0}
              <button
                class="btn btn-warning btn-xs ml-auto"
                title="Reset"
                aria-label="Reset added groups"
                onclick={() => {
                  groups = []
                }}
              >
                <IconRefresh size={18} class="inline" />
              </button>
            {/if}
          </div>
          <Svelecte
            inputId={`create-member-group-input`}
            class="svelecte-control-pk"
            options={allOptions}
            multiple
            collapseSelection="blur"
            valueField="value"
            labelField="text"
            bind:value={groups}
            {option}
          />
        </div>
      </div>
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Changes</h5>
      <div class="text-sm">
        {groups.length} groups total
      </div>
      {#if groups.length > 0}
        <div>
          <h6 class="flex flex-row gap-1 items-center mb-1 mt-2">
            <IconPlus class="text-success" size={22} />
            Groups added
            <button
              class="btn btn-warning btn-xs ml-auto"
              title="Reset"
              aria-label="Reset added groups"
              onclick={() => (groups = [])}
            >
              <IconRefresh size={18} class="inline" />
            </button>
          </h6>
          {@render joinGroups(selectedGroups)}
        </div>
      {:else}
        <div class="mt-3">No groups have been selected yet.</div>
      {/if}
    </div>
    <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
      <h5 class="text-lg">Formatted preview</h5>
      {#if formattedGroups.length > 1000}
        <span class="text-sm"
          ><IconAlertTriangle class="text-warning inline-block mr-1" size={18} />The formatted
          groups take up more than 1000 characters. It will be cut off when viewed via the bot.</span
        >
      {/if}
      <div class="text-sm discord-markdown">
        <AwaitHtml htmlPromise={parseMarkdown(formattedGroups, { embed: true })} />
      </div>
    </div>
  </div>
</div>

{#snippet option(opt)}
  <div
    class={`option flex flex-row justify-between rounded -m-1 p-1 bg-success/10 hover:bg-success/25`}
  >
    <span>{opt.text}</span>
    <span title="Add group">
      <IconPlus size={20} />
    </span>
  </div>
{/snippet}

{#snippet joinGroups(groups: Group[])}
  <ul class="discord-markdown text-sm flex flex-row flex-wrap gap-y-1 gap-x-2">
    {#each groups as group, i}
      {#if i <= 10}
        <li>[<code>{group.id}</code>] {group.name}{i < groups.length - 1 ? ", " : ""}</li>
      {/if}
    {/each}
    {#if groups.length > 10}
      <li>and {groups.length - 10} more...</li>
    {/if}
  </ul>
{/snippet}

<style>
  .option {
    width: calc(100% + 0.5rem);
  }
</style>
