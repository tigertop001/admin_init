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
  editData,
  addVis,
  addType,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  shwAdd,
  onEdit,
  onAddSub,
  add3rd,
  qt3rd,
  onSelChg
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <!-- 搜索区域 -->
    <template #header>
      <Search
        :exportData="dataList"
        @update:param="onPrmUp"
        @add="shwAdd(0)"
        @add3rd="add3rd"
        @qt3rd="qt3rd"
      />
    </template>

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
      @selection-change="onSelChg"
    >
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="() => onEdit(row)">
          详情
        </el-button>
        <el-button link type="primary" size="small" @click="() => onEdit(row)">
          入账
        </el-button>
        <el-button link type="primary" size="small" @click="() => onEdit(row)">
          出账
        </el-button>
      </template>
    </pure-table>

    <!-- 添加标签弹窗 -->
    <Add
      v-model:visible="addVis"
      :editData="editData"
      :type="addType"
      @submit="onAddSub"
      @update:visible="addVis = $event"
    />
  </el-card>
</template>
