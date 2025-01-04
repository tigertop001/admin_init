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
    // title: isEdit ? "修改消息" : "添加消息",
    title:
      props.type === 1
        ? "修改消息"
        : props.type === 3
          ? "消息详情"
          : "添加消息",
    confirmText: isEdit ? "修改" : "提交"
  };
});

const visible = ref(false);
const formData = ref<FieldValues>({
  type: 1, // 类型 1:系统消息 2:公告
  title: "",
  content: "",
  startAt: null,
  endAt: null,
  receiverType: 1,
  SendUidList: "",
  sendAt: null
});

const dateRange = ref({
  sentTime: []
});

const onDateChg = (val: any) => {
  if (val) {
    formData.value.sendAt = Math.floor(val);
  } else {
    formData.value.sendAt = null;
  }
  // if (val && Array.isArray(val)) {
  //   formData.value.startAt = Math.floor(val[0]);
  //   formData.value.endAt = Math.floor(val[1]);
  //   dateRange.value.sentTime = val;
  // } else {
  //   formData.value.startAt = null;
  //   formData.value.endAt = null;
  //   dateRange.value.sentTime = [];
  // }
};

const showUidInput = computed(() => formData.value.receiverType === 2);

const columns = computed<PlusColumn[]>(() => {
  const baseColumns: PlusColumn[] = [
    {
      label: "消息标题",
      labelWidth: 100,
      prop: "title",
      valueType: "input",
      fieldProps: {
        disabled: props.type === 3 // 动态禁用
      },
      rules: [
        {
          required: true,
          message: "消息标题不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "消息内容",
      labelWidth: 100,
      prop: "content",
      valueType: "input",
      fieldProps: {
        disabled: props.type === 3 // 动态禁用
      },
      rules: [
        {
          required: true,
          message: "消息内容不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "发送时间",
      labelWidth: 100,
      prop: "sentTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        // startPlaceholder: "请选择",
        // endPlaceholder: "请选择",
        // modelValue: dateRange.value.sentTime,
        // "onUpdate:modelValue": onDateChg
        modelValue: formData.value.sendAt, // 显式绑定 sendAt
        "onUpdate:modelValue": onDateChg, // 确保变更时触发
        disabled: props.type === 3 // 动态禁用
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
      label: "收件人",
      labelWidth: 100,
      prop: "receiverType",
      valueType: "radio",
      fieldProps: {
        disabled: props.type === 3 // 动态禁用
      },
      options: [
        {
          label: "全部会员",
          value: 1
        },
        {
          label: "指定会员",
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
    baseColumns.push({
      label: "会员ID",
      labelWidth: 100,
      prop: "SendUidList",
      valueType: "input",
      fieldProps: {
        disabled: props.type === 3 // 动态禁用
      }
    });
  }

  return baseColumns;
});

const crtDefVal = (columns: PlusColumn[]) => {
  const defaultValues = {
    type: 1, // 类型 1:系统消息 2:公告
    title: "",
    content: "",
    startAt: null,
    endAt: null,
    receiverType: 1,
    SendUidList: "",
    sendAt: null,
    publishStatus: 1 // 状态 1:未发布 2:待发送 3:已发送/发布 4:已撤回
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
  } else if ((props.type === 1 || props.type === 3) && props.editData) {
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
  () => formData.value.receiverType,
  newValue => {
    if (newValue === 1) {
      formData.value.SendUidList = "";
    }
  }
);

const onCfm = () => {
  if (formData.value.receiverType === 2) {
    formData.value.SendUidList = formData.value.SendUidList.toString()
      .split(",")
      .map(Number);
  } else {
    formData.value.SendUidList = [];
  }
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
