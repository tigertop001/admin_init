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
    title: isEdit ? "修改弹窗" : "添加弹窗",
    confirmText: isEdit ? "修改" : "提交"
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
  const baseColumns: PlusColumn[] = [
    {
      label: "标题",
      labelWidth: 100,
      prop: "title",
      valueType: "input",
      rules: [
        {
          required: true,
          message: "标题不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "轮播图片",
      labelWidth: 100,
      prop: "content",
      valueType: "input",
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
      valueType: "date-picker",
      fieldProps: {
        type: "datetimerange",
        startPlaceholder: "请选择",
        endPlaceholder: "请选择",
        modelValue: dateRange.value.sentTime,
        "onUpdate:modelValue": onDateChg
      },
      rules: [
        {
          required: true,
          message: "发送时间不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "跳转类型",
      labelWidth: 100,
      prop: "recipient",
      valueType: "radio",
      options: [
        {
          label: "不跳转",
          value: 1
        },
        {
          label: "跳转",
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

  if (showUidInput.value) {
    baseColumns.push(
      {
        label: " 跳转类型",
        labelWidth: 100,
        prop: "uid",
        valueType: "select",
        options: [
          {
            label: "内部界面",
            value: 1
          },
          {
            label: "指定活动详请",
            value: 2
          },
          {
            label: "外部链接",
            value: 3
          }
        ]
      },
      {
        label: "游戏ID",
        labelWidth: 100,
        prop: "uid",
        valueType: "input"
      }
    );
  }

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
