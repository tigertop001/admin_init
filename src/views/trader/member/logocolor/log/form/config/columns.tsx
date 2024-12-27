import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemLCLog } from "../store";
const store = useMemLCLog();

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
   * 映射配置
   */
  const operMap = {
    1: { text: "新增", color: "text-green-600" },
    2: { text: "编辑", color: "text-red" },
    3: { text: "删除", color: "text-red" }
  };

  const clrMap = {
    1: { text: "红色", color: "bg-red-500", texclr: "text-white" },
    2: { text: "蓝色", color: "bg-blue-500", texclr: "text-white" },
    3: { text: "绿色", color: "bg-green-500", texclr: "text-white" },
    4: { text: "紫色", color: "bg-purple-500", texclr: "text-white" },
    5: { text: "黄色", color: "bg-yellow-500", texclr: "text-white" },
    6: { text: "黑色", color: "bg-black", texclr: "text-white" },
    7: { text: "褐色", color: "bg-amber-600", texclr: "text-white" }
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
      label: "用户名",
      width: 260,
      prop: "account",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">{row.account || "--"}</div>
      )
    },
    {
      label: "操作",
      prop: "operate",
      cellRenderer: ({ row }) => {
        const oper = operMap[row.operate] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${oper.color} font-medium`}>{oper.text}</span>;
      }
    },
    {
      label: "修改前标识会员",
      prop: "beforeColor",
      sortable: true,
      cellRenderer: ({ row }) => {
        // 将颜色字符串分割成数组
        const colorIds = (row.beforeColor || "").split(",").filter(Boolean);

        return (
          <div class="flex flex-wrap gap-1">
            {colorIds.map(id => {
              const colorInfo = clrMap[id] || {
                text: "--",
                color: "bg-gray-200",
                texclr: "text-gray-600"
              };
              return (
                <div
                  key={id}
                  class={`px-2 py-1 rounded ${colorInfo.color} ${colorInfo.texclr} text-xs`}
                >
                  {colorInfo.text}
                </div>
              );
            })}
          </div>
        );
      }
    },
    {
      label: "修改后标识会员",
      prop: "afterColor",
      sortable: true,
      cellRenderer: ({ row }) => {
        // 将颜色字符串分割成数组
        const colorIds = (row.afterColor || "").split(",").filter(Boolean);

        return (
          <div class="flex flex-wrap gap-1">
            {colorIds.map(id => {
              const colorInfo = clrMap[id] || {
                text: "--",
                color: "bg-gray-200",
                texclr: "text-gray-600"
              };
              return (
                <div
                  key={id}
                  class={`px-2 py-1 rounded ${colorInfo.color} ${colorInfo.texclr} text-xs`}
                >
                  {colorInfo.text}
                </div>
              );
            })}
          </div>
        );
      }
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "操作时间",
      prop: "operateTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.operateTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
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
