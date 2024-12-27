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

// 初始查询参数
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  /**
   * 状态管理
   */
  const dataList = ref([]);
  // const dialogVis = ref(false);
  // const curTag = ref<Record<string, any> | null>(null);
  // const addMebVis = ref(false);
  const dtlsVis = ref(false);
  const curRow = ref<Record<string, any>>({});

  // 使用分页 hook
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

  /**
   * 状态映射配置
   */
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
  /**
   * 表格列配置
   */
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

  // 搜索参数更新
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

  /**
   * 设置数据
   */
  const setData = (data: any[], total: number) => {
    dataList.value = data;
    setTotal(total);
    setLd(false);
  };

  /**
   * 列表
   */
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

  // /**
  //  * 会员管理方法
  //  */
  // const onAdd = () => {
  //   addMebVis.value = true;
  // };

  // const onAddSub = async (formValues: FieldValues) => {
  //   try {
  //     const res = await store.add(formValues as object);
  //     if (res?.code === 0) {
  //       message("添加成功", { type: "success", showClose: true });
  //       await getList(searchParam.value);
  //     } else {
  //       message("添加失败", { type: "error" });
  //     }
  //   } catch (error) {
  //     console.error("添加失败:", error);
  //     message("添加失败", { type: "error" });
  //   }
  //   addMebVis.value = false;
  // };

  /**
   * 导出处理
   */
  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  // 到帐
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
        remark: remark || "" // 使用输入的备注
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
    // 状态
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    // dialogVis,
    // curTag,
    // addMebVis,
    dtlsVis,
    curRow,
    // 方法
    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    onPrmUp,
    // onAdd,
    // onAddSub,
    onArrv
  };
}
