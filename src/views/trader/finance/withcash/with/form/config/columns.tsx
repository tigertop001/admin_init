import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useFwWith } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useTableSelection } from "@/hooks/useSelection";

const store = useFwWith();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  const dtLst = ref([]);

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

  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  const { clrSel } = useTableSelection(dtLst);
  const onSelChg = (rows: any[]) => {
    seldRows.value = rows;
  };

  const statusMap = {
    1: { text: "申请提现", color: "text-orange-400" },
    2: { text: "出款成功 ", color: "text-green-600" },
    3: { text: "出款失败", color: "text-red" },
    4: { text: "出款取消", color: "text-gray" },
    5: { text: "代付中", color: "text-yellow" }
  };

  const ctpMap = {
    1: { text: "微信 " },
    2: { text: "支付宝" },
    3: { text: "银行卡" }
  };

  const typeMap = {
    1: { text: "在线提现 ", color: "text-green-600" },
    2: { text: "人工提现", color: "text-orange-400" }
  };

  const columns = [
    {
      type: "selection",
      width: 55,
      fixed: "left",
      alignWhole: "center"
    },
    {
      label: "订单ID",
      prop: "id",
      width: 200,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "订单号",
      prop: "orderNo",
      width: 200,
      formatter: row => `${row.orderNo || "--"}`
    },
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
      label: "提款类型/姓名/账号",
      prop: "channelType",
      width: 200,
      cellRenderer: ({ row }) => {
        const type = ctpMap[row.channelType] || {
          text: "--",
          color: "text-gray-400"
        };
        return (
          <span class={`font-medium`}>
            {type.text} / {row.uname || "--"} / {row.account || "--"}
          </span>
        );
      }
    },
    {
      label: "金额/币种",
      prop: "amount",
      width: 140,
      formatter: row => `${row.amount || "--"} / ${row.currencyCode || "--"}`
    },
    {
      label: "实际到账/手续费",
      prop: "realAmount",
      width: 200,
      formatter: row => `${row.realAmount || "--"} / ${row.fee || "--"}`
    },
    {
      label: "提款方式",
      prop: "type",
      width: 200,
      cellRenderer: ({ row }) => {
        const status = typeMap[row.type] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "申请时间",
      prop: "createdAt",
      width: 200,
      formatter: row =>
        `${fmtTs(row.createdAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "审核时间",
      prop: "operaTime",
      width: 200,
      formatter: row =>
        `${fmtTs(row.operaTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "完成时间",
      prop: "operaTime",
      width: 200,
      formatter: row =>
        `${fmtTs(row.operaTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "订单状态",
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
      label: "出款人",
      prop: "operator",
      width: 200,
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      width: 100,
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: "220",
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
        clrSel();
      } else {
        setData([], 0);
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  const infVis = ref(false);
  const curData = ref(null);
  const isInfo = async (row: any) => {
    curData.value = row;
    setTimeout(() => {
      infVis.value = true;
    }, 0);
  };

  const payVis = ref(false);
  const isPay = async (row: any) => {
    curData.value = row;
    setTimeout(() => {
      payVis.value = true;
    }, 0);
  };

  const onCxl = async (row: any, actionType) => {
    try {
      const { value: remark } = await ElMessageBox.prompt(
        "请输入备注",
        "确认取消",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          inputPlaceholder: "请输入备注信息"
        }
      );
      const params = {
        id: row.id,
        remark: remark || "",
        actionType
      };
      const res = await store.cxl(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("提款到余额失败:", error);
        message("操作失败", { type: "error" });
      }
    }
  };

  const onBlK = async (row: any) => {
    try {
      await ElMessageBox.confirm("确定要将该用户拉黑吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      const params = {
        id: row.id,
        uid: row.uid
      };
      const res = await store.black(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("拉黑失败:", error);
        message("操作失败", { type: "error" });
      }
    }
  };

  const onClr = async (row: any) => {
    try {
      await ElMessageBox.confirm("确定要一键清除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      const params = {
        id: row.id,
        uid: row.uid
      };
      const res = await store.clear(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("清除失败:", error);
        message("操作失败", { type: "error" });
      }
    }
  };

  const onRej = async (row: any) => {
    console.log("---", row);
  };

  const seldRows = ref<any[]>([]);
  const onBatver = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }
    try {
      const params = {
        ids: seldRows.value.map(row => row.id).join(",")
      };
      const res = await store.betver(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        seldRows.value = [];
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const onBatcxl = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }
    try {
      const { value: remark } = await ElMessageBox.prompt(
        "请输入备注",
        "确认取消",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          inputPlaceholder: "请输入备注信息"
        }
      );

      const params = {
        ids: seldRows.value.map(row => row.id).join(","),
        remark: remark || ""
      };
      const res = await store.betcxl(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        seldRows.value = [];
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const onBatpay = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }

    try {
      const params = {
        ids: seldRows.value.map(row => row.id).join(",")
      };
      const res = await store.betpay(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        seldRows.value = [];
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    curData,
    payVis,
    infVis,
    isPay,
    expExcel,
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    isInfo,
    onCxl,
    onBlK,
    onClr,
    onRej,
    onSelChg,
    onBatpay,
    onBatver,
    onBatcxl
  };
}
