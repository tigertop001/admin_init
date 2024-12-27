<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, computed } from "vue";
import { type PlusColumn, PlusSearch } from "plus-pro-components";
import "plus-pro-components/es/components/search/style/css";
import type { SearchStateType } from "./config/searchConfig";
import { crtDFS, resetSearchState } from "./config/searchConfig";

/**
 * 导入组件和图标
 */
import {
  Search,
  Refresh,
  ArrowDown,
  ArrowUp,
  Plus
} from "@element-plus/icons-vue";

/**
 * Emits 定义
 */
const emit = defineEmits<{
  (_e: "update:param", _param: Record<string, any>): void;
  (_e: "search", _values: any): void;
  (_e: "reset"): void;
  (_e: "add"): void;
  (_e: "update:isShowUnfold", _value: boolean): void;
}>();

// 搜索参数计算
const param = computed(() => {
  const result: Record<string, any> = {
    regStartTime: searchState.value.regStartTime,
    regEndTime: searchState.value.regEndTime,
    loginStartTime: searchState.value.loginStartTime,
    loginEndTime: searchState.value.loginEndTime,
    tagId: searchState.value.tagId,
    status: searchState.value.status,
    page: searchState.value.page || defaultParams.page,
    pageSize: searchState.value.pageSize || defaultParams.pageSize
  };

  return result;
});

/**
 * 表单字段配置
 */
const columns: PlusColumn[] = [
  {
    label: "后台帐号",
    prop: "tagId",
    valueType: "input"
  },
  ,
  {
    label: "创建时间",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      onChange: (val: [Date, Date] | null) => {
        if (val) {
          searchState.value.regStartTime = Math.floor(val[0].getTime());
          searchState.value.regEndTime = Math.floor(val[1].getTime());
        } else {
          searchState.value.regStartTime = null;
          searchState.value.regEndTime = null;
        }
      }
    }
  },
  {
    label: "最后登陆时间",
    prop: "loginTime",
    labelWidth: 100,
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      onChange: (val: [Date, Date] | null) => {
        if (val) {
          searchState.value.loginStartTime = Math.floor(val[0].getTime());
          searchState.value.loginEndTime = Math.floor(val[1].getTime());
        } else {
          searchState.value.loginStartTime = null;
          searchState.value.loginEndTime = null;
        }
      }
    }
  },
  {
    label: "帐号状态",
    labelWidth: 100,
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "开启",
        value: 1
      },
      {
        label: "关闭",
        value: 2
      }
    ]
  }
];

/**
 * 事件处理方法
 */
const onSearch = (values: any) => {
  emit("update:param", param.value);
  emit("search", values);
};

/**
 * 分页查询
 */
const defaultParams = {
  page: 1,
  pageSize: 10
};
const searchState = ref<SearchStateType>({
  ...crtDFS(),
  ...defaultParams
});

/**
 * 重置处理
 */
// const searchState = ref<SearchStateType>(crtDFS());
const onReset = () => {
  searchState.value = resetSearchState(() => emit("reset"));
};

/**
 * 添加处理
 */
const onAdd = () => {
  emit("add");
};
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
    @search="onSearch"
    @reset="onReset"
  >
    <!-- 底部操作按钮 -->
    <template
      #footer="{ handleReset, handleSearch, handleUnfold, isShowUnfold }"
    >
      <div class="flex">
        <el-button type="primary" :icon="Search" @click="handleSearch">
          查询
        </el-button>
        <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
        <el-button type="primary" :icon="Plus" @click="onAdd">
          新建帐号
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
