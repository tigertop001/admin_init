<script setup lang="ts">
import { onMounted } from "vue";
import { useColumns } from "./form/config/columns";
import Add from "./dialog/add.vue";
import Marset from "./dialog/marset.vue";
import Set from "./dialog/set.vue";

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
  marSetVis,
  setVis,
  onSzChg,
  onCurChg,
  getList,
  shwAdd,
  onAddSub,
  onPrmUp,
  onDel,
  shwSet,
  shwMarSet
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 196px)' }">
    <div class="flex">
      <pure-table
        ref="tableRef"
        stripe
        border
        adaptive
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
          <el-button link type="warning" size="small" @click="shwSet(1, row)">
            设置
          </el-button>
          <el-button link type="danger" size="small" @click="onDel(row)">
            删除
          </el-button>
        </template>
      </pure-table>
    </div>
    <Add
      v-model:visible="addVis"
      :editData="editData"
      :type="addType"
      @submit="onAddSub"
      @update:visible="addVis = $event"
    />
    <Marset
      v-model:visible="marSetVis"
      :editData="editData"
      @submit="onAddSub"
      @update:visible="marSetVis = $event"
    />
    <Set
      v-model:visible="setVis"
      :editData="editData"
      @submit="onAddSub"
      @update:visible="setVis = $event"
    />
  </el-card>
</template>
