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
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  add3rd,
  qt3rd,
  onSelChg
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search
      :exportData="dtLst"
      @update:param="onPrmUp"
      @add3rd="add3rd"
      @qt3rd="qt3rd"
    />
  </div>

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
    @selection-change="onSelChg"
  >
    <template #operation="{}">
      <el-button link type="primary" size="small">通过</el-button>
      <el-button link type="primary" size="small">取消</el-button>
      <el-button link type="primary" size="small">复审</el-button>
      <el-button link type="primary" size="small">冻结</el-button>
    </template>
  </pure-table>
</template>
