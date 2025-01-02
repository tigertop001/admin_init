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
    title: "账户转账--人工录入",
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
      label: "支付渠道",
      labelWidth: 90,
      prop: "title",
      valueType: "text"
    },
    {
      label: "支付类型",
      labelWidth: 90,
      prop: "title",
      valueType: "text"
    },
    {
      label: "收款姓名",
      labelWidth: 90,
      prop: "title",
      valueType: "text"
    },
    {
      label: "收款账户",
      labelWidth: 90,
      prop: "title",
      valueType: "text"
    },
    {
      label: "转出/转入",
      labelWidth: 90,
      prop: "title",
      valueType: "radio",
      options: [
        {
          label: "转出",
          value: 1
        },
        {
          label: "转入",
          value: 2
        }
      ]
    },
    {
      label: "转出金额",
      labelWidth: 90,
      prop: "title",
      valueType: "input"
    },
    {
      label: "转出手续费",
      labelWidth: 90,
      prop: "title",
      valueType: "input"
    },
    {
      label: "备注",
      labelWidth: 90,
      prop: "title",
      valueType: "textarea"
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
    :width="500"
    :title="dlgConf.title"
    :confirmText="dlgConf.confirmText"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>
