import type { Group, Member } from "$api/types"
import { randomId } from "./ids"

export interface FilterGroup {
  mode: "and" | "or"
  filters: Filter[]
  id: string
  draggable: boolean
}

export type Filter = {
  value: FilterValueType
  mode: FilterMode
  field: string
  fieldName: string
  id: string
  valueType: string
}

export type FilterValueType = string | number | null | string[]
export type FilterFieldType = "number" | "date" | "string" | "group" | "member"

export type FilterModeText = {
  mode: FilterMode
  verb: string
  afterVerb?: string
}

export const filterFieldText = (raw: string) => {
  const text: Record<string, string> = {
    display_name: "display name",
    avatar_url: "avatar",
    webhook_avatar_url: "proxy avatar",
    message_count: "message count",
    pronouns: "pronoun",
    birthday: "birthdays",
    created: "creation dates",
  }

  return text[raw] ?? raw
}

export const filterFieldType = (raw: string): FilterFieldType => {
  const type: Record<string, FilterFieldType> = {
    message_count: "number",
    created: "date",
    birthday: "date",
    group: "group",
    member: "member",
  }

  return type[raw] ?? "string"
}

export const filterModeText = (newMode: FilterMode, type: string) => {
  const mode = newMode

  const text: FilterModeText[] = [
    {
      mode: FilterMode.INCLUDES,
      verb: type === "date" ? "match the following criteria:" : "include",
    },
    {
      mode: FilterMode.EXCLUDES,
      verb: type === "date" ? "don't match the following criteria:" : "exclude",
    },
    {
      mode: FilterMode.EXACT,
      verb: "match",
    },
    {
      mode: FilterMode.NOTEXACT,
      verb: "don't match",
    },
    {
      mode: FilterMode.EMPTY,
      verb: "are empty",
    },
    {
      mode: FilterMode.NOTEMPTY,
      verb: "are not empty",
    },
    {
      mode: FilterMode.HIGHERTHAN,
      verb: type === "date" ? "are after" : "are more than",
      afterVerb: type === "string" ? "characters long" : "",
    },
    {
      mode: FilterMode.LOWERTHAN,
      verb: type === "date" ? "are before" : "are less than",
      afterVerb: type === "string" ? "characters long" : "",
    },
  ]

  return {
    get verb(): string {
      return text.find((i) => i.mode === mode)?.verb ?? "???"
    },
    get afterVerb(): string {
      return text.find((i) => i.mode === mode)?.afterVerb ?? ""
    },
  }
}

export enum FilterMode {
  // string: includes substring, int: N/A, groups: includes member in any of groups
  INCLUDES = "includes",
  // string: excludes substring, int: N/A, groups: excludes member in any of groups
  EXCLUDES = "excludes",
  // string: empty, int: N/A, groups: any member without group
  EMPTY = "empty",
  // string: not empty, int: N/A, groups: any member with group
  NOTEMPTY = "not empty",
  // string: length > value, int: > value, groups: any member with groups > input
  HIGHERTHAN = "more than",
  // string: length < value, int: < value, groups: any member with groups < input
  LOWERTHAN = "less than",
  // string: exact match, int: = value, groups: include members in all groups
  EXACT = "match",
  // string: any no exact match, int: != value, groups: exclude members in all groups
  NOTEXACT = "no match",
}

export const groupArrayModes = [
  FilterMode.INCLUDES,
  FilterMode.EXCLUDES,
  FilterMode.EXACT,
  FilterMode.NOTEXACT,
]

export function createFilterGroup(filter?: Filter[], drag: boolean = true): FilterGroup {
  let filters: Filter[] = $state(filter || [])
  let id: string = randomId()
  let mode: "and" | "or" = $state("and")
  let draggable: boolean = drag

  return {
    get filters() {
      return filters
    },
    set filters(filter: Filter[]) {
      filters = filter
    },
    get id() {
      return id
    },
    get mode() {
      return mode
    },
    set mode(newMode: "and" | "or") {
      mode = newMode
    },
    get draggable() {
      return draggable
    },
  }
}

