import { ref, type Ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useAwd } from "../../../comm/form/store";
const store = useAwd();

import { useSearch } from "./searchConfig";

export function useColumns(activeType: Ref<number>) {
  const { searchVal } = useSearch((event: string, ...args: any[]) => {
    if (event === "update:param") {
      searchParam.value = args[0];
      getList(args[0]);
    }
  }, activeType.value);
  const searchParam = ref(searchVal.value);

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

  const statusMap = {
    1: { text: "待发放", color: "text-yellow-500" },
    2: { text: "已发放", color: "text-green-500" },
    3: { text: "审核中", color: "text-blue-500" },
    4: { text: "已取消", color: "text-orange-400" },
    5: { text: "发放中", color: "text-red-500" }
  };

  const columns = [
    {
      label: "会员UID/会员账号",
      prop: "activityID",
      width: 160,
      formatter: row => `${row.uid || "--"}/${row.account || "--"}`
    },
    {
      label: "参与活动名称/ID",
      prop: "name",
      formatter: row => `${row.name || "--"}/${row.activityID || "--"}`
    },
    {
      label: "亏损金额",
      prop: "statistic",
      formatter: row => `${row.statistic || "--"}`
    },
    {
      label: "奖励金额",
      prop: "rewardAmount",
      formatter: row => `${row.rewardAmount}`
    },
    {
      label: "派奖钱包",
      prop: "walletType",
      formatter: row => `${row.walletType || "--"}`
    },
    {
      label: "达标时间/发放时间",
      width: 260,
      prop: "updatedAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.reachedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"} / ${fmtTs(row.issuedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
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
      label: "最后操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      width: 160,
      prop: "updatedAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: 200,
      fixed: "right",
      slot: "operation"
    }
  ];

  const getList = async (params = searchParam.value) => {
    try {
      const reqPrms = {
        ...params,
        type: Number(params.type || activeType.value)
      };
      const res = await store.list(reqPrms as object);
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

  const updateType = (newType: number) => {
    searchParam.value.type = newType;
    getList(searchParam.value);
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

  const onCxl = async (row: any, stype) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    let str = "取消";
    if (row.status == 1) {
      str = "发放";
    }
    if (row.status == 5) {
      str = "取消";
    }

    try {
      const params = {
        uid: row.uid,
        status: stype,
        id: row.id,
        type: activeType.value
      };
      const res = await store.cxl(params);
      if (res?.code === 0) {
        message(`${str}成功`, { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message(res?.msg || `${str}失败`, { type: "error" });
      }
    } catch (error) {
      console.error(`${str}失败`, error);
      message(`${str}失败`, { type: "error" });
    }
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
    setData,
    updateType,
    onCxl
  };
}
