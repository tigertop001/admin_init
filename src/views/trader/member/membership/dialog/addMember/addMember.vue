<script setup lang="ts">
import { ref } from "vue";
// https://plus-pro-components.com/components/dialog-form.html
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

const columns: PlusColumn[] = [
  {
    label: "名称",
    width: 120,
    prop: "name",
    valueType: "copy",
    tooltip: "名称最多显示6个字符"
  },
  {
    label: "说明",
    prop: "desc",
    valueType: "textarea",
    fieldProps: {
      maxlength: 10,
      showWordLimit: true,
      autosize: { minRows: 2, maxRows: 4 }
    }
  }
];

const visible = ref(false);
const values = ref<FieldValues>({});

const handleOpen = () => {
  visible.value = true;
};
</script>

<template>
  <div>
    <el-button @click="handleOpen">打开弹窗表单</el-button>
    <PlusDialogForm
      v-model:visible="visible"
      v-model="values"
      :form="{ columns }"
    />
  </div>
</template>
