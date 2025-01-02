import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useAgt } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useAgt();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  const dtLst = ref([]);
  // const dialogVis = ref(false);
  // const curTag = ref<Record<string, any> | null>(null);
  const addMebVis = ref(false);
  const dtlsVis = ref(false);
  const curRow = ref<Record<string, any>>({});

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
    1: { text: "正常", color: "text-green-600" },
    2: { text: "资金冻结", color: "text-orange-400" },
    3: { text: "禁止登录", color: "text-orange-600" },
    4: { text: "黑名单", color: "text-gray" },
    5: { text: "封禁", color: "text-red" }
  };

  const columns = [
    {
      label: "代理UID/代理账号",
      prop: "uid",
      width: 200,
      formatter: row => `${row.uid || "--"}/${row.account || "--"}`
    },
    {
      label: "上级代理UID/上级代理账号",
      prop: "parentUid",
      width: 200,
      formatter: row => `${row.parentUid || "--"}/${row.parentAccount || "--"}`
    },
    {
      label: "下级总人数",
      prop: "totalCount",
      width: 200,
      formatter: row => `${row.totalCount || "--"}`
    },
    {
      label: "直属人数/团队人数",
      prop: "directCount",
      width: 200,
      formatter: row => `${row.directCount || "--"}/${row.teamCount || "--"}`
    },
    {
      label: "总业绩/代理级别",
      prop: "totalPerformance",
      width: 140,
      formatter: row => `${row.totalPerformance || "--"}/${row.level || "--"}`
    },
    {
      label: "直属业绩/团队业绩",
      prop: "moneyLeft",
      width: 200,
      formatter: row =>
        `${row.directPerformance || "--"}/${row.teamPerformance || "--"}`
    },
    {
      label: "累计佣金",
      prop: "totalCommission",
      width: 200,
      formatter: row => `${row.totalCommission || "--"}`
    },
    {
      label: "已领取佣金/未领取佣金",
      prop: "drawMoney",
      width: 200,
      formatter: row =>
        `${row.receivedCommission || "--"}/${row.unreceivedCommission || "--"}`
    },
    {
      label: "注册时间/IP",
      prop: "dddd",
      width: 200,
      formatter: row =>
        `${fmtTs(row.createdAt) || "-暂无接口字段-"} / ${row.unreceivedCommission || "-暂无接口字段-"}`
    },
    {
      label: "最近登陆时间/IP",
      prop: "dddd",
      width: 200,
      formatter: row =>
        `${fmtTs(row.updatedAt) || "-暂无接口字段-"} / ${row.unreceivedCommission || "-暂无接口字段-"}`
    },
    {
      label: "账号状态",
      prop: "agentState",
      width: 100,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.agentState] || {
          text: "-暂无接口字段-",
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
   * 会员管理方法
   */
  const onAdd = () => {
    addMebVis.value = true;
  };

  const onAddSub = async (formValues: FieldValues) => {
    try {
      const res = await store.add(formValues as object);
      if (res?.code === 0) {
        message("添加成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message("添加失败", { type: "error" });
      }
    } catch (error) {
      console.error("添加失败:", error);
      message("添加失败", { type: "error" });
    }
    addMebVis.value = false;
  };

  /**
   * 详情处理
   */
  const onDetail = (row: any) => {
    curRow.value = row;
    dtlsVis.value = true;
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
    // dialogVis,
    // curTag,
    addMebVis,
    dtlsVis,
    curRow,

    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    onPrmUp,
    onAdd,
    onAddSub,
    onDetail
  };
}
