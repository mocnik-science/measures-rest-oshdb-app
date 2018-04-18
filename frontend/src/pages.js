import PageDashboard from './components/pageDashboard'
import PageMeasure from './components/pageMeasure'
import PageMeasureDescription from './components/pageMeasureDescription'
import PageMeasureCode from './components/pageMeasureCode'
import PageHelp from './components/pageHelp'

const pages = [
  {path: '/dashboard', label: 'Dashboard', component: PageDashboard, exact: true, menu: true},
  {path: '/measure', label: 'Measures', component: PageMeasure, exact: true, menu: true},
  {path: '/measure/:id/description', label: null, component: PageMeasureDescription, exact: false, menu: false},
  {path: '/measure/:id/code', label: null, component: PageMeasureCode, exact: false, menu: false},
  {path: '/help', label: 'Help', component: PageHelp, exact: true, menu: true},
]

export default pages
