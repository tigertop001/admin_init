<script setup lang="ts">
import { ref } from "vue";

import Add from "@iconify-icons/ri/add-circle-line";
import Subtract from "@iconify-icons/ri/indeterminate-circle-line";

import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: Result;
}

import { useColumns } from "./form/columns";
const { columns } = useColumns();

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt.data.data;
const dtLst = ref([resDt.agentInfo]);
console.log(rowDt, resDt);

const isShow = ref(false);
const showTable = () => {
  isShow.value = !isShow.value;
};
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <div class="flex items-center gap-2">
      <span>上级代理：{{ resDt.agentInfo.account }}</span>
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
  <el-col v-if="isShow" :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
    <pure-table
      ref="tableRef"
      adaptive
      stripe
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :columns="columns"
      :data="dtLst"
      :empty-size="100"
      :height="dtLst ? 'auto' : '100'"
      max-height="500"
      :style="{ height: dtLst ? '' : '100px' }"
    />
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
