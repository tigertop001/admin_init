<script setup lang="ts">
import { ref, computed } from "vue";
// const { columns, dtLst } = useColumns();
// import { useColumns } from "./form/columns";

import Record from "./record/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "银行卡", name: "1", component: Record },
  { label: "支付宝", name: "2", component: Record },
  { label: "USDT", name: "3", component: Record },
  { label: "数字人民币", name: "4", component: Record },
  { label: "CGPay", name: "5", component: Record }
];

const onClk = (tab: any) => {
  console.log("Clicked tab:", tab);
};

const curCmp = computed(() => {
  const tab = tabs.find(tab => tab.name === actNm.value);
  return tab ? tab.component : null;
});
</script>

<template>
  <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
    <el-tab-pane
      v-for="(tab, index) in tabs"
      :key="index"
      :label="tab.label"
      :name="tab.name"
    />
  </el-tabs>

  <component :is="curCmp" />
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss");
</style>
