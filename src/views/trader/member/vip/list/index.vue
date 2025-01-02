<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";

const emit = defineEmits<{
  (_e: "swchTab", _tabName: string): void;
}>();

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  goToRec
} = useColumns(emit);

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search :exportData="dtLst" @update:param="onPrmUp" />
  </div>

  <pure-table
    ref="tableRef"
    adaptive
    stripe
    border
    row-key="id"
    alignWhole="center"
    showOverflowTooltip
    :loading="loading"
    :loading-config="lodConf"
    :adaptiveConfig="adapConf"
    :columns="columns"
    :pagination="pagination"
    :data="dtLst"
    @page-size-change="onSzChg"
    @page-current-change="onCurChg"
  >
    <template #operation="{}">
      <el-button link type="primary" size="small" @click="goToRec">
        领取记录
      </el-button>
    </template>
  </pure-table>
</template>
