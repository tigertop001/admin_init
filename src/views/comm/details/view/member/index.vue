<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import type { UserRowData } from "./types";
interface Props {
  rowDt?: UserRowData | null;
}
const props = defineProps<Props>();
/**
 * 数据处理方法
 */

import { useColumns } from "./form/config/columns";

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
  onPrmUp
} = useColumns(props.rowDt.uid);

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <Search
        :exportData="dtLst"
        :uid="props.rowDt.uid"
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
    />
  </el-card>
</template>
