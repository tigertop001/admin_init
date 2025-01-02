<script setup lang="ts">
import { computed } from "vue";
import { PlusDialogForm } from "plus-pro-components";
import { useColumns } from "./config/columns";

const props = defineProps<{
  visible: boolean;
  uid: number;
  resDt?: Record<string, any>;
}>();

const emit = defineEmits<{
  (_e: "update:visible", _visible: boolean): void;
}>();

const { formData, formConfig, dlgTit, onClose, onSub, rstFrm } = useColumns(
  props.uid,
  () => {
    emit("update:visible", false);
  }
);

const dlgVis = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});
</script>

<template>
  <div>
    <PlusDialogForm
      v-model:visible="dlgVis"
      v-model="formData"
      :form="formConfig"
      :width="500"
      :title="dlgTit"
      confirmText="确定"
      @close="onClose"
      @confirm="onSub"
      @open="rstFrm"
    />
  </div>
</template>
