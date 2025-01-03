import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
// import type { FieldValues } from "plus-pro-components";
import { useFdRev } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useFdRev();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  const dtLst = ref([]);

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
    1: { text: "申请充值", color: "text-orange-400" },
    2: { text: "充值成功 ", color: "text-green-600" },
    3: { text: "充值失败", color: "text-red" },
    4: { text: "充值取消", color: "text-gray" }
  };

  const typeMap = {
    1: { text: "在线充值 ", color: "text-green-600" },
    2: { text: "人工充值", color: "text-orange-400" }
  };

  const columns = [
    {
      label: "订单号",
      prop: "orderNo",
      width: 200,
      formatter: row => `${row.orderNo || "--"}`
    },
    {
      label: "来源商户",
      prop: "channelName",
      width: 200,
      formatter: row => `${row.channelName || "--"}`
    },
    {
      label: "UID/账号",
      prop: "date",
      width: 150,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
        </div>
      )
    },
    {
      label: "充值类型/充值币种",
      prop: "type",
      width: 200,
      cellRenderer: ({ row }) => {
        const type = typeMap[row.type] || {
          text: "--",
          color: "text-gray-400"
        };
        return (
          <span class={`${type.color} font-medium`}>
            {type.text} / {row.currencyCode || "--"}
          </span>
        );
      }
    },
    {
      label: "订单金额",
      prop: "amount",
      width: 140,
      formatter: row => `${row.amount || "--"}`
    },
    {
      label: "实际到账金额",
      prop: "realAmount",
      width: 200,
      formatter: row => `${row.realAmount || "--"}`
    },
    {
      label: "状态",
      prop: "status",
      width: 200,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "审核人",
      prop: "reviewer",
      width: 200,
      formatter: row => `${row.reviewer || "--"}`
    },
    {
      label: "创建时间",
      prop: "createdAt",
      width: 200,
      formatter: row =>
        `${fmtTs(row.createdAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "到账时间",
      prop: "operaTime",
      width: 200,
      formatter: row =>
        `${fmtTs(row.operaTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      width: 100,
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: "140",
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

  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  const onArrv = async (row: any, type: number) => {
    try {
      const { value: remark } = await ElMessageBox.prompt(
        "请输入备注",
        "确认到账",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          inputPlaceholder: "请输入备注信息"
        }
      );

      const params = {
        id: row.id,
        actionType: type,
        remark: remark || ""
      };
      const res = await store.arrv(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("驳回审核失败:", error);
        message("操作失败", { type: "error" });
      }
    }
  };

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    dtlsVis,
    curRow,
    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    onPrmUp,
    onArrv
  };
}
