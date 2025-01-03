import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemVipRec } from "../store";
const store = useMemVipRec();

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

  const statusMap = {
    1: { text: "已领取", color: "text-green-600" },
    2: { text: "待领取", color: "text-orange-400" }
  };
  const przMap = {
    1: { text: "周奖金", color: "text-orange" },
    2: { text: "月奖金", color: "text-red" },
    3: { text: "晋级奖金", color: "text-green-600" }
  };

  const dtLst = ref([]);

  const columns = [
    {
      label: "UID/账号/会员标识",
      width: 260,
      prop: "uid",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
          {row.sign == 1 ? (
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
      label: "当前等级",
      prop: "level",
      formatter: row => `${row.level || "-暂无接口字段-"}`
    },
    {
      label: "奖金类型",
      prop: "rewardType",
      cellRenderer: ({ row }) => {
        const przSt = przMap[row.rewardType] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${przSt.color} font-medium`}>{przSt.text}</span>;
      }
    },
    {
      label: "奖金金额",
      prop: "reward.amount",
      sortable: true,
      formatter: row => `${row.reward.amount || "--"}`
    },
    {
      label: "状态",
      prop: "isClaim",
      sortable: true,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.isClaim] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "发放时间",
      prop: "createdAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.createdAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "领取时间",
      prop: "claimAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.claimAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    }
  ];

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

  const onPrmUp = (newParam: any) => {
    searchParam.value = newParam;
    getList(newParam);
  };

  const setData = (data: any[], total: number) => {
    dtLst.value = data;
    setTotal(total);
    setLd(false);
  };

  return {
    loading,
    columns,
    dtLst,
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
