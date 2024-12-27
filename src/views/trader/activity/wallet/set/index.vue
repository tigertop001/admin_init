<script setup lang="ts">
import { onMounted } from "vue";

// https://plus-pro-components.com/components/form.html
import "plus-pro-components/es/components/form/style/css";
import { PlusForm } from "plus-pro-components";
import { useColumns } from "./form/config/columns";

/**
 * 从columns中引入所需的状态和方法
 */
const { columns, state, rules, onAdd, onErr, onReset, getInfo } = useColumns();

/**
 * 生命周期钩子：组件加载时获取数据
 */
onMounted(() => {
  getInfo();
});
</script>

<template>
  <PlusForm
    v-model="state"
    class="w-[550px] mr-auto ml-[32px] mt-[32px]"
    :columns="columns"
    :rules="rules"
    label-position="right"
    @submit="onAdd"
    @submit-error="onErr"
    @reset="onReset"
  >
    <!-- 自定义表单底部按钮 -->
    <template #footer>
      <div class="w-full flex justify-center gap-4">
        <el-button type="primary" @click="onAdd">保存</el-button>
      </div>
    </template>
  </PlusForm>
</template>
