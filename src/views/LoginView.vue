<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const email = ref<string>('');
const password = ref<string>('');

/**
 * Login handler for the login button
 */
const login = async () => {
  await userStore.login(email.value, password.value).catch((error) => {
    console.error(error);
  });
};
</script>

<template>
  <div class="flex xl:pt-24 items-center justify-center">
    <div class="card bg-base-200 md:w-full xl:w-fit">
      <div class="card-body">
        <div class="space-y-4">
          <input type="email" :placeholder="$t('views.login.form.email')"
                 class="input w-full" v-model="email" />
          <input type="password" :placeholder="$t('views.login.form.password')"
                 class="input w-full" v-model="password" />
        </div>
        <button class="btn btn-primary btn-block mt-4" @click="login()">
          {{ $t('views.login.form.submit') }}
        </button>
        <button class="btn btn-disabled text-primary-content/70">
          {{ $t('views.login.form.forgotPassword') }}
        </button>
        <div class="divider"></div>
        <div class="card-actions justify-center">
          <button class="btn btn-disabled btn-wide">
            {{ $t('views.login.form.createAccount') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
