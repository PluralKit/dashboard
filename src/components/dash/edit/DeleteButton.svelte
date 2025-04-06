<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import { IconTrash } from "@tabler/icons-svelte"

  let {
    item,
    type,
    asPage,
    list,
    groupList,
  }: {
    item: Member | Group
    type: "member" | "group"
    asPage: boolean
    list: DashList<Member | Group>
    groupList: DashList<Group>
  } = $props()

  let element: HTMLDialogElement
  let idInput = $state("")

  async function submitDelete() {
    if (!browser) return

    const token = localStorage.getItem("pk-token") ?? ""

    await window.api(`${type}s/${item.uuid}`, {
      token,
      method: "DELETE",
    })

    element.close()

    if (!asPage) {
      list.list.raw = list.list.raw.filter((g) => g.uuid !== item.uuid)

      list.process(groupList.list.raw)
      list.paginate()
    } else {
      goto(`/dash/${dash.user?.id}?tab=${type}s`)
    }
  }

  function checkId(): boolean {
    const rawInput = idInput.split("-").join("").toLocaleLowerCase().trim()
    return rawInput === item.id
  }
</script>

<button class="mt-2 ml-auto btn btn-sm btn-error" onclick={() => element.showModal()}>
  <IconTrash /> Delete
</button>

<dialog bind:this={element} class="modal">
  <div class="max-w-xl modal-box">
    <form method="dialog">
      <button class="absolute text-lg btn btn-circle btn-ghost right-2 top-2">✕</button>
    </form>
    <h3 class="text-xl">
      Delete {type} (<b>{item.name}</b>)
    </h3>
    <p class="my-3 discord-markdown">
      If you're sure you want to delete this {type}, enter the {type} ID (<code>{item.id}</code>)
      below.
    </p>
    <input
      type="text"
      maxlength={10}
      bind:value={idInput}
      class="w-full input input-bordered placeholder-base-content/30"
      placeholder={`Enter "${item.id}" here...`}
    />
    <div class="flex flex-row items-center mt-2">
      <button
        class="ml-auto btn btn-error btn-sm"
        disabled={!checkId()}
        onclick={() => submitDelete()}
      >
        <IconTrash class="inline" />
        Delete {type}
      </button>
    </div>
  </div>
</dialog>
