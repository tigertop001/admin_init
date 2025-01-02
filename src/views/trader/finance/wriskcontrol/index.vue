<script setup lang="ts">
import { ref, computed } from "vue";

import Rev from "./rev/index.vue";
import Reex from "./reex/index.vue";
import Conf from "./conf/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "提现风控审核", name: "1", component: Rev },
  { label: "风控复审", name: "2", component: Reex },
  { label: "风控标签配置", name: "3", component: Conf }
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
