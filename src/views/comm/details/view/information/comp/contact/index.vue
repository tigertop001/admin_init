<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref } from "vue";

/**
 * 导入组件和工具
 */
import Add from "@iconify-icons/ri/add-circle-line";
import Subtract from "@iconify-icons/ri/indeterminate-circle-line";

import type { UserRowData } from "../../types";
interface Props {
  rowData?: UserRowData;
  resData?: Result;
}

const props = defineProps<Props>();
const rowData = props.rowData;
const resData = props.resData.data.data;
console.log(rowData, resData);
/**
 * 表格相关配置和方法
 */
import { useColumns } from "./form/columns";
const { columnData } = useColumns(resData);

/**
 * 父级传来的数据---start
 */

/**
 * 父级传来的数据---end
 */

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
        会员信息：（{{ resData.uname || "暂无真实姓名" }}）（{{
          resData.phoneNum || "暂无手机号"
        }}）（{{ resData.email || "暂无邮箱" }}）</span
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
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
