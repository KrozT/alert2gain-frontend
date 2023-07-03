import { defineStore } from 'pinia';
import { UserModel } from '@/models/userModel';
import { useAxios } from '@/composables/axios.ts';
import router from '@/router';

export const useUserStore = defineStore('user', {
  state: (): UserModel => ({
    email: null,
    name: null,
    token: null,
  }),
  getters: {
    loggedIn: (state): boolean => state.token !== null,
    picturePlaceholder: (state): string | undefined => state
      .name?.toUpperCase().match(/\b\w/g)?.join(''),
  },
  actions: {
    async login(email: string, password: string) {
      const { api } = useAxios();
      return api.post('/auth', { email, password })
        .then((response) => {
          /**
           * Add the user's data to the store.
           */
          this.email = response.data.email;
          this.name = response.data.name;
          this.token = response.data.token;

          /**
           * Redirect the user to the dashboard.
           */
          router.push({ name: 'dashboard-view' });
        });
    },
    async logout() {
      /**
       * Remove the user's data from the store.
       */
      this.token = null;
      this.email = null;
      this.name = null;

      /**
       * Redirect the user to the login page.
       */
      await router.push({ name: 'login-view' });
    },
  },
  persist: [
    {
      storage: sessionStorage,
    },
  ],
});
