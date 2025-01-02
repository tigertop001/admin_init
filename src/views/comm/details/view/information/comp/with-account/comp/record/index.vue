<script setup lang="ts">
import { onMounted } from "vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  onPass,
  onSzChg,
  onCurChg,
  getList
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
