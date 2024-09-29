<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { dash } from "$lib/dash/dash.svelte"
  import { IconTrash } from "@tabler/icons-svelte"

  let {
    item,
    type,
    asPage,
  }: {
    item: Member | Group
    type: "member" | "group"
    asPage: boolean
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
      if (type === "member") {
        dash.members.list.raw = dash.members.list.raw.filter((m) => m.uuid !== item.uuid)
        dash.groups.list.raw.forEach((g) => g.members?.filter((m) => m !== item.uuid))

        dash.members.process(dash.groups.list.raw)
        dash.members.paginate()
      } else if (type === "group") {
        dash.groups.list.raw = dash.groups.list.raw.filter((g) => g.uuid !== item.uuid)

        dash.groups.process()
        dash.groups.paginate()
      }
    } else {
      goto(`/dash/${dash.user?.id}?tab=${type}s`)
    }
  }

  function checkId(): boolean {
    const rawInput = idInput.split("-").join("").toLocaleLowerCase().trim()
    return rawInput === item.id
  }
</script>

<button class="btn btn-sm btn-error mt-2 ml-auto" onclick={() => element.showModal()}>
  <IconTrash /> Delete
</button>

<dialog tabindex="-1" bind:this={element} class="modal">
  <div class="modal-box max-w-xl">
    <form method="dialog">
      <button class="btn text-lg btn-circle btn-ghost absolute right-2 top-2">✕</button>
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
      class="input input-bordered w-full placeholder-base-content/30"
      placeholder={`Enter "${item.id}" here...`}
    />
    <div class="flex flex-row items-center mt-2">
      <button
        class="btn btn-error btn-sm ml-auto"
        disabled={!checkId()}
        onclick={() => submitDelete()}
      >
        <IconTrash class="inline" />
        Delete {type}
      </button>
    </div>
  </div>
</dialog>
