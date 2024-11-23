<script setup lang="ts">
interface Props {
  visible: boolean;
  tagInfo?: {
    tag: string;
    memberLevel: string;
    registerTime: string;
  };
}

defineProps<Props>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="会员标识详情"
    width="400px"
    destroy-on-close
    @update:model-value="val => emit('update:visible', val)"
  >
    <div class="space-y-4">
      <div class="flex items-center">
        <span class="w-24 text-gray-600">会员标识:</span>
        <span>{{ tagInfo?.tag }}</span>
      </div>
      <div class="flex items-center">
        <span class="w-24 text-gray-600">会员等级:</span>
        <span>{{ tagInfo?.memberLevel }}</span>
      </div>
      <div class="flex items-center">
        <span class="w-24 text-gray-600">注册时间:</span>
        <span>{{ tagInfo?.registerTime }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="emit('update:visible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>
