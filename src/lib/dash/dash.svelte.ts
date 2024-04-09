import type { Group, Member, System } from "$api/types"
import { filterList, type FilterGroup } from "./filters.svelte"
import { SortMode, sortList, type Sort } from "./sorts"

export enum PrivacyMode {
  PUBLIC,
  PRIVATE,
  SCOPED,
}

export let dash = createDash()

function createDash() {
  let user: System | null = $state(null)
  let privacyMode: PrivacyMode = $state(PrivacyMode.PRIVATE)
  let systemData = $state(createSystemState())
  let memberList = $state(createMemberListState())
  let groupList = $state(createGroupListState())

  let tab: string = $state("")
  let settings: Record<string, any> = $state({})
  return {
    get members() {
      return {
        list: memberList.members,
        filters: {
          list: memberList.filters,
          append: memberList.appendFilter,
          replace: memberList.replaceFilter,
          delete: memberList.removeFilter,
          insert: memberList.insertFilter,
          clear: memberList.clearFilters,
        },
        sorts: {
          list: memberList.sorts,
          append: memberList.appendSort,
          replace: memberList.replaceSort,
          delete: memberList.removeSort,
          insert: memberList.insertSort,
          clear: memberList.clearSorts,
        },
        process: memberList.processList,
      }
    },
    get groups() {
      return groupList.groups
    },
    get system() {
      return systemData.system
    },
    get privacyMode() {
      return privacyMode
    },
    get sid() {
      return systemData.system?.id ?? ""
    },
    get user() {
      return user
    },
    init: (system: System, members: Member[], groups: Group[], mode: PrivacyMode) => {
      systemData.init(system)
      memberList.init(members)
      groupList.init(groups)
      privacyMode = mode
    },
    initUser: (system: System | null) => {
      user = system
    },
    get tab() {
      return tab
    },
    set tab(newTab: string) {
      if (!newTab) newTab = "overview"
      tab = newTab
    },
    get settings() {
      return settings
    },
  }
}

function createSystemState() {
  let system: System | null = $state(null)
  return {
    get system() {
      return system
    },
    init: (data: System | null) => (system = data),
  }
}

function createMemberListState() {
  let members: Member[] = $state([])
  let processedMembers: Member[] = $state([])

  let filters: FilterGroup[] = $state([])
  let sorts: Sort[] = $state([
    {
      mode: SortMode.ALPHABETICAL,
      order: 1,
      field: "name",
    },
  ])

  return {
    get members() {
      return {
        raw: members,
        processed: processedMembers
      }
    },
    get filters() {
      return filters
    },
    get sorts() {
      return sorts
    },
    processList: function () {
      processedMembers = filterList(members, filters)
      processedMembers = sortList(processedMembers, sorts)
    },
    clearFilters: () => {
      filters = []
    },
    appendFilter: (filter: FilterGroup) => filters.push(filter),
    removeFilter: (index: number) => {
      filters.splice(index, 1)
    },
    replaceFilter: (filter: FilterGroup, index: number) => {
      filters.splice(index, 1, filter)
    },
    insertFilter: (filter: FilterGroup, index: number) => {
      filters.splice(index, 0, filter)
    },
    clearSorts: () => {
      sorts = []
    },
    appendSort: (sort: Sort) => sorts.push(sort),
    removeSort: (index: number) => {
      sorts.splice(index, 1)
    },
    replaceSort: (sort: Sort, index: number) => {
      sorts.splice(index, 1, sort)
    },
    insertSort: (sort: Sort, index: number) => {
      sorts.splice(index, 0, sort)
    },
    init: function (data: Member[]) {
      members = data
      this.processList()
    },
  }
}

function createGroupListState() {
  let groups: Group[] = $state([])
  return {
    get groups() {
      return groups
    },
    init: (data: Group[]) => (groups = data),
  }
}
