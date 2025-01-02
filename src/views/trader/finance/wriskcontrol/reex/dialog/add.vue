<script setup lang="ts">
import { computed } from "vue";
import { type FieldValues, PlusDialogForm } from "plus-pro-components";
import { useAddDialog } from "./config/addConfig";

const props = defineProps<{
  visible: boolean;
  type?: number;
  editData?: FieldValues;
}>();

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const { formData, dialogTitle, formConfig, onCfm, onCls, rstFrm } =
  useAddDialog(props, emit);

const dialogVisible = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="dialogVisible"
    v-model="formData"
    :colon="false"
    :form="formConfig"
    :width="500"
    :title="dialogTitle"
    confirmText="确定"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>
