<template>
  <div class="bg-white p-6">
    <!-- 手续费开关 -->
    <el-form-item label="手续费开关" required>
      <el-radio-group v-model="state.withdrawServiceFeeEnabled">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="2">关闭</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 通道表单 -->
    <div class="mt-4">
      <div class="text-gray-600 mb-2">通道</div>
      <el-table :data="tableData" border>
        <el-table-column label="提现方式" width="120" align="center">
          <template #default>
            <span>PIX</span>
          </template>
        </el-table-column>

        <el-table-column label="提现费率" width="200" align="center">
          <template #default="scope">
            <div class="flex items-center gap-1">
              <el-input-number
                v-model="scope.row.rate"
                :min="0"
                :precision="2"
                :step="0.1"
                controls-position="right"
                class="w-24"
              />
              <span>%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="固定金额手续费" width="200" align="center">
          <template #default="scope">
            <div class="flex items-center gap-1">
              <el-input-number
                v-model="scope.row.fixedFee"
                :min="0"
                :precision="2"
                controls-position="right"
                class="w-24"
              />
              <span>BRL</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="封顶金额" width="200" align="center">
          <template #default="scope">
            <div class="flex items-center gap-1">
              <el-input-number
                v-model="scope.row.cap"
                :min="0"
                :precision="2"
                controls-position="right"
                class="w-24"
              />
              <span>BRL</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="提示语" width="90" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.messageEnabled"
              :active-value="1"
              :inactive-value="2"
            />
          </template>
        </el-table-column>

        <el-table-column label="提示语设置" align="center">
          <template #default="scope">
            <div class="flex items-center gap-2">
              <el-input
                v-model="scope.row.message"
                placeholder="Desculpe, a retirada falhou!"
              >
                <template #append>
                  <el-button :icon="EditPen" />
                </template>
              </el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 说明文字 -->
      <div class="mt-4 text-sm text-gray-600">
        <div>例如：</div>
        <div class="mt-1">
          设置提现费率为 2% ，固定金额手续费为 5BRL，上不封顶。
        </div>
        <div class="mt-1">
          则提现 100BRL，固定金额手续费为 5BRL，提现费率为 2BRL，实际到账为
          93BRL
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="mt-6 flex justify-center">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { EditPen } from "@element-plus/icons-vue";
import { useFwFee } from "./form/store/";
import { ElMessage } from "element-plus";

const store = useFwFee();

const state = ref({
  withdrawServiceFeeEnabled: 2
});

const tableData = ref([
  {
    method: "pix",
    rate: 0,
    fixedFee: 0,
    cap: 0,
    message: "",
    messageEnabled: 2
  }
]);

// 获取设置信息
const getInfo = async () => {
  try {
    const res = await store.info();
    if (res.code === 0) {
      state.value.withdrawServiceFeeEnabled =
        res.data.withdrawServiceFeeEnabled;
      if (res.data.settings && res.data.settings.length > 0) {
        tableData.value = res.data.settings;
      }
    } else {
      ElMessage.error(res.msg || "获取设置失败");
    }
  } catch (error) {
    console.error("获取设置失败:", error);
    ElMessage.error("获取设置失败");
  }
};

const onSubmit = async () => {
  try {
    const submitData = {
      withdrawServiceFeeEnabled: state.value.withdrawServiceFeeEnabled,
      settings: tableData.value
    };

    const res = await store.set(submitData);
    if (res.code === 0) {
      ElMessage.success("设置成功");
    } else {
      ElMessage.error(res.msg || "设置失败");
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("设置失败");
  }
};

onMounted(() => {
  getInfo();
});
</script>

<style scoped>
:deep(.el-table) {
  --el-table-border-color: #dcdfe6;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-right: 0;
}
</style>
