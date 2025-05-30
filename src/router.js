// src/router.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./views/HomeView.vue') // 懒加载
    },
    {
        path: '/p2p-test',
        name: 'p2p-test',
        component: () => import('./views/P2PTestView.vue') // 懒加载
    },
    {
        path: '/resources',
        name: 'resources',
        component: () => import('./views/ResourceView.vue') // 懒加载
    },
    {
        path: '/product-images',
        name: 'product-images',
        component: () => import('./views/P2PProductImagesView.vue') // 懒加载
    },
    {
        path: '/multi-js-test',
        name: 'multi-js-test',
        component: () => import('./views/MultiJsTestView.vue') // 懒加载
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;