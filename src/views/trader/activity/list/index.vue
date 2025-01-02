<script setup lang="ts">
import { ref, computed } from "vue";

import List from "./list/index.vue";
import Ended from "./ended/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "活动列表", name: "1", component: List },
  { label: "已结束活动", name: "2", component: Ended }
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
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 180px)' }">
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
