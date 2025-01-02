<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

interface EditDataType {
  uid?: string | number;
  account?: string;
  directCount?: number | string;
  directPerformance?: number | string;
  directCommission?: number | string;
  commission?: number | string;
  [key: string]: any;
}

const props = defineProps<{
  visible: boolean;
  editData?: EditDataType;
  editType: number;
}>();

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const title = computed(() => {
  const types = ["编辑", "审核", "查看"];
  const user = props.editData
    ? `${props.editData.account || ""} / ${props.editData.uid || ""}`
    : "";
  return `${types[props.editType]}佣金 - ${user}`;
});
interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const FORM_RULES = {
  c: [{ required: false, message: "请输入备注", trigger: "blur" }]
} as const;

const columns = computed<PlusColumn[]>(() => [
  {
    label: "直属会员/直属业绩",
    labelWidth: 130,
    prop: "directData",
    valueType: "text",
    formatter: () => {
      return `${props.editData?.directCount || "--"} / ${props.editData?.directPerformance || "--"}`;
    }
  },
  {
    label: "团队会员/团队业绩",
    labelWidth: 130,
    prop: "teamData",
    valueType: "text",
    formatter: () => {
      return `${props.editData?.teamCount || "--"} / ${props.editData?.teamPerformance || "--"}`;
    }
  },
  {
    label: "直属佣金/团队佣金",
    labelWidth: 130,
    prop: "commissionData",
    valueType: "text",
    formatter: () => {
      return `${props.editData?.directCommission || "--"} / ${props.editData?.teamCommission || "--"}`;
    }
  },
  {
    label: "结算佣金",
    prop: "commission",
    labelWidth: 130,
    valueType: props.editType === 0 ? "input" : "text",
    rules: props.editType === 0 ? FORM_RULES.c : undefined,
    fieldProps: props.editType === 0 ? {} : { readonly: true }
  }
]);

const crtDefVal = (
  columns: PlusColumn[],
  editData?: EditDataType
): FormDefaultValues => {
  const defVals = {
    directData: `${editData?.directCount || "--"} / ${editData?.directPerformance || "--"}`,
    teamData: `${editData?.teamCount || "--"} / ${editData?.teamPerformance || "--"}`,
    commissionData: `${editData?.directCommission || "--"} / ${editData?.teamCommission || "--"}`,
    commission: editData?.commission || ""
  };

  return defVals;
};

const formData = ref<FieldValues>({});

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const updateFormData = () => {
  formData.value = crtDefVal(columns.value, props.editData);
};

const dlgConf = computed(() => {
  switch (props.editType) {
    case 0:
      return {
        confirmText: "保存",
        cancelText: "取消"
      };
    case 1:
      return {
        confirmText: "通过",
        cancelText: "取消审核"
      };
    case 2:
      return {
        confirmText: "确认",
        cancelText: "关闭"
      };
    default:
      return {
        confirmText: "确认",
        cancelText: "取消"
      };
  }
});

const onSub = () => {
  let subData;
  if (props.editType === 0) {
    subData = {
      id: Number(props.editData?.id),
      commission: formData.value.commission || props.editData?.commission || 0
    };
  } else if (props.editType === 1) {
    subData = {
      id: props.editData?.id ?? 0,
      withdrawalState: 2
    };
  }
  if (subData) {
    emit("submit", subData);
    emit("update:visible", false);
  }
};

const onCls = () => {
  if (props.editType === 1) {
    const subData = {
      id: props.editData?.id ?? 0,
      withdrawalState: 3
    };
    emit("submit", subData);
  }
  emit("update:visible", false);
};

const formConfig = computed(() => ({
  columns: columns.value,
  labelSuffix: ""
}));

watchEffect(() => {
  if (props.visible) {
    console.log("editData", formData);
    updateFormData();
  }
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="dlgVis"
    v-model="formData"
    :form="formConfig"
    :width="500"
    :title="title"
    v-bind="dlgConf"
    @confirm="onSub"
    @cancel="onCls"
    @open="updateFormData"
  />
</template>
