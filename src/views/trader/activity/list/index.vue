<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, computed } from "vue";

/**
 * 导入组件和工具
 */
import List from "./list/index.vue";
import Ended from "./ended/index.vue";

// 定义选中的 tab 名称
const actNm = ref("1");

// 定义 tabs 数据
const tabs = [
  { label: "活动列表", name: "1", component: List },
  { label: "已结束活动", name: "2", component: Ended }
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
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 180px)' }">
    <!-- 将 el-tabs 放到 el-card 的 header 插槽 -->
    <template #header>
      <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
        <!-- 动态渲染 el-tab-pane -->
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="index"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
    </template>

    <!-- 动态渲染选项卡内容 -->
    <component :is="curCmp" />
  </el-card>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
