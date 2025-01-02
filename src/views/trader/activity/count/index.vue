<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import Add from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  editData,
  addVis,
  addType,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  shwAdd,
  getSummaries
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <Search :exportData="dtLst" @update:param="onPrmUp" @add="shwAdd(0)" />
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
      :summary-method="getSummaries"
      @page-size-change="onSzChg"
      @page-current-change="onCurChg"
    >
      <template #operation="{}">
        <el-button link type="primary" size="small"> 详情 </el-button>
      </template>
    </pure-table>

    <Add
      v-model:visible="addVis"
      :editData="editData"
      :type="addType"
      @update:visible="addVis = $event"
    />
  </el-card>
</template>
