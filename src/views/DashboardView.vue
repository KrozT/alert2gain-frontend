<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { useAxios } from '@/composables/axios.ts';
import { Platform } from '@/models/apiModel.ts';

/**
 * Router instance
 */
const router = useRouter();

/**
 * Axios instance
 */
const { api } = useAxios();

/**
 * Platforms collection
 */
const platforms = ref<Platform[]>([]);

/**
 * Pagination
 */
const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
const totalRecords = ref(0);

/**
 * Fetch platforms from API
 */
const fetchPlatforms = async () => {
  const response = await api.get('/platforms', {
    params: {
      pageNumber: pageNumber.value, pageSize: pageSize.value,
    },
  });

  /**
   * Set platforms collection
   */
  platforms.value = (response.data).data; // Double data allocation...

  /**
   * Set pagination
   */
  totalPages.value = response.data.totalPages;
  totalRecords.value = response.data.totalRecords;
};

/**
 * Obtain platforms from API on component mount
 */
onMounted(async () => {
  await fetchPlatforms();
});

/**
 * Obtain visible cards
 */
watch(pageNumber, async () => {
  await fetchPlatforms();
});

/**
 * Generate visible page numbers for pagination without overflows
 */
const visiblePageNumbers = computed(() => {
  const currentPage = pageNumber.value;
  const totalPagesCount = totalPages.value;

  let start = Math.max(1, currentPage - 4);
  const end = Math.min(start + 9, totalPagesCount);

  /**
   * Adjust range if there are not enough numbers to show
   */
  if (end - start < 9) {
    start = Math.max(1, end - 9);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const goToDetails = (platform: Platform) => {
  router.push({ name: 'details-view', params: { id: platform.id } });
};
</script>

<template>
  <div id="dashboard-view" class="grid h-full">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="platform in platforms" :key="platform.id"
             class="card card-compact bg-base-200 max-w-fit h-80 hover:border hover:border-primary"
             @click="goToDetails(platform)"
        >
          <figure>
            <img :src="platform.img" :alt="platform.name" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ platform.name }}</h2>
            <p>Id: {{ platform.id }}</p>
            <p>Fleet: {{ platform.fleet }}</p>
          </div>
        </div>
      </div>
    <div class="join justify-center pt-12">
      <button class="join-item btn btn-square" @click="pageNumber = 1;">
        <chevron-left-icon class="w-4 h-4" />
      </button>
      <input v-for="number in visiblePageNumbers"
             class="join-item btn btn-square"
             type="radio"
             name="options"
             :aria-label="number.toString()"
             :key="number"
             :checked="pageNumber === number"
             @click="pageNumber = number;"
      />
      <button class="join-item btn btn-square" @click="pageNumber = totalPages;">
        <chevron-right-icon class="w-4 h-4" />
      </button>
    </div>
    <div class="flex justify-center pt-4">
      <span class="label-text-alt">
        Total records: {{ totalRecords }} in {{ totalPages }} pages
      </span>
    </div>
  </div>
</template>

<style scoped>

</style>
