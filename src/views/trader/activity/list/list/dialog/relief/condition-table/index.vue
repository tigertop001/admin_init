<script setup lang="ts">
import { useColumns } from "./columns";
import Empty from "@/assets/svg/empty.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ep/plus";
import Delete from "@iconify-icons/ep/delete";

const emit = defineEmits(["update:modelValue"]);
const { columns, dtLst, onAdd, onDel, onChg } = useColumns(emit);
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
    <template #append>
      <el-button
        plain
        class="w-full my-2"
        :icon="useRenderIcon(AddFill)"
        @click="onAdd"
      >
        添加一行数据
      </el-button>
    </template>
    <template #operation="{ row }">
      <el-button
        class="reset-margin"
        link
        type="primary"
        :icon="useRenderIcon(Delete)"
        @click="onDel(row)"
      />
    </template>
  </pure-table>
</template>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
</style>
