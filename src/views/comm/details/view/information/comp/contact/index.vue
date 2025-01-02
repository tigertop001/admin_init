<script setup lang="ts">
import { ref } from "vue";

import Add from "@iconify-icons/ri/add-circle-line";
import Subtract from "@iconify-icons/ri/indeterminate-circle-line";

import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: Result;
}

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt.data.data;
console.log(rowDt, resDt);
/**
 * 表格相关配置和方法
 */
import { useColumns } from "./form/columns";
const { columnData } = useColumns(resDt);

const isShow = ref(false);
/** 事件处理方法 */
const handlers = {
  // 显示/隐藏表格
  toggleTable() {
    isShow.value = !isShow.value;
  }
};
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <div class="flex items-center gap-2">
      <span>
        会员信息：（{{ resDt.uname || "暂无真实姓名" }}）（{{
          resDt.phoneNum || "暂无手机号"
        }}）（{{ resDt.email || "暂无邮箱" }}）</span
      >
      <IconifyIconOffline
        v-if="isShow"
        width="22"
        :icon="Subtract"
        class="cursor-pointer hover:opacity-60"
        @click="handlers.toggleTable"
      />
      <IconifyIconOffline
        v-else
        width="22"
        :icon="Add"
        class="cursor-pointer hover:opacity-60"
        @click="handlers.toggleTable"
      />
    </div>
  </el-col>
  <el-col v-if="isShow" :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
    <ul class="space-y-0 border-[var(--vxe-table-border-color)] border rounded">
      <li
        v-for="(val, key) in columnData"
        :key="key"
        class="flex px-3 border-b border-[var(--vxe-table-border-color)] last:border-b-0"
      >
        <span class="w-25 flex-none opacity-60">{{ val.title }}: </span>
        <span class="flex-1">{{ val.value }}</span>
      </li>
    </ul>
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
