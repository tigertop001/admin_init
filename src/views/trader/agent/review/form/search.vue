<script setup lang="ts">
import { PlusSearch } from "plus-pro-components";
import "plus-pro-components/es/components/search/style/css";
import { useSearch } from "./config/searchConfig";

import {
  Search,
  Refresh,
  ArrowDown,
  ArrowUp,
  Upload,
  Delete
} from "@element-plus/icons-vue";

const props = defineProps({
  expExcel: {
    type: Function as PropType<(_data: any[]) => void>,
    required: true
  },
  exportData: {
    type: Array as PropType<any[]>,
    required: true
  },
  handleBatchOpt: {
    type: Function as PropType<(_type: 2 | 3) => void>,
    required: true
  }
});

const emit = defineEmits<{
  (_e: "update:param", _param: Record<string, any>): void;
}>();

/**
 * 搜索逻辑
 */
const { searchState, searchVal, columns, onSearch, onReset, onPrmUp } =
  useSearch(emit);

defineExpose({ searchVal });
</script>

<template>
  <PlusSearch
    v-model="searchState"
    :columns="columns"
    :defaultValues="searchState"
    label-position="right"
    :hasFooter="true"
    :showNumber="2"
    :col-props="{
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 6 }
    }"
    :row-props="{
      gutter: 20,
      justify: 'start'
    }"
    @update:param="onPrmUp"
  >
    <template #footer="{ handleUnfold, isShowUnfold }">
      <div class="flex">
        <el-button type="primary" :icon="Search" @click="onSearch">
          查询
        </el-button>
        <el-button :icon="Refresh" @click="onReset">重置</el-button>
        <el-button
          type="primary"
          :icon="Upload"
          @click="() => props.handleBatchOpt(2)"
        >
          批量通过
        </el-button>
        <el-button
          type="primary"
          :icon="Delete"
          @click="() => props.handleBatchOpt(3)"
        >
          批量取消
        </el-button>
        <el-button
          type="primary"
          :icon="Upload"
          @click="() => props.expExcel(props.exportData)"
        >
          导出数据
        </el-button>
        <el-button
          :icon="isShowUnfold ? ArrowUp : ArrowDown"
          link
          @click="handleUnfold"
        >
          {{ isShowUnfold ? "收起" : "展开" }}
        </el-button>
      </div>
    </template>
  </PlusSearch>
</template>
