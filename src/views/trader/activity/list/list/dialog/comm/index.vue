<script setup lang="ts">
import "plus-pro-components/es/components/form/style/css";
import { PlusForm } from "plus-pro-components";
import { useColumns } from "./form/config/columns";
const emit = defineEmits(["update:modelValue"]);
const { state, rules, columns, onChg } = useColumns(emit);

// 定义 props
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false // 默认值为 false
  }
});

const getFormData = () => {
  return state.value;
};

// 添加设置表单数据的方法
const setFormData = (data: any) => {
  Object.assign(state.value, data);
};

defineExpose({
  getFormData,
  setFormData // 暴露设置数据方法
});
</script>

<template>
  <PlusForm
    v-model="state"
    :disabled="props.disabled"
    class="w-[600px] m-auto"
    :columns="columns"
    :rules="rules"
    label-position="right"
    :has-footer="false"
    @change="onChg"
  />
</template>
