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
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import { fade } from "svelte/transition"

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

  let uuidsCurrent: string[] = $derived(groupsCurrent.map((g) => g.uuid || ""))
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
              included: uuidsCurrent.includes(g.uuid || ""),
            }
          })
          .sort((a, b) => a.text.localeCompare(b.text))
      : dash.member.groups
          .map((g) => {
            return {
              value: g.uuid,
              text: `${g.name} (${g.id})`,
              extra: g.display_name,
              included: uuidsCurrent.includes(g.uuid || ""),
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
      : groupSelection.map((g) => g.display_name || g.name).join(", ")
  )

  let added = $derived(groupSelection.filter((g) => !uuidsCurrent.includes(g.uuid || "")))
  let removed = $derived(groupsCurrent.filter((g) => !uuidSelection.includes(g.uuid || "")))

  $effect(() => console.log(toRemove))
</script>

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
        <div class="flex flex-row gap-2 items-center">
          <button
            class="btn btn-success btn-xs"
            title="Add all"
            aria-label="Add all groups to member"
            onclick={() => {
              toAdd = allOptions.filter((opt) => !opt.included).map((g) => g.value || "")
              uuidSelection = uuidSelection = [...uuidsCurrent, ...toAdd].filter(
                (g) => !toRemove.includes(g)
              )
            }}
          >
            <IconPlus size={18} class="inline" />
          </button>
          <label for={`${member.id}-add-group-input`}>Add groups</label>
          {#if added.length > 0}
            <button
              class="btn btn-warning btn-xs ml-auto"
              title="Reset"
              aria-label="Reset added groups"
              onclick={() => {
                uuidSelection = uuidSelection.filter((g) => uuidsCurrent.includes(g))
                toAdd = []
              }}
            >
              <IconRefresh size={18} class="inline" />
            </button>
          {/if}
        </div>
        <Svelecte
          inputId={`${member.id}-add-group-input`}
          class="svelecte-control-pk"
          options={allOptions.filter((opt) => !opt.included)}
          multiple
          collapseSelection="blur"
          valueField="value"
          labelField="text"
          bind:value={toAdd}
          onChange={() => {
            uuidSelection = [...uuidsCurrent, ...toAdd].filter((g) => !toRemove.includes(g))
          }}
          {option}
        />
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex flex-row gap-2 items-center">
          <button
            class="btn btn-error btn-xs"
            title="Remove all"
            aria-label="Remove all groups from member"
            onclick={() => {
              toRemove = allOptions.filter((opt) => opt.included).map((g) => g.value || "")
              uuidSelection = uuidSelection = [...uuidsCurrent, ...toAdd].filter(
                (g) => !toRemove.includes(g)
              )
            }}
          >
            <IconMinus size={18} class="inline" />
          </button>
          <label for={`${member.id}-remove-group-input`}>Remove groups</label>

          {#if removed.length > 0}
            <button
              class="btn btn-warning btn-xs ml-auto"
              title="Reset"
              aria-label="Reset removed groups"
              onclick={() => {
                uuidSelection = [
                  ...uuidsCurrent,
                  ...uuidSelection.filter((g) => !uuidsCurrent.includes(g)),
                ]
                toRemove = []
              }}
            >
              <IconRefresh size={18} class="inline" />
            </button>
          {/if}
        </div>
        <Svelecte
          inputId={`${member.id}-remove-group-input`}
          class="svelecte-control-pk"
          options={allOptions.filter((opt) => opt.included)}
          multiple
          collapseSelection="blur"
          valueField="value"
          labelField="text"
          bind:value={toRemove}
          onChange={() => {
            uuidSelection = [...uuidsCurrent, ...toAdd].filter((g) => !toRemove.includes(g))
          }}
          {option}
        />
      </div>
    </div>
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Formatted preview</h5>
    {#if formattedGroups.length > 1000}
      <span class="text-sm"
        ><IconAlertTriangle class="text-warning inline-block mr-1" size={18} />The formatted groups
        take up more than 1000 characters. It will be cut off when viewed via the bot.</span
      >
    {/if}
    <div class="text-sm discord-markdown">
      <AwaitHtml htmlPromise={parseMarkdown(formattedGroups, { embed: true })} />
    </div>
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Changes</h5>
    <div class="text-sm">
      {uuidSelection.length} groups total ({added.length} added, {removed.length} removed)
    </div>
    {#if added.length > 0}
      <div>
        <h6 class="flex flex-row gap-1 items-center mb-1 mt-2">
          <IconPlus class="text-success" size={22} />
          Groups added
          <button
            class="btn btn-warning btn-xs ml-auto"
            title="Reset"
            aria-label="Reset added groups"
            onclick={() => {
              uuidSelection = uuidSelection.filter((g) => uuidsCurrent.includes(g))
              toAdd = []
            }}
          >
            <IconRefresh size={18} class="inline" />
          </button>
        </h6>
        {@render joinGroups(added)}
      </div>
    {/if}
    {#if removed.length > 0}
      <div>
        <h6 class="flex flex-row gap-1 items-center mb-1 mt-2">
          <IconMinus class="text-error" size={22} />
          Groups removed
          <button
            class="btn btn-warning btn-xs ml-auto"
            title="Reset"
            aria-label="Reset removed groups"
            onclick={() => {
              uuidSelection = [
                ...uuidsCurrent,
                ...uuidSelection.filter((g) => !uuidsCurrent.includes(g)),
              ]
              toRemove = []
            }}
          >
            <IconRefresh size={18} class="inline" />
          </button>
        </h6>
        {@render joinGroups(removed)}
      </div>
    {/if}
    {#if removed.length === 0 && added.length === 0}
      <div class="mt-3">No changes have been made yet.</div>
    {/if}
  </div>
</div>
{#if err.length > 0}
  {#each err as e}
    {#if e}
      <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-error/20 mt-2">
        {e}
      </div>
    {/if}
  {/each}
{/if}
{#if success}
  <div transition:fade={{ duration: 400 }} role="alert" class="alert bg-success/20 mt-2">
    Member successfully edited
  </div>
{/if}
<div class="flex flex-row items-center">
  <div class="join mt-2">
    {#if !loading}
      {#if edited}
        <SubmitEditButton
          onSuccess={() => {
            toAdd = []
            toRemove = []
            uuidSelection = uuidsCurrent
          }}
          bind:loading
          bind:err
          bind:success
          options={{
            member,
            body: uuidSelection,
            asPage,
          }}
          path={`members/${member.uuid}/groups/overwrite`}
        />
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
      <button onclick={() => (mode = "view")} class="btn btn-sm btn-neutral join-item" disabled>
        <IconLoader /> Loading...
      </button>
    {/if}
  </div>
</div>

{#snippet option(opt)}
  <div
    class={`option flex flex-row justify-between rounded -m-1 p-1 ${
      !opt.included ? "bg-success/10 hover:bg-success/25" : "bg-error/10 hover:bg-error/25"
    }`}
  >
    <span>{opt.text}</span>
    {#if !opt.included}
      <span title="Add group">
        <IconPlus size={20} />
      </span>
    {:else}
      <span title="Remove group">
        <IconMinus size={20} />
      </span>
    {/if}
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
