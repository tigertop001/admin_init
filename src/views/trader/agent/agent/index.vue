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
  expExcel,
  getList,
  onPrmUp,
  onAdd,
  onAddSub,
  onDetail
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <Search
        :expExcel="expExcel"
        :exportData="dtLst"
        @update:param="onPrmUp"
        @add="onAdd"
      />
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
        <el-button link type="primary" size="small" @click="onDetail(row)">
          详情
        </el-button>
      </template>
    </pure-table>

    <!-- 会员标识详情弹窗
    <Tag v-model:visible="dialogVis" :curTag="curTag" /> -->

    <!-- 添加弹窗 -->
    <Add
      v-model:visible="addMebVis"
      @submit="onAddSub"
      @update:visible="addMebVis = $event"
    />

    <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
  </el-card>
</template>
