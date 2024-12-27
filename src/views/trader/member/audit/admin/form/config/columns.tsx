import { ref } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useMemAdm } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useMemAdm();

// 初始查询参数
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  /**
   * 状态管理
   */
  const dataList = ref([]);

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
    1: { text: "待审核", color: "text-orange-600" },
    2: { text: "通过审核", color: "text-green-600" },
    3: { text: "驳回审核", color: "text-orange-400" }
  };
  /**
   * 表格列配置
   */
  const columns = [
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
      label: "管理员(ID)",
      prop: "adminAccount",
      width: 160,
      formatter: row => `${row.adminAccount || "-暂无接口字段-"}`
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
      width: "280",
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

  // 驳回审核
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
    // 状态
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    // 方法
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    onPass,
    onRej
  };
}
