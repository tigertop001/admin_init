<script setup lang="ts">
import { computed } from "vue";
interface Props {
  visible: boolean;
  currentTag?: Record<string, any>;
}

const props = defineProps<Props>();
const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});
const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="会员标识详情"
    width="400px"
    destroy-on-close
    @update:model-value="val => emit('update:visible', val)"
  >
    <div class="space-y-4">
      <div class="flex items-center">
        <span class="w-24 text-gray-600">会员标识:</span>
        <span>{{ props.currentTag?.tag }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="emit('update:visible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>
