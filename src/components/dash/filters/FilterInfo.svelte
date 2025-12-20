<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { type DashList, type SvelecteOption } from "$lib/dash/dash.svelte"
  import {
    FilterMode,
    filterFieldType,
    groupArrayModes,
    type Filter,
  } from "$lib/dash/filters.svelte"
  import { proxyOptionFromString } from "$lib/dash/member/utils"
  import Svelecte from "svelecte"

  let {
    filter,
    list,
    groupList,
    memberList,
  }: {
    filter: Filter
    list: DashList<Member | Group>
    groupList: DashList<Group>
    memberList: DashList<Member>
  } = $props()

  let filterValue = $state(filter.value)

  let proxyValue: string[] = $state(filter.proxy ? filter.proxy : [])
  let proxyCreated: SvelecteOption | null = $state(null)

  const changeValue = (e: Event) => {
    const target = e.target as HTMLInputElement
    filter.value = filter.valueType === "number" ? parseInt(target.value) : target.value
  }
</script>

<!-- We need to handle groups and members separately again -->
{#if filter.field === "group" && groupArrayModes.includes(filter.mode)}
  <Svelecte
    class="svelecte-control-pk w-full"
    options={groupList.list.options}
    multiple
    valueField="value"
    labelField="text"
    bind:value={filterValue}
    onChange={() => {
      filter.value = $state.snapshot(filterValue)
    }}
  />
{:else if filter.field === "member" && groupArrayModes.includes(filter.mode)}
  <Svelecte
    class="svelecte-control-pk w-full"
    options={memberList.list.options}
    multiple
    valueField="value"
    labelField="text"
    bind:value={filterValue}
    onChange={() => {
      filter.value = $state.snapshot(filterValue)
    }}
  />
{:else if filter.privacy}
  <select
    class="input input-sm input-bordered"
    onchange={(e) => {
      filter.value = (e.target as HTMLSelectElement)?.value
    }}
    value={filter.value}
  >
    <option value="public">public</option>
    <option value="private">private</option>
  </select>
{:else if filter.proxy && filter.field === "proxy"}
  <Svelecte
    class="svelecte-control-pk w-full"
    options={list.proxyTags ? [...list.proxyTags] : []}
    multiple
    bind:value={proxyValue}
    valueField="value"
    labelField="text"
    onChange={() => {
      // we have to do it this way because svelecte doesn't automatically add created values to the selection...
      if (proxyCreated) {
        proxyValue.push(proxyCreated.value ? proxyCreated.value : "")
        proxyCreated = null
      }
      filter.proxy = $state.snapshot(proxyValue)
    }}
    strictMode={false}
    creatable
    createHandler={({ inputValue }) => {
      const proxy = proxyOptionFromString(inputValue)
      // only add the created value if it's not in the selection already
      if (filter.proxy && !filter.proxy?.some((p) => p === proxy.value)) {
        proxyCreated = proxy
      }
      return proxy
    }}
    option={proxyOption}
  />
{:else if filterFieldType(filter.field) === "date" && !(filter.mode === FilterMode.INCLUDES || filter.mode === FilterMode.EXCLUDES)}
  {#if filter.mode !== FilterMode.EMPTY && filter.mode !== FilterMode.NOTEMPTY}
    <input
      class="input input-sm input-bordered"
      type="date"
      value={filter.value}
      min={0}
      onchange={(e) => changeValue(e)}
    />
  {/if}
  <!-- The rest of the input types are either numbers or strings -->
{:else if filter.valueType === "number"}
  <input
    class="input input-sm input-bordered"
    placeholder={`Filter by ${filter.fieldName}...`}
    type="number"
    value={filter.value}
    min={0}
    onchange={(e) => changeValue(e)}
  />
{:else if filter.valueType === "string"}
  <input
    class="input input-sm input-bordered"
    placeholder={`Filter by ${filter.fieldName}...`}
    type="text"
    value={filter.value}
    onchange={(e) => changeValue(e)}
  />
{/if}

{#snippet proxyOption(opt: any)}
  <span
    >{opt.extra.prefix}<code class="px-0.5 bg-base-300 rounded-sm">text</code>{opt.extra
      .suffix}</span
  >
{/snippet}
