<script setup lang="ts">
import { useColumns } from "./columns";
import Empty from "@/assets/svg/empty.svg?component";

const emit = defineEmits(["update:modelValue"]);
const { columns, dtLst, onChg } = useColumns(emit);
</script>

<template>
  <pure-table
    row-key="id"
    align-whole="center"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }"
    :data="dtLst"
    :columns="columns"
    @change="onChg"
  >
    <template #empty>
      <Empty fill="var(--el-svg-monochrome-grey)" class="m-auto" />
    </template>
  </pure-table>
</template>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
</style>
