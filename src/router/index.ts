import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {SecurityService} from "@/security/SecurityService";

const TasksView = () => import("@/views/TasksView/TasksView.vue");
const ProfileView = () => import("@/views/ProfileView/ProfileView.vue");
const EventView = () => import("@/views/EventView/EventView.vue");
const LoginView = () => import( "@/views/LoginView/LoginView.vue");
const RegistrationView = () => import("@/views/RegistrationView/RegistrationView.vue");
const PageNotFoundView = () => import( "@/views/PageNotFoundView/PageNotFoundView.vue");
const EditView = () => import("@/views/EditView/EditView.vue")

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'EventView',
        component: EventView,
        meta: {
            authorized: true
        }
    }, {
        path: '/tasks/:userId?',
        name: 'TasksView',
        component: TasksView,
        meta: {
            authorized: true
        }
    }, {
        path: '/profile/:userId?',
        name: 'ProfileView',
        component: ProfileView,
        meta: {
            authorized: true
        }
    }, {
        path: '/editProfile',
        name: 'EditView',
        component: EditView,
        meta: {
            authorized: true
        }
    },{
        path: '/login',
        name: 'LoginView',
        component: LoginView
    }, {
        path: '/registration',
        name: 'RegistrationView',
        component: RegistrationView
    },
    {
        path: '/logout',
        beforeEnter: (to, from, next) => {
            SecurityService.clearToken();
            next('/login');
        }
    },
    {
        path: '/*',
        name: 'PageNotFoundView',
        component: PageNotFoundView
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.authorized && !SecurityService.isAuthorized()
        || to.meta.admin && !SecurityService.isAdmin()
        || to.meta.moderator && !SecurityService.isModerator()
        || to.meta.moderatorOrAdmin && !SecurityService.isModerator() && !SecurityService.isAdmin()
        || to.meta.user && !SecurityService.isUser()) {
        next('/login');
    } else next()
});

export default router
