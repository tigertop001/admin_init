import { ref } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useFinAdepMdw } from "../store";
const store = useFinAdepMdw();

import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  const addVis = ref(false);
  const recVis = ref(false);
  const currRow = ref(null);
  const dtLst = ref<any>([]);
  const tblDt = ref<any>([]);

  const getList = async (params = searchParam.value) => {
    try {
      const res = await store.list(params as object);
      if (res?.code === 0 && res.data.wallets) {
        setData(res.data || []);
        fmtTb(res.data.wallets);
      } else {
        setData([]);
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
  interface WalletData {
    currency: string;
    balance: string;
    commission?: string;
    activity?: string;
  }

  const currencyMap = {
    CHY: "(主货币)人民币钱包",
    BRL: "雷亚尔钱包",
    USDT: "USDT钱包"
  };

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

  const fmtTb = (wallets: WalletData[]) => {
    const result = [];
    const mainWallet = wallets.find(w => w.currency === "CHY");
    const otherWallets = wallets.filter(w => w.currency !== "CHY");
    if (mainWallet) {
      let isFirstRow = true;
      Object.entries(accountTypeMap).forEach(([key, label]) => {
        if (mainWallet[key] !== undefined) {
          result.push({
            walletType: isFirstRow ? "(主货币)人民币钱包" : "",
            accountType: label,
            amount: mainWallet[key],
            operation: key === "balance" ? "mainBalance" : "other",
            rowspan: isFirstRow ? 3 : 1
          });
          isFirstRow = false;
        }
      });
    }

    otherWallets.forEach(wallet => {
      result.push({
        walletType: currencyMap[wallet.currency],
        accountType: accountTypeMap.balance,
        amount: wallet.balance,
        operation: "otherBalance"
      });
    });

    tblDt.value = result;
    return result;
  };

  const shwMDep = row => {
    setTimeout(() => {
      currRow.value = { ...row };
      addVis.value = true;
    }, 0);
  };

  const onBalan = async (row: any) => {
    try {
      await ElMessageBox.confirm("确定要提款到余额吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      const params = {
        id: row.id,
        uid: row.uid
      };
      const res = await store.balan(params);
      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("提款到余额失败:", error);
        message("操作失败", { type: "error" });
      }
    }
  };
  const shwUsrLst = (row: any) => {
    currRow.value = { ...row };
    recVis.value = true;
  };

  const setData = (data: any[]) => {
    dtLst.value = data;
  };

  return {
    dtLst,
    getList,
    columns,
    tblDt,
    addVis,
    recVis,
    currRow,
    onPrmUp,
    shwMDep,
    shwUsrLst,
    onBalan
  };
}
