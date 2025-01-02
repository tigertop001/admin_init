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
  <div class="mb-4">
    <Search :exportData="dtLst" @update:param="onPrmUp" @add="shwAdd()" />
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
  >
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
