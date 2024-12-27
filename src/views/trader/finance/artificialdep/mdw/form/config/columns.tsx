import { ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useFinAdepMdw } from "../store";
const store = useFinAdepMdw();

// 初始查询参数
import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  /**
   * 基础数据
   */
  const addVis = ref(false);
  const recVis = ref(false);
  const currRow = ref(null);
  const dataList = ref<any>([]);
  const tableData = ref<any>([]);

  /**
   * 数据处理方法
   */
  const getList = async (params = searchParam.value) => {
    try {
      const res = await store.list(params as object);
      if (res?.code === 0) {
        setData(res.data || []);
        formatTableData(res.data.wallets);
      } else {
        setData([]);
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
  interface WalletData {
    currency: string;
    balance: string;
    commission?: string;
    activity?: string;
  }
  // 货币类型映射
  const currencyMap = {
    CHY: "(主货币)人民币钱包",
    BRL: "雷亚尔钱包", // 这个应该显示
    USDT: "USDT钱包" // 这个应该显示
  };
  // 账户类型映射
  const accountTypeMap = {
    balance: "账户余额",
    commission: "佣金钱包",
    activity: "活动钱包"
  };

  const columns = [
    {
      label: "钱包类型",
      prop: "walletType",
      cellRenderer: ({ row }) => {
        return row.rowspan ? (
          <div rowspan={row.rowspan} class="merged-cell">
            {row.walletType}
          </div>
        ) : (
          <div>{row.walletType}</div>
        );
      }
    },
    {
      label: "账户类型",
      prop: "accountType"
    },
    {
      label: "钱包余额",
      prop: "amount"
    },
    {
      label: "操作",
      prop: "operation",
      slot: "operation",
      fixed: "right"
    }
  ];

  // 处理数据格式化
  const formatTableData = (wallets: WalletData[]) => {
    const result = [];
    // 先找到主货币
    const mainWallet = wallets.find(w => w.currency === "CHY");
    // 其他货币
    const otherWallets = wallets.filter(w => w.currency !== "CHY");
    if (mainWallet) {
      // 主货币相关行
      let isFirstRow = true;
      Object.entries(accountTypeMap).forEach(([key, label]) => {
        if (mainWallet[key] !== undefined) {
          result.push({
            walletType: isFirstRow ? "(主货币)人民币钱包" : "", // 只在第一行显示钱包名称
            accountType: label,
            amount: mainWallet[key],
            operation: key === "balance" ? "mainBalance" : "other",
            rowspan: isFirstRow ? 3 : 1 // 第一行合并3行
          });
          isFirstRow = false;
        }
      });
    }

    // 其他货币行
    otherWallets.forEach(wallet => {
      result.push({
        walletType: currencyMap[wallet.currency], // 这里使用了 currencyMap 映射
        accountType: accountTypeMap.balance,
        amount: wallet.balance,
        operation: "otherBalance"
      });
    });

    tableData.value = result;
    return result;
  };

  /**
   * 弹窗相关方法
   */
  const shwAdd = row => {
    setTimeout(() => {
      currRow.value = { ...row }; // 设置当前选中行
      addVis.value = true;
    }, 0);
  };
  /**
   * CRUD 操作方法
   */
  const onUp = async (formValues: FieldValues) => {
    try {
      const params = {
        id: formValues.id
      };
      let res;
      res = await store.up(params);

      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
    addVis.value = false;
  };

  // 显示用户列表
  const shwUsrLst = (row: any) => {
    console.log("父组件: 显示用户列表", row);
    currRow.value = { ...row }; // 设置当前选中行
    recVis.value = true; // 显示弹窗
  };
  /**
   * 设置表格数据
   */
  const setData = (data: any[]) => {
    dataList.value = data;
  };

  return {
    dataList,
    getList,
    columns,
    tableData,
    addVis,
    recVis,
    currRow,
    onPrmUp,
    shwAdd,
    shwUsrLst,
    onUp
  };
}
