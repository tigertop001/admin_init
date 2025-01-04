<script setup lang="ts">
import { computed } from "vue";
import { useDialog } from "./form/columns";
import type { FieldValues } from "plus-pro-components";
import { PlusDialogForm } from "plus-pro-components";

const props = defineProps<{
  visible: boolean;
  editData?: FieldValues;
  type?: number;
}>();

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

const { formData, dlgConf, formConfig, onCls, onCfm, rstFrm } = useDialog(
  props,
  emit
);
</script>

<template>
  <PlusDialogForm
    v-model:visible="dialogVisible"
    v-model="formData"
    :colon="false"
    :form="formConfig"
    :width="1200"
    :title="dlgConf.title"
    :confirmText="dlgConf.confirmText"
    :col-props="{
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
      lg: { span: 12 },
      xl: { span: 12 }
    }"
    :row-props="{ gutter: 20 }"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>
