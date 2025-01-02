import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useAcLst } from "../store";
const store = useAcLst();

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

  const statusMap = {
    1: { text: "未发布", color: "text-red-500" },
    2: { text: "未开始 ", color: "text-orange-400" },
    3: { text: "进行中 ", color: "text-green-600" },
    4: { text: "已过期 ", color: "text-gray-600" },
    5: { text: "手动结束 ", color: "text-amber-600" }
  };

  const columns = [
    {
      label: "活动ID",
      prop: "id",
      width: 100,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "活动名称",
      prop: "name",
      width: 160,
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "活动类型",
      prop: "type",
      width: 200,
      formatter: row => `${row.type || "--"}`
    },
    {
      label: "活动标签",
      prop: "tagID",
      width: 140,
      formatter: row => `${row.tagID || "--"}`
    },
    {
      label: "参与会员",
      prop: "userType",
      width: 140,
      formatter: row => `${row.userType || "--"}`
    },
    {
      label: "开始时间/结束时间",
      prop: "startAt",
      width: 350,
      formatter: row =>
        `${fmtTs(row.startAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"} / ${fmtTs(row.endAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "展示起止时间",
      prop: "showStartAt",
      width: 350,
      formatter: row =>
        `${fmtTs(row.showStartAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"} / ${fmtTs(row.showEndAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作人",
      prop: "operator",
      width: 110,
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      width: 180,
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
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
      label: "操作",
      width: "120",
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
