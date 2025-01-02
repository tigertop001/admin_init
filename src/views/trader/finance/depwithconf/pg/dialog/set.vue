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
    title: "设置",
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
    },
    {
      label: "支付地址",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "查询注单地址",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "回调IP",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "回调地址",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "商户号",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "单笔额度限制",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "充值通道手续费率",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input",
      tooltip: "四方充值渠道收取得充值手续费"
    },
    {
      label: "接口类型",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "跳转方式",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "支付秘钥",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input"
    },
    {
      label: "快捷金额",
      labelWidth: 160,
      prop: "recipient",
      valueType: "input",
      tooltip: "格式为xx,xx,xx 例如：200,500,1000,最多设置8个"
    },
    {
      label: "支付金额类型",
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
