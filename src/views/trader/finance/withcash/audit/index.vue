<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  onSzChg,
  onCurChg,
  expExcel,
  getList,
  getInfo,
  onPrmUp,
  infoData,
  auditInfo
} = useColumns();

onMounted(() => {
  getList();
  getInfo();
});
</script>

<template>
  <div class="mb-4">
    <Search :expExcel="expExcel" :exportData="dtLst" @update:param="onPrmUp" />
  </div>
  <div
    class="flex justify-between items-center p-4 bg-gray-50 rounded-lg text-sm"
  >
    <div class="space-y-2">
      <template v-if="!auditInfo.isCompleted">
        <div class="text-gray-700">
          当前稽核 <span class="text-red-500 font-medium">未完成</span>，
          提现需扣除行政费：
          <span class="text-orange-500 font-medium">{{
            auditInfo.adminFee.toFixed(2)
          }}</span>
          元 + 活动优惠：
          <span class="text-orange-500 font-medium">{{
            auditInfo.activityDiscount.toFixed(2)
          }}</span>
          元
        </div>
      </template>
      <template v-else>
        <div class="text-gray-700">
          当前稽核 <span class="text-green-500 font-medium">已完成</span>
        </div>
      </template>
    </div>

    <div class="text-gray-700">
      行政费率：
      <span class="text-orange-500 font-medium"
        >{{ auditInfo.adminFeeRate }}%</span
      >
      ｜行政费上限：
      <span class="text-orange-500 font-medium">{{
        auditInfo.adminFeeLimit.toFixed(2)
      }}</span>
      元 ｜免稽核额度：
      <span class="text-orange-500 font-medium">{{
        auditInfo.auditFreeAmount.toFixed(2)
      }}</span>
      元
    </div>
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
  />
</template>
