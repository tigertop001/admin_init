<script setup lang="ts">
import { onMounted } from "vue";
import { useColumns } from "./form/config/columns";
import Add from "./dialog/add.vue";
import { Plus } from "@element-plus/icons-vue";
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
  shwAdd,
  onEdit,
  onAddSub,
  onDel
} = useColumns();

/**
 * 生命周期钩子
 */
onMounted(() => {
  getList();
});
</script>

<template>
  <div class="flex justify-end mb-4">
    <el-button type="primary" :icon="Plus" @click="shwAdd(0)">
      新增层级
    </el-button>
  </div>
  <pure-table
    ref="tableRef"
    stripe
    border
    adaptive
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
      <el-button link type="warning" size="small" @click="onEdit(row)">
        修改
      </el-button>
      <el-button link type="danger" size="small" @click="onDel(row)">
        删除
      </el-button>
    </template>
  </pure-table>

  <!-- 新增弹窗 -->
  <Add
    v-model:visible="addVis"
    :editData="editData"
    :type="addType"
    @submit="onAddSub"
    @update:visible="addVis = $event"
  />
</template>
