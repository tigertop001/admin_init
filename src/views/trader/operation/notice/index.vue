<script setup lang="ts">
import { ref, computed } from "vue";

import Ntc from "./ntc/index.vue";
import Msg from "./msg/index.vue";
import Marq from "./marq/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "系统公告", name: "1", component: Ntc },
  { label: "系统消息", name: "2", component: Msg },
  { label: "跑马灯", name: "3", component: Marq }
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
