<script setup lang="ts">
import { computed } from "vue";
import { useAddDialog } from "./form/config/addConfig";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const { remark, onSub, resetForm } = useAddDialog(emit);

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const onCls = () => {
  resetForm();
  emit("update:visible", false);
};

const onCfm = () => {
  onSub();
};
</script>

<template>
  <el-dialog
    v-model="dlgVis"
    title="添加黑名单"
    width="800px"
    :close-on-click-modal="false"
    @close="onCls"
  >
    <div class="flex flex-col gap-4">
      <!-- 用户名 -->
      <div class="w-full">
        <el-form
          :model="{ remark }"
          :rules="{
            remark: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ]
          }"
        >
          <el-form-item label="用户名：" prop="remark">
            <el-input
              v-model="remark"
              type="textarea"
              :rows="3"
              placeholder="请输入用户名"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCls">取消</el-button>
        <el-button type="primary" @click="onCfm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
