import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns1() {
  const dtLst1 = ref([
    {
      real_name: "909090",
      address: "fdferere",
      cj: "cjcjcj",
      zsxs: "uiuieruio"
    }
  ]);

  const columns1 = [
    {
      label: "代理UID",
      prop: "real_name",
      width: 120,
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "代理账号",
      prop: "address",
      width: 200,
      formatter: row => `${row.address || "--"}`
    },
    {
      label: "层级",
      prop: "cj",
      width: 140,
      formatter: row => `${row.cj || "--"}`
    },
    {
      label: "直属下级",
      prop: "zsxs",
      width: 140,
      formatter: row => `${row.zsxs || "--"}`
    }
  ];

  const adapConf1: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  const setData1 = (data: any[]) => {
    dtLst1.value = data;
  };

  return {
    columns1,
    dtLst1,
    adapConf1,
    setData1
  };
}
