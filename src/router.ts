import { createRouter, createWebHistory } from 'vue-router'

import HelloWorld from '@/views/HelloWorld.vue'
import Editor from '@/views/Editor.vue'

const routes = [
    { path: '/', name: 'Início', component: HelloWorld },
    { path: '/editor', name: 'Editor', component: Editor },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router