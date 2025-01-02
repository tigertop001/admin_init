<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import Mdep from "./dialog/mdep/index.vue";
import Mwith from "./dialog/mwith/index.vue";

const {
  dtLst,
  getList,
  onPrmUp,
  columns,
  tblDt,
  addVis,
  recVis,
  currRow,
  shwMDep,
  shwUsrLst,
  onBalan
} = useColumns();

// onMounted(() => {
//   getList();
// });
</script>

<template>
  <div class="mb-4">
    <Search :exportData="dtLst" @update:param="onPrmUp" />
  </div>
  <div class="w-full flex justify-center gap-8 my-4 p-4 bg-gray-50 rounded">
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-sm font-medium">UID：</span>
      <span
        :class="[
          dtLst.uid ? 'text-orange' : 'text-gray-400',
          'transition-colors'
        ]"
        >{{ dtLst.uid || "--" }}</span
      >
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-sm font-medium">用户名：</span>
      <span
        :class="[
          dtLst.account ? 'text-orange' : 'text-gray-400',
          'transition-colors'
        ]"
        >{{ dtLst.account || "--" }}</span
      >
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-sm font-medium">真实姓名：</span>
      <span
        :class="[
          dtLst.name ? 'text-orange' : 'text-gray-400',
          'transition-colors'
        ]"
        >{{ dtLst.name || "--" }}</span
      >
    </div>
  </div>
  <pure-table :data="tblDt" :columns="columns" class="[&_th]:!bg-gray-50">
    <template #operation="{ row }">
      <!-- 主钱包账户余额 -->
      <template v-if="row.operation === 'mainBalance'">
        <el-button link type="primary" @click="shwMDep(row)"
          >人工充值</el-button
        >
        <el-button link type="primary" @click="shwUsrLst(row)"
          >人工提现</el-button
        >
      </template>
      <!-- 主钱包其他账户 -->
      <template v-else-if="row.operation === 'other'">
        <el-button link type="primary" @click="shwMDep(row)"
          >人工充值</el-button
        >
        <el-button link type="primary" @click="onBalan(row)"
          >提取到余额</el-button
        >
      </template>
      <!-- 其他钱包账户余额 -->
      <template v-else>
        <el-button link type="primary" @click="shwMDep(row)"
          >人工充值</el-button
        >
        <el-button link type="primary" @click="shwUsrLst(row)"
          >人工提现</el-button
        >
      </template>
    </template>
  </pure-table>

  <!-- 人工充值 -->
  <Mdep
    v-model:visible="addVis"
    :userDt="dtLst"
    :wltDt="currRow"
    @update:visible="addVis = $event"
  />
  <!-- 人工提款 -->
  <Mwith
    v-model:visible="recVis"
    :userDt="dtLst"
    :wltDt="currRow"
    @update:visible="recVis = $event"
  />
</template>
