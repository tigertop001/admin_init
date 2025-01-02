import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { ExcelExporter } from "@/components/CgExportExcel";
import { useAgRec } from "../store";
const store = useAgRec();

import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
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

  const dtLst = ref([]);
  /**
   * 映射配置
   */
  const statusMap = {
    1: { text: "收入", color: "text-green-600" },
    2: { text: "支出", color: "text-red" }
  };

  const columns = [
    {
      label: "ID",
      prop: "orderId",
      width: 90,
      formatter: row => `${row.orderId || "--"}`
    },
    {
      label: "UID/账号/会员标识",
      prop: "date",
      width: 150,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
          {row.sign == 2 ? (
            <span class="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-300">
              会员标识
            </span>
          ) : (
            <span class="text-gray-400">未知</span>
          )}
        </div>
      )
    },
    {
      label: "交易性质",
      prop: "afterCommission",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.withdrawalState] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "交易金额",
      prop: "amountCommission",
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "冻结前/后金额",
      prop: "amountCommission",
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "交易前/后金额",
      prop: "amountCommission",
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "交易类型",
      prop: "amountCommission",
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "类型子项",
      prop: "amountCommission",
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "交易时间/终端",
      prop: "createdAt",
      formatter: row => `${fmtTs(row.createdAt) || "--"} / ${row.zd || "--"}`
    },
    {
      label: "交易描述",
      prop: "withdrawalState",
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.operator || "--"}`
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

  const setData = (data: any[], total: number) => {
    dtLst.value = data;
    setTotal(total);
    setLd(false);
  };

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

  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    onPass,
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    expExcel
  };
}
