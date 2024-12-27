<script setup lang="ts">
import { computed, watch, ref } from "vue";
import Search from "./form/search.vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useFamRec } from "./form/store";
import { useSearch, crtDFS } from "./form/config/searchConfig";

const store = useFamRec();
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

const props = defineProps<{
  visible: boolean;
  rowData: any;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

// 使用分页 hook
const {
  loading,
  pagination,
  lodConf,
  adapConf,
  onSzChg,
  onCurChg,
  setLd,
  setTotal
} = usePagination({
  onPageChange: params => {
    searchParam.value = {
      ...searchParam.value,
      ...params
    };
    getList(searchParam.value);
  }
});

const dataList = ref([]);
const seldRows = ref<any[]>([]);

// 表格列配置
const columns = [
  {
    type: "selection",
    width: 55,
    align: "center"
  },
  {
    label: "用户名",
    prop: "account",
    formatter: row => `${row.account || "--"}`
  },
  {
    label: "用户标识颜色",
    width: 140,
    prop: "uname",
    formatter: row => `${row.uname || "--"}`
  },
  {
    label: "添加标识时间",
    width: 140,
    prop: "addTime",
    formatter: row => `${fmtTs(row.addTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
  },
  {
    label: "标识内容",
    width: 140,
    prop: "walletLeft",
    formatter: row => `${row.walletLeft || "--"}`
  },
  {
    label: "操作",
    width: 160,
    fixed: "right",
    slot: "operation"
  }
];

// 获取列表数据
const getList = async (params = searchParam.value) => {
  const queryParams = {
    ...params,
    id: props.rowData?.id,
    account: props.rowData?.account
  };

  try {
    const res = await store.list(queryParams);
    if (res?.code === 0) {
      setData(res.data.list || [], res.data.total || 0);
    } else {
      setData([], 0);
      message("未找到数据", { type: "error" });
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    message("获取数据失败", { type: "error" });
  }
};

// 设置表格数据
const setData = (data: any[], total: number) => {
  dataList.value = data;
  setTotal(total);
  setLd(false);
};

// 搜索参数更新
const onPrmUp = (newParam: any) => {
  const updatedParams = {
    ...newParam,
    id: props.rowData?.id,
    account: props.rowData?.account
  };
  searchParam.value = updatedParams;
  getList(updatedParams);
};

// 选择行变化的处理函数
const onSelChg = (rows: any[]) => {
  seldRows.value = rows;
};

const handleRemove = async (row: any) => {
  try {
    const params = {
      id: props.rowData?.id, // 当前用户的id
      uid: String(row.uid) // 要移除的用户id
    };
    const res = await store.qtBtch(params);
    if (res?.code === 0) {
      message("移除成功", { type: "success" });
      getList(searchParam.value); // 刷新列表
    } else {
      message(res?.msg || "移除失败", { type: "error" });
    }
  } catch (error) {
    console.error("移除失败:", error);
    message("移除失败", { type: "error" });
  }
};

// 批量移除
const qtBtch = async () => {
  if (!seldRows.value.length) {
    message("请选择需要移除的用户", { type: "error" });
    return;
  }

  try {
    const params = {
      id: props.rowData?.id, // 当前用户的id
      uid: seldRows.value.map(row => row.uid).join(",") // 选中的用户id，用逗号分隔
    };
    const res = await store.qtBtch(params);
    if (res?.code === 0) {
      message("批量移除成功", { type: "success" });
      seldRows.value = []; // 清空选中数据
      getList(searchParam.value); // 刷新列表
    } else {
      message(res?.msg || "批量移除失败", { type: "error" });
    }
  } catch (error) {
    console.error("批量移除失败:", error);
    message("批量移除失败", { type: "error" });
  }
};

// dialog 相关
const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const onCls = () => {
  emit("update:visible", false);
};

// 监听 rowData 变化
watch(
  () => props.rowData,
  newVal => {
    if (newVal) {
      console.log("rowData changed:", newVal);
      const params = {
        ...searchParam.value,
        id: newVal.id,
        account: newVal.account
      };
      searchParam.value = params;
      getList(params);
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<template>
  <el-dialog
    v-model="dlgVis"
    title="用户列表"
    width="1400px"
    :close-on-click-modal="false"
    @close="onCls"
  >
    <!-- 搜索区域 -->
    <div class="mb-4">
      <Search :exportData="dataList" @update:param="onPrmUp" @qtBtch="qtBtch" />
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
        <el-button link type="primary" size="small" @click="handleRemove(row)">
          移除该标识
        </el-button>
      </template>
    </pure-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCls">取消</el-button>
        <el-button type="primary"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
