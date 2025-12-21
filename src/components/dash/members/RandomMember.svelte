<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle, IconUserQuestion } from "@tabler/icons-svelte"
  import MemberList from "./MemberList.svelte"
  import ListControls from "../ListControls.svelte"
  import RandomControls from "../RandomControls.svelte"

  let wide = $derived(dash.settings.display?.forceControlsAtTop === true)

  let amount = $state(5)
  let selection: string[] = $state([])
  let members = $derived(dash.groups.list.raw.filter(g => selection.includes(g.uuid || "aaa")).flatMap(g => g.members || []))
  let privacyFilter = $state("all")

  function randomize() {
    dash.members.getRandom(amount, members.length > 0 ? members : undefined, privacyFilter)
    dash.members.paginate()
  }

  randomize()
</script>

{#if dash.errors.members}
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
    <IconAlertTriangle class="text-error" /> Error fetching members: {dash.errors.members}
  </div>
{/if}
<div
  class={`flex flex-col gap-8 mx-auto w-full max-w-4xl ${
    dash.settings.display?.forceControlsAtTop === true ? "" : "xl:flex-row xl:max-w-7xl"
  }`}
>
  <div class={dash.settings.display?.forceControlsAtTop === true ? "" : "xl:w-1/3"}>
    <div class="box bg-base-100 h-min">
      <div class="flex flex-col-reverse sm:flex-row sm:justify-between">
        <span class="mt-2 sm:mt-0">
          <h2 class="text-xl flex-1">
            <IconUserQuestion class="inline mr-2" /> Random Members
          </h2>
          <div class="text-sm mt-2">
            <a href="/settings/layout" class="link-secondary">Change layout settings</a>
          </div>
        </span>
      </div>
      <ListControls list={dash.members} wide={dash.settings.display?.forceControlsAtTop === true} />
      <button class="btn btn-sm w-full mt-4" onclick={randomize}>Randomize</button>
      <RandomControls bind:selection list={dash.groups} type="Groups" {randomize} bind:privacyFilter bind:amount {wide} />
    </div>
  </div>
  <div
    class={`flex flex-col gap-3 sm:gap-4 ${
      dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
    }`}
  >
    <MemberList privacyMode={dash.privacyMode} groupList={dash.groups} list={dash.members} />
  </div>
</div>
