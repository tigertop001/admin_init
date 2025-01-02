<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { message } from "@/utils/message";
import { fmtTs } from "@/utils/dateFormat";
import { useOpNctl } from "../form/store/index";
import { usePagination } from "@/hooks/usePagination";

const store = useOpNctl();

const props = defineProps<{
  modelValue: boolean;
  uid?: number;
}>();

const emit = defineEmits<{
  (_e: "update:modelValue", _value: boolean): void;
}>();

// 表格数据
const dtLst = ref([]);

// 请求参数
const searchParam = ref({
  start: 0,
  limit: 10,
  uid: props.uid
});

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
    getRecordList();
  }
});

// 操作类型映射
const operateTypeMap = {
  1: "自动",
  2: "手动"
};

// 操作方式映射
const operateWayMap = {
  1: "系统",
  2: "人工"
};

// 表格列配置
const columns = [
  {
    label: "ID",
    prop: "id"
  },
  {
    label: "UID/用户名",
    prop: "uid",
    formatter: (row: any) => `${row.uid || "--"} / ${row.userName || "--"}`
  },
  {
    label: "设置前层级",
    prop: "beforeLevel",
    formatter: (row: any) => row.beforeLevel || "--"
  },
  {
    label: "设置后层级",
    prop: "afterLevel",
    formatter: (row: any) => row.afterLevel || "--"
  },
  {
    label: "类型",
    prop: "operateType",
    formatter: (row: any) => operateTypeMap[row.operateType] || "--"
  },
  {
    label: "方式",
    prop: "operateWay",
    formatter: (row: any) => operateWayMap[row.operateWay] || "--"
  },
  {
    label: "备注",
    prop: "remark",
    formatter: (row: any) => row.remark || "--"
  },
  {
    label: "操作时间",
    prop: "operateTime",
    formatter: (row: any) =>
      fmtTs(Number(row.operateTime), "YYYY-MM-DD HH:mm:ss.SSS") || "--"
  }
];

// 获取记录列表
const getRecordList = async () => {
  if (!props.uid) {
    message("缺少用户ID", { type: "error" });
    return;
  }

  try {
    setLd(true);
    const params = {
      ...searchParam.value,
      uid: props.uid
    };
    const res = await store.rec(params);
    if (res?.code === 0) {
      dtLst.value = res.data.list || [];
      setTotal(res.data.total || 0);
    } else {
      message(res?.msg || "获取记录失败", { type: "error" });
      dtLst.value = [];
      setTotal(0);
    }
  } catch (error) {
    console.error("获取记录失败:", error);
    message("获取记录失败", { type: "error" });
    dtLst.value = [];
    setTotal(0);
  } finally {
    setLd(false);
  }
};

const close = () => {
  emit("update:modelValue", false);
};

const initList = () => {
  searchParam.value = {
    start: 0,
    limit: 10,
    uid: props.uid
  };
  getRecordList();
};

onMounted(() => {
  if (props.modelValue && props.uid) {
    initList();
  }
});

watch([() => props.modelValue, () => props.uid], ([newVisible, newUid]) => {
  if (newVisible && newUid) {
    initList();
  }
});
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="升级记录"
    width="1400"
    @update:model-value="close"
  >
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
      :data="dtLst"
      :pagination="pagination"
      @page-size-change="onSzChg"
      @page-current-change="onCurChg"
    />
  </el-dialog>
</template>

<style scoped>
.el-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
