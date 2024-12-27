<script setup lang="ts">
/**
 * 导入依赖和组件
 */
import { onMounted } from "vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  onPass,
  onSzChg,
  onCurChg,
  getList
} = useColumns();

/**
 * 生命周期钩子
 */
onMounted(() => {
  getList();
});
</script>

<template>
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
      <el-button
        v-if="row.status == 2"
        link
        type="primary"
        size="small"
        @click="onPass({ requestId: row.id, uid: row.uid, status: 1 })"
      >
        通过
      </el-button>
      <el-button
        v-if="row.status == 2"
        link
        type="primary"
        size="small"
        @click="onPass({ requestId: row.id, uid: row.uid, status: 3 })"
      >
        取消
      </el-button>
    </template>
  </pure-table>
</template>
