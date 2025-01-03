<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import Info from "./dialog/info.vue";

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
  isInfo,
  getSum,
  infVis,
  curData
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <Search :exportData="dtLst" @update:param="onPrmUp" />
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
      :show-summary="true"
      :summary-method="getSum"
      @page-size-change="onSzChg"
      @page-current-change="onCurChg"
    >
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="isInfo(row)">
          详情
        </el-button>
      </template>
    </pure-table>

    <Info
      v-model:visible="infVis"
      :curData="curData"
      @update:visible="infVis = $event"
    />
  </el-card>
</template>
