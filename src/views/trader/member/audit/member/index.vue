<script setup lang="ts">
/**
 * 导入依赖和组件
 */
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
  onPass,
  onCxl,
  onBlK,
  onClr,
  onRej
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
