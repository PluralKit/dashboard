import type { Config, Group, Member, System } from "$api/types"
import {
  FilterMode,
  createFilter,
  createFilterGroup,
  createSimpleFilters,
  filterList,
  type FilterGroup,
} from "./filters.svelte"
import { fetchList, getRandom } from "./utils"
import { createListSettings, paginateList, type ListSettings } from "./settings.svelte"
import { SortMode, createSimpleSorts, createSort, sortList, type Sort } from "./sorts.svelte"
import { mapMemberGroups } from "./member/utils"
import { browser } from "$app/environment"

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
    random: T[] | null
    options: SvelecteOption[]
  }
  filters: FilterGroup[]
  sorts: Sort[]
  simpleFilters: FilterGroup[]
  simpleSorts: Sort[]
  settings: ListSettings
  proxyTags?: SvelecteOption[]
  filter: string[] | undefined
  page: Member | Group | undefined
  fetch: (token?: string, groups?: Group[]) => Promise<void>
  process: (groups: Group[]) => void
  getRandom: (amount: number, included: string[] | undefined, privacy: string) => void
  paginate: () => void
}

export interface SvelecteOption {
  value: string | undefined
  text: string
  extra?: any
}

const createSystemState: (data: any) => System = (data: any) => data?.system ?? {}

export let dash: ReturnType<typeof createDash> = createDash(null)

export const initDash = (data: any) => {
  dash = createDash(data)
}

function createDash(data: any) {
  let user: System | null = $derived(data?.user ?? null)
  let privacyMode: PrivacyMode = $derived(data?.privacyMode ?? PrivacyMode.PUBLIC)

  let systemData = $derived(createSystemState(data))
  let memberList = $derived(createMemberListState(data))
  let groupList = $derived(createGroupListState(data))

  let configSettings = $derived(createConfigState(data?.config))

  let member = $derived(createMemberState(data))
  let group = $derived(createGroupState(data))

  let ratelimited: Record<string, boolean> = $derived({})
  let errors: Record<string, string> = $derived(data?.errors ?? {})

  let settings: Record<string, any> = $derived(
    browser ? JSON.parse(localStorage.getItem("pk-settings") ?? "{}") : {}
  )
  return {
    members: memberList,
    groups: groupList,
    system: systemData,
    member,
    group,
    privacyMode,
    sid: systemData?.id,
    user,
    config: configSettings,
    get settings() {
      return settings
    },
    set settings(value) {
      if (browser) localStorage.setItem("pk-settings", JSON.stringify($state.snapshot(value)))
      settings = $state.snapshot(value)
    },
    ratelimited,
    errors,
  }
}

function createMemberListState(data: any): DashList<Member> {
  let listSettings: ListSettings = $state(createListSettings())

  let filters: FilterGroup[] = $state([
    createFilterGroup([createFilter("name", "name", FilterMode.INCLUDES, "")]),
  ])
  let sorts: Sort[] = $state([createSort(SortMode.ALPHABETICAL, "name", "name", 1)])

  let simpleFilters: FilterGroup[] = $state([createSimpleFilters()])
  let simpleSorts: Sort[] = $state(createSimpleSorts())

  let groupFilter: string[] = $state([])
  let page: Group | undefined = $state(undefined)

  let members: Member[] = $state(mapMemberGroups(data?.members ?? [], data?.groups ?? []))
  let processedMembers: Member[] = $derived.by(() => {
    return processList(
      groupFilter.length > 0
        ? members.filter((m) => groupFilter.find((g) => g === m.uuid))
        : members,
      listSettings.filterMode === "simple" ? simpleFilters : filters,
      listSettings.filterMode === "simple" ? simpleSorts : sorts,
      data?.groups
    )
  })
  let randomMembers: Member[] | null = $state(null)
  let paginatedMembers: Member[] = $derived(
    paginateList(randomMembers ?? processedMembers, listSettings)
  )

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

  if (data?.view && data?.view.m) {
    if (Array.isArray(data?.view.m) && data?.view.m.length >= 2) {
      filters = data?.view.m[0]
      sorts = data?.view.m[1]
      if (data?.view.m.length > 2) {
        listSettings.viewType = data?.view.m[2]
      }
      listSettings.filterMode = "advanced"
    }
  }

  return {
    get list() {
      return {
        raw: members,
        processed: processedMembers,
        random: randomMembers,
        paginated: paginatedMembers,
        options: optionMembers,
      }
    },
    filters,
    sorts,
    simpleFilters,
    simpleSorts,
    proxyTags,
    settings: listSettings,
    filter: groupFilter,
    page,
    fetch: async function (token?: string, groups?: Group[]) {
      members = mapMemberGroups(
        await fetchList(`systems/${dash.system?.id || "exmpl"}/members`, token),
        groups || []
      )
    },
    process: function (groups: Group[]) {
      if (randomMembers) return

      processedMembers = processList(
        groupFilter.length > 0
          ? members.filter((m) => groupFilter.find((g) => g === m.uuid))
          : members,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts,
        groups
      )
    },
    getRandom: function (amount: number, included: string[] | undefined, privacy: string) {
      let includedMembers = members
      if (included && included.length > 0) {
        includedMembers = members.filter((m) => included.includes(m.uuid || ""))
      }
      if (privacy !== "all") {
        includedMembers = processList(
          includedMembers,
          [
            createFilterGroup([
              createFilter(
                "privacy",
                "privacy",
                FilterMode.NOTEMPTY,
                privacy,
                {
                  field: "visibility",
                  fieldName: "visibility",
                },
                undefined,
                "random-filter--visibility"
              ),
            ]),
          ],
          []
        )
      }
      randomMembers = getRandom(
        includedMembers,
        amount > includedMembers.length ? includedMembers.length : amount < 0 ? 0 : amount
      )
    },
    paginate: function () {
      paginatedMembers = paginateList(randomMembers ?? processedMembers, listSettings)
    },
  }
}

