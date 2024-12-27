<script setup lang="ts">
import { ref, computed } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
const props = defineProps<{
  visible: boolean;
  type: "reLog" | "rePay";
}>();

const formData = ref<FieldValues>({
  password: ""
});

const FORM_RULES = {
  password: [
    { required: true, message: "请输入管理员密码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{6,20}$/,
      message: "密码必须为6-20位字母和数字的组合"
    }
  ]
};

const columns = computed<PlusColumn[]>(() => [
  {
    label: "管理员密码",
    width: 120,
    labelWidth: 100,
    prop: "password",
    valueType: "input",
    fieldProps: {
      type: "password",
      placeholder: "请输入管理员密码"
    },
    rules: FORM_RULES.password
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
    case "reLog":
      return "重置登录密码";
    case "rePay":
      return "重置支付密码";

    default:
      return "";
  }
});

const rstFrm = () => {
  formData.value = {
    password: ""
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
