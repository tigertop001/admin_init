<script setup lang="ts">
// https://plus-pro-components.com/components/form.html
import "plus-pro-components/es/components/form/style/css";
import { PlusForm } from "plus-pro-components";
import { useColumns } from "./form/config/columns";
const { state, columns, onChg, onSub, onSubErr, onReset, setFormData } =
  useColumns();

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

defineExpose({
  getFormData,
  setFormData
});
</script>

<template>
  <PlusForm
    v-model="state"
    :disabled="props.disabled"
    class="w-[680px] m-auto"
    :columns="columns"
    label-position="right"
    :has-footer="false"
    @change="onChg"
    @submit="onSub"
    @submit-error="onSubErr"
    @reset="onReset"
  />
</template>
