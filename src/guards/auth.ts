import { NavigationGuard } from 'vue-router';
import { useUserStore } from '@/stores/userStore.ts';

/**
 * This is a navigation guard. It is used to prevent users from accessing certain routes if they are not logged in.
 * @param to
 * @param from
 * @param next
 */
export const requireAuthorized: NavigationGuard = (to, from, next) => {
  const userStore = useUserStore();
  if (!userStore.loggedIn) next({ name: 'login-view' });
  else next();
};

/**
 * This is a navigation guard. It is used to prevent users from accessing certain routes if they are logged in.
 * @param to
 * @param from
 * @param next
 */
export const requireUnauthorized: NavigationGuard = (to, from, next) => {
  const userStore = useUserStore();
  if (userStore.loggedIn) next({ name: 'dashboard-view' });
  else next();
};
