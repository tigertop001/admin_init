<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, computed } from "vue";
// const { columns, dataList } = useColumns();
// import { useColumns } from "./form/columns";

/**
 * 导入组件和工具
 */
import Record from "./record/index.vue";

// 定义选中的 tab 名称
const actNm = ref("1");

// 定义 tabs 数据
const tabs = [
  { label: "银行卡", name: "1", component: Record },
  { label: "支付宝", name: "2", component: Record },
  { label: "USDT", name: "3", component: Record },
  { label: "数字人民币", name: "4", component: Record },
  { label: "CGPay", name: "5", component: Record }
];

// 点击 tab 时的处理函数
const onClk = (tab: any) => {
  console.log("Clicked tab:", tab);
};

// 根据选中的 tab 动态渲染对应的组件
const curCmp = computed(() => {
  const tab = tabs.find(tab => tab.name === actNm.value);
  return tab ? tab.component : null;
});
</script>

<template>
  <!-- 将 el-tabs 放到 el-card 的 header 插槽 -->

  <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
    <!-- 动态渲染 el-tab-pane -->
    <el-tab-pane
      v-for="(tab, index) in tabs"
      :key="index"
      :label="tab.label"
      :name="tab.name"
    />
  </el-tabs>

  <!-- 动态渲染选项卡内容 -->
  <component :is="curCmp" />
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
