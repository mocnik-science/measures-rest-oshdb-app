import PageDashboard from './pageDashboard'
import PageHelp from './pageHelp'
import PageItemContext from './pageItemContext'
import PageItemContextDescription from './pageItemContextDescription'
import PageItemMeasure from './pageItemMeasure'
import PageItemMeasureCode from './pageItemMeasureCode'
import PageItemMeasureDescription from './pageItemMeasureDescription'
import PageItemPerson from './pageItemPerson'
import PageItemPersonDescription from './pageItemPersonDescription'
import PageItemResult from './pageItemResult'
import PageItemResultDescription from './pageItemResultDescription'
import PageMap from './pageMap'
import PagePublicRepository from './pagePublicRepository'

const pages = [
  {path: '/dashboard', label: 'Dashboard', component: PageDashboard, exact: true, menu: true},
  {path: '/measure', label: 'Measures', component: PageItemMeasure, exact: true, menu: true},
  {path: '/measure/:level/:id/description', label: null, component: PageItemMeasureDescription, exact: false, menu: false},
  {path: '/measure/:level/:id/code', label: null, component: PageItemMeasureCode, exact: false, menu: false},
  {path: '/measure/:level/:id/map', label: null, component: PageMap, exact: false, menu: false, navigationCollapsed: true},
  {path: '/result', label: 'Results', component: PageItemResult, exact: true, menu: true},
  {path: '/result/:level/:id/description', label: null, component: PageItemResultDescription, exact: false, menu: false},
  {path: '/context', label: 'Contexts', component: PageItemContext, exact: true, menu: true},
  {path: '/context/:level/:id/description', label: null, component: PageItemContextDescription, exact: false, menu: false},
  {path: '/person', label: 'People', component: PageItemPerson, exact: true, menu: true},
  {path: '/person/:level/:id/description', label: null, component: PageItemPersonDescription, exact: false, menu: false},
  {path: '/publicRepository', label:'Public Repository', component: PagePublicRepository, exact: true, menu: true, navigationCollapsed: true},
  {path: '/help', label: 'Help', component: PageHelp, exact: true, menu: true},
  {path: '/help/gettingStarted', label: 'Getting started', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/measureCode', label: 'Measures (code)', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/measureDescription', label: 'Measures (description)', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/publicRepository', label: 'Public repository', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/advanced', label: 'Advanced', component: PageHelp, exact: true, menu: '/help'},
]

export default pages
