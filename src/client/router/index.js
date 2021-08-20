import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/client/views/Home'
import Plans from '@/client/views/Plans'
import Login from '@/client/views/Login'

const routes = [
  {
    path: '/',
    component: Login,
    name: 'login'
  },
  {
    path: '/home',
    component: Home,
    name: 'home'
  },
  {
    path: '/nodes',
    name: 'nodes',
    component: () => import(/* webpackChunkName: "about" */ '../views/Nodes.vue')
  },
  {
    path: '/plans',
    name: 'plans',
    component: Plans
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
