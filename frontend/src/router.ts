import { createMemoryHistory, createRouter } from 'vue-router'
import IndexView from './Views/IndexView.vue'
import NewNeuralNetworkView from './Views/NeuralNetworkViews/NewNeuralNetworkView.vue'
import Layout from './Views/Layout.vue'

export const PathRoutes = {
  Home: "/",
  NewNeuralNetwork: "/new-nn",


}

const routes = [
  { path: PathRoutes.Home, component: IndexView },
  { path: PathRoutes.NewNeuralNetwork, component: NewNeuralNetworkView },
]
  
const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router

