<script setup lang="ts">
/**
 * 导入组件和工具
 */
import Dlg from "./dialog/index.vue";
import { useColumns } from "./dialog/config/columns";
import type { UserRowData } from "../../types";

interface Props {
  rowData?: UserRowData;
}

const props = defineProps<Props>();
const { dlgVis, onSub, onUp } = useColumns(props.rowData.uid);
</script>

<template>
  <div class="w-full flex flex-wrap">
    <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
      会员层级：未分层（未锁定）
    </el-col>
    <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <el-button @click="onUp">修改层级</el-button> ----- 暂无接口字段 ------
    </el-col>
    <Dlg v-model:visible="dlgVis" :uid="rowData.uid" @submit="onSub" />
  </div>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
