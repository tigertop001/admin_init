<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  type TableValueType,
  type FormItemValueType,
  PlusDialogForm
} from "plus-pro-components";

/** 定义props接收默认数据 */
const props = defineProps<{
  editData?: FieldValues; // 可选的默认数据
  type?: number; // 0新增，1修改
}>();

/**
 * 计算弹窗标题和按钮文字
 */
const dlgConf = computed(() => {
  const isEdit = props.type === 1;
  return {
    title: isEdit ? "修改活动标签" : "添加活动标签",
    confirmText: isEdit ? "修改" : "提交"
  };
});

/** 控制弹窗显示状态 */
const visible = ref(false);

/**
 * 定义表单字段的默认值类型
 */
interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

/**
 * 表单验证规则配置
 */
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

/** 表单列配置 */
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
    prop: "status", // 修改为 status
    valueType: "switch", // 改为 switch 类型
    fieldProps: {
      "active-value": 2, // 开启时的值
      "inactive-value": 1 // 关闭时的值
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

/**
 * 根据columns自动生成重置数据
 */
const crtDefVal = (columns: PlusColumn[]): FormDefaultValues => {
  const defaultValues = columns.reduce((acc, column) => {
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

/**
 * 表单数据对象
 */
const formData = ref<FieldValues>(crtDefVal(columns.value));

/** 组件事件定义 */
const emit = defineEmits<{
  /** 提交事件,传递表单数据 */
  (_e: "submit", _formValues: FieldValues): void;
  /** 更新弹窗显示状态 */
  (_e: "update:visible", _visible: boolean): void;
}>();

/**
 * 优化重置表单方法
 */
const rstFrm = () => {
  // 根据当前类型决定是否保留数据
  if (props.type === 0) {
    // 新增时清空所有数据
    formData.value = crtDefVal(columns.value);
  } else if (props.type === 1 && props.editData) {
    // 修改时保留默认数据
    formData.value = {
      ...crtDefVal(columns.value),
      ...props.editData
    };
  }
};

/**
 * 监听 type 和 editData 的变化
 */
watch(
  [() => props.type, () => props.editData],
  ([newType, newData]) => {
    if (newType === 0) {
      // 新增时清空表单数据
      formData.value = crtDefVal(columns.value);
    } else if (newType === 1 && newData) {
      // 修改时且有默认数据时，设置表单数据
      formData.value = {
        ...crtDefVal(columns.value),
        ...newData
      };
    }
  },
  { immediate: true }
);

/**
 * 提交
 */
const onCfm = () => {
  const subData = {
    ...formData.value,
    sort: formData.value.sort ? Number(formData.value.sort) : null
  };

  emit("submit", subData);
  emit("update:visible", false);
  // 提交后，如果是新增模式，清空表单
  if (props.type === 0) {
    formData.value = crtDefVal(columns.value);
  }
};

/**
 * 处理弹窗关闭
 */
const onCls = () => {
  rstFrm();
  emit("update:visible", false);
};

/** 表单配置对象 */
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
