<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle, IconFolderQuestion } from "@tabler/icons-svelte"
  import ListControls from "../ListControls.svelte"
  import RandomControls from "../RandomControls.svelte"
  import GroupList from "./GroupList.svelte"

  let wide = $derived(dash.settings.display?.forceControlsAtTop === true)

  let amount = $state(5)
  let selection: string[] = $state([])
  let groups = $derived(dash.groups.list.raw.filter(g => g.members?.some(m => selection.includes(m))).flatMap(g => g.uuid || "aaa"))
  let privacyFilter = $state("all")

  function randomize() {
    dash.groups.getRandom(amount, groups.length > 0 ? groups : undefined, privacyFilter)
    dash.groups.paginate()
  }

  randomize()
</script>

{#if dash.errors.groups}
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
    <IconAlertTriangle class="text-error" /> Error fetching groups: {dash.errors.groups}
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
            <IconFolderQuestion class="inline mr-2" /> Random Groups
          </h2>
          <div class="text-sm mt-2">
            <a href="/settings/layout" class="link-secondary">Change layout settings</a>
          </div>
        </span>
      </div>
      <ListControls list={dash.groups} wide={dash.settings.display?.forceControlsAtTop === true} />
      <button class="btn btn-sm w-full mt-4" onclick={randomize}>Randomize</button>
      <RandomControls bind:selection list={dash.members} type="Members" {randomize} bind:privacyFilter bind:amount {wide} />
    </div>
  </div>
  <div
    class={`flex flex-col gap-3 sm:gap-4 ${
      dash.settings.display?.forceControlsAtTop === true ? "" : "lg:flex-1"
    }`}
  >
    <GroupList privacyMode={dash.privacyMode} memberList={dash.members} list={dash.groups} />
  </div>
</div>
