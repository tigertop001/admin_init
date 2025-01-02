<script setup lang="ts">
import { ref, computed } from "vue";

import Rev from "./rev/index.vue";
import Set from "./set/index.vue";
import Whitelist from "./whitelist/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "充值审核", name: "1", component: Rev },
  { label: "充值设置", name: "2", component: Set },
  { label: "充值统计", name: "3", component: Whitelist }
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
