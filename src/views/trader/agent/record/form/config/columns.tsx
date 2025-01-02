import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
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
    1: { text: "待审核", color: "text-orange-600" },
    2: { text: "审核通过", color: "text-blue-600" },
    3: { text: "审核拒绝", color: "text-red" },
    4: { text: "已提佣", color: "text-green-600" }
  };

  const columns = [
    {
      label: "订单号",
      prop: "orderId",
      width: 90,
      formatter: row => `${row.orderId || "--"}`
    },
    {
      label: "代理UID/代理账号",
      prop: "uid",
      width: 180,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
        </div>
      )
    },
    {
      label: "已领取佣金/未领取佣金",
      prop: "afterCommission",
      width: 180,
      formatter: row =>
        `${row.amountCommission || "--"} / ${row.afterCommission || "--"}`
    },
    {
      label: "提拥金额",
      prop: "amountCommission",
      width: 140,
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "提拥时间",
      prop: "createdAt",
      formatter: row => `${fmtTs(row.createdAt) || "--"}`
    },
    {
      label: "账号状态",
      prop: "withdrawalState",
      width: 160,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.withdrawalState] || {
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
    onPrmUp
  };
}
