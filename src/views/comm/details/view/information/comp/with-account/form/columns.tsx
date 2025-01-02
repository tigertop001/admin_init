import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns() {
  const dtLst = ref([
    {
      name: "namenamename",
      hk: "hkhkhk",
      yh: "yhyhyh",
      kaihuh: "kaihuh"
    }
  ]);

  const columns = [
    {
      label: "姓名",
      prop: "name",
      width: 120,
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "卡号",
      prop: "hk",
      width: 200,
      formatter: row => `${row.hk || "--"}`
    },
    {
      label: "银行",
      prop: "yh",
      width: 140,
      formatter: row => `${row.yh || "--"}`
    },
    {
      label: "开户行",
      prop: "kaihuh",
      width: 200,
      formatter: row => `${row.kaihuh || "--"}`
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
