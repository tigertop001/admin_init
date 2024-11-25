<script setup lang="ts">
import { PlusDialog } from "plus-pro-components";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { computed } from "vue";
interface Props {
  visible: boolean;
  currentTag?: Record<string, any> | null; // 修改这里，允许 null 值
}

const props = defineProps<Props>();
const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});
const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();
const saveTag = () => {
  console.log("保存标签");
};

// 定义按钮配置
const footerButtons = {
  confirm: {
    text: "保存"
  },
  cancel: {
    text: "取消"
  }
};
</script>

<template>
  <PlusDialog
    v-model="dialogVisible"
    title="会员标识详情"
    width="400px"
    :destroy-on-close="true"
    :footer-buttons="footerButtons"
    @confirm="saveTag"
  >
    <!-- <div class="space-y-4">
      <div class="flex items-center">
        <span class="w-24 text-gray-600">会员标识:</span>
        <span>{{ props.currentTag?.tag }}</span>
      </div>
    </div> -->
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label="会员标识">
        {{ props.currentTag?.tag }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </PlusDialog>
</template>
