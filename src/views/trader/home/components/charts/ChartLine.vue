<script setup lang="ts">
import { computed, watchEffect } from "vue";

// 接收父组件传递过来的 props
const props = defineProps({
  data: {
    type: Number,
    required: true
  },
  maxData: {
    type: Number,
    required: true
  }
});

// 计算 chartWidth 以百分比显示
const chartWidth = computed(
  () => `${(Math.abs(props.data) / props.maxData) * 100}%`
);

// 计算 RGB 颜色的函数
const getChartColor = (data: number, maxData: number) => {
  let r, g, b;

  const absData = Math.abs(data);
  const maxNegativeValue = maxData; // 假设负数的最大绝对值为 100
  if (data < 0) {
    r = Math.round(217 - (217 - 133) * (absData / maxNegativeValue));
    g = Math.round(217 - (217 - 133) * (absData / maxNegativeValue));
    b = Math.round(217 - (217 - 133) * (absData / maxNegativeValue));
  } else if (data <= 500) {
    r = Math.round(151 - (151 - 119) * (data / 500));
    g = Math.round(242 - (242 - 192) * (data / 500));
    b = Math.round(4 - (4 - 1) * (data / 500));
  } else if (data <= 1000) {
    r = Math.round(99 - (99 - 14) * ((data - 500) / 500));
    g = Math.round(178 - (178 - 117) * ((data - 500) / 500));
    b = Math.round(255 - (255 - 217) * ((data - 500) / 500));
  } else if (data <= 2000) {
    r = Math.round(183 - (183 - 149) * ((data - 1000) / 1000));
    g = Math.round(40 - (40 - 57) * ((data - 1000) / 1000));
    b = Math.round(253 - (253 - 135) * ((data - 1000) / 1000));
  } else if (data <= 5000) {
    r = Math.round(255 - (255 - 231) * ((data - 2000) / 3000));
    g = Math.round(124 - (124 - 14) * ((data - 2000) / 3000));
    b = Math.round(174 - (174 - 97) * ((data - 2000) / 3000));
  } else {
    r = Math.round(255 - (255 - 165) * ((data - 5000) / maxNegativeValue));
    g = Math.round(0 - (0 - 4) * ((data - 5000) / maxNegativeValue));
    b = Math.round(0 - (0 - 4) * ((data - 5000) / maxNegativeValue));
  }

  return { r, g, b };
};

// 获取 chartColor 和 textColor
const chartColor = computed(() => {
  const { r, g, b } = getChartColor(props.data, props.maxData);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
});

const textColor = computed(() => {
  const { r, g, b } = getChartColor(props.data, props.maxData);
  const darken = (colorValue: number) => Math.max(0, colorValue - 120);
  return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`;
});
</script>

<template>
  <div
    :style="{
      width: chartWidth,
      backgroundColor: chartColor,
      color: textColor
    }"
    class="h-[20px] rounded flex items-center pl-2 animate-width"
  >
    {{ props.data }}
  </div>
</template>

<style scoped>
@keyframes width-grow {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

.animate-width {
  animation: widthGrow 1s ease-in-out forwards;
}
</style>
