<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import AddDialog from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";

/**
 * 从columns中引入所需的状态和方法
 */
const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  addVis,
  editData,
  addType,
  onSzChg,
  onCurChg,
  onPrmUp,
  shwAdd,
  onDel,
  onPub,
  onEnd,
  getList,
  onDlogSub
} = useColumns();

/**
 * 生命周期钩子：组件加载时获取数据
 */
onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search
      :exportData="dtLst"
      @update:param="onPrmUp"
      @add="shwAdd(0, null)"
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
  >
    <template #operation="{ row }">
      <el-button
        v-if="row.status == 1"
        link
        type="primary"
        size="small"
        @click="shwAdd(1, row)"
      >
        编辑
      </el-button>
      <el-button
        v-if="row.status == 1"
        link
        type="primary"
        size="small"
        @click.passive="() => onPub({ id: row.id })"
      >
        发布
      </el-button>
      <el-button
        v-if="[1, 2].includes(row.status)"
        link
        type="primary"
        size="small"
        @click="() => onDel({ id: row.id })"
      >
        删除
      </el-button>
      <el-button
        v-if="[2, 3].includes(row.status)"
        link
        type="primary"
        size="small"
        @click="() => shwAdd(2, row)"
      >
        详情
      </el-button>
      <el-button
        v-if="row.status == 3"
        link
        type="primary"
        size="small"
        @click="() => onEnd({ id: row.id })"
      >
        结束活动
      </el-button>
    </template>
  </pure-table>
  <AddDialog
    v-model="addVis"
    :edit-data="editData"
    :edit-type="addType"
    @submit="onDlogSub"
  />
</template>
