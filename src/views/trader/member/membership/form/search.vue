<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, h, computed, type PropType } from "vue";
import { type PlusColumn, PlusSearch } from "plus-pro-components";
import "plus-pro-components/es/components/search/style/css";

/**
 * 导入组件和图标
 */
import AccountTypeField, {
  type SearchField
} from "@/components/CgDropDownSearch";
import {
  Search,
  Refresh,
  ArrowDown,
  ArrowUp,
  Plus,
  Upload
} from "@element-plus/icons-vue";

/**
 * Props 定义
 */
const { exportExcel, exportData } = defineProps({
  exportExcel: {
    type: Function as PropType<(_data: any[]) => void>,
    required: true
  },
  exportData: {
    type: Array as PropType<any[]>,
    required: true
  }
});

/**
 * Emits 定义
 */
const emit = defineEmits<{
  (_e: "update:param", _param: Record<string, any>): void;
  (_e: "search", _values: any): void;
  (_e: "reset"): void;
  (_e: "update:isShowUnfold", _value: boolean): void;
  (_e: "add"): void; // 添会员事件
}>();

/**
 * 搜索条件配置
 */
// 下拉选项配置
const searchOptions = {
  member: [
    { label: "UID", value: "uid", typename: "会员" },
    { label: "账号", value: "username", typename: "会员" }
  ],
  supAgent: [
    { label: "UID", value: "sUid", typename: "上级代理" },
    { label: "账号", value: "supName", typename: "上级代理" }
  ],
  inviter: [
    { label: "UID", value: "initUid", typename: "邀请人" },
    { label: "账号", value: "initName", typename: "邀请人" }
  ]
};

// 字段映射配置
const fieldMapping = {
  member: { idKey: "memberId", nameKey: "member" },
  supAgent: { idKey: "agentId", nameKey: "agentMember" },
  inviter: { idKey: "inviterId", nameKey: "inviterMember" }
};

/**
 * 状态管理
 */
// 搜索状态
const searchState = ref({
  member: { content: "", type: "uid", label: "UID" },
  supAgent: { content: "", type: "sUid", label: "UID" },
  inviter: { content: "", type: "initUid", label: "UID" },
  startTime: "",
  endTime: "",
  loginStartTime: "",
  loginEndTime: ""
});

/**
 * 类型定义
 */
type UserType = "member" | "supAgent" | "inviter";

// 搜索参数计算
const param = computed(() => {
  const result: Record<string, string> = {
    startTime: searchState.value.startTime,
    endTime: searchState.value.endTime,
    loginStartTime: searchState.value.loginStartTime,
    loginEndTime: searchState.value.loginEndTime
  };

  Object.entries(fieldMapping).forEach(([key, { idKey, nameKey }]) => {
    const field = searchState.value[key as UserType];
    const paramKey = field.label === "UID" ? idKey : nameKey;
    result[paramKey] = field.content;
  });

  return result;
});

/**
 * 表单字段配置
 */
const columns: PlusColumn[] = [
  {
    label: "会员",
    prop: "member",
    valueType: "input",
    renderField: () =>
      h(AccountTypeField, {
        modelValue: searchState.value.member,
        options: searchOptions.member,
        "onUpdate:modelValue": (newValue: SearchField) => {
          searchState.value.member = newValue;
        }
      })
  },
  {
    label: "上级代理",
    prop: "supAgent",
    valueType: "input",
    renderField: () =>
      h(AccountTypeField, {
        modelValue: searchState.value.supAgent,
        options: searchOptions.supAgent,
        "onUpdate:modelValue": (newValue: SearchField) => {
          searchState.value.supAgent = newValue;
        }
      })
  },
  {
    label: "邀请人",
    prop: "inviter",
    valueType: "input",
    renderField: () =>
      h(AccountTypeField, {
        modelValue: searchState.value.inviter,
        options: searchOptions.inviter,
        "onUpdate:modelValue": (newValue: SearchField) => {
          searchState.value.inviter = newValue;
        }
      })
  },
  {
    label: "注册时间",
    prop: "endTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  },
  {
    label: "登陆时间",
    prop: "endTimed",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  }
];

/**
 * 事件处理方法
 */
const handleSearch = (values: any) => {
  emit("update:param", param.value);
  emit("search", values);
};

const handleReset = () => {
  searchState.value = {
    member: { content: "", type: "uid", label: "UID" },
    supAgent: { content: "", type: "sUid", label: "UID" },
    inviter: { content: "", type: "initUid", label: "UID" },
    startTime: "",
    endTime: "",
    loginStartTime: "",
    loginEndTime: ""
  };
  emit("reset");
};

/**
 * 添加会员处理
 */
const handleAdd = () => {
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
    @search="handleSearch"
    @reset="handleReset"
  >
    <!-- 底部操作按钮 -->
    <template
      #footer="{ handleReset, handleSearch, handleUnfold, isShowUnfold }"
    >
      <div class="flex">
        <el-button type="primary" :icon="Search" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
        <el-button
          type="primary"
          :icon="Upload"
          @click="() => exportExcel(exportData)"
        >
          导出数据
        </el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          添加会员
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
