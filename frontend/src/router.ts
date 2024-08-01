import { createMemoryHistory, createRouter } from 'vue-router'
import IndexPage from './pages/IndexPage.vue'
import NewNeuralNetworkPage from './pages/new-neural-network/NewNeuralNetworkPage.vue'


export const PathRoutes = {
  Home: "/",
  NewNeuralNetwork: "/new-nn",


}

const routes = [
  { path: PathRoutes.Home, component: IndexPage },
  { path: PathRoutes.NewNeuralNetwork, component: NewNeuralNetworkPage },
]
  
const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router

