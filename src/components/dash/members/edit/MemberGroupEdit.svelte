<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash } from "$lib/dash/dash.svelte"
  import {
    IconRefresh,
    IconLoader,
    IconMinus,
    IconPlus,
    IconX,
    IconAlertTriangle,
  } from "@tabler/icons-svelte"
  import Svelecte from "svelecte"
  import AwaitHtml from "$components/dash/AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"

  let {
    groupsCurrent,
    member,
    mode = $bindable(),
    asPage = false,
  }: {
    groupsCurrent: Group[]
    member: Member
    mode: "view" | "edit"
    asPage?: boolean
  } = $props()

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)

  let uuidsCurrent: string[] = $state(groupsCurrent.map((g) => g.uuid || ""))
  let uuidSelection: string[] = $state(uuidsCurrent)

  let groupSelection: Group[] = $derived(
    !asPage
      ? dash.groups.list.raw
          .filter((g) => uuidSelection.includes(g.uuid || ""))
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
      : dash.member.groups
          .filter((g) => uuidSelection.includes(g.uuid || ""))
          .sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
  )

  let allOptions = $derived(
    !asPage
      ? dash.groups.list.raw
          .map((g) => {
            return {
              value: g.uuid,
              text: `${g.name} (${g.id})`,
              extra: g.display_name,
              included: uuidSelection.includes(g.uuid || ""),
            }
          })
          .sort((a, b) => a.text.localeCompare(b.text))
      : dash.member.groups
          .map((g) => {
            return {
              value: g.uuid,
              text: `${g.name} (${g.id})`,
              extra: g.display_name,
              included: uuidSelection.includes(g.uuid || ""),
            }
          })
          .sort((a, b) => a.text.localeCompare(b.text))
  )

  let edited = $derived(!$state.is(uuidSelection, uuidsCurrent))

  let toAdd: string[] = $state([])
  let toRemove: string[] = $state([])

  let formattedGroups = $derived(
    groupSelection.length <= 5
      ? groupSelection.map((g) => `[\`${g.id}\`] ${g.display_name || g.name}`).join("\n")
      : groupSelection.map((g) => g.display_name).join(", ")
  )

  let added = $derived(groupSelection.filter((g) => !uuidsCurrent.includes(g.uuid || "")))
  let removed = $derived(groupsCurrent.filter((g) => !uuidSelection.includes(g.uuid || "")))
</script>

<div class="alert mb-2 bg-warning/10">
  <IconAlertTriangle class="text-warning" /><span>This section is incomplete! You cannot submit your edits yet.</span>
</div>
<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing member groups</h4>
  {#if !loading}
    {#if edited}
      <button
        onclick={() => (mode = "view")}
        class="btn btn-sm btn-neutral join-item"
        aria-label="Cancel edit"
      >
        <IconX /> Cancel
      </button>
    {:else}
      <button
        onclick={() => (mode = "view")}
        class="btn btn-sm btn-neutral join-item"
        aria-label="Exit edit"
      >
        <IconX /> Exit
      </button>
    {/if}
  {:else}
    <button class="btn btn-sm btn-neutral join-item" disabled>
      <IconLoader /> Loading...
    </button>
  {/if}
</div>
<div class="flex flex-col h-min md:flex-row gap-2 lg:gap-3 flex-wrap">
  <div class="bg-base-100 w-full rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Edit groups</h5>
    <div class="flex flex-col md:flex-row gap-3">
      <div class="flex flex-col gap-2 flex-1">
        <label for={`${member.id}-add-group-input`}>Add group</label>
        <Svelecte
          inputId={`${member.id}-add-group-input`}
          class="svelecte-control-pk"
          highlightFirstItem={false}
          options={allOptions.filter((opt) => !opt.included)}
          multiple
          valueField="value"
          labelField="text"
          selectOnTab={true}
          bind:value={toAdd}
          onChange={() => {
            if (toAdd.length > 0) {
              uuidSelection = [...uuidSelection, ...toAdd]
            }
            toAdd = []
          }}
          {option}
        />
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <label for={`${member.id}-remove-group-input`}>Remove group</label>
        <Svelecte
          inputId={`${member.id}-remove-group-input`}
          class="svelecte-control-pk"
          highlightFirstItem={false}
          options={allOptions.filter((opt) => opt.included)}
          multiple
          valueField="value"
          labelField="text"
          selectOnTab={true}
          bind:value={toRemove}
          onChange={() => {
            if (toRemove.length > 0) {
              uuidSelection = uuidSelection.filter((g) => g !== toRemove[0])
            }
            toRemove = []
          }}
          {option}
        />
      </div>
    </div>
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Formatted preview</h5>
    <div class="text-sm discord-markdown">
      <AwaitHtml htmlPromise={parseMarkdown(formattedGroups, { embed: true })} />
    </div>
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Changes</h5>
    {#if added.length > 0}
      <hr />
      <div>
        <h6 class="flex flex-row gap-1 items-center mb-1">
          <IconPlus class="text-success" size={22} />
          Groups added
          <button
            class="btn btn-ghost btn-circle text-warning btn-sm ml-auto"
            title="Reset"
            aria-label="Reset added groups"
            onclick={() => (uuidSelection = uuidSelection.filter((g) => uuidsCurrent.includes(g)))}
          >
            <IconRefresh size={18} class="inline" />
          </button>
        </h6>
        {@render joinGroups(added)}
      </div>
    {/if}
    {#if removed.length > 0}
      <hr />
      <div>
        <h6 class="flex flex-row gap-1 items-center mb-1">
          <IconMinus class="text-error" size={22} />
          Groups removed
          <button
            class="btn btn-ghost btn-circle text-warning btn-sm ml-auto"
            title="Reset"
            aria-label="Reset removed groups"
            onclick={() =>
              (uuidSelection = [
                ...uuidsCurrent,
                ...uuidSelection.filter((g) => uuidsCurrent.includes(g)),
              ])}
          >
            <IconRefresh size={18} class="inline" />
          </button>
        </h6>
        {@render joinGroups(removed)}
      </div>
    {/if}
    {#if removed.length === 0 && added.length === 0}
      <span class="text-sm">No changes have been made yet.</span>
    {/if}
  </div>
</div>

{#snippet option(opt)}
  <div
    class={`option flex flex-row justify-between rounded -m-1 p-1 ${
      !opt.included ? "bg-success/20 hover:bg-success/40" : "bg-error/20 hover:bg-error/40"
    }`}
  >
    <span>{opt.text}</span>
    {#if !opt.included}
      <span title="Add group">
        <IconPlus size={20} class="text-success" />
      </span>
    {:else}
      <span title="Remove group">
        <IconMinus size={20} class="text-error" />
      </span>
    {/if}
  </div>
{/snippet}

{#snippet joinGroups(groups: Group[])}
  <ul class="discord-markdown text-sm flex flex-row flex-wrap gap-y-1 gap-x-3">
    {#each groups as group}
      <li>[<code>{group.id}</code>] {group.name}</li>
    {/each}
  </ul>
{/snippet}

<style>
  .option {
    width: calc(100% + 0.5rem);
  }
</style>
