import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useActCnt } from "../store";
const store = useActCnt();

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
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);

  const statusMap = {
    1: { text: "帐号首充" },
    2: { text: "充值活动" },
    3: { text: "邀请转盘" },
    4: { text: "救济金" },
    5: { text: "自定义活动" }
  };

  const summaryData = ref({
    participantCount: 0,
    participationCount: 0,
    totalReward: 0
  });

  const getSummaries = (param: { columns: any[] }) => {
    const { columns } = param;
    const sums: string[] = [];
    columns.forEach((_, index) => {
      if (index === 0) {
        sums[index] = "合计";
        return;
      }
      switch (columns[index].prop) {
        case "participantCount":
          sums[index] = `${summaryData.value.participantCount}`;
          break;
        case "participationCount":
          sums[index] = `${summaryData.value.participationCount}`;
          break;
        case "totalReward":
          sums[index] = `${fmtTs(summaryData.value.totalReward)}`;
          break;
        default:
          sums[index] = "--";
      }
    });
    return sums;
  };

  const columns = [
    {
      label: "活动ID",
      prop: "activityId",
      width: 100,
      formatter: row => `${row.activityId || "--"}`
    },
    {
      label: "活动名称",
      prop: "name",
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "活动类型",
      prop: "type",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.type] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span>{status.text}</span>;
      }
    },
    {
      label: "参与人数",
      prop: "participantCount",
      formatter: row => `${row.participantCount || "--"}`
    },
    {
      label: "活动发放次数",
      prop: "participationCount",
      formatter: row => `${row.participationCount || "--"}`
    },
    {
      label: "活动总奖金",
      prop: "totalReward",
      sortable: true,
      formatter: row => `${fmtTs(row.totalReward) || "--"}}`
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
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

  const shwAdd = (type: number) => {
    if (type === 0) {
      editData.value = null;
    }
    addType.value = type;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
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
    editData,
    addVis,
    addType,
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    shwAdd,
    setData,
    getSummaries
  };
}
