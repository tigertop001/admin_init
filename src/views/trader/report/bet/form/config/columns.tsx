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

  const statusMap = {
    1: { text: "已结算", color: "text-green-600" },
    2: { text: "未结算", color: "text-red" },
    3: { text: "已取消", color: "text-gray" }
  };

  const columns = [
    {
      label: "注单号",
      prop: "real_name",
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "局号(期数)",
      prop: "real_name",
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "会员ID/会员账号",
      width: 160,
      prop: "date",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
        </div>
      )
    },
    {
      label: "游戏类型",
      prop: "real_name",
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "游戏平台",
      prop: "address",
      formatter: row => `${row.parent_id || "--"}`
    },
    {
      label: "游戏名称",
      prop: "invite_memberid",
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "投注时间",
      prop: "moneyLeft",
      formatter: row => `${fmtTs(row.lastLoginTime)}/${row.lastLoginIp || "--"}`
    },
    {
      label: "结算时间",
      prop: "moneyLeft",
      formatter: row => `${fmtTs(row.lastLoginTime)}/${row.lastLoginIp || "--"}`
    },
    {
      label: "投注内容",
      prop: "totalSave",
      formatter: row => `${row.totalSave || "--"}/${row.totalTimes}次`
    },
    {
      label: "币种",
      prop: "drawMoney",
      formatter: row => `${row.drawMoney || "--"}/${row.drawTimes}次`
    },
    {
      label: "投注金额",
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "有效投注",
      prop: "regTime",
      formatter: row => `${row.regTime}`
    },
    {
      label: "派彩",
      prop: "lastLoginTime",
      formatter: row => `${row.lastLoginTime} / ${row.lastLoginIp || "--"}`
    },
    {
      label: "输赢",
      prop: "status",
      width: 90,
      formatter: row => `${row.lastLoginTime}/${row.lastLoginIp || "--"}`
    },
    {
      label: "状态",
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
