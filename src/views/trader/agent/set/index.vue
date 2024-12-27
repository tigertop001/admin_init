<script setup lang="ts">
/**
 * 导入依赖
 */
import { onMounted } from "vue";

/**
 * 导入组件和工具
 */
import Refresh from "@iconify-icons/ri/loop-right-fill";
import { useColumns } from "./form/config/columns";
import { useAgSet } from "./form/store";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ep/plus";

const store = useAgSet();
const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  onEdit,
  onSave,
  onCxl,
  onAdd,
  onSzChg,
  onCurChg,
  getList,
  getInfo,
  refresh,
  refIconCls,
  infoData
} = useColumns(store);

onMounted(() => {
  getList();
  getInfo();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 220px)' }">
    <!-- 搜索区域 -->
    <template #header>
      <el-row class="mb-4">
        <el-col :span="24" class="text-lg">佣金结算设置 </el-col>
      </el-row>
      <el-row class="text-sm">
        <el-col :xs="24" :sm="6" :md="6" :lg="6"
          >结算周期：{{ infoData.settleCycle }}
        </el-col>
        <el-col :xs="24" :sm="6" :md="6" :lg="6"
          >日结算时间：{{ infoData.settleAt }}
        </el-col>
        <el-col :xs="24" :sm="6" :md="6" :lg="6"
          >是否人工审核：{{ infoData.isSettle }}
        </el-col>
        <el-col :xs="24" :sm="6" :md="6" :lg="6"
          >提佣时间：{{ infoData.commissionTimeRange }}
        </el-col>
      </el-row>
    </template>
    <el-row class="mb-4">
      <el-col :span="23" class="text-lg">代理级别设置 </el-col>
      <el-col :span="1"
        ><IconifyIconOffline
          :icon="Refresh"
          :class="refIconCls"
          width="22"
          @click.stop="refresh"
        />
      </el-col>
    </el-row>
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
    >
      <!-- 操作列 -->
      <template #operation="{ row, index }">
        <el-button
          v-if="!dataList[index]?.editable"
          link
          type="primary"
          size="small"
          @click="onEdit(row, index)"
        >
          编辑
        </el-button>
        <div v-else>
          <el-button
            class="reset-margin"
            link
            type="primary"
            @click="onSave(row, index)"
          >
            保存
          </el-button>
          <el-button class="reset-margin" link @click="onCxl(index)">
            取消
          </el-button>
        </div>
      </template>
      <template #append>
        <el-button
          plain
          class="w-full my-2"
          :icon="useRenderIcon(AddFill)"
          @click="onAdd"
        >
          添加一行数据
        </el-button>
      </template>
    </pure-table>
  </el-card>
</template>
