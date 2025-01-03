<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import Pay from "./dialog/pay.vue";
import Info from "./dialog/info.vue";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  curData,
  payVis,
  infVis,
  isPay,
  isInfo,
  onSzChg,
  onCurChg,
  expExcel,
  getList,
  onPrmUp,
  onCxl,
  onBlK,
  onRej,
  onSelChg,
  onBatpay,
  onBatver,
  onBatcxl
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search
      :expExcel="expExcel"
      :exportData="dtLst"
      @update:param="onPrmUp"
      @batchk="onBatver"
      @batrej="onBatpay"
      @batcxl="onBatcxl"
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
    @selection-change="onSelChg"
  >
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="isInfo(row)">
        查看
      </el-button>
      <el-button link type="primary" size="small" @click="onCxl(row, 2)">
        取消
      </el-button>
      <el-button link type="primary" size="small" @click="onRej(row)">
        稽核流水
      </el-button>
      <el-button link type="primary" size="small" @click="isPay(row)">
        代付
      </el-button>
    </template>
  </pure-table>

  <Pay
    v-model:visible="payVis"
    :curData="curData"
    @submit="onCxl(curData, 1)"
    @update:visible="payVis = $event"
  />

  <Info
    v-model:visible="infVis"
    :curData="curData"
    @submit="onCxl(curData, 1)"
    @update:visible="infVis = $event"
  />
</template>
