<script setup lang="ts">
import { PlusSearch } from "plus-pro-components";
import "plus-pro-components/es/components/search/style/css";
import { useSearch } from "./config/searchConfig";
import { Search, Refresh, ArrowDown, ArrowUp } from "@element-plus/icons-vue";

const emit = defineEmits<{
  (_e: "update:param", _param: Record<string, any>): void;
}>();

/**
 * 搜索逻辑
 */
const { searchState, searchVal, columns, onSearch, onReset, onPrmUp, loading } =
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
    <template v-if="loading">
      <span class="loading-tip">加载中...</span>
    </template>
    <template #footer="{ handleUnfold, isShowUnfold }">
      <div class="flex">
        <el-button type="primary" :icon="Search" @click="onSearch">
          查询
        </el-button>
        <el-button :icon="Refresh" @click="onReset">重置</el-button>
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
