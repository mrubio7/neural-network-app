import { createMemoryHistory, createRouter } from 'vue-router'
import IndexView from './Views/IndexView.vue'
import NewModelView from './Views/NewModelView.vue'

const routes = [
    { path: '/', component: IndexView },
    { path: '/about', component: NewModelView },
  ]
  
const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router