<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  type TableValueType,
  type FormItemValueType,
  PlusDialogForm
} from "plus-pro-components";

const props = defineProps<{
  editData?: FieldValues;
  type?: number;
}>();

const dlgConf = computed(() => {
  const isEdit = props.type === 1;
  return {
    title: isEdit ? "修改账号" : "添加IP白名单",
    confirmText: isEdit ? "修改" : "保存"
  };
});

const visible = ref(false);

interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const columns = computed<PlusColumn[]>(() => [
  {
    label: "IP地址",
    width: 120,
    labelWidth: 100,
    prop: "roleId",
    valueType: "input"
  },
  {
    label: "备注",
    width: 120,
    labelWidth: 100,
    prop: "account",
    valueType: "textarea"
  }
]);

const crtDefVal = (columns: PlusColumn[]): FormDefaultValues => {
  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = (() => {
      const valueType = column.valueType as TableValueType | FormItemValueType;
      switch (valueType) {
        case "input":
        case "textarea":
        case "select":
        case "radio":
        case "checkbox":
        case "text":
          return "";
        case "switch":
          return 1;
        default:
          return "";
      }
    })();

    if (column.prop) {
      acc[column.prop] = defaultValue;
    }
    return acc;
  }, {} as FormDefaultValues);

  return defaultValues;
};

const formData = ref<FieldValues>(crtDefVal(columns.value));

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;

  (_e: "update:visible", _visible: boolean): void;
}>();

const rstFrm = () => {
  if (props.type === 0) {
    formData.value = crtDefVal(columns.value);
  } else if (props.type === 1 && props.editData) {
    formData.value = {
      ...crtDefVal(columns.value),
      ...props.editData
    };
  }
};

watch(
  [() => props.type, () => props.editData],
  ([newType, newData]) => {
    if (newType === 0) {
      formData.value = crtDefVal(columns.value);
    } else if (newType === 1 && newData) {
      formData.value = {
        ...crtDefVal(columns.value),
        ...newData
      };
    }
  },
  { immediate: true }
);

const onCfm = () => {
  const subData = {
    ...formData.value,
    sort: formData.value.sort ? Number(formData.value.sort) : null
  };

  emit("submit", subData);
  emit("update:visible", false);
  if (props.type === 0) {
    formData.value = crtDefVal(columns.value);
  }
};

const onCls = () => {
  rstFrm();
  emit("update:visible", false);
};

const formConfig = computed(() => ({
  columns: columns.value,
  labelSuffix: ""
}));
</script>

<template>
  <PlusDialogForm
    v-model:visible="visible"
    v-model="formData"
    :colon="false"
    :form="formConfig"
    :width="500"
    :title="dlgConf.title"
    :confirmText="dlgConf.confirmText"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>
