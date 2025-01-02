import { ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemPlay } from "../store";
const store = useMemPlay();

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

  const dtLst = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);

  /**
   * 映射配置
   */
  const statusMap = {
    1: { text: "正常", color: "text-green-600" },
    2: { text: "冻结", color: "text-orange-400" },
    3: { text: "禁止登录", color: "text-red" },
    4: { text: "拉黑", color: "text-gray-500" }
  };

  const columns = [
    {
      type: "selection",
      width: 55,
      align: "center"
    },
    {
      label: "UID/用户名/标识会员/分层",
      prop: "id",
      width: 220,
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
          <span>/{row.levelName || "--"}</span>
        </div>
      )
    },
    {
      label: "真实姓名",
      width: 140,
      prop: "uname",
      formatter: row => `${row.uname || "--"}`
    },
    {
      label: "钱包余额",
      width: 140,
      prop: "walletLeft",
      formatter: row => `${row.walletLeft || "--"}`
    },
    {
      label: "入账金额",
      width: 140,
      prop: "enterMoney",
      formatter: row => `${row.enterMoney || "--"}`
    },
    {
      label: "出账金额",
      width: 140,
      prop: "outMoney",
      formatter: row => `${row.outMoney || "--"}`
    },
    {
      label: "出入差额",
      width: 140,
      prop: "entOutDiff",
      sortable: true,
      formatter: row => `${row.entOutDiff || "--"}`
    },
    {
      label: "会员投注盈亏",
      width: 140,
      prop: "winOrLose",
      formatter: row => `${row.winOrLose || "--"}`
    },
    {
      label: "添加时间",
      width: 140,
      prop: "addTime",
      formatter: row =>
        `${fmtTs(row.addTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "是否进三方",
      width: 140,
      prop: "enterThird",
      cellRenderer: ({ row }) => (
        <el-switch
          modelValue={row.enterThird}
          onChange={value => {
            if (value !== row.enterThird) {
              onE3rdChg(row, value);
            }
          }}
          activeValue={1}
          inactiveValue={2}
          inlinePrompt
          activeText="是"
          inactiveText="否"
        />
      )
    },
    {
      label: "状态",
      prop: "remark",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "操作",
      width: 160,
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

  const shwAdd = (type: number) => {
    if (type === 0) {
      editData.value = null;
    }
    addType.value = type;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
  };

  const onSucc = async () => {
    addVis.value = false;
    editData.value = null;
    addType.value = 0;
    await getList(searchParam.value);
  };

  const onEdit = (row: any) => {
    editData.value = row;
    shwAdd(1);
  };

  const onAddSub = async (formValues: {
    type: number | "edit";
    data: FieldValues;
  }) => {
    const { type, data } = formValues;
    try {
      let res;
      if (type === 1) {
        res = await store.add(data);
      } else {
        res = await store.addNow(data);
      }
      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await onSucc();
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const seldRows = ref<any[]>([]);
  const add3rd = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }

    try {
      const params = {
        uids: seldRows.value.map(row => row.uid).join(",")
      };
      const res = await store.add3rd(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        seldRows.value = [];
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const qt3rd = async () => {
    if (!seldRows.value.length) {
      message("请选择需要操作的账号", { type: "error" });
      return;
    }

    try {
      const params = {
        uids: seldRows.value.map(row => row.uid).join(",")
      };
      const res = await store.qt3rd(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        seldRows.value = [];
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const onE3rdChg = async (row: any, value: boolean) => {
    try {
      const params = {
        uid: row.uid,
        isThird: value
      };
      const res = await store.ent3rd(params);
      if (res?.code === 0) {
        message("设置成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "设置失败", { type: "error" });
        row.enterThird = !value;
      }
    } catch (error) {
      console.error("设置失败:", error);
      message("设置失败", { type: "error" });
      row.enterThird = !value;
    }
  };

  const onSelChg = (rows: any[]) => {
    seldRows.value = rows;
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
    editData,
    addVis,
    addType,
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    shwAdd,
    onEdit,
    onAddSub,
    seldRows,
    onSelChg,
    add3rd,
    qt3rd,
    setData
  };
}
