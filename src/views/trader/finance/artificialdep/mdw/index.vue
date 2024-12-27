<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import Add from "./dialog/add/index.vue";
import Rec from "./dialog/rec/index.vue";

const {
  dataList,
  getList,
  onPrmUp,
  columns,
  tableData,
  addVis,
  recVis,
  currRow,
  shwAdd,
  shwUsrLst
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <!-- 搜索区域 -->
  <div class="mb-4">
    <Search :exportData="dataList" @update:param="onPrmUp" />
  </div>
  <div class="w-full flex justify-center gap-8 my-4 p-4 bg-gray-50 rounded">
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-sm font-medium">UID：</span>
      <span
        :class="[
          dataList.uid ? 'text-orange' : 'text-gray-400',
          'transition-colors'
        ]"
        >{{ dataList.uid || "--" }}</span
      >
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-sm font-medium">用户名：</span>
      <span
        :class="[
          dataList.account ? 'text-orange' : 'text-gray-400',
          'transition-colors'
        ]"
        >{{ dataList.account || "--" }}</span
      >
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-sm font-medium">真实姓名：</span>
      <span
        :class="[
          dataList.name ? 'text-orange' : 'text-gray-400',
          'transition-colors'
        ]"
        >{{ dataList.name || "--" }}</span
      >
    </div>
  </div>
  <pure-table :data="tableData" :columns="columns" class="[&_th]:!bg-gray-50">
    <template #operation="{ row }">
      <!-- 主钱包账户余额 -->
      <template v-if="row.operation === 'mainBalance'">
        <el-button link type="primary" @click="shwAdd(row)">人工充值</el-button>
        <el-button link type="primary" @click="shwUsrLst(row)"
          >人工提现</el-button
        >
      </template>
      <!-- 主钱包其他账户 -->
      <template v-else-if="row.operation === 'other'">
        <el-button link type="primary" @click="shwAdd(row)">人工充值</el-button>
        <el-button link type="primary">提取到余额</el-button>
      </template>
      <!-- 其他钱包账户余额 -->
      <template v-else>
        <el-button link type="primary" @click="shwAdd(row)">人工充值</el-button>
        <el-button link type="primary" @click="shwUsrLst(row)"
          >人工提现</el-button
        >
      </template>
    </template>
  </pure-table>

  <!-- 添加标签弹窗 -->
  <Add v-model:visible="addVis" @update:visible="addVis = $event" />
  <!-- 用户列表弹窗 -->
  <Rec
    ref="recRef"
    v-model:visible="recVis"
    :rowData="currRow"
    @update:visible="recVis = $event"
  />
</template>
