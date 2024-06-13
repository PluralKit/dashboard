<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { createMemberCreationState } from "$lib/dash/member/edit.svelte"
  import { IconLoader, IconPlus } from "@tabler/icons-svelte"
  import { untrack } from "svelte"
  import MemberViewCreate from "./MemberViewCreate.svelte"
  import MemberInfoCreate from "./MemberInfoCreate.svelte"
  import MemberGroupCreate from "./MemberGroupCreate.svelte"
  import type { Member, MemberPrivacy, proxytag } from "$api/types"
  import { fade } from "svelte/transition"
  import SubmitCreateButton from "$components/dash/edit/SubmitCreateButton.svelte"

  let {
    forceOpen = false,
    open = $bindable(false),
  }: {
    forceOpen?: boolean
    open?: boolean
  } = $props()

  let member: Member & {
    proxy_tags: proxytag[]
    privacy: MemberPrivacy
  } = $state(createMemberCreationState())
  let groups: string[] = $state([])

  let tab: "view" | "info" | "groups" = $state("view")

  let openedOnce = $state(false)
  $effect(() => {
    if (untrack(() => openedOnce)) return
    else if (isOpen) openedOnce = true
  })

  let isOpen = $derived(forceOpen ? true : open)

  let tabbedOnce = $state(false)
  $effect(() => {
    if (untrack(() => tabbedOnce)) return
    else if (tab === "groups") tabbedOnce = true
  })

  let err: string[] = $state([])
  let loading: boolean = $state(false)
  let success: boolean = $state(false)

  let avatar = $state("")
  let proxyAvatar = $state("")
</script>

<div
  class="bg-base-100 rounded-lg"
  style={member.color && dash.settings.display?.fullColorBorder
    ? `border-color: #${member.color}; border-left-width: 6px;`
    : ""}
>
  <button
    aria-label={`Open or close ${member.name}'s card`}
    onclick={() => (open = !open)}
    class="collapse-title px-2 py-2 lg:px-4 text-xl font-medium flex justify-between items-center"
  >
    <div class="flex items-center">
      <div class="mr-3">
        <IconPlus />
      </div>
      <span class="h-min"
        >Create new member
        <span class="font-light">
          {#if member.name}
            ({member.name})
          {/if}
        </span>
      </span>
    </div>
    <div class="h-14 ml-3">
      {#if proxyAvatar || avatar}
        <div class="avatar w-14 h-14">
          {@render iconImage(proxyAvatar || avatar || "", `${member.name}'s avatar'`)}
        </div>
      {/if}
    </div>
  </button>
  <div
    class={`px-2 lg:px-4 pb-4 rounded-b-lg  ${forceOpen || open ? "" : "hidden"}`}
    style={member.color && !dash.settings.display?.fullColorBorder
      ? `border-color: #${member.color}; border-left-width: 6px;`
      : ""}
  >
    <hr class="mb-3 -mx-4" />
    <div role="tablist" class="tabs tabs-lifted tabs-box">
      <button
        role="tab"
        class={`tab ${tab === "view" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "view")}>View</button
      >
      <button
        role="tab"
        class={`tab ${tab === "info" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "info")}>Info</button
      >
      <button
        role="tab"
        class={`tab ${tab === "groups" ? "tab-active bg-base-200" : ""}`}
        onclick={() => (tab = "groups")}>Groups</button
      >
    </div>
    <div class="tab-contents flex flex-col rounded-b-lg p-2 lg:p-4 bg-base-200">
      <MemberViewCreate bind:member {tab} bind:avatar bind:proxyAvatar />
      <MemberInfoCreate bind:member {tab} bind:privacy={member.privacy} />
      {#if openedOnce && tabbedOnce}
        <MemberGroupCreate bind:member {tab} bind:groups />
      {/if}
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
        Member successfully created
      </div>
    {/if}
    <div class="flex flex-row items-center">
      <div class="join mt-2">
        {#if !loading}
          <SubmitCreateButton
            bind:loading
            bind:err
            bind:success
            item={member}
            itemPath="members"
            groupPath="groups"
            groupList={groups}
            list={dash.members}
            onSuccess={() => {
              member = createMemberCreationState()
              groups = []
              avatar = ""
              proxyAvatar = ""
            }}
          />
        {:else}
          <button class="btn btn-sm btn-neutral join-item" disabled>
            <IconLoader /> Loading...
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

{#snippet iconImage(url: string, altText: string)}
  <img class="item-icon object-cover rounded-full" src={url} alt={altText} />
{/snippet}
