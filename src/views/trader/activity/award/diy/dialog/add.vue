<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  type TableValueType,
  type FormItemValueType,
  PlusDialogForm
} from "plus-pro-components";
import { usePullData } from "@/views/trader/comm/pull/activity/form/columns";
const { getPullData, currentData, formatOptions } = usePullData("ACT");

const props = defineProps<{
  editData?: FieldValues;
  type?: number;
}>();

const dlgConf = computed(() => {
  const isEdit = props.type === 1;
  const isDetail = props.type === 2;
  let title = "添加发放奖励";
  if (isEdit) {
    title = "修改发放奖励";
  }
  if (isDetail) {
    title = "发放奖励详情";
  }
  return {
    title: title,
    confirmText: !isDetail ? (isEdit ? "修改" : "提交") : "",
    showConfirmButton: !isDetail
  };
});

const visible = ref(false);

interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const formData = ref<FieldValues>({
  activityId: null,
  distributeType: null,
  uids: null,
  amount: null,
  remark: null
});

const opt = computed(() => {
  if (!currentData.value?.data?.list) return [];
  return formatOptions(currentData.value.data.list);
});

const columns = computed<PlusColumn[]>(() => {
  const isEdit = props.type === 1;
  const isDetail = props.type === 2;
  const isDisabled = isEdit || isDetail;

  const baseColumns: PlusColumn[] = [
    {
      label: "活动名称",
      labelWidth: 100,
      prop: "activityId",
      valueType: "select",
      options: opt.value,
      // options: [
      //   {
      //     label: "自定义活动1",
      //     value: 120003
      //   },
      //   {
      //     label: "自定义活动2",
      //     value: 120008
      //   },
      //   {
      //     label: "自定义活动4",
      //     value: 120003
      //   }
      // ],
      rules: [
        {
          required: true,
          message: "请选择活动名称",
          trigger: ["blur", "change"]
        }
      ],
      fieldProps: { disabled: isDisabled }
    },
    {
      label: "发放对象",
      labelWidth: 100,
      prop: "distributeType",
      valueType: "radio",
      options: [
        {
          label: "全部",
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
          message: "请选择发放对象",
          trigger: ["blur", "change"]
        }
      ],
      fieldProps: { disabled: isDetail }
    },
    {
      label: "发放金额",
      width: 120,
      labelWidth: 100,
      prop: "amount",
      valueType: "input",
      fieldProps: {
        disabled: isDetail,
        precision: 0,
        step: 1,
        controls: false,
        class: "uid-input"
      },
      rules: [
        {
          required: true,
          message: "请输入发放金额",
          trigger: ["blur", "change"]
        }
      ]
    },
    {
      label: "备注",
      prop: "remark",
      width: 120,
      labelWidth: 100,
      valueType: "textarea",
      fieldProps: {
        disabled: isDetail,
        maxlength: 200,
        showWordLimit: true,
        autosize: { minRows: 3, maxRows: 4 }
      }
    }
  ];

  if (formData.value.distributeType === 2) {
    baseColumns.splice(2, 0, {
      label: "会员UID",
      width: 120,
      labelWidth: 100,
      prop: "uids",
      valueType: "input",
      rules: [{ required: true, message: "请输入会员UID" }],
      fieldProps: {
        disabled: isDetail,
        onInput: (val: string | number | null) => {
          if (typeof val === "string") {
            const newValue = val.replace(/，/g, ",");
            formData.value.uids = newValue;
          }
        }
      }
    });
  }

  return baseColumns;
});

const crtDefVal = (columns: PlusColumn[]): FormDefaultValues => {
  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = (() => {
      const valueType = column.valueType as TableValueType | FormItemValueType;
      switch (valueType) {
        case "input":
        case "textarea":
        case "select":
        case "radio":
        case "checkbox":
        case "text":
          return "";
        case "switch":
          return 1;
        default:
          return "";
      }
    })();

    if (column.prop) {
      acc[column.prop] = defaultValue;
    }
    return acc;
  }, {} as FormDefaultValues);

  return defaultValues;
};

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const parseExtendData = (extendStr: string) => {
  try {
    const extendData = JSON.parse(extendStr);
    return {
      uids: extendData.uids || "",
      amount: extendData.amount || null
    };
  } catch (error) {
    console.error("Parse extend data error:", error);
    return { uids: "", amount: null };
  }
};

const rstFrm = () => {
  if (props.type === 0) {
    formData.value = crtDefVal(columns.value);
  } else if ([1, 2].includes(props.type) && props.editData) {
    const { uids, amount } = parseExtendData(props.editData.extend as string);
    const distributeType = uids ? 2 : 1;

    formData.value = {
      activityId: props.editData.activityID,
      distributeType: distributeType,
      uids: distributeType === 1 ? "" : uids,
      amount: amount,
      remark: props.editData.remark || null,
      id: props.editData.id
    };
  }
};

watch(
  () => formData.value.distributeType,
  newType => {
    if (props.type === 1 && newType === 1) {
      formData.value.uids = "";
    }
  }
);

watch(
  [() => props.type, () => props.editData],
  async ([type, editData]) => {
    await getPullData({ type: 1 });
    if (type === 0) {
      formData.value = crtDefVal(columns.value);
    } else if ([1, 2].includes(type) && editData) {
      const { uids, amount } = parseExtendData(editData.extend as string);
      const newDistributeType = uids ? 2 : 1;

      formData.value = {
        activityId: editData.activityID,
        distributeType: newDistributeType,
        uids: newDistributeType === 1 ? "" : uids,
        amount: amount,
        remark: editData.remark || "",
        id: editData.id
      };
    }
  },
  { immediate: true }
);

const onCfm = () => {
  const subData = {
    ...formData.value
  };

  emit("submit", subData);
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
    :showConfirmButton="dlgConf.showConfirmButton"
    @close="onCls"
    @confirm="onCfm"
    @open="rstFrm"
  />
</template>

<style>
.uid-input .el-input__inner {
  text-align: left !important;
}
</style>
