<script setup lang="ts">
/**
 * 导入依赖和组件
 */
import { onMounted } from "vue";
import Search from "./form/search.vue";
// import Tag from "./dialog/tag.vue";
// import Add from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";
import Details from "@/views/comm/details/index.vue";

const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  // dialogVis,
  // curTag,
  // addMebVis,
  dtlsVis,
  curRow,
  onSzChg,
  onCurChg,
  expExcel,
  getList,
  onPrmUp,
  // onAdd,
  // onAddSub,
  onArrv
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
    <Search
      :expExcel="expExcel"
      :exportData="dataList"
      @update:param="onPrmUp"
    />
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
      <el-button link type="primary" size="small" @click="onArrv(row, 1)">
        到帐
      </el-button>
      <el-button link type="primary" size="small" @click="onArrv(row, 2)">
        未到
      </el-button>
    </template>
  </pure-table>

  <!-- 会员标识详情弹窗
    <Tag v-model:visible="dialogVis" :curTag="curTag" /> -->

  <!-- 添加弹窗 -->
  <!-- <Add
    v-model:visible="addMebVis"
    @submit="onAddSub"
    @update:visible="addMebVis = $event"
  /> -->

  <!-- 会员详情 -->
  <Details v-model:visible="dtlsVis" title="会员详情" :rowData="curRow" />
</template>
