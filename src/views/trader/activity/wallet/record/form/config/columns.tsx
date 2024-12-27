import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useActRec } from "../store";
const store = useActRec();

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
   * 状态管理
   */
  const dataList = ref([]);
  /**
   * 映射配置
   */
  const statusMap = {
    1: { text: "成功", color: "text-green-600" },
    2: { text: "审核中", color: "text-orange-400" },
    3: { text: "拒绝", color: "text-red-500" }
  };

  const convertModeMap = {
    1: { text: "全额提取", color: "text-green-600" },
    2: { text: "部分提取", color: "text-orange-400" }
  };

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "ID",
      prop: "id",
      width: 90,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "会员UID/会员账号",
      prop: "uid",
      width: 180,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
        </div>
      )
    },
    {
      label: "活动钱包余额",
      prop: "walletBalance",
      width: 180,
      formatter: row => `${row.walletBalance || "--"}`
    },
    {
      label: "提取金额",
      prop: "convertAmount",
      width: 140,
      formatter: row => `${row.convertAmount || "--"}`
    },
    {
      label: "提取时间",
      prop: "createdAt",
      formatter: row =>
        `${fmtTs(row.createdAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "提取方式",
      prop: "convertMode",
      width: 110,
      cellRenderer: ({ row }) => {
        const status = convertModeMap[row.convertMode] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "状态",
      prop: "status",
      width: 160,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "最后操作人",
      prop: "operator",
      width: 160,
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作",
      width: "120",
      fixed: "right",
      slot: "operation"
    }
  ];

  /**
   * 搜索参数更新
   */
  const onPrmUp = (newParam: any) => {
    if (
      Object.keys(newParam).length === 2 &&
      newParam.page &&
      newParam.pageSize
    ) {
      return;
    }
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

  /**
   * 列表
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

  /**
   * 通过处理
   */
  const onPass = async (params = searchParam.value) => {
    try {
      const res = await store.pass(params as object);
      if (res?.code === 0) {
        params.states == 1 ? "通过" : "取消";
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  return {
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    onPass,
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp
  };
}
