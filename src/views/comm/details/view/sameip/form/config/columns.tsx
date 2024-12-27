import { ref } from "vue";
import { message } from "@/utils/message";
import { useSameIp } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useSameIp();

export function useColumns(obj: { uid?: number | string; tabItem: string }) {
  // 初始查询参数
  const searchState = ref(crtDFS);
  const { searchVal } = useSearch(searchState.value, obj);
  const searchParam = ref(searchVal.value);

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

  const updateTabItem = (newTabItem: string) => {
    searchParam.value = {
      ...searchParam.value,
      tabItem: newTabItem
    };
    getList(searchParam.value);
  };

  /**
   * 状态映射配置
   */
  const isBindPhStMap = {
    1: { text: "是", color: "text-green-500" },
    2: { text: "否", color: "text-red-500" }
  };

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "UID/用户名/标识会员",
      prop: "uid",
      width: 200,
      cellRenderer: ({ row }) => (
        <div>
          <span>
            {row.uid || "--"}/{row.account || "--"}/
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
      label: "真实姓名",
      prop: "status",
      formatter: row => `${row.uname || "--"}`
    },
    {
      label: "最近登录时间",
      prop: "address",
      width: 200,
      formatter: row => `${row.ip || "--"}/${row.area || "--"}`
    },
    {
      label: "最近登录IP",
      prop: "loginTime",
      width: 140,
      formatter: row => `${row.loginTime || "--"}`
    },
    {
      label: "设备号",
      prop: "deviceNum",
      width: 160,
      formatter: row => `${row.deviceNum || "--"}`
    },
    {
      label: "是否绑定手机号",
      prop: "isBindPhone",
      width: 160,
      cellRenderer: ({ row }) => {
        const bindPhSt = isBindPhStMap[row.isBindPhone] || {
          text: "--",
          color: "text-gray-400"
        };
        return (
          <span class={`${bindPhSt.color} font-medium`}>{bindPhSt.text}</span>
        );
      }
    },
    {
      label: "注册IP",
      prop: "regIp",
      width: 160,
      formatter: row => `${row.regIp || "--"}`
    },
    {
      label: "注册时间",
      prop: "regTime",
      width: 160,
      formatter: row =>
        `${fmtTs(row.regTime, "YYYY-MM-DD HH:mm:ss.SSS", "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
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
    updateTabItem
  };
}
