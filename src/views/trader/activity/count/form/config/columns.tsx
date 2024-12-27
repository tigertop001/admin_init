import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useActCnt } from "../store";
const store = useActCnt();

// 初始查询参数
import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
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

  /**
   * 基础数据
   */
  const dataList = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);

  const statusMap = {
    1: { text: "关闭", color: "text-red-500" },
    2: { text: "开启", color: "text-green-600" }
  };
  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "ID",
      prop: "id",
      width: 100,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "活动标签",
      prop: "name",
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "进行中活动数量",
      prop: "ProcessingActivityNum",
      formatter: row => `${row.ProcessingActivityNum || "--"}`
    },
    {
      label: "排序",
      prop: "sort",
      formatter: row => `${row.sort || "--"}`
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      sortable: true,
      formatter: row => `${fmtTs(row.updatedAt) || "--"}}`
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /**
   * 数据处理方法
   */
  const getList = async (params = searchParam.value) => {
    try {
      const res = await store.list(params as object);
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

  // 搜索参数更新
  const onPrmUp = (newParam: any) => {
    searchParam.value = newParam;
    getList(newParam);
  };

  /**
   * 弹窗相关方法
   */
  const shwAdd = (type: number) => {
    if (type === 0) {
      editData.value = null;
    }
    addType.value = type;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
  };

  /**
   * 设置表格数据
   */
  const setData = (data: any[], total: number) => {
    dataList.value = data;
    setTotal(total);
    setLd(false);
  };

  return {
    loading,
    columns,
    dataList,
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
    setData
  };
}
