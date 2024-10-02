import type { Group, Member, proxytag, System } from "$api/types"
import {
  FilterMode,
  createFilter,
  createFilterGroup,
  createSimpleFilters,
  filterList,
  type FilterGroup,
} from "./filters.svelte"
import { fetchList } from "./utils"
import { createListSettings, paginateList, type ListSettings } from "./settings.svelte"
import { SortMode, createSimpleSorts, createSort, sortList, type Sort } from "./sorts.svelte"

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
  simpleFilters: FilterGroup[]
  simpleSorts: Sort[]
  settings: ListSettings
  proxytags?: SvelecteOption[]
  process: (groupList?: Group[]) => void
  paginate: () => void
  fetch: (token?: string) => Promise<void>
  init: (data: Member[] | Group[]) => void
}

export interface SvelecteOption {
  value: string | undefined
  text: string
  extra?: any
}

const getDashList = <T>(g: DashList<T>) => {
  return {
    list: g.list,
    get filters() {
      return g.filters
    },
    set filters(filterGroups: FilterGroup[]) {
      g.filters = filterGroups
    },
    get sorts() {
      return g.sorts
    },
    set sorts(sortList: Sort[]) {
      g.sorts = sortList
    },
    get simpleFilters() {
      return g.simpleFilters
    },
    set simpleFilters(filterGroups: FilterGroup[]) {
      g.simpleFilters = filterGroups
    },
    get simpleSorts() {
      return g.simpleSorts
    },
    set simpleSorts(sortList: Sort[]) {
      g.simpleSorts = sortList
    },
    get settings() {
      return g.settings
    },
    set settings(settings: ListSettings) {
      g.settings = settings
    },
    process: g.process,
    paginate: g.paginate,
    fetch: g.fetch,
    init: g.init,
  }
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
      return getDashList<Member>(memberList)
    },
    get groups() {
      return getDashList<Group>(groupList)
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

function createMemberListState(): DashList<Member> {
  let listSettings: ListSettings = $state(createListSettings())

  let filters: FilterGroup[] = $state([
    createFilterGroup([createFilter("name", "name", FilterMode.INCLUDES, "")]),
  ])
  let sorts: Sort[] = $state([createSort(SortMode.ALPHABETICAL, "name", "name", 1)])

  let simpleFilters: FilterGroup[] = $state([createSimpleFilters()])
  let simpleSorts: Sort[] = $state(createSimpleSorts())

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

  let proxyTags: SvelecteOption[] = $derived(
    members
      .flatMap((m) =>
        m.proxy_tags
          ? m.proxy_tags.map((t) => {
              return {
                extra: t,
                text: `${t.prefix ? t.prefix : ""}text${t.suffix ? t.suffix : ""}`,
                value: `${t.prefix ? t.prefix : ""}text${t.suffix ? t.suffix : ""}`,
              }
            })
          : []
      )
      .sort((a, b) => a.text.localeCompare(b.text))
  )

  return {
    get list() {
      return {
        get raw() {
          return members
        },
        set raw(value: Member[]) {
          members = value
        },
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
    get simpleFilters() {
      return simpleFilters
    },
    set simpleFilters(groups: FilterGroup[]) {
      simpleFilters = groups
    },
    get simpleSorts() {
      return simpleSorts
    },
    set simpleSorts(newSorts: Sort[]) {
      simpleSorts = newSorts
    },
    get proxytags() {
      return proxyTags
    },
    get settings() {
      return listSettings
    },
    set settings(settings: ListSettings) {
      listSettings = settings
    },
    process: function (groupList?: Group[]) {
      processedMembers = processList(
        members,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groupList
      )
    },
    paginate: function () {
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
    fetch: async function (token?: string, groups?: Group[]) {
      members = await fetchList(`systems/${dash.system?.id || "exmpl"}/members`, token)
      processedMembers = processList(
        members,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groups
      )
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
    init: function (data: Member[], groups?: Group[]) {
      members = data
      processedMembers = processList(
        members,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groups
      )
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
  }
}

function createGroupListState(): DashList<Group> {
  let listSettings: ListSettings = $state(createListSettings())

  let filters: FilterGroup[] = $state([
    createFilterGroup([createFilter("name", "name", FilterMode.INCLUDES, "")]),
  ])
  let sorts: Sort[] = $state([createSort(SortMode.ALPHABETICAL, "name", "name", 1)])

  let simpleFilters: FilterGroup[] = $state([createSimpleFilters("group")])
  let simpleSorts: Sort[] = $state(createSimpleSorts())

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
    get list() {
      return {
        get raw() {
          return groups
        },
        set raw(value: Group[]) {
          groups = value
        },
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
    get simpleFilters() {
      return simpleFilters
    },
    set simpleFilters(groups: FilterGroup[]) {
      simpleFilters = groups
    },
    get simpleSorts() {
      return simpleSorts
    },
    set simpleSorts(newSorts: Sort[]) {
      simpleSorts = newSorts
    },
    get settings() {
      return listSettings
    },
    set settings(settings: ListSettings) {
      listSettings = settings
    },
    process: function (groupList?: Group[]) {
      processedGroups = processList(
        groups,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groupList
      )
    },
    paginate: function () {
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
    fetch: async function (token?: string) {
      groups = await fetchList(
        `systems/${dash.system?.id || "exmpl"}/groups?with_members=true`,
        token
      )
      processedGroups = processList(
        groups,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts
      )
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
    init: function (data: Group[]) {
      groups = data
      processedGroups = processList(
        groups,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts
      )
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
  }
}

function createMemberState() {
  let member: Member | undefined = $state(undefined)
  let groups: DashList<Group> = $state(createGroupListState())
  let members: DashList<Member> = $state(createMemberListState())
  let privacyMode: PrivacyMode = $state(PrivacyMode.PUBLIC)

  return {
    get member() {
      return member
    },
    set member(m: Member | undefined) {
      member = m
    },
    get groups() {
      return getDashList<Group>(groups)
    },
    get members() {
      return getDashList<Member>(members)
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
  let members: DashList<Member> = $state(createMemberListState())
  let groups: DashList<Group> = $state(createGroupListState())
  let privacyMode: PrivacyMode = $state(PrivacyMode.PUBLIC)

  return {
    get group() {
      return group
    },
    set group(g: Group | undefined) {
      group = g
    },
    get members() {
      return getDashList<Member>(members)
    },
    get groups() {
      return getDashList<Group>(groups)
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