export function createFilter(
  newField: string,
  newName: string,
  newMode: FilterMode,
  newValue: FilterValueType
): Filter {
  const getValueType = (value: FilterValueType) => {
    if (Array.isArray(value)) return "array"
    if (value !== null) return typeof value
    return "null"
  }

  let value: FilterValueType = $state(newValue)
  let valueType: string = getValueType(newValue)
  let mode: FilterMode = $state(newMode)
  let field: string = $state(newField)
  let fieldName: string = $state(newName)
  let id: string = (Math.random() + 1).toString(36).slice(2, 5)

  return {
    get id() {
      return id
    },
    get value() {
      return value
    },
    get valueType() {
      return valueType
    },
    set value(newValue: FilterValueType) {
      valueType = getValueType(newValue)
      value = newValue
    },
    get mode() {
      return mode
    },
    set mode(newMode: FilterMode) {
      mode = newMode
    },
    get fieldName() {
      return fieldName
    },
    set fieldName(newName: string) {
      fieldName = newName
    },
    get field() {
      return field
    },
    set field(newField: string) {
      field = newField
    },
  }
}

export function filterList<T>(list: T[], groups: FilterGroup[], groupList?: Group[]): T[] {
  let processedList: T[] = [...list]
  for (const group of groups) {
    if (group.filters.length > 1 && group.mode === "and") {
      // AND MODE - we need to only include items that match ALL criteria
      for (const filter of group.filters) {
        processedList = applyFilter(processedList, filter, groupList)
      }
    } else if (group.filters.length > 1 && group.mode === "or") {
      // OR MODE - we need to include any items that matches ONE of the criteria
      let includeList: T[] = [] // all items to include
      for (const filter of group.filters) {
        // for each filter, get all items that are included in that filter
        let nextFilter = applyFilter(processedList, filter, groupList)
        // then add those items to the list to include
        // so all of them are included
        includeList = [...new Set([...includeList, ...nextFilter])]
      }
      processedList = processedList.filter((i) => includeList.includes(i))
    } else if (group.filters.length > 0) {
      // item is alone in the list. technically the same as AND
      processedList = applyFilter(processedList, group.filters[0], groupList)
    }
  }

  return processedList
}

function applyFilter<T>(list: T[], filter: Filter, groupList?: Group[]): T[] {
  let processedList: T[] = [...list]
  const field = filter.field as keyof T
  const value = filter.value

  const fieldType = filterFieldType(filter.field)

  // first handle filtering by groups and members since they're rather... special
  if (fieldType === "group" && groupList) {
    return filterMembersByGroup<T>(processedList, filter.mode, value, groupList)
  }

  if (fieldType === "member") {
    return filterGroupsByMember<T>(processedList, filter.mode, value)
  }

  if (fieldType === "date") {
    return filterByDate<T>(processedList, filter)
  }

  switch (filter.mode) {
    // INCLUDE MODE
    case FilterMode.INCLUDES:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (!i[field]) return false
        switch (filter.valueType) {
          // string: include any with substring
          case "string": {
            return (i[field] as string).toLowerCase().includes((value as string).toLowerCase())
          }
          default:
            return false
        }
      })
      break
    case FilterMode.EXCLUDES:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (!i[field]) return true
        switch (filter.valueType) {
          // string: include any with substring
          case "string": {
            return !(i[field] as string).toLowerCase().includes((value as string).toLowerCase())
          }
          default:
            return true
        }
      })
      break
    case FilterMode.EMPTY:
      processedList = processedList.filter((i) => {
        return !i[field]
      })
      break
    case FilterMode.NOTEMPTY:
      processedList = processedList.filter((i) => {
        return !!i[field]
      })
      break
    case FilterMode.EXACT:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (!i[field]) return false
        if (filter.valueType === "string")
          return (i[field] as string).toLowerCase() === (value as string).toLowerCase()
        else return i[field] === filter.value
      })
      break
    case FilterMode.NOTEXACT:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (!i[field]) return true
        if (filter.valueType === "string")
          return (i[field] as string).toLowerCase() !== (value as string).toLowerCase()
        else return i[field] !== filter.value
      })
      break
    case FilterMode.HIGHERTHAN:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (!i[field]) return false
        if (typeof i[field] === "string") {
          return (i[field] as string).length > (value as number)
        } else if (typeof i[field] === "number") {
          return (i[field] as number) > (value as number)
        } else return false
      })
      break
    case FilterMode.LOWERTHAN:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (!i[field]) return false
        if (typeof i[field] === "string") {
          return (i[field] as string).length < (value as number)
        } else if (typeof i[field] === "number") {
          return (i[field] as number) < (value as number)
        } else return false
      })
      break
  }
  return processedList
}

