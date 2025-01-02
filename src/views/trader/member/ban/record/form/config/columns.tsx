import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemBanRec } from "../store";
const store = useMemBanRec();

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
      getList(searchParam.value);
    }
  });

  /**
   * 映射配置
   */
  const eveMap = {
    1: { text: "是", color: "text-green-600" },
    2: { text: "否", color: "text-red" }
  };

  const dtLst = ref([]);

  const columns = [
    {
      label: "账号",
      width: 260,
      prop: "uid",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">{row.account || "--"}</div>
      )
    },
    {
      label: "事件",
      prop: "events",
      cellRenderer: ({ row }) => {
        const peopleLevel = eveMap[row.events] || {
          text: "--",
          color: "text-gray-400"
        };
        return (
          <span class={`${peopleLevel.color} font-medium`}>
            {peopleLevel.text}
          </span>
        );
      }
    },
    {
      label: "封禁时间",
      prop: "bannedTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.bannedTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "结束时间",
      prop: "overTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.overTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
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
