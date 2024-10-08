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

let availableViews: View[] = [
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
    itemsPerPageSelection: [24, 36, 48, 60],
    defaultItemsPerPage: 36,
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
  changeView: () => void
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
    },
    changeView: () => {
      itemsPerPage = view.defaultItemsPerPage
      currentPage = 1
    },
    get itemsPerPage() {
      return itemsPerPage
    },
    set itemsPerPage(ipp: number) {
      itemsPerPage = ipp
    },
    get currentPage() {
      return currentPage
    },
    set currentPage(page: number) {
      currentPage = page
    },
    get filterMode() {
      return filterMode
    },
    set filterMode(mode: "simple" | "advanced") {
      filterMode = mode
    },
    get extraFields() {
      return extraFields
    },
    set extraFields(open: boolean) {
      extraFields = open
    },
  }
}

export function paginateList<T>(list: T[], settings: ListSettings) {
  const pageAmount = Math.ceil(list.length / settings.itemsPerPage)
  if (settings.currentPage > pageAmount) settings.currentPage = pageAmount > 0 ? pageAmount : 1

  const last = settings.currentPage * settings.itemsPerPage
  const first = last - settings.itemsPerPage

  return list.slice(first, last)
}
