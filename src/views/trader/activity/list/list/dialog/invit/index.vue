<script setup lang="ts">
import "plus-pro-components/es/components/form/style/css";
import { PlusForm } from "plus-pro-components";
import { useColumns } from "./form/config/columns";
const { state, columns, onChg, onSub, onSubErr, onReset } = useColumns();

const getFormData = () => {
  return state.value;
};

defineExpose({
  getFormData
});
</script>

<template>
  <PlusForm
    v-model="state"
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
