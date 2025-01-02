import { ref } from "vue";
import { message } from "@/utils/message";
import { useSameIp } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useSameIp();

export function useColumns(obj: { uid?: number | string; tabItem: string }) {
  const searchState = ref(crtDFS);
  const { searchVal } = useSearch(searchState.value, obj);
  const searchParam = ref(searchVal.value);

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

  const updateTabItem = (newTabItem: string) => {
    searchParam.value = {
      ...searchParam.value,
      tabItem: newTabItem
    };
    getList(searchParam.value);
  };

  const isBindPhStMap = {
    1: { text: "是", color: "text-green-600" },
    2: { text: "否", color: "text-red" }
  };

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
    updateTabItem
  };
}
