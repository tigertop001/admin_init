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
  editData?: FieldValues; // 可选的默认数据
  type?: number; // 0新增，1修改
}>();

/**
 * 计算弹窗标题和按钮文字
 */
const dlgConf = computed(() => {
  const isEdit = props.type === 1;
  return {
    title: isEdit ? "修改层级" : "添加层级",
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
    colProps: { span: 14 }, // 控制第一个输入框的宽度
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
    colProps: { span: 10 }, // 控制第二个输入框的宽度
    hasLabel: false,
    fieldProps: {
      type: "number",
      placeholder: "最高金额",
      class: "no-asterisk" // 添加自定义类名
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

  // // 如果有默认数据，则使用默认数据覆盖
  // if (props.editData) {
  //   return {
  //     ...defaultValues,
  //     ...props.editData
  //   };
  // }

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
  // 创建一个新对象并转换类型
  const subData = {
    ...formData.value,
    minVal: formData.value.minVal ? Number(formData.value.minVal) : null,
    maxVal: formData.value.maxVal ? Number(formData.value.maxVal) : null
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
