<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  requireData: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  questionData: {
    type: Array as PropType<Array<number>>,
    default: () => []
  }
});

const { isDark } = useDark();

const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, {
  theme
});

watch(
  () => props,
  async () => {
    await nextTick(); // 确保DOM更新完成后再执行
    setOptions({
      container: ".bar-card",
      color: ["#41b6ff", "#e85f33"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none"
        }
      },
      grid: {
        top: "50px", // 根据 legend 位置调整
        left: "50px",
        right: "0px" // 如果 legend 在右侧，需要留出空间
      },
      legend: {
        data: ["昨天", "今天"],
        textStyle: {
          color: "#606266",
          fontSize: "0.875rem"
        },
        top: 0, // 改为顶部
        right: 0 // 靠右对齐
      },
      xAxis: [
        {
          type: "category",
          data: [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23"
          ],
          axisLabel: {
            fontSize: "0.875rem"
          },
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            fontSize: "0.875rem"
          },
          splitLine: {
            show: true // 去网格线
          }
          // name: "单位: 个"
        }
      ],
      series: [
        {
          name: "昨天",
          type: "line", // 设置为折线图
          smooth: true, // 启用平滑曲线
          lineStyle: {
            width: 3, // 设置线条宽度
            color: "#41b6ff" // 设置线条颜色
          },
          data: props.requireData
        },
        {
          name: "今天",
          type: "line", // 设置为折线图
          smooth: true, // 启用平滑曲线
          lineStyle: {
            width: 3, // 设置线条宽度
            color: "#e86033ce" // 设置线条颜色
          },
          data: props.questionData
        }
      ]
    });
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 365px" />
</template>
