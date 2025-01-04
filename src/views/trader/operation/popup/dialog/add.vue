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
  redirectType: 1,
  redirectParas: "",
  isRedirect: false
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

const showUidInput = computed(() => formData.value.isRedirect === true);
const showUidInput1 = computed(() => formData.value.redirectType);

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
      label: "弹窗图片",
      labelWidth: 100,
      prop: "thumbnail",
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
      width: 120,
      labelWidth: 100,
      prop: "sort",
      valueType: "input",
      fieldProps: {
        type: "number",
        placeholder: "请输入排序"
      },
      rules: FORM_RULES.sort
    },
    {
      label: "弹窗类型",
      labelWidth: 100,
      prop: "popType",
      valueType: "select",
      options: [
        {
          label: "指定游戏",
          value: 1
        },
        {
          label: "内部界面",
          value: 2
        },
        {
          label: "指定活动详请",
          value: 3
        },
        {
          label: "外部链接",
          value: 4
        }
      ]
    },
    {
      label: "跳转类型",
      labelWidth: 100,
      prop: "redirectType",
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
    baseColumns.push({
      label: "跳转类型",
      labelWidth: 100,
      prop: "redirectType",
      valueType: "select",
      options: [
        {
          label: "指定游戏",
          value: 1
        },
        {
          label: "内部界面",
          value: 2
        },
        {
          label: "指定活动详请",
          value: 3
        },
        {
          label: "外部链接",
          value: 4
        }
      ]
    });
  }
  if (showUidInput1.value == 1 && showUidInput.value) {
    baseColumns.push({
      label: "游戏ID",
      labelWidth: 100,
      prop: "redirectParas",
      valueType: "input"
    });
  }

  if (showUidInput1.value == 2 && showUidInput.value) {
    baseColumns.push({
      label: "内部界面",
      labelWidth: 100,
      prop: "redirectParas",
      valueType: "select",
      options: [
        {
          label: "代理中心",
          value: 1
        },
        {
          label: "VIP详情",
          value: 2
        },
        {
          label: "充值界面",
          value: 3
        }
      ]
    });
  }

  if (showUidInput1.value == 3 && showUidInput.value) {
    baseColumns.push({
      label: "活动ID",
      labelWidth: 100,
      prop: "redirectParas",
      valueType: "input"
    });
  }

  if (showUidInput1.value == 4 && showUidInput.value) {
    baseColumns.push({
      label: "外部链接",
      labelWidth: 100,
      prop: "redirectParas",
      valueType: "input"
    });
  }

  return baseColumns;
});

const crtDefVal = (columns: PlusColumn[]) => {
  const defaultValues = {
    title: "",
    content: "",
    startAt: null,
    endAt: null,
    isRedirect: false,
    redirectType: 1,
    redirectParas: ""
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
  () => formData.value.redirectType,
  newValue => {
    // if (newValue === 1) {
    //   formData.value.uid = "";
    // }
  }
);

const onCfm = () => {
  delete formData.value.sentTime;
  formData.value.sort = formData.value.sort
    ? Number(formData.value.sort)
    : null;
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
