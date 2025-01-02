import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns() {
  const dtLst = ref([]);

  const columns = [
    {
      label: "游戏名称",
      prop: "real_name",
      width: 120,
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "游戏帐号",
      prop: "address",
      width: 200,
      formatter: row => `${row.address || "--"}`
    },
    {
      label: "余额",
      prop: "invite_memberid",
      width: 140,
      formatter: row => `${row.invite_memberid || "--"}`
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  const adapConf: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  const setData = (data: any[]) => {
    dtLst.value = data;
  };

  return {
    columns,
    dtLst,
    adapConf,
    setData
  };
}
