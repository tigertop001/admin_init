<script setup lang="ts">
import { ref, h, computed } from "vue";
import "plus-pro-components/es/components/search/style/css";
import { type PlusColumn, PlusSearch } from "plus-pro-components";
// import AccountTypeField from "./AccountTypeField.vue";
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

type UserType = "member" | "supAgent" | "inviter";

const props = defineProps({
  exportExcel: {
    type: Function as PropType<() => void>,
    required: true
  },
  exportData: {
    type: Array as PropType<any[]>,
    required: true
  }
});

const searchState = ref({
  member: { content: "", type: "uid", label: "UID" },
  supAgent: { content: "", type: "sUid", label: "UID" },
  inviter: { content: "", type: "initUid", label: "UID" },
  startTime: "",
  endTime: "",
  loginStartTime: "",
  loginEndTime: ""
});

const param = computed(() => {
  const result: Record<string, string> = {
    startTime: searchState.value.startTime,
    endTime: searchState.value.endTime,
    loginStartTime: searchState.value.loginStartTime,
    loginEndTime: searchState.value.loginEndTime
  };

  const fieldMapping = {
    member: { idKey: "memberId", nameKey: "member" },
    supAgent: { idKey: "agentId", nameKey: "agentMember" },
    inviter: { idKey: "inviterId", nameKey: "inviterMember" }
  };

  Object.entries(fieldMapping).forEach(([key, { idKey, nameKey }]) => {
    const field = searchState.value[key as UserType];
    const paramKey = field.label === "UID" ? idKey : nameKey;
    result[paramKey] = field.content;
  });

  return result;
});

const options = [
  { label: "UID", value: "uid", typename: "会员" },
  { label: "账号", value: "username", typename: "会员" }
];

const supOptions = [
  { label: "UID", value: "sUid", typename: "上级代理" },
  { label: "账号", value: "supName", typename: "上级代理" }
];

const initOptions = [
  { label: "UID", value: "initUid", typename: "邀请人" },
  { label: "账号", value: "initName", typename: "邀请人" }
];

const columns: PlusColumn[] = [
  {
    label: "会员",
    prop: "member",
    valueType: "input",
    renderField: () => {
      return h(AccountTypeField, {
        modelValue: searchState.value.member,
        options: options,
        "onUpdate:modelValue": (newValue: SearchField) => {
          searchState.value.member = newValue;
        }
      });
    }
  },
  {
    label: "上级代理",
    prop: "supAgent",
    valueType: "input",
    renderField: () => {
      return h(AccountTypeField, {
        modelValue: searchState.value.supAgent,
        options: supOptions,
        "onUpdate:modelValue": (newValue: SearchField) => {
          searchState.value.supAgent = newValue;
        }
      });
    }
  },
  {
    label: "邀请人",
    prop: "inviter",
    valueType: "input",
    renderField: () => {
      return h(AccountTypeField, {
        modelValue: searchState.value.inviter,
        options: initOptions,
        "onUpdate:modelValue": (newValue: SearchField) => {
          searchState.value.inviter = newValue;
        }
      });
    }
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

const emit = defineEmits<{
  (_e: "update:param", _param: Record<string, any>): void;
  (_e: "search", _values: any): void;
  (_e: "reset"): void;
}>();

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
</script>

<template>
  <PlusSearch
    v-model="searchState"
    :columns="columns"
    label-position="right"
    :defaultValues="searchState"
    :col-props="{
      xs: 24,
      sm: 12,
      md: 6,
      lg: 6,
      xl: 6
    }"
    :row-props="{
      gutter: 20,
      justify: 'start'
    }"
    :hasFooter="true"
    :showNumber="2"
    @search="handleSearch"
    @reset="handleReset"
  >
    <template
      #footer="{ handleReset, handleSearch, handleUnfold, isShowUnfold }"
    >
      <div class="flex">
        <el-button type="primary" :icon="Search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button :icon="Upload" @click="props.exportExcel(props.exportData)"
          >导出数据</el-button
        >
        <el-button :icon="Plus" @click="handleSearch">添加会员</el-button>
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
