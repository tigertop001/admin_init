<script setup lang="ts">
import { ref } from "vue";

import Add from "@iconify-icons/ri/add-circle-line";
import Subtract from "@iconify-icons/ri/indeterminate-circle-line";
import ACCTLST from "./comp/index.vue";

import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: any;
}

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt;
console.log(rowDt, resDt);

const isShow = ref(false);
const showTable = () => {
  isShow.value = !isShow.value;
};
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <div class="flex items-center gap-2">
      <span>提现账户：</span>
      <span>PIX (最近使用)</span>
      <IconifyIconOffline
        v-if="isShow"
        width="22"
        :icon="Subtract"
        class="cursor-pointer hover:opacity-60"
        @click.stop="showTable()"
      />
      <IconifyIconOffline
        v-else
        width="22"
        :icon="Add"
        class="cursor-pointer hover:opacity-60"
        @click.stop="showTable()"
      />
    </div>
  </el-col>
  <el-col v-if="isShow" :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
    <ACCTLST />
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
