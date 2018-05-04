import PageDashboard from './components/pageDashboard'
import PageHelp from './components/pageHelp'
import PageItemContext from './components/pageItemContext'
import PageItemContextDescription from './components/pageItemContextDescription'
import PageItemMeasure from './components/pageItemMeasure'
import PageItemMeasureCode from './components/pageItemMeasureCode'
import PageItemMeasureDescription from './components/pageItemMeasureDescription'
import PageItemPerson from './components/pageItemPerson'
import PageItemPersonDescription from './components/pageItemPersonDescription'
import PageItemResult from './components/pageItemResult'
import PageItemResultDescription from './components/pageItemResultDescription'

const pages = [
  {path: '/dashboard', label: 'Dashboard', component: PageDashboard, exact: true, menu: true},
  {path: '/measure', label: 'Measures', component: PageItemMeasure, exact: true, menu: true},
  {path: '/measure/:level/:id/description', label: null, component: PageItemMeasureDescription, exact: false, menu: false},
  {path: '/measure/:level/:id/code', label: null, component: PageItemMeasureCode, exact: false, menu: false},
  {path: '/result', label: 'Results', component: PageItemResult, exact: true, menu: true},
  {path: '/result/:level/:id/description', label: null, component: PageItemResultDescription, exact: false, menu: false},
  {path: '/context', label: 'Contexts', component: PageItemContext, exact: true, menu: true},
  {path: '/context/:level/:id/description', label: null, component: PageItemContextDescription, exact: false, menu: false},
  {path: '/person', label: 'People', component: PageItemPerson, exact: true, menu: true},
  {path: '/person/:level/:id/description', label: null, component: PageItemPersonDescription, exact: false, menu: false},
  {path: '/help', label: 'Help', component: PageHelp, exact: true, menu: true},
  {path: '/help/gettingStarted', label: 'Getting started', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/measureCode', label: 'Measures (Code)', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/measureDescription', label: 'Measures (Description)', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/context', label: 'Contexts', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/result', label: 'Results', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/publicRepository', label: 'Public Repository', component: PageHelp, exact: true, menu: '/help'},
  {path: '/help/advanced', label: 'Advanced', component: PageHelp, exact: true, menu: '/help'},
]

export default pages
