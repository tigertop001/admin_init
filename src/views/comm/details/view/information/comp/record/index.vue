<script setup lang="ts">
import { useColumns } from "./config/columns";
import type { UserRowData } from "../../types";

interface Props {
  rowData?: UserRowData;
  resData?: Result;
}

const props = defineProps<Props>();
const { isEdit, textarea, onEdit, save, cancel } = useColumns({
  uid: props.rowData.uid
});
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <div class="flex items-start">
      <span>备注:</span>

      <!-- 有备注值且不是编辑状态时显示文本 -->
      <template v-if="resData.data.data.userInfo?.remark && !isEdit">
        <span class="mx-2">{{ resData.data.data.userInfo.remark }}</span>
        <el-button
          class="self-end"
          @click="onEdit(resData.data.data.userInfo.remark)"
        >
          修改
        </el-button>
      </template>

      <!-- 无备注值或编辑状态时显示输入框 -->
      <template v-else>
        <el-input
          v-model="textarea"
          :autosize="{ minRows: 4, maxRows: 8 }"
          class="mx-2"
          style="width: 500px"
          type="textarea"
          placeholder="请输入备注"
        />
        <el-button class="self-end" @click="save">保存</el-button>
        <el-button class="self-end" @click="cancel">取消</el-button>
      </template>
    </div>
  </el-col>
</template>
