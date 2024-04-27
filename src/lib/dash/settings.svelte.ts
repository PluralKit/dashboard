enum ViewType {
  COLLAPSE = "collapse",
  OPEN = "open",
  CARD = "card",
  TINY = "tiny",
  TEXT = "text",
}

interface View {
  type: ViewType
  itemsPerPageSelection: number[]
  defaultItemsPerPage: number
}

export interface ListSettings {
  readonly view: View
  changeView: (type: ViewType) => void
  itemsPerPage: number
  currentPage: number
}

export function createListSettings() {
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
      itemsPerPageSelection: [24, 36, 48, 60],
      defaultItemsPerPage: 36,
    },
    {
      type: ViewType.TEXT,
      itemsPerPageSelection: [10, 25, 50, 100],
      defaultItemsPerPage: 25,
    },
  ]
  let view: View = $state(availableViews[0])
  let itemsPerPage: number = $state(view.defaultItemsPerPage)
  let currentPage: number = $state(1)

  return {
    get view() {
      return view
    },
    changeView: (type: ViewType) => {
      view = availableViews.find((v) => view.type === type) || availableViews[0]
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
  }
}

export function paginateList<T>(list: T[], settings: ListSettings) {
  const pageAmount = Math.ceil(list.length / settings.itemsPerPage)
  if (settings.currentPage > pageAmount) settings.currentPage = pageAmount > 0 ? pageAmount : 1
  
  const last = settings.currentPage * settings.itemsPerPage
  const first = last - settings.itemsPerPage

  return list.slice(first, last)
}
