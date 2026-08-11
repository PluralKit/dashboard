import { dash } from "./dash.svelte"

export enum ViewType {
  COLLAPSE = "collapse",
  OPEN = "open",
  CARD = "card",
  TINY = "tiny",
  TEXT = "text",
  DISCORD = "discord",
}

interface View {
  type: ViewType
  itemsPerPageSelection: number[]
  defaultItemsPerPage: number
}

const availableViews: View[] = [
  {
    type: ViewType.COLLAPSE,
    itemsPerPageSelection: [10, 25, 50],
    defaultItemsPerPage: 25,
  },
  {
    type: ViewType.OPEN,
    itemsPerPageSelection: [5, 10, 25],
    defaultItemsPerPage: 10,
  },
  {
    type: ViewType.CARD,
    itemsPerPageSelection: [12, 24, 48],
    defaultItemsPerPage: 24,
  },
  {
    type: ViewType.TINY,
    itemsPerPageSelection: [20, 30, 60],
    defaultItemsPerPage: 30,
  },
  {
    type: ViewType.TEXT,
    itemsPerPageSelection: [10, 25, 50, 100],
    defaultItemsPerPage: 25,
  },
  {
    type: ViewType.DISCORD,
    itemsPerPageSelection: [10, 25],
    defaultItemsPerPage: 25,
  },
]

export interface ListSettings {
  readonly view: View
  viewType: ViewType
  itemsPerPage: number
  currentPage: number
  filterMode: "simple" | "advanced"
  extraFields: boolean
}

export function createListSettings(): ListSettings {
  let viewType: ViewType = $state(ViewType.COLLAPSE)
  let view: View = $derived.by(() => {
    const vv = availableViews.find((v) => v.type === viewType)
    if (!vv) return dash?.settings.display?.keepOpen ? availableViews[1] : availableViews[0]
    else return vv
  })
  let itemsPerPage: number = $state(view.defaultItemsPerPage)
  let currentPage: number = $state(1)

  let filterMode: "simple" | "advanced" = $state("simple")
  let extraFields = $state(false)

  return {
    get view() {
      return view
    },
    get viewType() {
      return viewType
    },
    set viewType(type: ViewType) {
      viewType = type
      itemsPerPage = view.defaultItemsPerPage
      currentPage = 1
    },
    itemsPerPage,
    currentPage,
    filterMode,
    extraFields,
  }
}

export function paginateList<T>(list: T[], settings: ListSettings) {
  const pageAmount = Math.ceil(list.length / settings.itemsPerPage)

  let page = settings.currentPage > pageAmount ? pageAmount : settings.currentPage

  const last = page * settings.itemsPerPage
  const first = last - settings.itemsPerPage

  return list.slice(first, last)
}
