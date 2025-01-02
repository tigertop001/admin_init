<script setup lang="ts">
import { ref, computed } from "vue";

import EPay from "./epay/index.vue";
import OT from "./ot/index.vue";
import PG from "./pg/index.vue";
import PT from "./pt/index.vue";
import WT from "./wt/index.vue";

const actNm = ref("1");

const tabs = [
  { label: "在线支付设置", name: "1", component: EPay },
  { label: "线下转账设置", name: "2", component: OT },
  { label: "代付通道设置", name: "3", component: PG },
  { label: "支付类型管理", name: "4", component: PT },
  { label: "提款类型管理", name: "5", component: WT }
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
