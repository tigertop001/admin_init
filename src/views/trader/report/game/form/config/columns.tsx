import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { ExcelExporter } from "@/components/CgExportExcel";
import { useRepGam } from "../store";
const store = useRepGam();

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
      label: "序号",
      prop: "id",
      cellRenderer: ({ index }) => <p>{index + 1}</p>
    },
    {
      label: "游戏平台",
      width: 100,
      prop: "real_name",
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "投注人数",
      width: 100,
      prop: "address",
      formatter: row => `${row.parent_id || "--"}`
    },
    {
      label: "投注次数",
      width: 100,
      prop: "invite_memberid",
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "投注额",
      width: 100,
      prop: "moneyLeft",
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "有效投注",
      width: 100,
      prop: "totalSave",
      formatter: row => `${row.totalSave || "--"}`
    },
    {
      label: "中奖金额",
      width: 100,
      prop: "drawMoney",
      formatter: row => `${row.drawMoney || "--"}`
    },
    {
      label: "会员投注盈亏",
      width: 140,
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "返水",
      width: 100,
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },

    {
      label: "传统提成",
      width: 100,
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "合营提成",
      width: 100,
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "人均投注额",
      width: 100,
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "人均投注次数",
      width: 120,
      prop: "saveDiffDraw",
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "抽水金额",
      width: 120,
      prop: "totalSave",
      sortable: true,
      formatter: row => `${row.totalSave}`
    },
    {
      label: "保险输赢金额",
      width: 140,
      prop: "totalSave",
      sortable: true,
      formatter: row => `${row.totalSave}`
    },
    {
      label: "会员盈利率",
      width: 140,
      prop: "regTime",
      formatter: row => `${row.totalSave}`
    },
    {
      label: "统计时间",
      width: 100,
      prop: "regTime",
      formatter: row => `${fmtTs(row.regTime)}`
    },
    {
      label: "操作",
      width: 100,
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
