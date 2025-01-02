<script setup lang="ts">
import { useColumns } from "./form/config/columns";
import Empty from "@/assets/svg/empty.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ep/plus";
import Delete from "@iconify-icons/ep/delete";

const { editMap, columns, dtLst, onAdd, onDel, onEdit, onSave, onCxl } =
  useColumns();
</script>

<template>
  <div class="flex">
    <pure-table
      row-key="id"
      align-whole="center"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      :data="dtLst"
      :columns="columns"
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
          添加等级
        </el-button>
      </template>
      <template #operation="{ row, index }">
        <template v-if="!editMap[index]?.editable">
          <el-button
            class="reset-margin"
            link
            type="primary"
            @click="onEdit(row, index)"
          >
            修改
          </el-button>
          <el-button
            class="reset-margin"
            link
            type="danger"
            :icon="useRenderIcon(Delete)"
            @click="onDel(row)"
          />
        </template>
        <template v-else>
          <el-button
            class="reset-margin"
            link
            type="primary"
            @click="onSave(index)"
          >
            保存
          </el-button>
          <el-button class="reset-margin" link @click="onCxl(index)">
            取消
          </el-button>
        </template>
      </template>
    </pure-table>
  </div>
</template>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
</style>
