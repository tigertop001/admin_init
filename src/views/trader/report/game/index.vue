<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import { topTabs } from "./data";
import Details from "@/views/comm/details/index.vue";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  expExcel,
  dtlsVis,
  curRow,
  onDetail
} = useColumns();

onMounted(() => {
  getList();
});

const activeTopTab = ref("all");
const activeSubTab = ref("all-sub");

const currentSubTabs = computed(() => {
  const currentTop = topTabs.find(tab => tab.name === activeTopTab.value);
  return currentTop ? currentTop.subTabs : [];
});

watch(activeTopTab, newVal => {
  const currentTop = topTabs.find(tab => tab.name === newVal);
  if (currentTop && currentTop.subTabs.length > 0) {
    activeSubTab.value = currentTop.subTabs[0].name;
  }
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <div class="nav-container">
        <el-radio-group v-model="activeTopTab" class="radio-tabs">
          <el-radio-button
            v-for="item in topTabs"
            :key="item.name"
            :label="item.name"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <el-tabs v-model="activeSubTab" class="sub-tabs mt-4">
          <el-tab-pane
            v-for="item in currentSubTabs"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </el-tabs>
      </div>
      <Search
        :exportData="dtLst"
        :expExcel="expExcel"
        @update:param="onPrmUp"
      />
    </template>

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
      :data="dtLst"
      @page-size-change="onSzChg"
      @page-current-change="onCurChg"
    >
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="onDetail(row)">
          详情
        </el-button>
      </template>
    </pure-table>

    <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
  </el-card>
</template>
