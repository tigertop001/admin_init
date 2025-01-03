<script setup lang="ts">
import { onMounted } from "vue";
import { useColumns } from "./form/config/columns";
import Search from "./form/search.vue";
import Add from "./dialog/add.vue";
import { Plus } from "@element-plus/icons-vue";
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
  shwAdd,
  onEdit,
  onAddSub,
  onPrmUp,
  onDel,
  onPub,
  onRev
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search :exportData="dtLst" @update:param="onPrmUp" @add="shwAdd(0)" />
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
    :data="dtLst"
    @page-size-change="onSzChg"
    @page-current-change="onCurChg"
  >
    <template #operation="{ row }">
      <el-button link type="warning" size="small" @click="onPub(row)">
        发布
      </el-button>
      <el-button link type="warning" size="small" @click="onEdit(row)">
        编辑
      </el-button>
      <el-button link type="danger" size="small" @click="onDel(row)">
        删除
      </el-button>
      <el-button link type="warning" size="small" @click="onEdit(row)">
        详情
      </el-button>
      <el-button link type="warning" size="small" @click="onRev(row)">
        撤回
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
</template>
