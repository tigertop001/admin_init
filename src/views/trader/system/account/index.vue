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
  onDel
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <Search :exportData="dtLst" @update:param="onPrmUp" @add="shwAdd(0)" />
    </template>

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
        <el-button link type="primary" size="small" @click="() => onEdit(row)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="() => onDel(row)">
          关闭
        </el-button>
        <el-button link type="primary" size="small" @click="() => onDel(row)">
          停用
        </el-button>
      </template>
    </pure-table>

    <Add
      v-model:visible="addVis"
      :editData="editData"
      :type="addType"
      @submit="onAddSub"
      @update:visible="addVis = $event"
    />
  </el-card>
</template>
