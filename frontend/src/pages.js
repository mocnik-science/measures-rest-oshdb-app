import PageContext from './components/pageContext'
import PageContextDescription from './components/pageContextDescription'
import PageDashboard from './components/pageDashboard'
import PageHelp from './components/pageHelp'
import PageMeasure from './components/pageMeasure'
import PageMeasureCode from './components/pageMeasureCode'
import PageMeasureDescription from './components/pageMeasureDescription'
import PagePerson from './components/pagePerson'
import PagePersonDescription from './components/pagePersonDescription'
import PageResult from './components/pageResult'
import PageResultDescription from './components/pageResultDescription'

const pages = [
  {path: '/dashboard', label: 'Dashboard', component: PageDashboard, exact: true, menu: true},
  {path: '/measure', label: 'Measures', component: PageMeasure, exact: true, menu: true},
  {path: '/measure/:id/description', label: null, component: PageMeasureDescription, exact: false, menu: false},
  {path: '/measure/:id/code', label: null, component: PageMeasureCode, exact: false, menu: false},
  {path: '/context', label: 'Contexts', component: PageContext, exact: true, menu: true},
  {path: '/context/:id/description', label: null, component: PageContextDescription, exact: false, menu: false},
  {path: '/result', label: 'Results', component: PageResult, exact: true, menu: true},
  {path: '/result/:id/description', label: null, component: PageResultDescription, exact: false, menu: false},
  {path: '/person', label: 'People', component: PagePerson, exact: true, menu: true},
  {path: '/person/:id/description', label: null, component: PagePersonDescription, exact: false, menu: false},
  {path: '/help', label: 'Help', component: PageHelp, exact: true, menu: true},
]

export default pages
