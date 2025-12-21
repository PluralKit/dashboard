<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, PrivacyMode, type DashList } from "$lib/dash/dash.svelte"
  import Svelecte from "svelecte"

  let {
    wide,
    amount = $bindable(),
    randomize,
    privacyFilter = $bindable(),
    list,
    type,
    selection = $bindable()
  }: {
    wide: boolean,
    amount: number,
    randomize: () => void,
    privacyFilter: string,
    list: DashList<Member|Group>,
    type: string,
    selection: string[]
  } = $props()
</script>

<div
  class={`grid grid-col-1 md:grid-cols-2 gap-2 mt-4 mb-2 ${
    wide === true ? "xl:grid-cols-2" : "xl:grid-cols-1"
  }`}
>
  <div class="join">
    <label
      class="input input-disabled input-bordered input-sm  w-fitjoin-item"
      for="random-list-amount">Amount</label
    >
    <input
      class="input input-sm input-bordered join-item flex-1 w-full"
      id="random-list-amount"
      bind:value={amount}
      onchange={randomize}
      type="number"
      min={1}
    />
  </div>
  <div class="join">
        <label
          class="input input-disabled input-bordered input-sm w-fit join-item"
          for="member-list-group-search">{type}</label
        >
        <Svelecte
          class="svelecte-control-pk join-item w-full text-sm"
          options={list.list.options}
          multiple
          valueField="value"
          labelField="text"
          bind:value={selection}
          onChange={randomize}
        />
      </div>
  {#if dash.privacyMode === PrivacyMode.PRIVATE}
  <div class="join flex-1">
      <label
        class="input input-disabled input-bordered input-sm w-fit join-item"
        for="random-list-filter-privacy">Visibility</label
      >
      <select
        class="input input-sm input-bordered join-item flex-1"
        id="random-list-filter-privacy"
        bind:value={privacyFilter}
        onchange={randomize}
      >
        <option value="all">All</option>
        <option value="public">Public only</option>
        <option value="private">Private only</option>
      </select>
    </div>
  {/if}
</div>
