<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useColumns } from "./config/columns";
import { type FieldValues, PlusDialogForm } from "plus-pro-components";

interface FormDataType {
  question: string;
  type: number;
  answer: string;
  sort: number;
  isDisplay: boolean;
}

const props = defineProps<{
  visible: boolean;
  editData?: FieldValues;
  type?: number;
}>();

const dlgConf = computed(() => {
  const isEdit = props.type === 1;
  return {
    title: isEdit ? "修改问题" : "添加问题",
    confirmText: isEdit ? "修改" : "提交"
  };
});

const formData = ref<FormDataType>({
  question: null,
  type: null,
  answer: null,
  sort: null,
  isDisplay: false
});

// 获取列配置
const { columns } = useColumns(formData);

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const resetForm = () => {
  formData.value = {
    question: null,
    type: null,
    answer: null,
    sort: null,
    isDisplay: false
  };
};

// 监听 type 和 editData 的变化
watch(
  [() => props.type, () => props.editData],
  ([newType, newData]) => {
    if (newType === 0) {
      resetForm();
    } else if (newType === 1 && newData) {
      formData.value = {
        question: String(newData.question || null),
        type: Number(newData.type) || null, // 由于type在FormDataType中定义为 number | string
        answer: String(newData.answer || null),
        sort: Number(newData.sort) || null, // 由于sort在FormDataType中定义为 string | number
        isDisplay: Boolean(newData.isDisplay)
      };
    }
  },
  { immediate: true }
);

const onCfm = () => {
  const param = { ...formData.value, categoryId: 0, lang: "" };
  emit("submit", param);
  emit("update:visible", false);
  if (props.type === 0) {
    resetForm();
  }
};

const onCls = () => {
  if (props.type === 0) {
    resetForm();
  }
  emit("update:visible", false);
};

const formConfig = computed(() => ({
  columns: columns.value,
  labelSuffix: ""
}));
</script>

<template>
  <PlusDialogForm
    v-model:visible="dlgVis"
    v-model="formData"
    :form="formConfig"
    :width="1000"
    :title="dlgConf.title"
    :confirmText="dlgConf.confirmText"
    @close="onCls"
    @confirm="onCfm"
    @open="resetForm"
  />
</template>
