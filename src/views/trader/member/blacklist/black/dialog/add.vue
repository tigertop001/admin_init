<script setup lang="ts">
import { computed } from "vue";
import { useAddDialog } from "./config/addConfig";
import { Delete } from "@element-plus/icons-vue";
import { srchOpts } from "../form/config/searchConfig";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const {
  srchAcct,
  selUsers,
  srchRes,
  remark,
  loading,
  tblCols,
  onSrchChg,
  onAdd,
  onDelUser,
  onSub,
  resetForm,
  AccountTypeField
} = useAddDialog(emit);

const dialogVisible = computed({
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
    v-model="dialogVisible"
    title="添加黑名单"
    width="800px"
    :close-on-click-modal="false"
    @close="onCls"
  >
    <div class="flex flex-col gap-4">
      <!-- 搜索区域 -->
      <div class="w-full">
        <AccountTypeField
          :modelValue="srchAcct"
          :options="srchOpts.account"
          :config="{
            typeKey: 'stype',
            contentKey: 'scontent',
            isStype: true
          }"
          @update:modelValue="onSrchChg"
        />
      </div>

      <!-- 搜索结果表格 -->
      <div v-loading="loading">
        <el-table
          :data="srchRes"
          style="width: 100%"
          size="small"
          :max-height="250"
        >
          <el-table-column
            v-for="item in tblCols"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :fixed="item.fixed"
          >
            <template v-if="item.slot === 'operation'" #default="{ row }">
              <el-button type="primary" link @click="onAdd(row)">
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 已选用户表格 -->
      <div v-if="selUsers.length > 0">
        <el-table
          :data="selUsers"
          style="width: 100%"
          size="small"
          :max-height="200"
        >
          <el-table-column
            v-for="item in tblCols"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :fixed="item.fixed"
          >
            <template v-if="item.slot === 'operation'" #default="{ $index }">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="onDelUser($index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 备注 -->
      <div class="w-full">
        <el-form
          :model="{ remark }"
          :rules="{
            remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
          }"
        >
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model="remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
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
