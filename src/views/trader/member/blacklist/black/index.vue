<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import Add from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  addVis,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  shwAdd,
  onAddSub,
  onFrzn
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <!-- 搜索区域 -->
  <div class="mb-4">
    <Search :exportData="dataList" @update:param="onPrmUp" @add="shwAdd()" />
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
    <!-- 操作列 -->
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="onFrzn(row)">
        解冻
      </el-button>
    </template>
  </pure-table>

  <!-- 添加标签弹窗 -->
  <Add
    v-model:visible="addVis"
    @submit="onAddSub"
    @update:visible="addVis = $event"
  />
</template>
