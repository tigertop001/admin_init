<script setup lang="ts">
import { onMounted } from "vue";

import "plus-pro-components/es/components/form/style/css";
import { PlusForm } from "plus-pro-components";
import { useColumns } from "./form/config/columns";

const { columns, state, onAdd, onErr, onReset, getInfo } = useColumns();

onMounted(() => {
  getInfo();
});
</script>

<template>
  <PlusForm
    v-model="state"
    class="w-[550px] mr-auto ml-[32px] mt-[32px]"
    :columns="columns"
    label-position="right"
    @submit="onAdd"
    @submit-error="onErr"
    @reset="onReset"
  >
    <template #footer>
      <div class="w-full flex justify-center gap-4">
        <el-button type="primary" @click="onAdd">保存</el-button>
      </div>
    </template>
  </PlusForm>
</template>
