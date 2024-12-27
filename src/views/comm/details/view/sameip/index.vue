<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import Search from "./form/search.vue";
import type { UserRowData } from "./types";

interface Props {
  rowData?: UserRowData | null;
}

const props = defineProps<Props>();

// 定义选中的 tab 名称
const actNm = ref("ip");

// 定义 tabs 数据
const tabs = [
  { label: "同最近登录IP(0)", name: "ip" },
  { label: "同设备(0)", name: "device" },
  { label: "同姓名(0)", name: "uname" }
];

// 导入和初始化列
import { useColumns } from "./form/config/columns";

// 使用计算属性获取当前选中的 tab
const currentTab = computed(
  () => tabs.find(tab => tab.name === actNm.value) || tabs[0]
);

const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  updateTabItem
} = useColumns({
  uid: props.rowData?.uid,
  tabItem: currentTab.value.name
});

// 点击 tab 时的处理函数
const onClk = () => {
  updateTabItem(currentTab.value.name);
};

/**
 * 生命周期钩子
 */
onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <!-- 搜索区域 -->
    <template #header>
      <Search
        :exportData="dataList"
        :obj="{
          uid: props.rowData?.uid,
          tabItem: currentTab.name
        }"
        @update:param="onPrmUp"
      />
    </template>

    <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      />
    </el-tabs>

    <!-- 数据表格 -->
    <pure-table
      ref="tableRef"
      adaptive
      stripe
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="lodConf"
      :adaptiveConfig="adapConf"
      :columns="columns"
      :pagination="pagination"
      :data="dataList"
      @page-size-change="onSzChg"
      @page-current-change="onCurChg"
    />
  </el-card>
</template>
