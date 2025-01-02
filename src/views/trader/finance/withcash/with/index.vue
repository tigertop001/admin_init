<script setup lang="ts">
import { onMounted } from "vue";
import Search from "./form/search.vue";
import { useColumns } from "./form/config/columns";
import Details from "@/views/comm/details/index.vue";

const {
  loading,
  columns,
  dtLst,
  pagination,
  lodConf,
  adapConf,
  dtlsVis,
  curRow,
  onSzChg,
  onCurChg,
  expExcel,
  getList,
  onPrmUp,
  onCxl,
  onSelChg
} = useColumns();

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="mb-4">
    <Search :expExcel="expExcel" :exportData="dtLst" @update:param="onPrmUp" />
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
    @selection-change="onSelChg"
  >
    <template #operation="{}">
      <el-button link type="primary" size="small" @click="onCxl()">
        查看
      </el-button>
      <el-button link type="primary" size="small" @click="onCxl()">
        取消
      </el-button>
      <el-button link type="primary" size="small" @click="onCxl()">
        稽核流水
      </el-button>
      <el-button link type="primary" size="small" @click="onCxl()">
        代付
      </el-button>
    </template>
  </pure-table>

  <!-- 会员标识详情弹窗
    <Tag v-model:visible="dialogVis" :curTag="curTag" /> -->

  <!-- 添加弹窗 -->
  <!-- <Add
    v-model:visible="addMebVis"
    @submit="onAddSub"
    @update:visible="addMebVis = $event"
  /> -->

  <Details v-model:visible="dtlsVis" title="会员详情" :rowDt="curRow" />
</template>
