<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import Add from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";
import Details from "@/views/comm/details/index.vue";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  addMebVis,
  dtlsVis,
  curRow,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  onAdd,
  onAddSub,
  onDetail,
  onSelChg
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search :exportData="dtLst" @update:param="onPrmUp" @add="onAdd" />
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
    @selection-change="onSelChg"
  >
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="onDetail(row)">
        移出
      </el-button>
      <el-button link type="primary" size="small" @click="onDetail(row)">
        冻结
      </el-button>
    </template>
  </pure-table>

  <!-- 添加弹窗 -->
  <Add
    v-model:visible="addMebVis"
    @submit="onAddSub"
    @update:visible="addMebVis = $event"
  />

  <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
</template>
