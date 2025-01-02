<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  onPass,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp
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
      @page-size-change="onSzChg"
      @page-current-change="onCurChg"
    >
      <template #operation="{ row }">
        <el-button
          v-if="row.withdrawalState == 1"
          link
          type="primary"
          size="small"
          @click="onPass({ id: row.id, withdrawalState: 2 })"
        >
          通过
        </el-button>
        <el-button
          v-if="row.withdrawalState == 1"
          link
          type="primary"
          size="small"
          @click="onPass({ id: row.id, withdrawalState: 3 })"
        >
          取消
        </el-button>
      </template>
    </pure-table>
  </el-card>
</template>
