<script setup lang="ts">
import {
  Bars3CenterLeftIcon, GlobeAltIcon, ComputerDesktopIcon, SunIcon, MoonIcon,
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import { useApplicationStore } from '@/stores/applicationStore.ts';

/**
 * Obtain the theme and language from the platform store.
 */
const applicationStore = useApplicationStore();
const { language, theme } = storeToRefs(applicationStore);

/**
 * Obtain the user store.
 */
const userStore = useUserStore();

/**
 * Obtain the available locales from the i18n plugin.
 */
const { availableLocales } = useI18n();

/**
 * Icon map for the theme selector.
 */
const iconMap = {
  default: ComputerDesktopIcon,
  light: SunIcon,
  dark: MoonIcon,
};

/**
 * Resolve the current icon based on the chosen theme.
 */
const currentIcon = computed(() => iconMap[theme.value]);

/**
 * Resolve language display name.
 * @param locale
 */
const localeDisplayName = (locale: string) => {
  const languageCode = locale.split('-')[0].toLowerCase();
  const displayNames = new Intl.DisplayNames([languageCode], { type: 'language' });
  const languageName = displayNames.of(locale);

  return languageName?.charAt(0).toUpperCase()
    .concat(languageName?.slice(1));
};
</script>

<template>
  <div class="navbar bg-base-200 rounded-box">
    <div class="navbar-start">
      <div class="dropdown" v-if="userStore.loggedIn">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <bars3-center-left-icon class="h-6 w-6" />
        </label>
        <ul tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1]
             p-2 shadow bg-base-100 rounded-box w-52">
          <li class=px-1>
            <router-link :to="{ name: 'dashboard-view' }" active-class="active">
              {{ $t('header.navigation.dashboard') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'details-view' }"
                         active-class="active" class="pointer-events-none">
              {{ $t('header.navigation.details') }}
            </router-link>
          </li>
        </ul>
      </div>
      <router-link class="btn btn-ghost" :to="{ name: 'dashboard-view' }">
        <div class="font-title inline-flex text-lg md:text-2xl">
          <span>{{ applicationStore.appName }}</span>
        </div>
      </router-link>
    </div>
    <div class="navbar-center hidden lg:flex" v-if="userStore.loggedIn">
      <ul class="menu menu-horizontal px-1">
        <li class="px-1">
          <router-link :to="{ name: 'dashboard-view' }" active-class="active">
            {{ $t('header.navigation.dashboard') }}
          </router-link>
        </li>
        <li class="px-1">
          <router-link :to="{ name: 'details-view' }"
                       active-class="active" class="pointer-events-none">
            {{ $t('header.navigation.details') }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="justify-end flex space-x-2">
        <div class="input-group">
        <span>
          <globe-alt-icon class="h-8 w-8" />
        </span>
          <select class="select max-w-fit" v-model="language">
            <option v-for="locale in availableLocales" :key="locale" :value="locale">
              {{ localeDisplayName(locale) }}
            </option>
          </select>
        </div>
        <div class="input-group">
        <span>
          <component :is="currentIcon" class="h-8 w-8" />
        </span>
          <select class="select max-w-fit" v-model="theme">
            <option value="default">
              {{ $t('header.themes.system') }}
            </option>
            <option value="dark">
              {{ $t('header.themes.dark') }}
            </option>
            <option value="light">
              {{ $t('header.themes.light') }}
            </option>
          </select>
        </div>
      </div>
      <!-- Profile -->
      <div class="pl-4 dropdown dropdown-end z-10" v-if="userStore.loggedIn">
        <div tabindex="0" class="btn btn-ghost btn-circle avatar placeholder">
          <div class="bg-neutral-focus text-neutral-content rounded-full w-24">
            <span class="text-2xl">{{ userStore.picturePlaceholder }}</span>
          </div>
        </div>
        <ul tabindex="0"
            class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
          <li class="menu-title">{{ userStore.name }}</li>
          <li @click="userStore.logout">
            <a>
              {{ $t('header.profile.logout') }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
