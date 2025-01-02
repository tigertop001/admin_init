<script setup lang="ts">
import { onMounted, ref } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";

const activeType = ref(4);

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
  updateType,
  onCxl
} = useColumns(activeType);

const onActTUpd = (newType: number) => {
  activeType.value = newType;
  updateType(newType);
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search
      :exportData="dtLst"
      @update:param="onPrmUp"
      @update:activeType="onActTUpd"
    />
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
    <template #operation="{ row }">
      <el-button
        v-if="row.status == 3"
        link
        type="primary"
        size="small"
        @click="() => onCxl(row, 2)"
      >
        通过
      </el-button>
      <el-button
        v-if="row.status == 3"
        link
        type="primary"
        size="small"
        @click="() => onCxl(row, 5)"
      >
        取消
      </el-button>
    </template>
  </pure-table>
</template>
