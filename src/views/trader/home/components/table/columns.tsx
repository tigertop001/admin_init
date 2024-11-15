import Empty from "./empty.svg?component";
import { h } from "vue";

// 定义基础列配置
const baseColumns = {
  rank: {
    sortable: true,
    label: "排名",
    prop: "rank",
    width: 80
  },
  memberid: {
    sortable: true,
    label: "会员",
    prop: "memberid",
    width: 120
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
        sortable: true,
        label: "入款",
        prop: "rechargeAmount",
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
        sortable: true,
        label: "笔数",
        prop: "rechargeCount"
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
        sortable: true,
        label: "出款",
        prop: "withdrawAmount",
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
        sortable: true,
        label: "笔数",
        prop: "withdrawCount"
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
        sortable: true,
        label: "输赢",
        prop: "profit",
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
        sortable: true,
        label: "订单数",
        prop: "betRecordCount"
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
        label: "代理"
      },
      {
        sortable: true,
        label: "累计下线",
        prop: "allCount"
      },
      {
        sortable: true,
        label: "今日新增",
        prop: "newAddCount"
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
