<script setup lang="ts">
import { computed } from "vue";
import { useAddDialog } from "./form/config/addConfig";

const props = defineProps<{
  visible: boolean;
  rowDt?: any;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const { remark, onSub, resetForm } = useAddDialog(emit, props);

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const clrMap = {
  1: { text: "红色", color: "bg-red-500", texclr: "text-white" },
  2: { text: "蓝色", color: "bg-blue-500", texclr: "text-white" },
  3: { text: "绿色", color: "bg-green-500", texclr: "text-white" },
  4: { text: "紫色", color: "bg-purple-500", texclr: "text-white" },
  5: { text: "黄色", color: "bg-yellow-500", texclr: "text-white" },
  6: { text: "黑色", color: "bg-black", texclr: "text-white" },
  7: { text: "褐色", color: "bg-amber-600", texclr: "text-white" }
};

const onCls = () => {
  resetForm();
  emit("update:visible", false);
};

const onCfm = () => {
  onSub();
};
console.log("Props rowDt:", props.rowDt);
console.log("Color mapping:", clrMap[props.rowDt?.color]);
</script>

<template>
  <el-dialog
    v-model="dlgVis"
    title="新增用户"
    width="500px"
    :close-on-click-modal="false"
    @close="onCls"
  >
    <el-form
      :model="{ remark }"
      :rules="{
        remark: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }"
    >
      <!-- 颜色标识 -->
      <el-form-item label="用户颜色标识:" :label-width="100">
        <div
          :class="[
            'rounded w-100% text-center',
            clrMap[props.rowDt?.color]?.color,
            clrMap[props.rowDt?.color]?.texclr
          ]"
        >
          {{ clrMap[props.rowDt?.color]?.text || "--" }}
        </div>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名:" prop="remark" :label-width="100">
        <el-input
          v-model="remark"
          type="textarea"
          :rows="3"
          placeholder="请输入用户名"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCls">取消</el-button>
        <el-button type="primary" @click="onCfm">确定</el-button>
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
