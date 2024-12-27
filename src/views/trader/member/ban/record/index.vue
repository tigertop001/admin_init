<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";

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
  onDel
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <!-- 搜索区域 -->
  <div class="mb-4">
    <Search :exportData="dataList" @update:param="onPrmUp" />
  </div>

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
  >
    <template #operation="{}">
      <el-button link type="primary" size="small" @click="onDel">
        移除
      </el-button>
    </template>
  </pure-table>
</template>
