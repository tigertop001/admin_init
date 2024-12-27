<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, computed } from "vue";
/**
 * 导入组件和工具
 */
import Refresh from "@iconify-icons/ri/loop-right-fill";

import type { UserRowData } from "../../types";
interface Props {
  rowData?: UserRowData;
  resData?: Result;
}

import { useColumns } from "./form/columns";
const { columns, dataList } = useColumns();

/**
 * 父级传来的数据---start
 */
const props = defineProps<Props>();
const rowData = props.rowData;
const resData = props.resData.data.data;
console.log(rowData, resData);
/**
 * 父级传来的数据---end
 */

const isShow = ref(false);
const isSpin = ref(false);

const emit = defineEmits<{
  (_e: "shwFndLg"): void;
}>();

/** 事件处理方法 */
const handlers = {
  // 显示/隐藏表格
  // toggleTable() {
  //   isShow.value = !isShow.value;
  // },

  shwFndLg() {
    emit("shwFndLg"); // 触发向上传递的事件
  },

  // 刷新处理
  refresh() {
    isSpin.value = true;
    setTimeout(() => {
      isSpin.value = false;
      // TODO: 添加实际的刷新逻辑
    }, 1000);
  }
};

/** 计算属性 */
const refIconCls = computed(() => [
  "text-red-600 cursor-pointer transition-all duration-500 hover:opacity-60",
  { "animate-spin": isSpin.value }
]);
</script>

<template>
  <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
    <div class="flex items-center gap-2">
      <span
        >佣金钱包余额：
        <span class="text-orange-400"
          >{{ resData.userInfo?.commissionWalletLeft || "--" }} BRL</span
        ></span
      >
      <IconifyIconOffline
        :icon="Refresh"
        :class="refIconCls"
        width="22"
        @click.stop="handlers.refresh"
      />
    </div>
  </el-col>
  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
    <div class="flex gap-2">
      <el-button @click="handlers.shwFndLg">
        {{ isShow ? "隐藏" : "查看" }}明细
      </el-button>
      <template v-if="isShow">
        <el-button>一键刷新</el-button>
        <el-button type="primary">一键转出</el-button>
      </template>
    </div>
  </el-col>
  <el-col
    v-if="isShow"
    :xs="24"
    :sm="24"
    :md="10"
    :lg="10"
    :xl="10"
    class="mt-2"
  >
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
      :height="dataList.length ? 'auto' : '100'"
      max-height="500"
      :style="{ height: dataList.length ? '' : '100px' }"
    />
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
