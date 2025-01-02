<script setup lang="ts">
import { onMounted } from "vue";
import Add from "./dialog/add/index.vue";
import Rec from "./dialog/rec/index.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  addVis,
  recVis,
  currRow,
  onSzChg,
  onCurChg,
  getList,
  shwAdd,
  shwUsrLst
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
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
      <el-button link type="primary" size="small" @click="shwAdd(row)">
        新增用户
      </el-button>
      <el-button link type="primary" size="small" @click="shwUsrLst(row)">
        用户列表
      </el-button>
    </template>
  </pure-table>

  <!-- 添加标签弹窗 -->
  <Add
    v-model:visible="addVis"
    :rowDt="currRow"
    @update:visible="addVis = $event"
  />
  <!-- 用户列表弹窗 -->
  <Rec
    ref="recRef"
    v-model:visible="recVis"
    :rowDt="currRow"
    @update:visible="recVis = $event"
  />
</template>
