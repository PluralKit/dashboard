<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import AwaitHtml from "../AwaitHtml.svelte"
  import parseMarkdown from "$api/parseMarkdown"
  import SimplePagination from "../SimplePagination.svelte"
  import MemberLink from "./MemberLink.svelte"
  import MemberGroupEdit from "./edit/MemberGroupEdit.svelte"
  import MemberGroupList from "./MemberGroupList.svelte"
  import OpenEditButton from "../edit/OpenEditButton.svelte"
  import { deriveGroupsAsync, deriveGroups } from "$lib/dash/group/utils"
  import type { ApiError } from "$api"
  import { IconAlertTriangle } from "@tabler/icons-svelte"

  let {
    asPage = false,
    member,
    tab,
  }: {
    asPage?: boolean
    member: Member
    tab: string
  } = $props()

  let mode: "view" | "edit" = $state("view")

  let err = $state("")

  let list: Group[] = $derived(deriveGroups(member, asPage))
  let groups: Group[] = $state(deriveGroups(member, asPage))

  let groupPromise: Promise<Group[]> = $derived.by(async () => {
    try {
      return await deriveGroupsAsync(member, list, asPage)
    } catch (e) {
      err = (e as ApiError).message ?? "unknown error."
    }
    return list
  })

  $effect(() => {
    Promise.resolve(groupPromise).then((g) => (groups = g))
  })

  let formattedGroups: string = $derived(
    groups.length <= 5
      ? groups.map((g) => `[\`${g.id}\`] ${g.display_name || g.name}`).join("\n")
      : groups.map((g) => g.display_name || g.name).join(", ")
  )

  // dirty hack to make the formatted groups update on edit
  // there probably is a better way to do this, and I probably should submit a bug report to svelte!
  function noop(_: any) {}
  $effect(() => noop(formattedGroups))

  let itemsPerPage = 5
  let currentPage = $state(1)
</script>

<div style={tab !== "groups" ? "display: none;" : ""}>
  {#if mode === "view"}
    <div class="flex flex-row gap-2 justify-between items-center mb-3">
      <h4 class="text-2xl ml-3 font-medium">Group list</h4>
      {#if (!asPage && dash.privacyMode !== PrivacyMode.PUBLIC) || (asPage && dash.member.privacyMode !== PrivacyMode.PUBLIC)}
        <OpenEditButton bind:mode />
      {/if}
    </div>
    <div class="flex flex-col h-min md:flex-row flex-1 gap-2 lg:gap-3 xl:flex-row flex-wrap">
      {#if err}
        <div class="alert bg-warning/5 text-sm">
          <IconAlertTriangle class="text-warning" />
          <span>
            <b>Error fetching groups: {err}</b>. There might be some groups missing from this list
            as a result.
          </span>
        </div>
      {/if}
      <div class="rounded-xl bg-base-100 flex-1 p-6 py-4">
        <h5 class="text-lg mb-2">Group info</h5>
        {#await groupPromise}
          <span class="loading loading-spinner loading-xs text-muted"></span> fetching groups...
        {:then}
          <div class="flex flex-row justify-between gap-2 items-start">
            <p class="mb-3">{groups.length} total groups</p>
            <SimplePagination {itemsPerPage} rawList={groups} bind:currentPage />
          </div>
          <MemberGroupList {groups} bind:currentPage {itemsPerPage} />
        {/await}
      </div>
      {#if groups.length > 0}
        <div class="rounded-xl text-sm discord-markdown bg-base-100 p-6 py-4 flex-1">
          <h5 class="text-lg mb-2">Formatted list</h5>
          {#await groupPromise}
            <span class="loading loading-spinner loading-xs text-muted"></span> fetching groups...
          {:then}
            <div>
              <AwaitHtml htmlPromise={parseMarkdown(formattedGroups, { embed: true })} />
            </div>
          {/await}
        </div>
      {/if}
      <div class="flex flex-row items-center justify-end gap-2 w-full">
        <OpenEditButton class="mt-2" bind:mode />
        <MemberLink item={member} {asPage} />
      </div>
    </div>
  {:else if mode === "edit"}
    <MemberGroupEdit bind:mode {member} groupsCurrent={groups} {asPage} />
  {/if}
</div>
