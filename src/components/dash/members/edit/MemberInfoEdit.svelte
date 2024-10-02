<script lang="ts">
  import type { Group, Member, MemberPrivacy, proxytag } from "$api/types"
  import DeleteButton from "$components/dash/edit/DeleteButton.svelte"
  import EditPrivacy from "$components/dash/edit/EditPrivacy.svelte"
  import EditProxyTag from "$components/dash/edit/EditProxyTag.svelte"
  import SubmitEditButton from "$components/dash/edit/SubmitEditButton.svelte"
  import { type DashList } from "$lib/dash/dash.svelte"
  import { createInfoEditState } from "$lib/dash/member/edit.svelte"
  import { IconLoader, IconPencil, IconPlus, IconAlertTriangle, IconX } from "@tabler/icons-svelte"
  import { fade } from "svelte/transition"

  let {
    mode = $bindable(),
    member,
    asPage,
    list,
    groupList,
  }: {
    mode: "view" | "edit"
    member: Member
    asPage: boolean
    list: DashList<Member>
    groupList: DashList<Group>
  } = $props()

  let editedState = $derived(createInfoEditState(member))

  // these are nested objects, so we have to handle them accordingly
  let edited = $derived.by(() => {
    // privacy has a $state for each privacy value
    // so loop through all of them and check if they're the same
    let privacy: MemberPrivacy | undefined = Object.fromEntries(
      Object.entries(editedState.privacy || {}).filter(([key, value]) => {
        return (
          $state.snapshot(value) !==
            $state.snapshot(member.privacy || {})[key as unknown as keyof MemberPrivacy] &&
          !(
            !$state.snapshot(value) &&
            !$state.snapshot(member.privacy || {})[key as unknown as keyof MemberPrivacy]
          )
        )
      })
    )

    if (Object.entries(privacy).length === 0) privacy = undefined

    // proxy tags only have one $state for the whole array
    // so converting it to a string and then comparing works fine
    const proxy_tags =
      JSON.stringify($state.snapshot(member.proxy_tags)) !==
      JSON.stringify($state.snapshot(editedState.proxy_tags))
        ? editedState.proxy_tags
        : undefined

    // filter out either that are undefined and thus unedited
    return Object.fromEntries(
      Object.entries({
        privacy,
        proxy_tags,
      }).filter(([_, value]) => value !== undefined)
    )
  })

  let err: string[] = $state([])
  let success = $state(false)
  let loading = $state(false)
  let duplicate: (proxytag & {
    member: string | undefined
  })[] = $derived(
    editedState.proxy_tags.flatMap((p) => {
      const m = list.list.raw.find((m) =>
        m.proxy_tags?.some(
          (t) =>
            (t.suffix === p.suffix || (!t.suffix && !p.suffix)) &&
            (t.prefix === p.prefix || (!t.prefix && !p.prefix))
        )
      )
      if (m && m.name !== member.name) return { ...p, member: m.name }
      else return []
    })
  )

  // we can't bind to the proxy tags directly
  // so we'll have to replace the whole array on edit
  function editProxyTag(event: Event, index: number, placement: "suffix" | "prefix") {
    const target = event.target as HTMLInputElement
    let tags = [...editedState.proxy_tags]

    const tag = editedState.proxy_tags[index]

    tags.splice(index, 1, {
      prefix: placement === "prefix" ? target.value : tag.prefix,
      suffix: placement === "suffix" ? target.value : tag.suffix,
    })

    editedState.proxy_tags = tags
  }

  function changeAllPrivacy(event: Event) {
    const target = event.target as HTMLSelectElement
    if (target.value === "public" || target.value === "private") {
      Object.entries(editedState.privacy).forEach(
        ([key]) => (editedState.privacy[key as keyof MemberPrivacy] = target.value)
      )
    } else if (target.value) {
      Object.entries(editedState.privacy).forEach(
        ([key]) =>
          (editedState.privacy[key as keyof MemberPrivacy] = (member.privacy as MemberPrivacy)[
            key as keyof MemberPrivacy
          ])
      )
    }
  }
</script>

<div class="flex flex-row gap-2 justify-between items-center mb-3">
  <h4 class="text-2xl ml-3 font-medium">Editing details</h4>
  {#if !loading}
    {#if Object.keys(edited).length > 0}
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
<div class="flex flex-col h-min gap-2 lg:gap-3">
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <div class="flex flex-row gap-3 items-center">
      <h5 class="text-lg">Proxy Tags</h5>
      {#if edited.proxy_tags}
        <span title="edited">
          <IconPencil size={26} class="text-info" />
        </span>
      {/if}
    </div>
    {#if duplicate.length > 0}
      <div class="alert bg-warning/10 mb-2 w-full mx-auto px-5 py-3">
        <IconAlertTriangle class="text-warning" />
        <div>
          {#each duplicate as dupe}
            <div>
              Member <b>{dupe.member}</b> already has the proxy tag
              <b>{dupe.prefix}text{dupe.suffix}</b>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    <hr />
    <div class="flex flex-col md:flex-row w-full flex-wrap">
      {#each editedState.proxy_tags as tag, index}
        <EditProxyTag {editedState} {index} {tag} {editProxyTag} />
      {/each}
      <button
        class="btn btn-sm btn-success mx-2 my-1"
        onclick={() => {
          editedState.proxy_tags.push({
            prefix: "",
            suffix: "",
          })
        }}
      >
        <IconPlus size={20} /> Add proxy tag
      </button>
    </div>
  </div>
  <div class="bg-base-100 flex-1 rounded-box p-4 gap-2 flex flex-col">
    <h5 class="text-lg">Privacy</h5>
    <hr />
    <ul class="flex flex-row flex-wrap">
      <li class="w-full px-2 py-1 flex flex-col">
        <label class="mb-1" for={`${member.uuid}-privacy-all`}>Set all to</label>
        <select
          class="input input-bordered input-sm"
          onchange={(e) => changeAllPrivacy(e)}
          id={`${member.uuid}-privacy-all`}
        >
          <option value="">Select privacy level...</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="nope">Reset to current</option>
        </select>
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <div class="flex flex-col">
          <EditPrivacy
            item={member}
            bind:value={editedState.privacy.visibility}
            original={member.privacy?.visibility}
            field="Visibility"
          />
        </div>
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.name_privacy}
          original={member.privacy?.name_privacy}
          field="Name"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.description_privacy}
          original={member.privacy?.description_privacy}
          field="Description"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.avatar_privacy}
          original={member.privacy?.avatar_privacy}
          field="Avatar"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.pronoun_privacy}
          original={member.privacy?.pronoun_privacy}
          field="Pronouns"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.birthday_privacy}
          original={member.privacy?.birthday_privacy}
          field="Birthday"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.proxy_privacy}
          original={member.privacy?.proxy_privacy}
          field="Proxy tags"
        />
      </li>
      <li class="w-full md:w-1/2 px-2 py-1">
        <EditPrivacy
          item={member}
          bind:value={editedState.privacy.metadata_privacy}
          original={member.privacy?.metadata_privacy}
          field="Metadata"
        />
      </li>
    </ul>
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
      {#if Object.keys(edited).length > 0}
        <SubmitEditButton
          {groupList}
          memberList={list}
          bind:loading
          bind:err
          bind:success
          options={{
            item: member,
            body: edited,
            list,
          }}
          path={`members/${member.uuid}`}
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
  <DeleteButton type="member" item={member} {asPage} {list} />
</div>
