import type { Group, Member, System } from "$api/types"
import { filterList, type FilterGroup } from "./filters.svelte"
import { createListSettings, paginateList, type ListSettings } from "./settings.svelte"
import { SortMode, sortList, type Sort } from "./sorts"

export enum PrivacyMode {
  PUBLIC,
  PRIVATE,
  SCOPED,
}

export interface DashList<T> {
  list: {
    raw: T[]
    processed: T[]
    paginated: T[]
  }
  filters: FilterGroup[]
  sorts: Sort[]
  settings: ListSettings
  process: () => void
  paginate: () => void
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
    get members(): DashList<Member> {
      return {
        list: memberList.members,
        get filters() {
          return memberList.filters
        },
        set filters(filterGroups: FilterGroup[]) {
          memberList.filters = filterGroups
        },
        sorts: memberList.sorts,
        settings: memberList.listSettings,
        process: memberList.processList,
        paginate: memberList.paginateList
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
  let listSettings: ListSettings = $state(createListSettings())

  let filters: FilterGroup[] = $state([])
  let sorts: Sort[] = $state([
    {
      mode: SortMode.ALPHABETICAL,
      order: 1,
      field: "name",
    },
  ])

  let members: Member[] = $state([])
  let processedMembers: Member[] = $state(processList(members, filters, sorts))
  let paginatedMembers: Member[] = $state(paginateList(processedMembers, listSettings))

  return {
    get members() {
      return {
        raw: members,
        processed: processedMembers,
        paginated: paginatedMembers,
      }
    },
    get filters() {
      return filters
    },
    set filters(groups: FilterGroup[]) {
      filters = groups
    },
    get sorts() {
      return sorts
    },
    set sorts(newSorts: Sort[]) {
      sorts = newSorts
    },
    get listSettings() {
      return listSettings
    },
    processList: function () {
      processedMembers = processList(members, filters, sorts)
      listSettings.currentPage = 1
    },
    paginateList: function () {
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
    init: function (data: Member[]) {
      members = data
      this.processList()
      this.paginateList()
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

function processList<T>(raw: T[], filters: FilterGroup[], sorts: Sort[]) {
  let processed = filterList(raw, filters)
  return sortList(processed, sorts)
}