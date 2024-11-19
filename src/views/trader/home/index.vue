<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ReCol from "@/components/ReCol";
import { useDark } from "./utils";
import WelcomeTable from "./components/table/index.vue";
import { ChartBar, ChartLine, OnlineCount } from "./components/charts";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { useUserStoreHook } from "./store";
import register from "@iconify-icons/ri/user-add-fill";
import recharge from "@iconify-icons/ri/money-cny-circle-fill";
import withdraw from "@iconify-icons/ep/wallet-filled";
import active from "@iconify-icons/ri/price-tag-3-fill";

defineOptions({
  name: "Home"
});

const { isDark } = useDark();

const type = ref(1); // 0在线会员、1充值、2提款、3注册、4注册、5平台赢亏、6打码
const optionsBasis: Array<OptionsType> = [
  {
    label: "在线会员",
    value: "online"
  },
  {
    label: "充值",
    value: "recharge"
  },
  {
    label: "提款",
    value: "withdraw"
  },
  {
    label: "注册",
    value: "register"
  },
  {
    label: "平台盈亏",
    value: "profit"
  },
  {
    label: "打码",
    value: "bet"
  }
];
const handleSegmentedChange = () => {
  homeStore.getOnline({ type: optionsBasis[type.value].value });
};

// 获取 store 实例
const homeStore = useUserStoreHook();
// 响应式引用存储图表数据
// const onlineData = ref(null);

// 在组件挂载时获取数据
onMounted(async () => {
  await homeStore.getHomeData();
  await homeStore.getOnlineSummary({ date: curday.value });
  await homeStore.getOnline({ type: optionsBasis[type.value].value });
  await homeStore.getRankingList();
});

// 计算每个对象中的最大值
const maxValues = computed(() => {
  const result: Record<string, number> = {};

  // 在访问之前先检查 chartData 是否有效
  if (homeStore.homeData) {
    Object.keys(homeStore.homeData).forEach(key => {
      const values = Object.values(homeStore.homeData[key]);
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
  active: active
};

const iconColors = computed(() => {
  return [
    `rgba(255, 219, 183, ${isDark.value ? 0.5 : 0.9})`,
    `rgba(184, 225, 255, ${isDark.value ? 0.5 : 0.9})`,
    `rgba(209, 232, 209, ${isDark.value ? 0.5 : 0.9})`,
    `rgba(230, 211, 242, ${isDark.value ? 0.5 : 0.9})`
  ];
});

const rankingList = computed(() => [
  {
    title: "充值排行榜",
    data: homeStore.rankingListData.rechargeRank,
    type: "rechargeRank"
  },
  {
    title: "提现排行榜",
    data: homeStore.rankingListData.withdrawRank,
    type: "withdrawRank"
  },
  {
    title: "输赢排行榜",
    data: homeStore.rankingListData.profitRank,
    type: "profitRank"
  },
  {
    title: "代理发展排行榜",
    data: homeStore.rankingListData.proxyRank,
    type: "proxyRank"
  }
]);

const curday = ref(1); // 0昨天、1今天
const handleDayChange = async () => {
  await homeStore.getOnlineSummary({ date: curday.value });
};
</script>

<template>
  <div>
    <el-row :gutter="24" justify="start">
      <re-col
        v-for="(item, index, key) in homeStore.homeData"
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
                  <span class="w-[85px] text-left text-[14px] flex-shrink-0">{{
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
                  class="flex items-center justify-start flex-shrink-0 pl-4"
                >
                  <span class="w-[85px] text-left text-[14px]">{{ k }}</span>
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
              <span class="w-[85px] text-left text-[14px] flex-shrink-0">{{
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
        <el-card class="bar-card">
          <div
            class="flex justify-between items-center border-b border-gray-200 pb-3"
          >
            <span class="text-md font-medium">在线会员情况</span>
          </div>
          <div
            class="flex w-full justify-between items-start mt-3 h-full flex-1"
          >
            <div class="w-xs h-full">
              <el-radio-group v-model="curday" @change="handleDayChange">
                <el-radio :value="0">昨天</el-radio>
                <el-radio :value="1">今天</el-radio>
              </el-radio-group>
              <OnlineCount
                :data="homeStore.onlineSummaryData"
                :curday="curday"
              />
            </div>
            <div class="flex-1">
              <!-- <p>{{ optionsBasis[type].label }}</p> -->
              <Segmented
                v-model="type"
                :options="optionsBasis"
                class="ml-[20px] relative z-10"
                @change="handleSegmentedChange"
              />
              <ChartBar
                class="mt-[-20px]"
                :requireData="homeStore.onlineData.day0"
                :questionData="homeStore.onlineData.day1"
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
        <el-card>
          <el-row :gutter="24" justify="start">
            <!-- 遍历排行榜数据 -->
            <re-col
              v-for="(rankData, index) in rankingList"
              :key="index"
              v-motion
              class="mb-[18px]"
              :value="6"
              :md="12"
              :sm="12"
              :xs="24"
              :initial="{
                opacity: 0,
                y: 100
              }"
              :enter="{
                opacity: 1,
                y: 0
              }"
              :class="{
                'px-4': index !== 0 && index !== rankingList.length - 1
              }"
            >
              <p class="text-md font-medium pl-3">{{ rankData.title }}</p>
              <WelcomeTable
                class="mt-3"
                :dataList="rankData.data"
                :type="rankData.type"
              />
            </re-col>
          </el-row>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
