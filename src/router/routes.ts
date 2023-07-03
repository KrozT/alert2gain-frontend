import { RouteRecordRaw } from 'vue-router';
import { requireAuthorized, requireUnauthorized } from '@/guards/auth.ts';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'login-view',
        component: () => import('@/views/LoginView.vue'),
        beforeEnter: [requireUnauthorized],
      },
      {
        path: 'dashboard',
        name: 'dashboard-view',
        component: () => import('@/views/DashboardView.vue'),
        beforeEnter: [requireAuthorized],
      },
      {
        path: 'details/:id?',
        name: 'details-view',
        component: () => import('@/views/DetailsView.vue'),
        beforeEnter: [requireAuthorized],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      path: '/',
      name: 'login-view',
    },
  },
];

export default routes;
