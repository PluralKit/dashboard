export interface FilterGroup {
  mode: "and" | "or"
  filters: Filter[]
  id: string
}

export type Filter = {
  value: string | number,
  mode: FilterMode,
  field: string,
  fieldName: string,
  id: string,
}

export enum FilterMode {
  // string: includes substring, int: N/A, groups: includes member in any of groups
  INCLUDES = "include",
  // string: excludes substring, int: N/A, groups: excludes member in any of groups
  EXCLUDES = "exclude",
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
  NOTEXACT = "don't match",
}

export function createFilter(newField: string, newName: string, newMode: FilterMode, newValue: string|number): Filter {
  let value: string|number = $state(newValue)
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
    set value(newValue: string|number) {
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
    }
  }
}

export function filterList<T>(list: T[], groups: FilterGroup[]): T[] {
  let processedList: T[] = [...list]
  for (const group of groups) {
    if (group.filters.length > 1 && group.mode === "and") {
      for (const filter of group.filters) {
        processedList = applyFilter(processedList, filter)
      }
    } else if (group.filters.length > 1 && group.mode === "or") {
      let includeList: T[] = []
      for (const filter of group.filters) {
        let nextFilter = applyFilter(processedList, filter)
        includeList = [...new Set([...includeList, ...nextFilter])]
      }
      processedList = processedList.filter((i) => includeList.includes(i))
    } else if (group.filters.length > 0) {
      processedList = applyFilter(processedList, group.filters[0])
    }
  }

  return processedList
}

function applyFilter<T>(list: T[], filter: Filter): T[] {
  let processedList: T[] = [...list]
  const field = filter.field as keyof T
  const value = filter.value

  switch (filter.mode) {
    // INCLUDE MODE
    case FilterMode.INCLUDES:
      processedList = processedList.filter((i) => {
        if (!value) return true
        switch (typeof i[field]) {
          // string: include any with substring
          case "string": {
            if ((i[field] as string).toLowerCase().includes((value as string).toLowerCase()))
              return true
            else return false
          }
          default:
            return false
        }
      })
      break
    case FilterMode.EXCLUDES:
      processedList = processedList.filter((i) => {
        if (!value) return true
        switch (typeof i[field]) {
          // string: include any with substring
          case "string": {
            if ((i[field] as string).toLowerCase().includes((value as string).toLowerCase()))
              return false
            else return true
          }
          default:
            return false
        }
      })
      break
    case FilterMode.EMPTY:
      processedList = processedList.filter((i) => {
        if (i[field] === null || i[field] === undefined) return true
        else return false
      })
      break
    case FilterMode.NOTEMPTY:
      processedList = processedList.filter((i) => {
        if (i[field] !== null || i[field] !== undefined) return true
        else return false
      })
      break
    case FilterMode.EXACT:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (i[field] === value) return true
        else return false
      })
      break
    case FilterMode.NOTEXACT:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (i[field] !== value) return true
        else return false
      })
      break
    case FilterMode.HIGHERTHAN:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (typeof i[field] === "string") {
          if ((i[field] as string).length > (value as number)) return true
          else return false
        } else if (typeof i[field] === "number") {
          if ((i[field] as number) > (value as number)) return true
          else return false
        } else return false
      })
      break
    case FilterMode.LOWERTHAN:
      processedList = processedList.filter((i) => {
        if (!value) return true
        if (typeof i[field] === "string") {
          if ((i[field] as string).length < (value as number)) return true
          else return false
        } else if (typeof i[field] === "number") {
          if ((i[field] as number) < (value as number)) return true
          else return false
        } else return false
      })
      break
  }
  return processedList
}
