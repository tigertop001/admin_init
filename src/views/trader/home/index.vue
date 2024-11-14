<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import ReCol from "@/components/ReCol";
import { useDark } from "./utils";
import WelcomeTable from "./components/table/index.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { ChartBar, ChartLine, OnlineCount } from "./components/charts";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { barChartData } from "./data";
import { useUserStoreHook } from "./store/home";
import register from "@iconify-icons/ri/user-add-fill";
import recharge from "@iconify-icons/ri/money-cny-circle-fill";
import withdraw from "@iconify-icons/ep/wallet-filled";
import active from "@iconify-icons/ri/price-tag-3-fill";
import bet from "@iconify-icons/ri/file-list-fill";
import monthData0 from "@iconify-icons/ri/contrast-2-fill";

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();

let curWeek = ref(1); // 0上周、1本周
const optionsBasis: Array<OptionsType> = [
  {
    label: "上周"
  },
  {
    label: "本周"
  }
];

// 获取 store 实例
const homeStore = useUserStoreHook();
// 响应式引用存储图表数据
const chartData = ref(null);
const onlineSummaryData = ref(null);
const onlineData = ref(null);

// 在组件挂载时获取数据
onMounted(async () => {
  await homeStore.getHomeData();
  chartData.value = homeStore.homeData;
  await homeStore.getOnlineSummary();
  onlineSummaryData.value = homeStore.onlineSummaryData;
  console.log("-----onlineSummaryData.value---", onlineSummaryData.value);
  await homeStore.getOnline();
  onlineData.value = homeStore.onlineSummaryData;
  console.log("-----onlineData.value---", onlineData.value);
});

// 计算每个对象中的最大值
const maxValues = computed(() => {
  const result: Record<string, number> = {};

  // 在访问之前先检查 chartData 是否有效
  if (chartData.value) {
    Object.keys(chartData.value).forEach(key => {
      const values = Object.values(chartData.value[key]);
      const maxValue = Math.max(...values.map(v => parseFloat(v as string)));
      result[key] = maxValue;
    });
  }

  return result;
});

// 创建一个映射对象，根据 index 映射到对应的图标
const iconMap = {
  register: register,
  recharge: recharge,
  withdraw: withdraw,
  active: active,
  bet: bet,
  monthData0: monthData0
};

const iconColors = computed(() => {
  return [
    `rgba(255, 219, 183, ${isDark.value ? 0.5 : 0.9})`, // 根据 isDark 变更透明度
    `rgba(184, 225, 255, ${isDark.value ? 0.5 : 0.9})`,
    `rgba(209, 232, 209, ${isDark.value ? 0.5 : 0.9})`,
    `rgba(230, 211, 242, ${isDark.value ? 0.5 : 0.9})`
  ];
});
</script>

<template>
  <div>
    <el-row :gutter="24" justify="start">
      <re-col
        v-for="(item, index, key) in chartData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="8"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (key + 1)
          }
        }"
      >
        <el-card class="line-card h-[160px] flex flex-col justify-between">
          <template v-if="Object.keys(item).length > 5">
            <div class="flex flex-row justify-between w-full h-full">
              <div class="flex flex-col w-1/2 h-full justify-between">
                <p
                  v-for="[k, v] in Object.entries(item).slice(0, 5)"
                  :key="k"
                  class="flex items-center justify-start"
                >
                  <span class="w-[100px] text-left text-[14px] flex-shrink-0">{{
                    k
                  }}</span>
                  <ChartLine
                    :data="parseFloat(v as string) || 0"
                    :maxData="maxValues[index]"
                    :dataVal="k"
                  />
                </p>
              </div>

              <div class="flex flex-col w-1/2 h-full justify-between">
                <p
                  v-for="[k, v] in Object.entries(item).slice(5)"
                  :key="k"
                  class="flex items-center justify-start flex-shrink-0"
                >
                  <span class="w-[100px] text-left text-[14px]">{{ k }}</span>
                  <ChartLine
                    :data="parseFloat(v as string) || 0"
                    :maxData="maxValues[index]"
                    :dataVal="k"
                  />
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <IconifyIconOffline
              :icon="iconMap[index]"
              :color="iconColors[key % iconColors.length]"
              width="48"
              class="absolute top-[10px] right-[30px]"
            />
            <p
              v-for="[k, v] in Object.entries(item)"
              :key="k"
              class="flex items-center justify-start"
            >
              <span class="w-[100px] text-left text-[14px] flex-shrink-0">{{
                k
              }}</span>
              <ChartLine
                :data="parseFloat(v as string) || 0"
                :maxData="maxValues[index]"
                :dataVal="k"
                class="mr-[80px]"
              />
            </p>
          </template>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="24"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between border-b border-gray-200 pb-3">
            <span class="text-md font-medium">分析概览</span>
            <Segmented v-model="curWeek" :options="optionsBasis" />
          </div>
          <div
            class="flex w-full justify-between items-start mt-3 h-full flex-1"
          >
            <div class="w-xs h-full">
              <OnlineCount :data="onlineSummaryData" />
            </div>
            <div class="flex-1">
              <p>{{ optionsBasis[curWeek].label }}</p>
              <ChartBar
                :requireData="barChartData[curWeek].requireData"
                :questionData="barChartData[curWeek].questionData"
              />
            </div>
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="24"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560
          }
        }"
      >
        <el-card shadow="never" class="h-[580px]">
          <div class="flex justify-between">
            <span class="text-md font-medium">数据统计</span>
          </div>
          <WelcomeTable class="mt-3" />
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
