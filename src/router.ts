import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Editor from '@/views/Editor.vue'

const routes = [
    { path: '/home', name: 'Início', component: Home },
    { path: '/', name: 'Editor', component: Editor },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router