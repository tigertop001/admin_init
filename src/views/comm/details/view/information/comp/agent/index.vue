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

import { useColumns } from "./form/columns";
const { columns } = useColumns();

/**
 * 父级传来的数据---start
 */
const props = defineProps<Props>();
const rowData = props.rowData;
const resData = props.resData.data.data;
const dataList = ref([resData.agInf]);
console.log(rowData, resData);

/**
 * 父级传来的数据---end
 */

const isShow = ref(false);
const showTable = () => {
  isShow.value = !isShow.value;
};
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <div class="flex items-center gap-2">
      <span>上级代理：{{ resData.agInf.account }}</span>
      <IconifyIconOffline
        v-if="isShow"
        width="22"
        :icon="Subtract"
        class="cursor-pointer hover:opacity-60"
        @click.stop="showTable()"
      />
      <IconifyIconOffline
        v-else
        width="22"
        :icon="Add"
        class="cursor-pointer hover:opacity-60"
        @click.stop="showTable()"
      />
    </div>
  </el-col>
  <el-col v-if="isShow" :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
    <pure-table
      ref="tableRef"
      adaptive
      stripe
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :columns="columns"
      :data="dataList"
      :empty-size="100"
      :height="dataList ? 'auto' : '100'"
      max-height="500"
      :style="{ height: dataList ? '' : '100px' }"
    />
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
