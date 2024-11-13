<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import ReCol from "@/components/ReCol";
import { useDark } from "./utils";
import WelcomeTable from "./components/table/index.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { ChartBar, ChartLine, ChartRound } from "./components/charts";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { barChartData } from "./data";
import { useUserStoreHook } from "./store/home";

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

// 在组件挂载时获取数据
onMounted(async () => {
  await homeStore.getHomeData(); // 调用 store 中的请求方法
  chartData.value = homeStore.homeData; // 假设 store 中的数据结构是 homeData.chartData
  console.log("-----chartData.value---", chartData.value);
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
watchEffect(() => {
  console.log("maxValues---", maxValues.value);
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
        <el-card class="line-card h-[200px] flex flex-col justify-between">
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
          <div class="flex justify-between">
            <span class="text-md font-medium">分析概览</span>
            <Segmented v-model="curWeek" :options="optionsBasis" />
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartBar
              :requireData="barChartData[curWeek].requireData"
              :questionData="barChartData[curWeek].questionData"
            />
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
