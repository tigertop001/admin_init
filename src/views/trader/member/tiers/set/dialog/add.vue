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
    title: isEdit ? "修改层级" : "添加层级",
    confirmText: isEdit ? "修改" : "提交"
  };
});

const visible = ref(false);

interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const FORM_RULES = {
  levelName: [
    { required: true, message: "请输入名称", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{2,20}$/,
      message: "名称必须为2-20位字母、数字或其组合"
    }
  ],
  peopleLevel: [
    { required: true, message: "请选择人工分层", trigger: "change" }
  ],
  levelSign: [{ required: true, message: "请选择分层类别", trigger: "change" }],
  minVal: [
    { required: true, message: "请输入当月存款最低金额", trigger: "blur" },
    {
      validator: (rule: any, value: any) => {
        if (!value) return true;
        const num = Number(value);
        if (isNaN(num)) return false;
        return num > 0;
      },
      message: "请输入大于0的数字",
      trigger: "blur"
    }
  ],
  maxVal: [
    { required: true, message: "请输入当月存款最高金额", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) return callback();
        const maxNum = Number(value);
        const minNum = Number(formData.value.minVal);
        if (isNaN(maxNum)) return callback(new Error("请输入有效数字"));
        if (maxNum <= minNum)
          return callback(new Error("最高金额必须大于最低金额"));
        callback();
      },
      trigger: "blur"
    }
  ]
} as const;

const columns = computed<PlusColumn[]>(() => [
  {
    label: "名称",
    labelWidth: 100,
    prop: "levelName",
    valueType: "input",
    tooltip: "6-20位字母和数字的组合",
    rules: FORM_RULES.levelName
  },
  {
    label: "人工分层",
    labelWidth: 100,
    prop: "peopleLevel",
    valueType: "radio",
    options: [
      {
        label: "否",
        value: 1
      },
      {
        label: "是",
        value: 2
      }
    ],
    tooltip: "选择人工分层开启，则一下条件全部不可选",
    rules: FORM_RULES.peopleLevel
  },
  {
    label: "内层/外层",
    labelWidth: 100,
    prop: "levelSign",
    valueType: "select",
    options: [
      {
        label: "外层",
        value: 1,
        color: "red"
      },
      {
        label: "内层",
        value: 2,
        color: "blue"
      },
      {
        label: "VIP层",
        value: 3,
        color: "yellow"
      }
    ],
    rules: FORM_RULES.levelSign
  },
  {
    label: "分层条件",
    labelWidth: 100,
    prop: "minVal",
    valueType: "input",
    colProps: { span: 14 },
    fieldProps: {
      type: "number",
      placeholder: "最低金额"
    },
    tooltip: "当月存款金额",
    rules: FORM_RULES.minVal
  },
  {
    labelWidth: 16,
    prop: "maxVal",
    valueType: "input",
    colProps: { span: 10 },
    hasLabel: false,
    fieldProps: {
      type: "number",
      placeholder: "最高金额",
      class: "no-asterisk"
    },
    rules: FORM_RULES.maxVal
  },
  {
    label: "备注",
    prop: "remark",
    labelWidth: 100,
    valueType: "textarea",
    fieldProps: {
      maxlength: 200,
      showWordLimit: true,
      autosize: { minRows: 4, maxRows: 6 }
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
    minVal: formData.value.minVal ? Number(formData.value.minVal) : null,
    maxVal: formData.value.maxVal ? Number(formData.value.maxVal) : null
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
  columns: columns.value
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
