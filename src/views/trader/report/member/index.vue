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
      合计：账户钱包余额：<span class="text-red-500 ml-2 mr-8">4000.00</span>
      充值金额：<span class="text-red-500 ml-2 mr-8">4000.00</span>
      提款金额：<span class="text-red-500 ml-2 mr-8">4000.00</span>
      注单量：<span class="text-red-500 ml-2 mr-8">100</span> 投注金额：<span
        class="text-red-500 ml-2 mr-8"
        >400.00</span
      >
      有效投注:<span class="text-red-500 ml-2 mr-8">400.00</span>
      会员投注盈亏：<span class="text-red-500 ml-2 mr-8">0.00</span>
      会员实际盈亏：<span class="text-red-500 ml-2">0.00</span>
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

    <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
  </el-card>
</template>
