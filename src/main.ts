import { createApp } from 'vue'
import Popper from "vue3-popper";

import 'popper.js/dist/popper.min'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'

import './style.css'

import App from './App.vue'
import router from './router'


import { addIcons, OhVueIcon } from 'oh-vue-icons';

import * as FaIcons from "oh-vue-icons/icons/fa";
import * as BiIcons from "oh-vue-icons/icons/bi";

const AllIcons = Object.values({ ...FaIcons, ...BiIcons });
addIcons(...AllIcons);

createApp(App)
    .use(router)
    .component("Popper", Popper)
    .component("v-icon", OhVueIcon)
    .mount('#app')


