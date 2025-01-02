<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

const props = defineProps<{
  editData?: FieldValues;
  type?: number;
}>();

const dlgConf = computed(() => {
  return {
    title: "转账记录",
    confirmText: "提交"
  };
});

const visible = ref(false);
const formData = ref<FieldValues>({
  title: "",
  content: "",
  recipient: 1,
  uid: ""
});

const dateRange = ref({
  sentTime: []
});

const columns = computed<PlusColumn[]>(() => {
  const isEdit = props.type === 1;
  const baseColumns: PlusColumn[] = [
    {
      label: "支付通道昵称",
      labelWidth: 160,
      prop: "title",
      valueType: "input",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      }
    },
    {
      label: "支付类型",
      labelWidth: 160,
      prop: "content",
      valueType: "input",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      }
    },
    {
      label: "支付接口名",
      labelWidth: 160,
      prop: "sentTime",
      valueType: "input"
    },
    {
      label: "支付接口英文名",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "支付通道名",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "通道编号",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input",
      tooltip: "以上配置请谨慎操作，编辑保存后不可再次编辑"
    },
    {
      label: "支付网关",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    }
  ];

  return baseColumns;
});

const crtDefVal = (columns: PlusColumn[]) => {
  const defaultValues = {
    title: "",
    content: "",
    startAt: null,
    endAt: null,
    recipient: 1,
    uid: ""
  };

  return defaultValues;
};

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const rstFrm = () => {
  dateRange.value.sentTime = [];
  if (props.type === 0) {
    formData.value = crtDefVal(columns.value);
  } else if (props.type === 1 && props.editData) {
    formData.value = {
      ...crtDefVal(columns.value),
      ...props.editData
    };
    if (props.editData.startAt && props.editData.endAt) {
      dateRange.value.sentTime = [props.editData.startAt, props.editData.endAt];
    }
  }
};

watch(
  [() => props.type, () => props.editData],
  () => {
    rstFrm();
  },
  { immediate: true }
);

watch(
  () => formData.value.recipient,
  newValue => {
    if (newValue === 1) {
      formData.value.uid = "";
    }
  }
);

const onCfm = () => {
  delete formData.value.sentTime;
  emit("submit", formData.value);
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
    :width="800"
    :title="dlgConf.title"
    :confirmText="dlgConf.confirmText"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>