function filterMembersByGroup<T>(
  list: T[],
  mode: FilterMode,
  value: FilterValueType,
  groupList: Group[]
): T[] {
  const groups = value as string[]

  switch (mode) {
    case FilterMode.INCLUDES:
      // include any member that is in ANY of the groups
      list = list.filter((i) => {
        if (groups.length === 0) return true

        for (const uuid of groups) {
          // get the corresponding group of each group uuid included
          const group = groupList.find((g) => g.uuid === uuid)
          if (group && group.members?.includes((i as Member).uuid ?? "")) return true
        }
        // none of the groups had this member, exclude them
        return false
      })
      break
    case FilterMode.EXCLUDES:
      // include any member that is in NONE of the groups
      list = list.filter((i) => {
        if (groups.length === 0) return true

        for (const uuid of groups) {
          const group = groupList.find((g) => g.uuid === uuid)
          if (group && group.members?.includes((i as Member).uuid ?? "")) return false
        }
        return true
      })
      break
    case FilterMode.EXACT:
      // include any member that is in ALL of the groups
      list = list.filter((i) => {
        if (groups.length === 0) return true

        if (
          groups.every(
            (uuid) =>
              groupList.find((g) => g.uuid === uuid)?.members?.includes((i as Member).uuid ?? "")
          )
        )
          return true
        return false
      })
      break
    case FilterMode.NOTEXACT:
      // include any member that is NOT in ALL of the groups
      list = list.filter((i) => {
        if (groups.length === 0) return true

        if (
          groups.every(
            (uuid) =>
              groupList.find((g) => g.uuid === uuid)?.members?.includes((i as Member).uuid ?? "")
          )
        )
          return false
        return true
      })
      break
    case FilterMode.HIGHERTHAN:
      // include any member that is in MORE groups than...
      list = list.filter((i) => {
        if (
          groupList.filter((g) => g.members?.includes((i as Member).uuid || "")).length >
          (value as number)
        )
          return true
        return false
      })
      break
    case FilterMode.LOWERTHAN:
      // include any member that is in MORE groups than...
      list = list.filter((i) => {
        if (
          groupList.filter((g) => g.members?.includes((i as Member).uuid || "")).length <
          (value as number)
        )
          return true
        return false
      })
      break
    case FilterMode.NOTEMPTY:
      // include any member a group
      list = list.filter((i) => {
        if (groupList.some((g) => g.members?.includes((i as Member).uuid || ""))) return true
        return false
      })
      break
    case FilterMode.EMPTY:
      // include any member without a group
      list = list.filter((i) => {
        if (groupList.some((g) => g.members?.includes((i as Member).uuid || ""))) return false
        return true
      })
      break
  }
  return list
}

