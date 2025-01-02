<script setup lang="ts">
import Dlg from "./dialog/index.vue";
import { useColumns } from "./dialog/config/columns";
import type { UserRowData } from "../../types";

interface Props {
  rowDt?: UserRowData;
}

const props = defineProps<Props>();
const { dlgVis, onSub, onUp } = useColumns(props.rowDt.uid);
</script>

<template>
  <div class="w-full flex flex-wrap">
    <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
      会员层级：未分层（未锁定）
    </el-col>
    <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <el-button @click="onUp">修改层级</el-button> ----- 暂无接口字段 ------
    </el-col>
    <Dlg v-model:visible="dlgVis" :uid="rowDt.uid" @submit="onSub" />
  </div>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
