<script setup lang="ts">
/**
 * 导入依赖和组件
 */
import { onMounted } from "vue";
import Search from "./form/search.vue";
import Edit from "./dialog/change.vue";
import { useColumns } from "./form/config/columns";

const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  editVis,
  editData,
  onEditSub,
  onSzChg,
  onCurChg,
  expExcel,
  getList,
  getInfo,
  shwEdit,
  onPrmUp,
  infoData,
  editType,
  handleBatchOpt,
  onSelChg
} = useColumns();

/**
 * 生命周期钩子
 */
onMounted(() => {
  getList();
  getInfo();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <!-- 搜索区域 -->
    <template #header>
      <Search
        :expExcel="expExcel"
        :exportData="dataList"
        :handleBatchOpt="handleBatchOpt"
        @update:param="onPrmUp"
      />
    </template>
    <div class="flex items-center justify-center gap-8 pb-3 text-size-sm">
      <span>
        佣金总计：
        <span class="text-red-500">{{ infoData.directCommission || 0 }}</span>
      </span>
      <span>
        已发放总计：
        <span class="text-red-500">{{ infoData.totalPerformance || 0 }}</span>
      </span>
      <span>
        待审核总计：
        <span class="text-red-500">{{
          infoData.totalWaitAuditPerformance || 0
        }}</span>
      </span>
      <span>
        已取消总计：
        <span class="text-red-500">{{
          infoData.totalCancelPerformance || 0
        }}</span>
      </span>
      <span>
        总记录数：
        <span class="text-red-500">{{ infoData.totalCount || 0 }}</span>
      </span>
    </div>
    <!-- 数据表格 -->
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
      @selection-change="onSelChg"
    >
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="shwEdit(0, row)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="shwEdit(1, row)">
          审核
        </el-button>
        <el-button link type="primary" size="small" @click="shwEdit(2, row)">
          查看
        </el-button>
      </template>
    </pure-table>
    <!-- 弹窗 -->
    <Edit
      v-model:visible="editVis"
      :editData="editData"
      :editType="editType"
      @submit="onEditSub"
      @update:visible="editVis = $event"
    />
  </el-card>
</template>
