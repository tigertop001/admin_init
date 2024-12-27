<script setup lang="ts">
/**
 * 导入依赖和组件
 */
import { onMounted } from "vue";
import Search from "./form/search.vue";
import Add from "./dialog/change.vue";
import Rec from "./dialog/rec.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  addVis,
  editData,
  recVis,
  currUid,
  showRec,
  onAddSub,
  onSzChg,
  onCurChg,
  getList,
  shwAdd,
  onPrmUp
} = useColumns();

/**
 * 生命周期钩子
 */
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
    <!-- 操作列 -->
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="shwAdd(0, row)">
        升级、降级
      </el-button>
      <el-button link type="primary" size="small" @click="showRec(row)">
        升级记录
      </el-button>
    </template>
  </pure-table>
  <Rec v-model="recVis" :uid="currUid" />
  <!-- 升级降级弹窗 -->
  <Add
    v-model:visible="addVis"
    :editData="editData"
    @submit="onAddSub"
    @update:visible="addVis = $event"
  />
</template>
