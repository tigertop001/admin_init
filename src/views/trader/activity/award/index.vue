<script setup lang="ts">
import { ref, computed } from "vue";
import Diy from "./diy/index.vue";
import FirstDep from "./first-dep/index.vue";
import DepAct from "./dep-act/index.vue";
import Invit from "./invit/index.vue";
import Relief from "./relief/index.vue";

// 定义选中的 tab 名称
const actName = ref("5");

// 定义 tabs 数据
const tabs = [
  { label: "自定义活动", name: "5", component: Diy },
  { label: "帐号首充", name: "1", component: FirstDep },
  { label: "充值活动", name: "2", component: DepAct },
  { label: "邀请转盘", name: "3", component: Invit },
  { label: "救济金", name: "4", component: Relief }
];

// 发射改变事件给子组件
const emit = defineEmits(["update:activeType"]);

// 点击 tab 时的处理函数
const onClick = (tab: any) => {
  emit("update:activeType", Number(tab.paneName));
};

// 根据选中的 tab 动态渲染对应的组件
const curCmp = computed(() => {
  const tab = tabs.find(tab => tab.name === actName.value);
  return tab ? tab.component : null;
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 196px)' }">
    <template #header>
      <el-tabs v-model="actName" class="demo-tabs" @tab-click="onClick">
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
