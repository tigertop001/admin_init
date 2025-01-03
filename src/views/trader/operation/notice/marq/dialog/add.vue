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
    title: isEdit ? "修改跑马灯" : "添加跑马灯",
    confirmText: isEdit ? "修改" : "提交"
  };
});

const visible = ref(false);
const formData = ref<FieldValues>({
  content: "",
  sendAt: null,
  endAt: null,
  receiverType: 1,
  SendUidList: ""
});

const dateRange = ref({
  sentTime: []
});

const onDateChg = (val: any[]) => {
  if (val && Array.isArray(val)) {
    formData.value.sendAt = Math.floor(val[0]);
    formData.value.endAt = Math.floor(val[1]);
    dateRange.value.sentTime = val;
  } else {
    formData.value.sendAt = null;
    formData.value.endAt = null;
    dateRange.value.sentTime = [];
  }
};

const FORM_RULES = {
  name: [
    { required: true, message: "请输入活动标签", trigger: "blur" },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{2,20}$/,
      message: "活动标签长度为2-20位，不能包含特殊字符"
    }
  ],
  sort: [
    { required: true, message: "排序必须为大于0的整数", trigger: "blur" },
    {
      pattern: /^[1-9]\d*$/,
      message: "排序必须为大于0的整数"
    }
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }]
} as const;

const showUidInput = computed(() => formData.value.receiverType === 2);

const columns = computed<PlusColumn[]>(() => {
  const baseColumns: PlusColumn[] = [
    {
      label: "跑马灯内容",
      labelWidth: 100,
      prop: "content",
      valueType: "input",
      rules: [
        {
          required: true,
          message: "跑马灯内容不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "起始时间",
      labelWidth: 100,
      prop: "sentTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetimerange",
        startPlaceholder: "请选择",
        endPlaceholder: "请选择",
        modelValue: dateRange.value.sentTime,
        "onUpdate:modelValue": onDateChg
      }
    },
    // {
    //   label: "结束时间",
    //   labelWidth: 100,
    //   prop: "sentTime",
    //   valueType: "date-picker",
    //   fieldProps: {
    //     type: "datetimerange",
    //     startPlaceholder: "请选择",
    //     endPlaceholder: "请选择",
    //     modelValue: dateRange.value.sentTime,
    //     "onUpdate:modelValue": onDateChg
    //   }
    // },
    {
      label: "排序",
      labelWidth: 100,
      prop: "sort",
      // valueType: "input",
      valueType: "input",
      fieldProps: {
        type: "number",
        placeholder: "请输入排序"
      },
      rules: FORM_RULES.sort
    },
    {
      label: "收件人",
      labelWidth: 100,
      prop: "receiverType",
      valueType: "radio",
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
          message: "请输入会员ID",
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
      valueType: "input"
    });
  }

  return baseColumns;
});

const crtDefVal = (columns: PlusColumn[]) => {
  const defaultValues = {
    content: "",
    sendAt: null,
    endAt: null,
    receiverType: 1,
    SendUidList: ""
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
    if (props.editData.sendAt && props.editData.endAt) {
      dateRange.value.sentTime = [props.editData.sendAt, props.editData.endAt];
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
  formData.value.publishStatus = 1;
  formData.value.sort = formData.value.sort
    ? Number(formData.value.sort)
    : null;
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
