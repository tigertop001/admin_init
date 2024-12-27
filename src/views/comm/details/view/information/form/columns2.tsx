import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns2() {
  /**
   * 基础数据
   */
  const dataList2 = ref([
    {
      real_name: "未绑定",
      kahao: "未绑定",
      hy: "未绑定",
      kaihu: "未绑定"
    }
  ]);

  /**
   * 表格列配置
   */
  const columns2 = [
    {
      label: "姓名",
      prop: "real_name",
      width: 120,
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "卡号",
      prop: "kahao",
      width: 200,
      formatter: row => `${row.kahao || "--"}`
    },
    {
      label: "银行",
      prop: "hy",
      width: 140,
      formatter: row => `${row.hy || "--"}`
    },
    {
      label: "开户行",
      prop: "kaihu",
      width: 140,
      formatter: row => `${row.kaihu || "--"}`
    }
  ];

  /**
   * 自适应高度配置
   */
  const adapConf2: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  // 设置表格数据
  const setData2 = (data: any[]) => {
    dataList2.value = data;
  };

  return {
    columns2,
    dataList2,
    adapConf2,
    setData2
  };
}
