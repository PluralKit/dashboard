import type { Group, Member, System } from "$api/types"
import { filterList, type Filter, type FilterGroup } from "./filters"

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
          apply: memberList.applyFilters,
          clear: memberList.clearFilters,
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
  return {
    get members() {
      return processedMembers
    },
    get filters() {
      return filters
    },
    processList: function () {
      this.applyFilters()
    },
    clearFilters: () => {
      filters = []
    },
    applyFilters: () => {
      processedMembers = filterList<Member>(members, filters)
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
    init: (data: Member[]) => {
      members = data
      processedMembers = data
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
