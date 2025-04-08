import type { Config, Group, Member, proxytag, System } from "$api/types"
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
import { mapMemberGroups } from "./member/utils"

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
  filter: string[] | undefined
  page: Member | Group | undefined
  process: (groupList?: Group[]) => void
  paginate: () => void
  fetch: (token?: string, groups?: Group[]) => Promise<void>
  init: (data: Member[] | Group[], groups?: Group[], view?: any) => void
}

export interface SvelecteOption {
  value: string | undefined
  text: string
  extra?: any
}

const getDashList = <T>(l: DashList<T>) => {
  return {
    list: l.list,
    get filters() {
      return l.filters
    },
    set filters(filterGroups: FilterGroup[]) {
      l.filters = filterGroups
    },
    get sorts() {
      return l.sorts
    },
    set sorts(sortList: Sort[]) {
      l.sorts = sortList
    },
    get simpleFilters() {
      return l.simpleFilters
    },
    set simpleFilters(filterGroups: FilterGroup[]) {
      l.simpleFilters = filterGroups
    },
    get simpleSorts() {
      return l.simpleSorts
    },
    set simpleSorts(sortList: Sort[]) {
      l.simpleSorts = sortList
    },
    get settings() {
      return l.settings
    },
    set settings(settings: ListSettings) {
      l.settings = settings
    },
    get filter() {
      return l.filter
    },
    set filter(f: string[] | undefined) {
      l.filter = f
    },
    get page() {
      return l.page
    },
    set page(p: Member | Group | undefined) {
      l.page = p
    },
    process: l.process,
    paginate: l.paginate,
    fetch: l.fetch,
    init: l.init,
  }
}

export let dash = createDash()

function createDash() {
  let user: System | null = $state(null)
  let privacyMode: PrivacyMode = $state(PrivacyMode.PRIVATE)

  let systemData = $state(createSystemState())
  let memberList = $state(createMemberListState())
  let groupList = $state(createGroupListState())

  let configSettings = createConfigState()

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
    get config() {
      return configSettings as Config
    },
    set config(value: Config | undefined) {
      configSettings = createConfigState(value as Config)
    },
    init: (system: System, members: Member[], groups: Group[], mode: PrivacyMode, view?: any) => {
      systemData.init(system)
      memberList.init(members, groups, view)
      groupList.init(groups, view)
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

  let groupFilter: string[] | undefined = $state(undefined)
  let page: Group | undefined = $state(undefined)

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
    get filter() {
      return groupFilter
    },
    set filter(g: string[] | undefined) {
      groupFilter = g
    },
    get page() {
      return page
    },
    set page(p: Group | undefined) {
      page = p
    },
    process: function (groupList?: Group[]) {
      processedMembers = processList(
        groupFilter ? members.filter((m) => groupFilter?.find((g) => g === m.uuid)) : members,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groupList
      )
    },
    paginate: function () {
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
    fetch: async function (token?: string, groups?: Group[]) {
      members = mapMemberGroups(
        await fetchList(`systems/${dash.system?.id || "exmpl"}/members`, token),
        groups || []
      )
      processedMembers = processList(
        groupFilter ? members.filter((m) => groupFilter?.find((g) => g === m.uuid)) : members,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groups
      )
      paginatedMembers = paginateList(processedMembers, listSettings)
    },
    init: function (data: Member[], groups?: Group[], view?: any) {
      members = mapMemberGroups(data, groups || [])
      if (view && view.m) {
        if (Array.isArray(view.m) && view.m.length >= 2) {
          filters = view.m[0]
          sorts = view.m[1]
          if (view.m.length > 2) {
            this.settings.viewType = view.m[2]
            console.log(this.settings.viewType, view.m[2])
            this.settings.changeView()
          }
          this.settings.filterMode = "advanced"
        }
      }
      processedMembers = processList(
        groupFilter ? members.filter((m) => groupFilter?.find((g) => g === m.uuid)) : members,
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

  let memberFilter: string[] | undefined = $state(undefined)
  let page: Member | undefined = $state(undefined)

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
    get filter() {
      return memberFilter
    },
    set filter(m: string[] | undefined) {
      memberFilter = m
    },
    get page() {
      return page
    },
    set page(p: Member | undefined) {
      page = p
    },
    process: function (groupList?: Group[]) {
      processedGroups = processList(
        memberFilter ? groups.filter((g) => memberFilter?.find((m) => m === g.uuid)) : groups,
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
        memberFilter ? groups.filter((g) => memberFilter?.find((m) => m === g.uuid)) : groups,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts
      )
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
    init: function (data: Group[], view?: any) {
      groups = data
      if (view && view.g) {
        if (Array.isArray(view.g) && view.g.length >= 2) {
          filters = view.g[0]
          sorts = view.g[1]
          if (view.g.length > 2) {
            this.settings.viewType = view.g[2]
            this.settings.changeView()
          }
          this.settings.filterMode = "advanced"
        }
      }
      processedGroups = processList(
        memberFilter ? groups.filter((g) => memberFilter?.find((m) => m === g.uuid)) : groups,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts
      )
      paginatedGroups = paginateList(processedGroups, listSettings)
    },
  }
}

export function createConfigState(config?: Config) {
  let privateMember = $state(config?.member_default_private)
  let privateGroup = $state(config?.group_default_private)
  let templates = $state(config?.description_templates ?? [])
  return {
    get member_default_private() {
      return privateMember
    },
    set member_default_private(value) {
      privateMember = value
    },
    get group_default_private() {
      return privateGroup
    },
    set group_default_private(value) {
      privateGroup = value
    },
    get description_templates() {
      return templates
    },
    set description_templates(value: string[]) {
      templates = value
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
  return sortList(processed, sorts, groupList || [])
}
