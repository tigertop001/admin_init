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
    title: isEdit ? "修改活动标签" : "添加活动标签",
    confirmText: isEdit ? "修改" : "提交"
  };
});

const visible = ref(false);

interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const FORM_RULES = {
  name: [
    { required: true, message: "请输入活动标签", trigger: "blur" },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{2,20}$/,
      message: "活动标签长度为2-20位，不能包含特殊字符"
    }
  ],
  sort: [
    { required: true, message: "排序必须为大于0的整数", trigger: "blur" },
    {
      pattern: /^[1-9]\d*$/,
      message: "排序必须为大于0的整数"
    }
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }]
} as const;

const columns = computed<PlusColumn[]>(() => [
  {
    label: "活动标签",
    width: 120,
    labelWidth: 100,
    prop: "name",
    valueType: "input",
    rules: FORM_RULES.name
  },
  {
    label: "排序",
    width: 120,
    labelWidth: 100,
    prop: "sort",
    valueType: "input",
    fieldProps: {
      type: "number",
      placeholder: "请输入排序"
    },
    rules: FORM_RULES.sort
  },
  {
    label: "状态",
    width: 120,
    labelWidth: 100,
    prop: "status",
    valueType: "switch",
    fieldProps: {
      "active-value": 2,
      "inactive-value": 1
    },
    rules: FORM_RULES.status
  },
  {
    label: "备注",
    prop: "remark",
    width: 120,
    labelWidth: 100,
    valueType: "textarea",
    fieldProps: {
      maxlength: 200,
      showWordLimit: true,
      autosize: { minRows: 3, maxRows: 4 }
    }
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
