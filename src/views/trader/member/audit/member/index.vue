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
  onPass,
  onCxl,
  onBlK,
  onClr,
  onRej,
  onSelChg,
  batchk,
  batrej
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
      @batchk="batchk"
      @batrej="batrej"
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
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="onPass(row)">
        审核通过
      </el-button>
      <el-button link type="primary" size="small" @click="onRej(row)">
        驳回审核
      </el-button>
      <el-button link type="primary" size="small" @click="onCxl(row)">
        撤销审核
      </el-button>
      <el-button link type="primary" size="small" @click="onBlK(row)">
        拉黑
      </el-button>
      <el-button link type="primary" size="small" @click="onClr(row)">
        一键清除
      </el-button>
    </template>
  </pure-table>
</template>
