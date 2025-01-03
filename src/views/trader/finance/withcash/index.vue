<script setup lang="ts">
import { ref, computed } from "vue";

import With from "./with/index.vue";
import Set from "./set/index.vue";
import Audit from "./audit/index.vue";
import Fee from "./fee/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "提现出款", name: "1", component: With },
  { label: "提现设置", name: "2", component: Set },
  { label: "稽核流水", name: "3", component: Audit },
  { label: "提现手续费", name: "4", component: Fee }
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
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 196px)' }">
    <template #header>
      <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="index"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
    </template>

    <component :is="curCmp" />
  </el-card>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss");
</style>