function filterGroupsByMember<T>(list: T[], mode: FilterMode, value: FilterValueType): T[] {
  const members = value as string[]

  switch (mode) {
    case FilterMode.INCLUDES:
      // include any group that has ANY of the members
      list = list.filter((i) => {
        if (members.length === 0) return true

        for (const uuid of members) {
          if ((i as Group).members?.includes(uuid)) return true
        }
        return false
      })
      break
    case FilterMode.EXCLUDES:
      // include any group that has NONE of the members
      list = list.filter((i) => {
        if (members.length === 0) return true

        for (const uuid of members) {
          if ((i as Group).members?.includes(uuid)) return false
        }
        return true
      })
      break
    case FilterMode.EXACT:
      // include any group that has ALL of the members
      list = list.filter((i) => {
        if (members.length === 0) return true

        return members.every((m) => (i as Group).members?.includes(m))
      })
      break
    case FilterMode.NOTEXACT:
      // include any group that does not have ALL of the members
      list = list.filter((i) => {
        if (members.length === 0) return true

        return !members.every((m) => (i as Group).members?.includes(m))
      })
      break
    case FilterMode.HIGHERTHAN:
      list = list.filter((i) => ((i as Group).members?.length ?? 0) > (value as number))
      break
    case FilterMode.LOWERTHAN:
      list = list.filter((i) => ((i as Group).members?.length ?? 0) < (value as number))
      break
    case FilterMode.EMPTY:
      list = list.filter((i) => ((i as Group).members?.length ?? 0) === 0)
      break
    case FilterMode.NOTEMPTY:
      list = list.filter((i) => ((i as Group).members?.length ?? 0) > 0)
      break
  }
  return list
}

function filterByDate<T>(list: T[], filter: Filter) {
  const field = filter.field as keyof T
  const value = filter.value as string

  if (filter.mode === FilterMode.INCLUDES || filter.mode === FilterMode.EXCLUDES) {
    // filters items based on whether the date has a certain timeframe
    // like everyone created on the 12th day of the month
    // or everyone with a birthday in november 2022

    // the search query is formatted as an URLSearchParams string
    const params = new URLSearchParams(value)
    const day = params.get("day")
    const month = params.get("month")
    const year = params.get("year")
    const weekday = params.get("weekday")

    list = list.filter((i) => {
      if (!i[field]) return filter.mode === FilterMode.EXCLUDES
      const date = new Date(i[field] as string)
      let include = true

      // include every time period that isn't specified, exclude if it is, and it doesn't match
      if (day && date.getDate() !== parseInt(day)) include = false
      if (include && weekday && date.getDay() !== parseInt(weekday)) include = false
      if (include && month && date.getMonth() !== parseInt(month)) include = false
      if (include && year && date.getFullYear() !== parseInt(year)) include = false

      // invert the include if the filtermode is EXCLUDE
      if (filter.mode === FilterMode.EXCLUDES) return !include
      else return include
    })
  } else if (filter.mode === FilterMode.EXACT || filter.mode === FilterMode.NOTEXACT) {
    // filters dates based on whether they match the specified *date* exactly
    // we ignore the time

    // we use toLocaleDateString with locale en-CA
    // since that keeps timezones in mind and formats the date as YYYY-MM-DD
    // unsure if there's a better way.
    const matchDate = new Date(value).toLocaleDateString("en-CA")

    list = list.filter((i) => {
      if (!i[field]) return filter.mode === FilterMode.NOTEXACT
      const date = new Date(i[field] as string).toLocaleDateString("en-CA")
      let include = false
      if (date === matchDate) include = true
      if (filter.mode === FilterMode.NOTEXACT) return !include
      else return include
    })
  } else if (filter.mode === FilterMode.HIGHERTHAN || filter.mode === FilterMode.LOWERTHAN) {
    // filters dates based on whether they were after/before the specified date
    // again, we ignore the time

    const matchDate = new Date(value).toLocaleDateString("en-CA")

    list = list.filter((i) => {
      if (!i[field]) return false

      const date = new Date(i[field] as string).toLocaleDateString("en-CA")
      const compare = date.localeCompare(matchDate)
      if (filter.mode === FilterMode.LOWERTHAN) return compare < 0
      else return compare > 0
    })
  } else if (filter.mode === FilterMode.EMPTY || filter.mode === FilterMode.NOTEMPTY) {
    // filters the date based on whether it's set or not
    const empty = filter.mode === FilterMode.EMPTY
    list = list.filter((i) => (!i[field] ? empty : !empty))
  }

  return list
}
