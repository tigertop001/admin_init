<script setup lang="ts">
import { onMounted, ref } from "vue";
import Search from "./form/search.vue";
import Add from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";

const activeType = ref(5);

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  editData,
  addVis,
  addType,
  onSzChg,
  onCurChg,
  getList,
  onPrmUp,
  shwAdd,
  onEdit,
  onAddSub,
  updateType,
  onDtls,
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
      @add="shwAdd(0)"
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
        v-if="row.status == 1"
        link
        type="primary"
        size="small"
        @click="() => onEdit(row)"
      >
        编辑
      </el-button>
      <el-button
        v-if="row.status == 1"
        link
        type="primary"
        size="small"
        @click="() => onCxl(row)"
      >
        发放
      </el-button>
      <el-button
        v-if="[2, 3, 4, 5].includes(row.status)"
        link
        type="primary"
        size="small"
        @click="() => onDtls(row)"
      >
        详情
      </el-button>
      <el-button
        v-if="row.status == 2"
        link
        type="primary"
        size="small"
        @click="() => onCxl(row)"
      >
        停用
      </el-button>
    </template>
  </pure-table>

  <Add
    v-model:visible="addVis"
    :editData="editData"
    :type="addType"
    @submit="onAddSub"
    @update:visible="addVis = $event"
  />
</template>
