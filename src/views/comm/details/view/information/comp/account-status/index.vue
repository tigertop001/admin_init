<script setup lang="ts">
import { useColumns } from "./dialog/config/columns";
import Dlg from "./dialog/index.vue";
import Normal from "@iconify-icons/ri/user-follow-fill";
import Disable from "@iconify-icons/ri/admin-fill";

import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: Result;
}

const props = defineProps<Props>();
const { dlgVis, actTp, onSub, onFznAmt, onUnFznAmt, onLgDis } = useColumns(
  props.rowDt.uid
);

const getStat = (status: number) => (status === 1 ? "正常" : "禁用");
</script>

<template>
  <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
    <div class="flex items-center gap-2">
      <span>账号状态：{{ getStat(rowDt.status) }}</span>
      <IconifyIconOffline
        v-if="rowDt.status === 1"
        class="text-green-600"
        width="22"
        :icon="Normal"
      />
      <IconifyIconOffline
        v-else
        class="text-orange-300"
        width="22"
        :icon="Disable"
      />
    </div>
  </el-col>
  <el-col :xs="12" :sm="12" :md="20" :lg="20" :xl="20">
    <el-button v-if="rowDt.status == 2" @click="onFznAmt">冻结资金</el-button>
    <el-button v-if="rowDt.status == 1" @click="onUnFznAmt">解冻资金</el-button>
    <el-button @click="onLgDis">禁止登录</el-button>
  </el-col>

  <Dlg v-model:visible="dlgVis" :type="actTp" @submit="onSub" />
</template>

<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
