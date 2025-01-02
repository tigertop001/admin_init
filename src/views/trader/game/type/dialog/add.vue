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
    title: isEdit ? "编辑类型" : "添加类型",
    confirmText: isEdit ? "保存" : "提交"
  };
});

const visible = ref(false);
const formData = ref<FieldValues>({
  title: "",
  content: "",
  startAt: null,
  endAt: null,
  recipient: 1,
  uid: ""
});

const dateRange = ref({
  sentTime: []
});

const onDateChg = (val: any[]) => {
  if (val && Array.isArray(val)) {
    formData.value.startAt = Math.floor(val[0]);
    formData.value.endAt = Math.floor(val[1]);
    dateRange.value.sentTime = val;
  } else {
    formData.value.startAt = null;
    formData.value.endAt = null;
    dateRange.value.sentTime = [];
  }
};

const showUidInput = computed(() => formData.value.recipient === 2);

const columns = computed<PlusColumn[]>(() => {
  const isEdit = props.type === 1;
  const baseColumns: PlusColumn[] = [
    {
      label: "类型ID",
      labelWidth: 100,
      prop: "title",
      valueType: "input",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      },
      rules: [
        {
          required: true,
          message: "标题不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "类型名称",
      labelWidth: 100,
      prop: "content",
      valueType: "input",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      },
      rules: [
        {
          required: true,
          message: "请输入图片地址",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "排序",
      labelWidth: 100,
      prop: "sentTime",
      valueType: "input",
      rules: [
        {
          required: true,
          message: "排序不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "平台状态",
      labelWidth: 100,
      prop: "recipient",
      valueType: "radio",
      options: [
        {
          label: "开启",
          value: 1
        },
        {
          label: "关闭",
          value: 2
        }
      ],
      rules: [
        {
          required: true,
          message: "收件人不能为空",
          trigger: ["blur", "change"]
        }
      ]
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
