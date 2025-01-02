<script setup lang="ts">
import { onMounted } from "vue";
import { useColumns } from "./form/config/columns";
import Search from "./form/search.vue";
import Add from "./dialog/add.vue";
import Marset from "./dialog/marset.vue";
import Set from "./dialog/set.vue";
import Tran from "./dialog/tran.vue";
import Rec from "./dialog/rec.vue";

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
  recVis,
  tranVis,
  onSzChg,
  onCurChg,
  getList,
  shwAdd,
  onAddSub,
  onPrmUp,
  onDel,
  shwSet,
  shwMarSet,
  shwRec,
  shwTran
} = useColumns();

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
      @marset="shwMarSet(2)"
    />
  </div>
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
    <template #image="{ row, index }">
      <el-image
        preview-teleported
        loading="lazy"
        :src="row.img"
        :preview-src-list="dtLst.map(v => v.img)"
        :initial-index="index"
        fit="cover"
        class="w-[100px] h-[100px]"
      />
    </template>

    <template #operation="{ row }">
      <el-button link type="warning" size="small" @click="shwSet(1, row)">
        设置
      </el-button>
      <el-button link type="warning" size="small" @click="shwTran(4, row)">
        转帐
      </el-button>
      <el-button link type="warning" size="small" @click="shwRec(5, row)">
        转帐记录
      </el-button>
      <el-button link type="danger" size="small" @click="onDel(row)">
        删除
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
  <Rec
    v-model:visible="recVis"
    :editData="editData"
    @submit="onAddSub"
    @update:visible="recVis = $event"
  />
  <Tran
    v-model:visible="tranVis"
    :editData="editData"
    @submit="onAddSub"
    @update:visible="tranVis = $event"
  />
</template>
