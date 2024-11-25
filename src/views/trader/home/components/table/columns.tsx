import Empty from "./empty.svg?component";
import { h } from "vue";

// 定义基础列配置
const baseColumns = {
  rank: {
    sortable: false,
    label: "排名",
    prop: "rank",
    width: 60,
    align: "center",
    headerAlign: "center"
  },
  memberid: {
    sortable: false,
    label: "会员",
    prop: "memberid",
    width: 80,
    align: "center",
    headerAlign: "center"
  }
};

// 定义表格配置
const tableConfigs = {
  recharge: {
    key: "rechargeRank",
    title: "充值排行榜",
    columns: [
      baseColumns.rank,
      baseColumns.memberid,
      {
        sortable: false,
        label: "入款",
        prop: "rechargeAmount",
        align: "center",
        headerAlign: "center",
        formatter: ({ rechargeAmount }) => {
          const value = parseFloat(rechargeAmount);
          return h(
            "span",
            {
              class: [
                "font-medium",
                value > 0
                  ? "text-red-500 dark:text-red-400"
                  : value < 0
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
              ]
            },
            `￥${rechargeAmount}`
          );
        }
      },
      {
        sortable: false,
        width: 60,
        label: "笔数",
        prop: "rechargeCount",
        align: "center",
        headerAlign: "center"
      }
    ]
  },
  withdraw: {
    key: "withdrawRank",
    title: "提现排行榜",
    columns: [
      baseColumns.rank,
      baseColumns.memberid,
      {
        sortable: false,
        label: "出款",
        prop: "withdrawAmount",
        align: "center",
        headerAlign: "center",
        formatter: ({ withdrawAmount }) => {
          const value = parseFloat(withdrawAmount);
          return h(
            "span",
            {
              class: [
                "font-medium",
                value > 0
                  ? "text-red-500 dark:text-red-400"
                  : value < 0
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
              ]
            },
            `￥${withdrawAmount}`
          );
        }
      },
      {
        sortable: false,
        label: "笔数",
        prop: "withdrawCount",
        width: 60,
        align: "center",
        headerAlign: "center"
      }
    ]
  },
  profit: {
    key: "profitRank",
    title: "输赢排行榜",
    columns: [
      baseColumns.rank,
      baseColumns.memberid,
      {
        sortable: false,
        label: "输赢",
        prop: "profit",
        align: "center",
        headerAlign: "center",
        formatter: ({ profit }) => {
          const value = parseFloat(profit);
          return h(
            "span",
            {
              class: [
                "font-medium",
                value > 0
                  ? "text-red-500 dark:text-red-400"
                  : value < 0
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
              ]
            },
            `￥${profit}`
          );
        }
      },
      {
        sortable: false,
        label: "订单数",
        prop: "betRecordCount",
        align: "center",
        headerAlign: "center"
      }
    ]
  },
  proxy: {
    key: "proxyRank",
    title: "代理发展排行榜",
    columns: [
      baseColumns.rank,
      {
        ...baseColumns.memberid,
        label: "代理",
        width: 80,
        align: "center",
        headerAlign: "center"
      },
      {
        sortable: false,
        label: "累计下线",
        width: 80,
        prop: "allCount",
        align: "center",
        headerAlign: "center"
      },
      {
        sortable: false,
        label: "今日新增",
        prop: "newAddCount",
        align: "center",
        width: 80,
        headerAlign: "center"
      }
    ]
  }
};

export function useColumns() {
  return {
    Empty,
    tableConfigs,
    // 为了兼容旧代码，保留原有的导出
    rrColumns: tableConfigs.recharge.columns,
    wrColumns: tableConfigs.withdraw.columns,
    pfColumns: tableConfigs.profit.columns,
    prColumns: tableConfigs.proxy.columns
  };
}
