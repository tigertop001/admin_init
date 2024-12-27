import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemVipRec } from "../store";
const store = useMemVipRec();

// 初始查询参数
import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
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
    1: { text: "正常", color: "text-green-600" },
    2: { text: "冻结", color: "text-orange-400" },
    3: { text: "禁止登录", color: "text-red-500" },
    4: { text: "拉黑", color: "text-gray-700" }
  };
  const przMap = {
    1: { text: "待领取", color: "text-orange-600" },
    2: { text: "已领取", color: "text-green-600" }
  };
  /**
   * 基础数据
   */
  const dataList = ref([]);
  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "UID/账号/会员标识",
      width: 260,
      prop: "uid",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
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
      label: "当前等级",
      prop: "level",
      formatter: row => `${row.level || "-暂无接口字段-"}`
    },
    {
      label: "奖金类型",
      prop: "prizeType",
      cellRenderer: ({ row }) => {
        const przSt = przMap[row.prizeType] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${przSt.color} font-medium`}>{przSt.text}</span>;
      }
    },
    {
      label: "奖金金额",
      prop: "amount",
      sortable: true,
      formatter: row => `${row.amount || "--"}`
    },
    {
      label: "状态",
      prop: "status",
      sortable: true,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "发放时间",
      prop: "createdAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.createdAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "领取时间",
      prop: "updatedAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    }
  ];

  /**
   * 数据处理方法
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

  // 搜索参数更新
  const onPrmUp = (newParam: any) => {
    searchParam.value = newParam;
    getList(newParam);
  };

  /**
   * 设置表格数据
   */
  const setData = (data: any[], total: number) => {
    dataList.value = data;
    setTotal(total);
    setLd(false);
  };

  return {
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    setData
  };
}
