<script setup lang="ts">
import { ref, computed } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  type TableValueType,
  type FormItemValueType,
  PlusDialogForm
} from "plus-pro-components";

const visible = ref(false);

interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const FORM_RULES = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{6,20}$/,
      message: "账号必须为6-20位字母和数字的组合"
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { pattern: /^.{6,20}$/, message: "密码长度必须在6-20位之间" }
  ]
} as const;

const columns = computed<PlusColumn[]>(() => [
  {
    label: "会员账号",
    width: 120,
    labelWidth: 100,
    prop: "account",
    valueType: "input",
    tooltip: "6-20位字母和数字的组合",
    rules: FORM_RULES.account
  },
  {
    label: "会员密码",
    width: 120,
    labelWidth: 100,
    prop: "password",
    valueType: "input",
    tooltip: "6-20位字符，支持字母、数字和特殊符号",
    fieldProps: {
      type: "password",
      "show-password": true
    },
    rules: FORM_RULES.password
  },
  {
    label: "备注",
    prop: "remark",
    width: 120,
    labelWidth: 100,
    valueType: "textarea",
    fieldProps: {
      maxlength: 10,
      showWordLimit: true,
      autosize: { minRows: 2, maxRows: 4 }
    }
  }
]);

const crtDefVal = (columns: PlusColumn[]): FormDefaultValues => {
  return columns.reduce((acc, column) => {
    // 根据不同的valueType设置默认值
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
          return false;
        default:
          return "";
      }
    })();

    if (column.prop) {
      acc[column.prop] = defaultValue;
    }
    return acc;
  }, {} as FormDefaultValues);
};

const formData = ref<FieldValues>(crtDefVal(columns.value));

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;

  (_e: "update:visible", _visible: boolean): void;
}>();

const rstFrm = (customDefaults?: Partial<FormDefaultValues>) => {
  const defaultValues = crtDefVal(columns.value);
  formData.value = {
    ...defaultValues,
    ...customDefaults
  };
};

const onCfm = () => {
  emit("submit", formData.value);
  emit("update:visible", false);
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
    :form="formConfig"
    :width="500"
    title="添加"
    confirmText="提交"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>
