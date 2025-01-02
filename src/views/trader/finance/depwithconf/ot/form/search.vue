<script setup lang="ts">
import { PlusSearch } from "plus-pro-components";
import "plus-pro-components/es/components/search/style/css";
import { useSearch } from "./config/searchConfig";
import { Search, Refresh, ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import { ref } from "vue";

const emit = defineEmits<{
  (_e: "update:param", _param: Record<string, any>): void;
}>();

const {
  searchState,
  searchVal,
  columns,
  onSearch,
  onReset,
  onPrmUp,
  onAdd,
  onMarSet
} = useSearch(emit);
const onlineStatus = ref(false);

const onlineChg = (val: boolean) => {
  searchState.value.isOnline = val;
  onSearch();
};
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
    @update:modelValue="onPrmUp"
  >
    <template #footer="{ isShowUnfold, handleUnfold }">
      <div class="flex">
        <el-button type="primary" :icon="Search" @click="onSearch">
          查询
        </el-button>
        <el-button :icon="Refresh" @click="onReset">重置</el-button>
        <div class="mx-4 flex items-center">
          <span class="mr-8px">在线支付状态</span>
          <el-switch v-model="onlineStatus" @change="onlineChg" />
        </div>
        <el-button type="primary" @click="onMarSet">跑马灯设置</el-button>
        <el-button type="primary" @click="onAdd">新增支付通道</el-button>
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
