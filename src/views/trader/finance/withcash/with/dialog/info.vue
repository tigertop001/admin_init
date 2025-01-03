<script lang="ts" setup>
import { computed } from "vue";
import { type FieldValues } from "plus-pro-components";

const props = defineProps<{
  visible: boolean;
  curData?: FieldValues;
}>();

const emit = defineEmits<{
  (_e: "submit", _formValues: FieldValues): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const onCls = (done: () => void) => {
  done();
};
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="查看详情"
    width="500"
    :before-close="onCls"
  >
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl text-gray-600 text-center mb-8">
        请确认信息后处理
      </h1>

      <div className="space-y-4">
        <div className="flex items-center">
          <span className="w-32 text-gray-600">用户名：</span>
          <span className="text-orange-400">wangxiaomei</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 text-gray-600">真实姓名：</span>
          <span className="text-orange-400">王小美</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 text-gray-600">申请提现金额：</span>
          <span className="text-orange-400">490.00 (RMB)</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 text-gray-600">实际打款金额：</span>
          <span className="text-orange-400">484.10 (RMB)</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 text-gray-600">提现类型：</span>
          <span className="text-orange-400">银行卡</span>
          <span className="ml-2 px-3 py-1 bg-green-500 text-white rounded"
            >华夏银行</span
          >
        </div>

        <div className="flex items-center">
          <span className="w-32 text-gray-600">提现账号：</span>
          <span className="text-orange-400">622748932748937</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认提现
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
