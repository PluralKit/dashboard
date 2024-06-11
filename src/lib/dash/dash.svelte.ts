import type { Group, Member, System } from "$api/types"
import {
  FilterMode,
  createFilter,
  createFilterGroup,
  filterList,
  type FilterGroup,
} from "./filters.svelte"
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
    options: SvelecteOption[]
  }
  filters: FilterGroup[]
  sorts: Sort[]
  settings: ListSettings
  process: (groupList?: Group[]) => void
  paginate: () => void
  fetch: (token?: string) => Promise<void>
}

export interface SvelecteOption {
  value: string | undefined
  text: string
  extra: string | undefined
}

export let dash = createDash()

function createDash() {
  let user: System | null = $state(null)
  let privacyMode: PrivacyMode = $state(PrivacyMode.PRIVATE)

  let systemData = $state(createSystemState())
  let memberList = $state(createMemberListState())
  let groupList = $state(createGroupListState())

  let member = $state(createMemberState())
  let group = $state(createGroupState())

  let ratelimited: Record<string, boolean> = $state({})
  let errors: Record<string, string> = $state({})

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
        get sorts() {
          return memberList.sorts
        },
        set sorts(sortList: Sort[]) {
          memberList.sorts = sortList
        },
        settings: memberList.listSettings,
        process: memberList.processList,
        paginate: memberList.paginateList,
        fetch: memberList.fetch,
      }
    },
    get groups() {
      return {
        list: groupList.groups,
        get filters() {
          return groupList.filters
        },
        set filters(filterGroups: FilterGroup[]) {
          groupList.filters = filterGroups
        },
        get sorts() {
          return groupList.sorts
        },
        set sorts(sortList: Sort[]) {
          groupList.sorts = sortList
        },
        settings: groupList.listSettings,
        process: groupList.processList,
        paginate: groupList.paginateList,
        fetch: groupList.fetch,
      }
    },
    get system() {
      return systemData.system
    },
    get member() {
      return member
    },
    get group() {
      return group
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

  let filters: FilterGroup[] = $state([
    createFilterGroup([createFilter("name", "name", FilterMode.INCLUDES, "")]),
  ])
  let sorts: Sort[] = $state([createSort(SortMode.ALPHABETICAL, "name", "name", 1)])

  let members: Member[] = $state([])
  let processedMembers: Member[] = $state(processList(members, filters, sorts))
  let paginatedMembers: Member[] = $state(paginateList(processedMembers, listSettings))

  let optionMembers: SvelecteOption[] = $derived(
    members
      .map((g) => {
        return { value: g.uuid, text: `${g.name} (${g.id})`, extra: g.display_name }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  )

  return {
    get members() {
      return {
        raw: members,
        processed: processedMembers,
        paginated: paginatedMembers,
        options: optionMembers,
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
    processList: function (groupList?: Group[]) {
      processedMembers = processList(members, filters, sorts, groupList)
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
  let listSettings: ListSettings = $state(createListSettings())

  let filters: FilterGroup[] = $state([
    createFilterGroup([createFilter("name", "name", FilterMode.INCLUDES, "")]),
  ])
  let sorts: Sort[] = $state([createSort(SortMode.ALPHABETICAL, "name", "name", 1)])

  let groups: Group[] = $state([])
  let processedGroups: Group[] = $state(processList(groups, filters, sorts))
  let paginatedGroups: Group[] = $state(paginateList(processedGroups, listSettings))

  let optionGroups: SvelecteOption[] = $derived(
    groups
      .map((g) => {
        return { value: g.uuid, text: `${g.name} (${g.id})`, extra: g.display_name }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  )

  return {
    get groups() {
      return {
        raw: groups,
        processed: processedGroups,
        paginated: paginatedGroups,
        options: optionGroups,
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
    processList: function (groupList?: Group[]) {
      processedGroups = processList(groups, filters, sorts, groupList)
    },
    paginateList: function () {
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
    fetch: async function (token?: string) {
      groups = await fetchList(
        fetch,
        `systems/${dash.system?.id || "exmpl"}/groups?with_members=true`,
        token
      )
      processedGroups = processList(groups, filters, sorts)
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
    init: function (data: Member[]) {
      groups = data
      processedGroups = processList(groups, filters, sorts)
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
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
    set member(m: Member | undefined) {
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
    },
  }
}

function createGroupState() {
  let group: Group | undefined = $state(undefined)
  let members: Member[] = $state([])
  let privacyMode: PrivacyMode = $state(PrivacyMode.PUBLIC)

  return {
    get group() {
      return group
    },
    set group(g: Group | undefined) {
      group = g
    },
    get members() {
      return members
    },
    set members(m: Member[]) {
      members = m
    },
    get privacyMode() {
      return privacyMode
    },
    set privacyMode(mode: PrivacyMode) {
      privacyMode = mode
    },
  }
}

function processList<T>(raw: T[], filters: FilterGroup[], sorts: Sort[], groupList?: Group[]) {
  let processed = filterList(raw, filters, groupList)
  return sortList(processed, sorts)
}
