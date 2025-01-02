import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { ExcelExporter } from "@/components/CgExportExcel";
import { useAgRec } from "../store";
const store = useAgRec();

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
  const dtlsVis = ref(false);
  const curRow = ref<Record<string, any>>({});

  const columns = [
    {
      label: "UID/账号/会员标识",
      prop: "date",
      width: 150,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
          {row.sign == 2 ? (
            <span
              class="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-300"
              // onClick={() => handleTagClick(row)}
            >
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
      prop: "real_name",
      width: 90,
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "账户钱包余额",
      prop: "address",
      width: 200,
      formatter: row => `${row.parent_id || "--"}/${row.invite_member || "--"}`
    },
    {
      label: "存款总额（次）",
      prop: "invite_memberid",
      width: 140,
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "提款总额（次）",
      prop: "moneyLeft",
      width: 110,
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "存取款差额",
      prop: "totalSave",
      width: 110,
      formatter: row => `${row.totalSave || "--"}/${row.totalTimes}次`
    },
    {
      label: "注单量",
      prop: "drawMoney",
      width: 110,
      formatter: row => `${row.drawMoney || "--"}/${row.drawTimes}次`
    },
    {
      label: "投注金额",
      prop: "saveDiffDraw",
      width: 100,
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "有效投注",
      prop: "regTime",
      width: 160,
      formatter: row => `${fmtTs(row.regTime)}`
    },
    {
      label: "会员投注盈亏",
      prop: "lastLoginTime",
      width: 160,
      formatter: row => `${fmtTs(row.lastLoginTime)}/${row.lastLoginIp || "--"}`
    },
    {
      label: "会员实际盈亏",
      prop: "status",
      width: 90,
      formatter: row => `${fmtTs(row.lastLoginTime)}/${row.lastLoginIp || "--"}`
    },
    {
      label: "会员盈利率",
      prop: "member_type",
      width: 100,
      formatter: row => `${row.member_type || "--"}`
    },
    {
      label: "注册时间/ip",
      prop: "member_type",
      width: 100,
      formatter: row =>
        `${row.member_type || "--"} / ${row.member_type || "--"}`
    },
    {
      label: "操作",
      width: "120",
      fixed: "right",
      slot: "operation"
    }
  ];

  /**
   * 搜索参数更新
   */
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

  /**
   * 详情处理
   */
  const onDetail = (row: any) => {
    curRow.value = row;
    dtlsVis.value = true;
  };

  /**
   * 通过处理
   */
  const onPass = async (params = searchParam.value) => {
    try {
      const res = await store.pass(params as object);
      if (res?.code === 0) {
        params.states == 1 ? "通过" : "取消";
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    onPass,
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    expExcel,
    onDetail,
    dtlsVis,
    curRow
  };
}
