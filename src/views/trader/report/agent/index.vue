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
  getList,
  onPrmUp,
  expExcel,
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
        :exportData="dtLst"
        :expExcel="expExcel"
        @update:param="onPrmUp"
      />
    </template>
    <div class="flex justify-center items-center text-sm px-4 py-2">
      合计：佣金钱包余额：<span class="text-red-500 ml-2 mr-8">4000.00</span>
      累计佣金：<span class="text-red-500 ml-2 mr-8">4000.00</span>
      新增总业绩：<span class="text-red-500 ml-2 mr-8">4000.00</span>
      新增直属业绩：<span class="text-red-500 ml-2 mr-8">100</span>
      新增其他业绩：<span class="text-red-500 ml-2 mr-8">400.00</span>
      结算佣金:<span class="text-red-500 ml-2 mr-8">400.00</span>
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
        <el-button link type="primary" size="small" @click="onDetail(row)">
          详情
        </el-button>
      </template>
    </pure-table>
    <!-- 会员详情 -->
    <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
  </el-card>
</template>
