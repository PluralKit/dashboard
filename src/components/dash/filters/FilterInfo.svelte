<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { dash, type DashList } from "$lib/dash/dash.svelte"
  import {
    FilterMode,
    filterFieldType,
    groupArrayModes,
    type Filter,
  } from "$lib/dash/filters.svelte"
  import Svelecte from "svelecte"

  let {
    filter,
    list,
  }: {
    filter: Filter
    list: DashList<Member | Group>
  } = $props()

  const changeValue = (e: Event) => {
    const target = e.target as HTMLInputElement
    filter.value = filter.valueType === "number" ? parseInt(target.value) : target.value
    list.process(dash.groups.list.raw)
    list.paginate()
  }
</script>

<!-- We need to handle groups and members separately again -->
{#if filter.field === "group" && groupArrayModes.includes(filter.mode)}
  <Svelecte
    class="svelecte-control-pk w-full"
    options={dash.groups.list.options}
    multiple
    valueField="value"
    labelField="text"
    value={filter.value}
    on:change={(e) => {
      filter.value = e.detail.map((i: any) => i.value)
      list.process(dash.groups.list.raw)
      list.paginate()
    }}
  />
{:else if filter.field === "member" && groupArrayModes.includes(filter.mode)}
  <Svelecte
    class="svelecte-control-pk w-full"
    options={dash.members.list.options}
    multiple
    valueField="value"
    labelField="text"
    value={filter.value}
    on:change={(e) => {
      filter.value = e.detail.map((i: any) => i.value)
      list.process(dash.groups.list.raw)
      list.paginate()
    }}
  />
  <!-- TODO: privacy filtering here -->
  <!-- TODO: Same for proxy tags -->
{:else if filterFieldType(filter.field) === "date" && !(filter.mode === FilterMode.INCLUDES || filter.mode === FilterMode.EXCLUDES )}
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
