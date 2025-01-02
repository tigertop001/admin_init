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
    title: isEdit ? "编辑游戏" : "添加轮播图",
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
      label: "游戏类型",
      labelWidth: 100,
      prop: "title",
      valueType: "select",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      },
      options: [
        {
          label: "彩票",
          value: 1
        },
        {
          label: "电子",
          value: 2
        }
      ],
      rules: [
        {
          required: true,
          message: "游戏类型不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "游戏平台",
      labelWidth: 100,
      prop: "content",
      valueType: "select",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      },
      options: [
        {
          label: "xx彩票",
          value: 1
        },
        {
          label: "PG电子",
          value: 2
        }
      ],
      rules: [
        {
          required: true,
          message: "请输入图片地址",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "游戏ID",
      labelWidth: 100,
      prop: "uid",
      valueType: "input",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      }
    },
    {
      label: "游戏标识",
      labelWidth: 100,
      prop: "uid",
      valueType: "input",
      fieldProps: {
        readonly: isEdit,
        disabled: isEdit
      }
    },
    {
      label: "游戏名称",
      labelWidth: 100,
      prop: "uid",
      valueType: "input",
      rules: [
        {
          required: true,
          message: "游戏名称不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "游戏英文名称",
      labelWidth: 100,
      prop: "uid",
      valueType: "input"
    },
    {
      label: "横竖屏",
      labelWidth: 100,
      prop: "pingmu",
      valueType: "radio",
      options: [
        {
          label: "竖屏",
          value: 1
        },
        {
          label: "横屏",
          value: 2
        },
        {
          label: "横竖屏",
          value: 3
        }
      ]
    },
    {
      label: "游戏标签",
      labelWidth: 100,
      prop: "pingmu",
      valueType: "checkbox",
      options: [
        {
          label: "热门",
          value: 1
        },
        {
          label: "推荐",
          value: 2
        }
      ]
    },
    {
      label: "排序",
      labelWidth: 100,
      prop: "sort",
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
          label: "开放中",
          value: 1
        },
        {
          label: "维护中",
          value: 2
        },
        {
          label: "已关闭",
          value: 3
        }
      ],
      rules: [
        {
          required: true,
          message: "收件人不能为空",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "图标",
      labelWidth: 100,
      prop: "sort",
      valueType: "input",
      rules: [
        {
          required: true,
          message: "图标不能为空",
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
