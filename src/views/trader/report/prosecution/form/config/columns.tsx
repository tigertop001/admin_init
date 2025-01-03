import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { ExcelExporter } from "@/components/CgExportExcel";
import { useRepPor } from "../store";
const store = useRepPor();

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

  const columns = [
    {
      label: "日期",
      prop: "createdAt",
      formatter: row => `${fmtTs(row.createdAt) || "--"} / ${row.zd || "--"}`
    },
    {
      label: "注册数",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "首充人数",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "首充金额",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "充值人数",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "充值金额/笔数",
      prop: "date",
      width: 150,
      formatter: row =>
        `${row.amountCommission || "--"} / ${row.amountCommission || "--"}`
    },
    {
      label: "提款人数",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"}`
    },
    {
      label: "提款金额/笔数",
      prop: "date",
      width: 150,
      formatter: row =>
        `${row.amountCommission || "--"} / ${row.amountCommission || "--"}`
    },
    {
      label: "提现手续费",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "提现补偿金额",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "提现补偿次数",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "充提差额",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "投注人数",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "投注金额",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "有效投注",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "中奖金额",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "公司输赢",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
    },
    {
      label: "活动优惠",
      prop: "date",
      width: 150,
      formatter: row => `${row.amountCommission || "--"} `
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
    expExcel
  };
}
