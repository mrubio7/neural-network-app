import { createMemoryHistory, createRouter } from 'vue-router'
import IndexPage from './pages/IndexPage.vue'
import NewNeuralNetworkPage from './pages/new-neural-network/NewNeuralNetworkPage.vue'
import UseNeuralNetwork from './pages/show-neural-network/components/UseNeuralNetwork.vue'


export const PathRoutes = {
  Home: "/",
  NewNeuralNetwork: "/new-nn",
  Use: "/use"
}

const routes = [
  { path: PathRoutes.Home, component: IndexPage },
  { path: PathRoutes.NewNeuralNetwork, component: NewNeuralNetworkPage },
  { path: PathRoutes.Use, component: UseNeuralNetwork }
]
  
const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router

