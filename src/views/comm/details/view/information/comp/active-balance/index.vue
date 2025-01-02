<script setup lang="ts">
import { ref, computed } from "vue";

import Refresh from "@iconify-icons/ri/loop-right-fill";

import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: Result;
}

import { useColumns } from "./form/columns";
const { columns, dtLst } = useColumns();

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt.data.data;
console.log(rowDt, resDt);

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
  "text-red cursor-pointer transition-all duration-500 hover:opacity-60",
  { "animate-spin": isSpin.value }
]);
</script>

<template>
  <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
    <div class="flex items-center gap-2">
      <span
        >活动钱包余额：
        <span class="text-orange-400"
          >{{ resDt.userInfo?.activeWalletLeft || "--" }} BRL</span
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
      :data="dtLst"
      :empty-size="100"
      :height="dtLst.length ? 'auto' : '100'"
      max-height="500"
      :style="{ height: dtLst.length ? '' : '100px' }"
    />
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
