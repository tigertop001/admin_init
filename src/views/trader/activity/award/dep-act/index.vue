<script setup lang="ts">
import { onMounted, ref } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";

const activeType = ref(2);

const {
  loading,
  columns,
  dataList,
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

// 处理活动类型更新
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
      :exportData="dataList"
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
    :data="dataList"
    @page-size-change="onSzChg"
    @page-current-change="onCurChg"
  >
    <template #operation="{ row }">
      <el-button
        v-if="row.status == 3"
        link
        type="primary"
        size="small"
        @click="() => onCxl(row)"
      >
        通过
      </el-button>
      <el-button
        v-if="row.status == 3"
        link
        type="primary"
        size="small"
        @click="() => onCxl(row)"
      >
        取消
      </el-button>
    </template>
  </pure-table>
</template>
