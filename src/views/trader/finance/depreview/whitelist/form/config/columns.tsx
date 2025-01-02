import { ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useMemRskWl } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useSelection";

const store = useMemRskWl();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  const dtLst = ref([]);
  const addMebVis = ref(false);
  const dtlsVis = ref(false);
  const curRow = ref<Record<string, any>>({});

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
    1: { text: "正常", color: "text-green-600" },
    2: { text: "资金冻结", color: "text-orange-400" },
    3: { text: "禁止登录", color: "text-orange-600" },
    4: { text: "黑名单", color: "text-gray-400" },
    5: { text: "封禁", color: "text-red" }
  };

  const columns = [
    {
      type: "selection",
      width: 55,
      fixed: "left",
      alignWhole: "center"
    },
    {
      label: "所属代理",
      prop: "date",
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
      label: "账号",
      prop: "real_name",
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "账户状态",
      prop: "status",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "添加时间",
      prop: "invite_memberid",
      cellRenderer: ({ row }) => (
        <div>
          <span class="text-blue-500">{row.available_balance || "--"}</span>
          <span>/{row.reg_source || "--"}</span>
        </div>
      )
    },
    {
      label: "备注",
      prop: "moneyLeft",
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "操作人",
      prop: "moneyLeft",
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "操作",
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

  const onAdd = () => {
    addMebVis.value = true;
  };

  const onAddSub = async (formValues: FieldValues) => {
    try {
      const res = await store.add(formValues as object);
      if (res?.code === 0) {
        message("添加成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message("添加失败", { type: "error" });
      }
    } catch (error) {
      console.error("添加失败:", error);
      message("添加失败", { type: "error" });
    }
    addMebVis.value = false;
  };

  /**
   * 详情处理
   */
  const onDetail = (row: any) => {
    curRow.value = row;
    dtlsVis.value = true;
  };

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    addMebVis,
    dtlsVis,
    curRow,

    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    onAdd,
    onAddSub,
    onDetail,
    onSelChg
  };
}
