<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import dayjs from 'dayjs';
import { useAxios } from '@/composables/axios.ts';
import { Platform, Sensor } from '@/models/apiModel.ts';

/**
 * Get route params
 */
const route = useRoute();
const id = ref(route.params.id);

/**
 * Axios instance
 */
const { api } = useAxios();

/**
 * Platform and sensors collection
 */
const platform = ref<Platform>({} as Platform);
const sensors = ref<Sensor[]>([]);
const currentSensorId = ref('');

// Define if report is shown
const showReport = ref(false);

/**
 * Convert date to human-readable format
 * @param dateString
 */
function convertDate(dateString: string): string {
  const date = dayjs(dateString);
  return date.format('DD/MM/YYYY HH:mm:ss');
}

/**
 * Fetch platform info from API
 */
const fetchPlatform = async () => {
  const response = await api.get(`/platforms/${id.value}`);

  /**
   * Set platforms collection
   */
  platform.value = (response.data).data; // Double data allocation...
};

/**
 * Fetch sensor info from API
 * @param sensorId
 */
const fetchSensor = async (sensorId: string) => {
  const response = await api.get(`/records/${sensorId}`);

  /**
   * Add records collection
   */
  response.data.data.forEach((record: Sensor) => {
    const { ts, value } = record;
    sensors.value.push({ id: sensorId, ts: convertDate(ts), value });
  });
};

/**
 * Populate body with platform and sensors
 */
const populateBody = async () => {
  await fetchPlatform();
  platform.value.sensors.forEach((sensor) => {
    fetchSensor(sensor.id);
  });
};

/**
 * Obtain platform and his sensors from API on component mount
 */
onMounted(async () => {
  await populateBody();
  currentSensorId.value = platform.value.sensors[0].id;
});

/**
 * Obtain platform and his sensors from API on route change
 */
watch(id, async () => {
  await populateBody();
});

/**
 * Toggle report visibility
 */
const toggleReport = () => {
  showReport.value = !showReport.value;
};

/**
 * Report button class
 */
const reportButtonClass = computed(() => (showReport.value ? 'btn-warning' : 'btn-success'));
</script>

<template>
  <div class="grid gap-4 w-full lg:flex-row">
    <div class="card card-compact w-full overflow-auto bg-base-200">
      <div class="card-body">
        <label class="label">
            <span class="label-text">
              {{ $t('views.details.form.sensorId') }}
            </span>
        </label>
        <select class="select w-full" v-model="currentSensorId">
          <option v-for="sensor in platform.sensors"
                  :key="sensor.id" :value="sensor.id">{{ sensor.id }}</option>
        </select>
        <div class="pt-4">
          <button class="btn btn-block" :class="reportButtonClass" @click="toggleReport">
            {{ showReport ? $t('views.details.form.buttons.hideLastReport')
            : $t('views.details.form.buttons.showLastReport')
            }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-full lg:flex-row gap-6">
      <div class="card w-full bg-base-200" v-if="showReport">
        <div class="card-body justify-center items-center">
          <iframe :src="platform.lastReport" width="520" height="445" data-theme="light"></iframe>
        </div>
      </div>
      <div class="card w-full bg-base-200">
        <div class="card-body">
          <div class="flex justify-center text-justify">
            <table class="border border-gray-300 w-full">
              <thead>
              <tr>
                <th class="border-b border-gray-300 px-4 py-2">ID</th>
                <th class="border-b border-gray-300 px-4 py-2">
                  {{ $t('views.details.form.table.timestamp') }}
                </th>
                <th class="border-b border-gray-300 px-4 py-2">
                  {{ $t('views.details.form.table.value') }}
                </th>
              </tr>
              </thead>
              <tbody v-for="sensor in sensors" :key="sensor.ts">
              <tr v-if="sensor.id === currentSensorId">
                <td class="border-b border-gray-300 px-4 py-2">{{ sensor.id }}</td>
                <td class="border-b border-gray-300 px-4 py-2">{{ sensor.ts }}</td>
                <td class="border-b border-gray-300 px-4 py-2">{{ sensor.value }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
