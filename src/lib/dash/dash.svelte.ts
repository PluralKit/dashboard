import type { Group, Member, System } from "$api/types"
import { filterList, type FilterGroup } from "./filters.svelte"
import { fetchList } from "./utils"
import { createListSettings, paginateList, type ListSettings } from "./settings.svelte"
import { SortMode, createSort, sortList, type Sort } from "./sorts.svelte"

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
  fetch: (token?: string) => Promise<void>
}

export let dash = createDash()

function createDash() {
  let user: System | null = $state(null)
  let privacyMode: PrivacyMode = $state(PrivacyMode.PRIVATE)

  let systemData = $state(createSystemState())
  let memberList = $state(createMemberListState())
  let groupList = $state(createGroupListState())

  let member = $state(createMemberState())

  let ratelimited: Record<string, boolean> = $state({})
  let errors: Record<string, string> = $state({})

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
        paginate: memberList.paginateList,
        fetch: memberList.fetch
      }
    },
    get groups() {
      return {
        list: groupList.groups
      }
    },
    get system() {
      return systemData.system
    },
    get member() {
      return member
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
    get ratelimited() {
      return ratelimited
    },
    set ratelimited(ratelimit: Record<string, boolean>) {
      ratelimited = ratelimit
    },
    get errors() {
      return errors
    },
    set errors(error: Record<string, string>) {
      errors = error
    }
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
    createSort(SortMode.ALPHABETICAL, "name", "name", 1),
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
    fetch: async function (token?: string) {
      members = await fetchList(fetch, `systems/${dash.system?.id || "exmpl"}/members`, token)
      processedMembers = processList(members, filters, sorts)
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
    init: function (data: Member[]) {
      members = data
      processedMembers = processList(members, filters, sorts)
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
  }
}

function createGroupListState() {
  let groups: Group[] = $state([])
  return {
    get groups() {
      return {
        raw: groups
      }
    },
    init: (data: Group[]) => (groups = data),
  }
}

function createMemberState() {
  let member: Member | undefined = $state(undefined)
  let groups: Group[] = $state([])
  let privacyMode: PrivacyMode = $state(PrivacyMode.PUBLIC)
  
  return {
    get member() {
      return member
    },
    set member(m: Member|undefined) {
      member = m
    },
    get groups() {
      return groups
    },
    set groups(g: Group[]) {
      groups = g
    },
    get privacyMode() {
      return privacyMode
    },
    set privacyMode(mode: PrivacyMode) {
      privacyMode = mode
    }
  }
}

function processList<T>(raw: T[], filters: FilterGroup[], sorts: Sort[]) {
  let processed = filterList(raw, filters)
  return sortList(processed, sorts)
}