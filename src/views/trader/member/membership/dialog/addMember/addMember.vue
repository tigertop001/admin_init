<script setup lang="ts">
import { ref, computed } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

/**
 * 表单引用，用于调用表单方法
 */
const formRef = ref();

/**
 * 初始表单数据
 * @constant
 */
const INITIAL_FORM_DATA = {
  account: "",
  password: "",
  desc: ""
} as const;

/**
 * 表单验证规则配置
 * @constant
 */
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
    {
      pattern: /^.{6,20}$/,
      message: "密码长度必须在6-20位之间"
    }
  ]
} as const;

/**
 * 使用计算属性定义表单列配置，避免每次渲染重新创建对象
 */
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
    prop: "desc",
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

/**
 * 控制弹窗显示状态
 */
const visible = ref(false);

/**
 * 表单数据
 */
const formData = ref<FieldValues>({ ...INITIAL_FORM_DATA });

/**
 * 定义组件事件
 */
const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

/**
 * 处理表单提交
 * 验证表单数据，验证通过后提交到父组件
 */
const handleConfirm = async () => {
  try {
    const valid = await formRef.value?.formRef?.validate();
    if (valid) {
      emit("submit", formData.value);
      emit("update:visible", false);
    }
  } catch (error) {
    console.error("表单验证失败：", error);
  }
};

/**
 * 重置表单数据和验证状态
 */
const resetForm = () => {
  formData.value = { ...INITIAL_FORM_DATA };
  formRef.value?.formRef?.clearValidate();
};

/**
 * 处理弹窗关闭
 * 重置表单并通知父组件更新visible状态
 */
const handleClose = () => {
  resetForm();
  emit("update:visible", false);
};

/**
 * 计算表单配置
 */
const formConfig = computed(() => ({
  columns: columns.value
}));
</script>

<template>
  <PlusDialogForm
    ref="formRef"
    v-model:visible="visible"
    v-model="formData"
    :form="formConfig"
    :width="500"
    title="添加会员"
    confirmText="提交"
    @close="handleClose"
    @confirm="handleConfirm"
    @open="resetForm"
  />
</template>
