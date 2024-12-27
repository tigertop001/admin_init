<script setup lang="ts">
import { ref, computed } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

const props = defineProps<{
  visible: boolean;
  type: "freeze" | "unFreeze" | "ban";
}>();

const formData = ref<FieldValues>({
  account: "",
  remark: ""
});

const FORM_RULES = {
  account: [
    { required: true, message: "请输入管理员密码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{6,20}$/,
      message: "密码必须为6-20位字母和数字的组合"
    }
  ],
  remark: [
    { required: true, message: "请输入备注", trigger: "blur" },
    { max: 200, message: "备注长度不能超过200个字符" }
  ]
};

const columns = computed<PlusColumn[]>(() => [
  {
    label: "管理员密码",
    width: 120,
    labelWidth: 100,
    prop: "account",
    valueType: "input",
    fieldProps: {
      type: "password",
      placeholder: "请输入管理员密码"
    },
    rules: FORM_RULES.account
  },
  {
    label: "操作备注",
    width: 130,
    labelWidth: 100,
    prop: "remark",
    valueType: "textarea",
    fieldProps: {
      maxlength: 200,
      showWordLimit: true,
      autosize: { minRows: 2, maxRows: 4 },
      placeholder: "请输入操作备注"
    },
    rules: FORM_RULES.remark
  }
]);

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

// 使用计算属性处理 visible 的双向绑定
const dlgVis = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

const dlgTit = computed(() => {
  switch (props.type) {
    case "freeze":
      return "冻结资金";
    case "unFreeze":
      return "解冻资金";
    case "ban":
      return "禁止登录";
    default:
      return "";
  }
});

const rstFrm = () => {
  formData.value = {
    account: "",
    remark: ""
  };
};

const onSubmit = () => {
  emit("submit", formData.value);
};

const onClose = () => {
  rstFrm();
  emit("update:visible", false);
};

const formConfig = computed(() => ({
  columns: columns.value
}));
</script>

<template>
  <PlusDialogForm
    v-model:visible="dlgVis"
    v-model="formData"
    :form="formConfig"
    :width="500"
    :title="dlgTit"
    confirmText="确定"
    @close="onClose"
    @confirm="onSubmit"
    @open="rstFrm"
  />
</template>
