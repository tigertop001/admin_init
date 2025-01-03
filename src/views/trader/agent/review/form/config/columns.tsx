import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import { useAgtRev } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import type { FieldValues } from "plus-pro-components";
import { useTableSelection } from "@/hooks/useSelection";

const store = useAgtRev();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);
interface BaseObject {
  [key: string]: string | number | boolean | null;
}
export function useColumns() {
  const dtLst = ref([]);
  const editData = ref();
  const editVis = ref(false);
  const editType = ref(0);
  const recVis = ref(false);
  const infoData = ref<BaseObject>({});

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

  const { onSelChg, clrSel, getSelRws } = useTableSelection(dtLst);

  const osMap = {
    1: { text: "待审核", color: "text-orange-600" },
    2: { text: "审核通过", color: "text-green-600" },
    3: { text: "已取消", color: "text-gray-400" }
  };

  const columns = [
    {
      type: "selection",
      width: 55,
      fixed: "left",
      alignWhole: "center"
    },
    {
      label: "代理UID/代理用户名/标识会员",
      width: "220",
      prop: "uid",
      cellRenderer: ({ row }) => (
        <div>
          <span>
            {row.uid || "--"}/{row.account || "--"}/
          </span>
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
      label: "总业绩/代理级别",
      width: "140",
      prop: "performance",
      formatter: row => `${row.performance || "--"} / ${row.level || "--"}`
    },
    {
      label: "直属会员/直属业绩",
      width: "160",
      prop: "directCount",
      formatter: row =>
        `${row.directCount || "--"} / ${row.directPerformance || "--"}`
    },
    {
      label: "团队会员/团队业绩",
      width: "160",
      prop: "teamCount",
      formatter: row =>
        `${row.teamCount || "--"} / ${row.teamPerformance || "--"}`
    },
    {
      label: "直属佣金/团队佣金",
      width: "160",
      prop: "directCommission",
      formatter: row =>
        `${row.directCommission || "--"} / ${row.teamCommission || "--"}`
    },
    {
      label: "结算佣金",
      width: "120",
      prop: "commission",
      formatter: row => `${row.commission || "--"}`
    },
    {
      label: "结算日期",
      width: "160",
      prop: "settlementDate",
      formatter: row =>
        `${fmtTs(row.settlementDate, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "审核时间",
      width: "160",
      prop: "operatorAt",
      formatter: row =>
        `${fmtTs(row.operatorAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "审核人",
      width: "120",
      prop: "operatorId",
      formatter: row => `${row.operatorId || "--"}`
    },
    {
      label: "状态",
      width: "120",
      prop: "operatorStatus",
      cellRenderer: ({ row }) => {
        const status = osMap[row.operatorStatus] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: "150",
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

  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        const data = res.data;
        infoData.value = {
          ...data,
          settleCycle: data.settleCycle === 1 ? "日" : "周",
          isSettle: data.isSettle === 1 ? "否" : "是"
        };
      } else {
        setData([], 0);
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  const shwEdit = (type: number, row?: any) => {
    if (type === 0) {
      editData.value = row;
    }
    editType.value = type;
    setTimeout(() => {
      editVis.value = true;
    }, 0);
  };
  const onSucc = async () => {
    editVis.value = false;
    editData.value = null;
    editType.value = 0;
    await getList(searchParam.value);
  };

  /**
   * CRUD操作方法
   */
  const onEditSub = async (formValues: FieldValues) => {
    try {
      let res;
      if (editType.value === 0) {
        // 编辑操作
        res = await store.edit(formValues);
      } else if (editType.value === 1) {
        // 审核操作
        console.log("审核操作, ", editType.value);
        res = await store.opt(formValues);
      }
      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await onSucc();
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const onBchOpt = async (type: 2 | 3) => {
    const selectedRows = getSelRws();
    if (!selectedRows.length) {
      message("请先选择要操作的记录", { type: "warning" });
      return;
    }

    try {
      const res = await store.opt({
        id: selectedRows.map(row => row.id),
        withdrawalState: type
      });

      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        clrSel(); // 清空选择
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
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
    editVis,
    editData,
    editType,
    recVis,
    infoData,

    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    onPrmUp,
    shwEdit,
    onEditSub,
    onSelChg,
    getInfo,
    onBchOpt
  };
}
