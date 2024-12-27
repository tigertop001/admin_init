import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns() {
  /**
   * 基础数据
   */
  const dataList = ref([
    {
      name: "namenamename",
      hk: "hkhkhk",
      yh: "yhyhyh",
      kaihuh: "kaihuh"
    }
  ]);

  /**
   * 表格列配置
   */
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

  /**
   * 自适应高度配置
   */
  const adapConf: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  // 设置表格数据
  const setData = (data: any[]) => {
    dataList.value = data;
  };

  return {
    columns,
    dataList,
    adapConf,
    setData
  };
}
