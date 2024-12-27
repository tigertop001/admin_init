import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemBlkRec } from "../store";
const store = useMemBlkRec();

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

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "序号",
      prop: "id",
      width: 100,
      cellRenderer: ({ index }) => <p>{index + 1}</p>
    },
    {
      label: "UID/用户名",
      prop: "uid",
      formatter: row => `${row.uid || "--"}/${row.account || "--"}`
    },
    {
      label: "冻结备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "冻结时间",
      prop: "frozenTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.frozenTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "解冻时间",
      prop: "unfrozenTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.unfrozenTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
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
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    setData
  };
}
