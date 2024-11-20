<script setup lang="ts">
import { ref, h } from "vue";
import "plus-pro-components/es/components/search/style/css";
import { type PlusColumn, PlusSearch } from "plus-pro-components";
import AccountTypeField from "./AccountTypeField.vue"; // 引入封装的组件

// 修改 state.searchContent 的类型为对象
const state = ref({
  status: "0",
  time: new Date().toString(),
  searchContent: { content: "", type: "uid", label: "会员UID" }, // 修改为对象
  searchType: "会员UID",
  label: "uid"
});

const options = [
  { label: "会员UID", value: "uid" },
  { label: "会员用户名", value: "username" }
];

const columns: PlusColumn[] = [
  {
    label: "账号类型",
    prop: "searchContent",
    valueType: "input",
    renderField: () => {
      return h(AccountTypeField, {
        modelValue: state.value.searchContent, // 传递对象类型的 modelValue
        searchType: state.value.searchType, // 传递 searchType
        options: options // 传递选项给子组件
      });
    }
  },
  {
    label: "到期时间",
    prop: "endTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  },
  {
    label: "奖励",
    prop: "price"
  },
  {
    label: "提成",
    prop: "percentage"
  }
];

const handleChange = (values: any) => {
  console.log(values, "change");
  console.log("搜索类型:", state.value.searchType);
  console.log("搜索内容:", values.searchContent);
};

const handleSearch = (values: any) => {
  console.log(values, "search");
  console.log("搜索类型:", state.value.searchType);
  console.log("搜索内容:", values.searchContent);
};

const handleRest = () => {
  console.log("handleRest");
  state.value.searchType = "name";
  state.value.searchContent = { content: "", type: "uid", label: "会员UID" }; // 重新初始化为对象
};
</script>

<template>
  <PlusSearch
    v-model="state"
    :columns="columns"
    :show-number="20"
    label-position="right"
    :field-props="{
      style: { width: 'auto' }
    }"
    @change="handleChange"
    @search="handleSearch"
    @reset="handleRest"
  />
</template>
