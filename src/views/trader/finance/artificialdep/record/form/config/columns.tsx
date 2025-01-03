import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useFinAdepRec } from "../store";
const store = useFinAdepRec();

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
      // getList(searchParam.value);
    }
  });

  /**
   * 映射配置
   */
  const tMap = {
    1: { text: "人工存入", color: "text-green-600" },
    2: { text: "人工提出", color: "text-orange" },
    3: { text: "提取佣金", color: "text-orange" },
    4: { text: "提取优惠", color: "text-orange" }
  };

  const stMap = {
    1: { text: "待审核", color: "text-orange" },
    2: { text: "成功", color: "text-green-600" }
  };

  const dtLst = ref([]);

  const columns = [
    {
      label: "交易号",
      width: 260,
      prop: "id",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">{row.id || "--"}</div>
      )
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
      label: "类型",
      prop: "type",
      cellRenderer: ({ row }) => {
        const type = tMap[row.type] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${type.color} font-medium`}>{type.text}</span>;
      }
    },
    {
      label: "金额",
      prop: "amount",
      sortable: true,
      formatter: row => `${row.amount || "--"}`
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row }) => {
        const status = stMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "操作人",
      prop: "operator",
      sortable: true,
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "操作时间",
      prop: "updatedAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      sortable: true,
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: 140,
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

  // 删除
  const onDel = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: row.id };
      const res = await store.del(params);
      if (res?.code === 0) {
        message("移除成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message(res?.msg || "移除失败", { type: "error" });
      }
    } catch (error) {
      console.error("移除失败:", error);
      message("移除失败", { type: "error" });
    }
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
    setData,
    onDel
  };
}
