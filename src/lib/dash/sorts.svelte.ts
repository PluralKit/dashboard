import type { Group, Member } from "$api/types"
import { randomId } from "./ids"

export interface Sort {
  mode: SortMode
  field: string
  order: 1 | -1
  id: string
  fieldName: string
}

export enum SortMode {
  ALPHABETICAL = "alphabetical",
  SIZE = "size",
}

export const sortModeText = (mode: SortMode, type: string, withComma?: boolean) => {
  const comma = withComma ? "," : ""

  const text: Record<string, string> = {
    alphabetical: `alphabetically${comma}`,
    size: type === "string" ? `by character length${comma}` : "",
  }
  return {
    get text() {
      return text[mode.toString()] ?? "???"
    },
  }
}

export function createSort(
  mode: SortMode,
  field: string,
  fieldName: string,
  order: 1 | -1,
  sortId?: string
): Sort {
  let sortMode: SortMode = $state(mode)
  let sortField: string = $state(field)
  let name: string = $state(fieldName)
  let sortOrder: 1 | -1 = $state(order)

  const id = sortId ? sortId : randomId()

  return {
    get mode() {
      return sortMode
    },
    set mode(mode: SortMode) {
      sortMode = mode
    },
    get field() {
      return sortField
    },
    set field(field: string) {
      sortField = field
    },
    get fieldName() {
      return name
    },
    set fieldName(fieldName: string) {
      name = fieldName
    },
    get order() {
      return sortOrder
    },
    set order(order: 1 | -1) {
      sortOrder = order
    },
    get id() {
      return id
    },
  }
}

type Color = Record<string, number | string>

export function sortList<T>(list: T[], sorts: Sort[], groupList: Group[]): T[] {
  let processedList: T[] = [...list]
  for (const sort of sorts) {
    processedList = applySort(processedList, sort, groupList)
  }
  return processedList
}

function applySort<T>(list: T[], sort: Sort, groupList: Group[]): T[] {
  let processedList: T[] = [...list]
  const field = sort.field as keyof T

  processedList.sort((a, b) => {
    let result = 0

    switch (field) {
      // first handle the special cases where a simple comparison won't work
      case "color":
        return sortColor(a, b) * sort.order
      // these should just work with a string/number comparison
      case "groups":
        let ag = (a as Member).group_count
        let bg = (b as Member).group_count
        if (!ag) ag = 0
        if (!bg) bg = 0

        if (ag === bg) result = 0
        else result = ag > bg ? 1 : -1
        return result * sort.order
      default:
        if (typeof a[field] === "string" || typeof b[field] === "string") {
          if (!a[field]) result = 0
          else if (!b[field]) result = 0
          else if (sort.mode === SortMode.ALPHABETICAL)
            result = (a[field] as string)
              .toLowerCase()
              .localeCompare((b[field] as string).toLowerCase())
          else if (sort.mode === SortMode.SIZE) {
            if ((a[field] as string).length === (b[field] as string).length) result = 0
            else result = (a[field] as string).length > (b[field] as string).length ? 1 : -1
          }
        } else if (typeof a[field] === "number" || typeof b[field] === "number") {
          if (!a[field]) result = 0
          else if (!b[field]) result = 0
          else if (a[field] === b[field]) result = 0
          else result = a[field] > b[field] ? 1 : -1
        } else result = 0
        return result * sort.order
    }
  })

  return processedList
}

function sortColor(A: any, B: any) {
  if (A.color === null) return 1
  if (B.color === null) return -1

  let aa = getColor(A.color)
  let bb = getColor(B.color)

  if (A.color === B.color) return 0

  if (aa.sat === 0 && bb.sat === 0) {
    if (aa.luma > bb.luma) return 1
    if (aa.luma < bb.luma) return -1
  }

  if (aa.hue === bb.hue) {
    if (aa.sat === 0 || bb.sat === 0) {
      if (aa.sat > bb.sat) return 1
      if (aa.sat < bb.sat) return -1
      return 0
    }
    if (aa.luma > bb.luma) return 1
    if (aa.luma < bb.luma) return -1
    return 0
  }

  if (aa.hue > bb.hue) return 1
  if (aa.hue < bb.hue) return -1
  return 0
}

function getColor(hex: string) {
  hex = hex.replace("#", "")

  // get the RGB values
  let r = parseInt(hex.substring(0, 2), 16) / 255
  let g = parseInt(hex.substring(2, 4), 16) / 255
  let b = parseInt(hex.substring(4, 6), 16) / 255

  // Getting the Max and Min values for Chroma
  let max = Math.max.apply(Math, [r, g, b])
  let min = Math.min.apply(Math, [r, g, b])

  // Variables for HSV value of hex color
  let chr = max - min
  let hue = 0
  let val = max
  let sat = 0

  if (val > 0) {
    // Calculate Saturation only if Value isn't 0.
    sat = chr / val
    if (sat > 0) {
      if (r == max) {
        hue = 60 * ((g - min - (b - min)) / chr)
        if (hue < 0) {
          hue += 360
        }
      } else if (g == max) {
        hue = 120 + 60 * ((b - min - (r - min)) / chr)
      } else if (b == max) {
        hue = 240 + 60 * ((r - min - (g - min)) / chr)
      }
    }
  }

  let color: Color = {}
  color.hex = hex
  color.chroma = chr
  color.hue = hue
  color.sat = sat
  color.val = val
  color.luma = 0.3 * r + 0.59 * g + 0.11 * b
  color.red = parseInt(hex.substring(0, 2), 16)
  color.green = parseInt(hex.substring(2, 4), 16)
  color.blue = parseInt(hex.substring(4, 6), 16)
  return color
}

export function createSimpleSorts() {
  let simpleNameSort = $state(
    createSort(SortMode.ALPHABETICAL, "name", "name", 1, "simple-sort--name")
  )

  return [simpleNameSort]
}
