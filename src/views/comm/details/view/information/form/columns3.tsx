import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns3() {
  /**
   * 基础数据
   */
  const dataList3 = ref([
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
  const columns3 = [
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
  const adapConf3: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  // 设置表格数据
  const setData3 = (data: any[]) => {
    dataList3.value = data;
  };

  return {
    columns3,
    dataList3,
    adapConf3,
    setData3
  };
}
