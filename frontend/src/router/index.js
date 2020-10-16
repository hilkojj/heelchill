import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Chat from '../views/Chat.vue'

import VueSwal from 'vue-swal';
Vue.use(VueSwal);

Vue.use(VueRouter)

const routes = [
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/",
        name: "register",
        component: Register
    },
    {
        path: "/chat",
        name: "chat",
        component: Chat,
        meta: {
            requiresAuth: true
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (localStorage.getItem("jwt") == null) {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
})

export default router
