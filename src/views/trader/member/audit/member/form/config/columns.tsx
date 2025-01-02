import { ref } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useMemMem } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useTableSelection } from "@/hooks/useSelection";

const store = useMemMem();

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

  const { onSelChg, clrSel } = useTableSelection(dtLst);

  const statusMap = {
    1: { text: "待审核", color: "text-orange-600" },
    2: { text: "驳回审核", color: "text-orange-400" },
    3: { text: "通过审核", color: "text-green-600" },
    4: { text: "撤销审核", color: "text-red-400" },
    5: { text: "黑名单", color: "text-gray-700" },
    6: { text: "清除", color: "text-red-500" }
  };

  const columns = [
    {
      type: "selection",
      width: 55,
      align: "center"
    },
    {
      label: "ID",
      prop: "id",
      width: 100,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "UID/用户名/昵称/标识会员",
      prop: "uid",
      cellRenderer: ({ row }) => (
        <div>
          <span>
            {row.uid || "--"}/{row.account || "--"}/{row.nickname || "--"}/
          </span>
          {row.sign == 2 ? (
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
      label: "项目",
      prop: "items",
      width: 160,
      formatter: row => `${row.items || "--"}`
    },
    {
      label: "申请时间",
      prop: "applyTime",
      width: 180,
      formatter: row => `${fmtTs(row.applyTime) || "--"}`
    },
    {
      label: "修改前/后",
      prop: "moneyLeft",
      width: 260,
      formatter: row =>
        `${row.changeBefore || "--"} || ${row.changeAfter || "--"}`
    },
    {
      label: "状态",
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "审核时间",
      prop: "totalSave",
      width: 160,
      formatter: row =>
        `${fmtTs(row.regTime, "YYYY-MM-DD HH:mm:ss.SSS")}/${row.regIp || "--"}`
    },
    {
      label: "操作",
      width: "320",
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
  // 通过审核
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
        getList(searchParam.value); // 刷新列表
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
        getList(searchParam.value); // 刷新列表
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
        getList(searchParam.value); // 刷新列表
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
    onSelChg
  };
}
