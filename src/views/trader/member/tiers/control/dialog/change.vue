<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  type TableValueType,
  type FormItemValueType,
  PlusDialogForm
} from "plus-pro-components";
import { usPullCols } from "@/views/comm/details/comm/form/columns";

interface EditDataType {
  uid?: string | number;
  account?: string;
  levelName?: string;
  totalSave?: number | string;
  levelId?: number;
  [key: string]: any;
}

const props = defineProps<{
  visible: boolean;
  editData?: EditDataType;
}>();

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const { getPullData, configData } = usPullCols();

interface FormDefaultValues extends FieldValues {
  [key: string]: any;
  [key: symbol]: any;
}

const levelOptions = computed(() => {
  if (!configData.value?.data?.levelList) return [];
  return configData.value.data.levelList.map(item => ({
    label: item.levelName,
    value: item.id
  }));
});

const FORM_RULES = {
  levelId: [{ required: true, message: "请选择设置层级", trigger: "change" }],
  remark: [{ required: false, message: "请输入备注", trigger: "blur" }]
} as const;

const columns = computed<PlusColumn[]>(() => [
  {
    label: "用户UID",
    labelWidth: 130,
    prop: "uid",
    valueType: "text",
    fieldProps: { readonly: true }
  },
  {
    label: "用户名",
    labelWidth: 130,
    prop: "account",
    valueType: "text",
    fieldProps: { readonly: true }
  },
  {
    label: "当前层级",
    labelWidth: 130,
    prop: "currentLevel",
    valueType: "text",
    fieldProps: { readonly: true }
  },
  {
    label: "当前存款额度",
    labelWidth: 130,
    prop: "totalSave",
    valueType: "text",
    fieldProps: { readonly: true }
  },
  {
    label: "设置层级",
    labelWidth: 130,
    prop: "levelId",
    valueType: "select",
    options: levelOptions.value,
    rules: FORM_RULES.levelId
  },
  {
    label: "备注",
    prop: "remark",
    labelWidth: 130,
    valueType: "textarea",
    fieldProps: {
      maxlength: 200,
      showWordLimit: true,
      autosize: { minRows: 2, maxRows: 4 }
    },
    rules: FORM_RULES.remark
  }
]);
const findLevelIdByName = (levelName: string) => {
  if (!configData.value?.data?.levelList) return null;
  const level = configData.value.data.levelList.find(
    item => item.levelName === levelName
  );
  return level ? level.id : null;
};

const crtDefVal = (
  columns: PlusColumn[],
  editData?: EditDataType
): FormDefaultValues => {
  const defVals = columns.reduce((acc, column) => {
    const valueType = column.valueType as TableValueType | FormItemValueType;
    const defVal =
      valueType === "select" ? "" : valueType === "switch" ? false : "";

    if (column.prop) {
      acc[column.prop] = defVal;
    }
    return acc;
  }, {} as FormDefaultValues);

  if (editData) {
    defVals.uid = editData.uid ?? "";
    defVals.account = editData.account ?? "";
    defVals.currentLevel = editData.levelName ?? "";
    defVals.totalSave = editData.totalSave ?? "";
    defVals.beforeLevelId = findLevelIdByName(editData.levelName ?? "");
  }

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

const onCfm = () => {
  const subData = {
    levelId: Number(formData.value.levelId),
    uid: Number(props.editData?.uid),
    beforeLevelId: Number(formData.value.beforeLevelId),
    remark: formData.value.remark || ""
  };

  emit("submit", subData);
  emit("update:visible", false);
};

const onCls = () => {
  updateFormData();
  emit("update:visible", false);
};

const formConfig = computed(() => ({
  columns: columns.value,
  labelSuffix: ""
}));

watchEffect(() => {
  if (props.visible) {
    updateFormData();
  }
});

onMounted(async () => {
  await getPullData();
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="dlgVis"
    v-model="formData"
    :form="formConfig"
    :width="500"
    title="升级、降级"
    confirmText="确定"
    @close="onCls"
    @confirm="onCfm"
    @open="updateFormData"
  />
</template>
