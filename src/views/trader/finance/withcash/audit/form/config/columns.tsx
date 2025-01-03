import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import { useFwAudit } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useFwAudit();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);
interface BaseObject {
  [key: string]: string | number | boolean | null;
}
export function useColumns() {
  const dtLst = ref([]);
  const infoData = ref<BaseObject>({});
  const auditInfo = ref({
    isCompleted: false,
    adminFee: 15.0,
    activityDiscount: 200.0,
    adminFeeRate: 10,
    adminFeeLimit: 60.0,
    auditFreeAmount: 1.0
  });

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

  const osMap = {
    1: { text: "未结算", color: "text-red" },
    2: { text: "已结算", color: "text-green" }
  };

  const adtMap = {
    1: { text: "存款", color: "text-orange" },
    2: { text: "活动优惠", color: "text-red" }
  };
  const columns = [
    {
      label: "UID/账号/会员标识",
      prop: "date",
      width: 150,
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
      label: "ID",
      width: "140",
      prop: "id",
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "稽核类型",
      width: "140",
      prop: "auditType",
      cellRenderer: ({ row }) => {
        const status = adtMap[row.auditType] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "金额",
      width: "160",
      prop: "amount",
      formatter: row => `${row.amount || "--"}`
    },
    {
      label: "关联活动",
      width: "160",
      prop: "relatedActivity",
      formatter: row => `${row.relatedActivity || "--"}`
    },
    {
      label: "流水要求/已完成流水",
      width: "160",
      prop: "flowRequest",
      formatter: row =>
        `${row.flowRequest || "--"} / ${row.teamCommission || "-无此数据此字段需删除-"}`
    },
    {
      label: "稽核状态",
      width: "120",
      prop: "auditStatus",
      cellRenderer: ({ row }) => {
        const status = osMap[row.auditStatus] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "行政费",
      width: "160",
      prop: "adminFee",
      formatter: row =>
        `${fmtTs(row.adminFee, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "活动扣除",
      width: "160",
      prop: "activityDeduction",
      formatter: row =>
        `${fmtTs(row.activityDeduction, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "订单时间",
      width: "160",
      prop: "orderTime",
      formatter: row =>
        `${fmtTs(row.orderTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "稽核完成",
      width: "120",
      prop: "auditCompletion",
      formatter: row => `${row.auditCompletion || "--"}`
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

  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        auditInfo.value = res.data;
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
      fileName: "数据报表"
    });
  };
  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    infoData,
    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    onPrmUp,
    getInfo,
    auditInfo
  };
}
