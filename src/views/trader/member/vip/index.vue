<script setup lang="ts">
import { ref, computed } from "vue";

import Set from "./set/index.vue";
import List from "./list/index.vue";
import Record from "./record/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "VIP设置", name: "1", component: Set },
  { label: "VIP列表", name: "2", component: List },
  { label: "VIP奖金记录", name: "3", component: Record }
];

const onClk = (tab: any) => {
  console.log("Clicked tab:", tab);
};

const swchTab = (tabName: string) => {
  actNm.value = tabName;
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

    <component :is="curCmp" @swchTab="swchTab" />
  </el-card>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss");
</style>
