import { ref } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useFinRev } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useTableSelection } from "@/hooks/useSelection";

const store = useFinRev();

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

  const { clrSel } = useTableSelection(dtLst);
  const onSelChg = (rows: any[]) => {
    seldRows.value = rows;
  };

  const statusMap = {
    1: { text: "正常", color: "text-green-600" },
    2: { text: "冻结", color: "text-orange-400" },
    3: { text: "禁止登录", color: "text-red" },
    4: { text: "拉黑", color: "text-gray-500" }
  };

  const columns = [
    {
      type: "selection",
      width: 55,
      align: "center"
    },
    {
      label: "订单号",
      width: 140,
      prop: "uname",
      formatter: row => `${row.uname || "--"}`
    },
    {
      label: "UID/用户名/标识会员/分层",
      prop: "id",
      width: 220,
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
          <span>/{row.levelName || "--"}</span>
        </div>
      )
    },
    {
      label: "会员层级",
      width: 140,
      prop: "uname",
      formatter: row => `${row.uname || "--"}`
    },
    {
      label: "用户余额",
      width: 140,
      prop: "walletLeft",
      formatter: row => `${row.walletLeft || "--"}`
    },
    {
      label: "金额/币种",
      width: 140,
      prop: "enterMoney",
      formatter: row => `${row.enterMoney || "--"} / ${row.enterMoney || "--"}`
    },
    {
      label: "实际到账/手续费",
      width: 140,
      prop: "outMoney",
      formatter: row => `${row.enterMoney || "--"} / ${row.enterMoney || "--"}`
    },
    {
      label: "注册日期",
      width: 140,
      prop: "entOutDiff",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.addTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "提款类型/姓名&账号",
      width: 160,
      prop: "winOrLose",
      formatter: row => `${row.enterMoney || "--"} / ${row.enterMoney || "--"}`
    },
    {
      label: "提款方式",
      width: 140,
      prop: "addTime",
      formatter: row => `${row.enterMoney || "--"}`
    },
    {
      label: "风控原因",
      width: 140,
      prop: "enterThird",
      formatter: row => `${row.enterMoney || "--"}`
    },
    {
      label: "审核状态",
      width: 140,
      prop: "remark",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "申请时间/审核时间",
      width: 180,
      prop: "winOrLose",
      formatter: row =>
        `${fmtTs(row.addTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"} / ${fmtTs(row.addTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "初审人",
      width: 140,
      prop: "enterThird",
      formatter: row => `${row.enterMoney || "--"}`
    },
    {
      label: "复审人",
      width: 140,
      prop: "enterThird",
      formatter: row => `${row.enterMoney || "--"}`
    },
    {
      label: "备注",
      width: 140,
      prop: "enterThird",
      formatter: row => `${row.enterMoney || "--"}`
    },
    {
      label: "操作",
      width: 200,
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
  const onPass = async (row: any) => {
    try {
      await ElMessageBox.confirm("确定要通过审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      const params = {
        id: row.id,
        uid: row.uid
      };
      const res = await store.pass(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("撤销审核失败:", error);
        message("操作失败", { type: "error" });
      }
    }
  };

  const onCxl = async (row: any) => {
    try {
      await ElMessageBox.confirm("确定要撤销审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      const params = {
        id: row.id,
        uid: row.uid
      };
      const res = await store.cancel(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("撤销审核失败:", error);
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
    try {
      await ElMessageBox.confirm("确定要驳回审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      const params = {
        id: row.id,
        uid: row.uid
      };
      const res = await store.reject(params);
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

  const seldRows = ref<any[]>([]);
  const batchk = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }

    try {
      const params = {
        ids: seldRows.value.map(row => row.id).join(",")
      };
      const res = await store.batchk(params);
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

  const batrej = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }

    try {
      const params = {
        ids: seldRows.value.map(row => row.id).join(",")
      };
      const res = await store.batrej(params);
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

    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    onPass,
    onCxl,
    onBlK,
    onClr,
    onRej,
    onSelChg,
    batrej,
    batchk
  };
}