function createGroupListState(data: any): DashList<Group> {
  let listSettings: ListSettings = $state(createListSettings())

  let filters: FilterGroup[] = $state([
    createFilterGroup([createFilter("name", "name", FilterMode.INCLUDES, "")]),
  ])
  let sorts: Sort[] = $state([createSort(SortMode.ALPHABETICAL, "name", "name", 1)])

  let simpleFilters: FilterGroup[] = $state([createSimpleFilters("group")])
  let simpleSorts: Sort[] = $state(createSimpleSorts())

  let memberFilter: string[] | undefined = $state([])
  let page: Member | undefined = $state(undefined)

  let groups: Group[] = $state(data?.groups ?? [])
  let processedGroups: Group[] = $derived(
    processList(
      memberFilter.length > 0
        ? groups.filter((g) => memberFilter.find((m) => m === g.uuid))
        : groups,
      listSettings.filterMode === "simple" ? simpleFilters : filters,
      listSettings.filterMode === "simple" ? simpleSorts : sorts
    )
  )
  let randomGroups: Group[] | null = $state(null)
  let paginatedGroups: Group[] = $derived(
    paginateList(randomGroups ?? processedGroups, listSettings)
  )

  let optionGroups: SvelecteOption[] = $derived(
    groups
      .map((g) => {
        return { value: g.uuid, text: `${g.name} (${g.id})`, extra: g.display_name }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  )

  if (data?.view && data?.view.g) {
    if (Array.isArray(data?.view.g) && data?.view.g.length >= 2) {
      filters = data?.view.g[0]
      sorts = data?.view.g[1]
      if (data?.view.g.length > 2) {
        listSettings.viewType = data?.view.g[2]
      }
      listSettings.filterMode = "advanced"
    }
  }

  return {
    get list() {
      return {
        raw: groups,
        processed: processedGroups,
        random: randomGroups,
        paginated: paginatedGroups,
        options: optionGroups,
      }
    },
    filters,
    sorts,
    simpleFilters,
    simpleSorts,
    settings: listSettings,
    filter: memberFilter,
    page,
    fetch: async function (token?: string) {
      groups = await fetchList(
        `systems/${dash.system?.id || "exmpl"}/groups?with_members=true`,
        token
      )
    },
    process: function (groups: Group[]) {
      if (randomGroups) return

      processedGroups = processList(
        memberFilter.length > 0
          ? groups.filter((g) => memberFilter.find((m) => m === g.uuid))
          : groups,
        listSettings.filterMode === "simple" ? simpleFilters : filters,
        listSettings.filterMode === "simple" ? simpleSorts : sorts
      )
    },
    getRandom: function (amount: number, included: string[] | undefined, privacy: string) {
      let includedGroups = groups
      if (included && included.length > 0) {
        includedGroups = groups.filter((g) => included.includes(g.uuid || "aaa"))
      }
      if (privacy !== "all") {
        includedGroups = processList(
          includedGroups,
          [
            createFilterGroup([
              createFilter(
                "privacy",
                "privacy",
                FilterMode.NOTEMPTY,
                privacy,
                {
                  field: "visibility",
                  fieldName: "visibility",
                },
                undefined,
                "random-filter--visibility"
              ),
            ]),
          ],
          []
        )
      }
      randomGroups = getRandom(
        includedGroups,
        amount > includedGroups.length ? includedGroups.length : amount < 0 ? 0 : amount
      )
    },
    paginate: function () {
      paginatedGroups = paginateList(randomGroups ?? processedGroups, listSettings)
    },
  }
}

export function createConfigState(config?: Config) {
  let privateMember = $state(config?.member_default_private)
  let privateGroup = $state(config?.group_default_private)
  let templates = $state(config?.description_templates ?? [])
  let dash_views = $state(config?.dash_views)
  return {
    dash_views,
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

function createMemberState(data: any) {
  let member: Member | undefined = $state(data?.member ?? undefined)
  let groups: DashList<Group> = $state(createGroupListState(data))
  let members: DashList<Member> = $state(createMemberListState(data))
  let privacyMode: PrivacyMode = $derived(data?.privacyMode ?? PrivacyMode.PUBLIC)

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
    get members() {
      return members
    },
    get privacyMode() {
      return privacyMode
    },
    set privacyMode(mode: PrivacyMode) {
      privacyMode = mode
    },
  }
}

function createGroupState(data: any) {
  let group: Group | undefined = $state(data?.group ?? undefined)
  let members: DashList<Member> = $state(createMemberListState(data))
  let groups: DashList<Group> = $state(createGroupListState(data))
  let privacyMode: PrivacyMode = $derived(data?.privacyMode ?? PrivacyMode.PUBLIC)

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
    get groups() {
      return groups
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
  let sorted = sortList(processed, sorts, groupList || [])
  return sorted
}
