<script setup lang="ts">
import { computed } from "vue";
import { useDark } from "@pureadmin/utils";
const { isDark } = useDark();
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
// 定义字段与对应中文标签的映射
const labels = {
  online_num: "目前在线人数",
  recharge: "充值",
  withdraw: "提款",
  register: "注册",
  bet: "平台盈亏",
  profit: "当日打码"
};
// 圆点的颜色数组
const circleColors = [
  "#FFA500", // 橙色
  "#00B5E2", // 青蓝
  "#FF69B4", // 粉红
  "#20B2AA", // 墨绿
  "#8A2BE2", // 紫色
  "#FFD700" // 黄色
];
</script>

<template>
  <ul
    class="flex flex-col justify-between space-y-2 h-[290px] text-[14px] mt-8"
  >
    <!-- 使用 v-for 遍历 data 对象的键值对并显示 -->
    <li
      v-for="(value, key, index) in props.data"
      :key="key"
      class="flex items-center pl-4 relative"
    >
      <strong class="font-bold mr-2">{{ labels[key] }}：</strong>
      <span>{{ value }}</span>

      <!-- 使用 ::before 创建圆点标注 -->
      <span
        :style="{
          backgroundColor: circleColors[index % circleColors.length]
        }"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 rounded-full"
      />
    </li>
  </ul>
</template>
