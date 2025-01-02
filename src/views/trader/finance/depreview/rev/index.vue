<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import Details from "@/views/comm/details/index.vue";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  dtlsVis,
  curRow,
  onSzChg,
  onCurChg,
  expExcel,
  getList,
  onPrmUp,
  onArrv
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search :expExcel="expExcel" :exportData="dtLst" @update:param="onPrmUp" />
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
  <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
</template>
