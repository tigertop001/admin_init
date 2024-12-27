import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemVipLis } from "../store";
const store = useMemVipLis();

// 初始查询参数
import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns(emit) {
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
      label: "累计有效投注",
      prop: "bet",
      formatter: row => `${row.bet || "--"}`
    },
    {
      label: "累计充值",
      prop: "charge",
      sortable: true,
      formatter: row => `${row.charge || "--"}`
    },
    {
      label: "晋级时间",
      prop: "vipUpdateTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.vipUpdateTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "累计晋级奖金",
      prop: "advancementMoney",
      formatter: row => `${row.advancementMoney || "--"}`
    },
    {
      label: "累计周奖金",
      prop: "wekkMoney",
      formatter: row => `${row.wekkMoney || "--"}`
    },
    {
      label: "累计月奖金",
      prop: "monthMoney",
      formatter: row => `${row.monthMoney || "--"}`
    },
    {
      label: "累计领取",
      prop: "totalGet",
      formatter: row => `${row.totalGet || "--"}`
    },
    {
      label: "操作",
      width: 140,
      fixed: "right",
      slot: "operation"
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

  const goToRec = () => {
    emit("swchTab", "3");
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
    setData,
    goToRec
  };
}
