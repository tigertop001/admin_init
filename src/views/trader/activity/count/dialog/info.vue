<script lang="ts" setup>
import { type FieldValues } from "plus-pro-components";
import { useColumns } from "./form/config/columns";

const props = defineProps<{
  visible: boolean;
  curData?: FieldValues;
}>();

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const { dialogVisible, onCls, height, columns, tableData, onSubmit } =
  useColumns(props, emit);
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="查看详情"
    width="800"
    :before-close="onCls"
  >
    <pure-table :data="tableData" :columns="columns" :height="height" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSubmit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
